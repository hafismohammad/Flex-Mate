import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import io from 'socket.io-client'
import { RootState } from '../../app/store'
// import dotenv from 'dotenv';
// dotenv.config()

const socket = io('http://localhost:3000')

function VideoCall() {
    const localVideo = useRef<HTMLVideoElement | null>(null)
    const remoteVideo = useRef<HTMLVideoElement | null>(null)
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection>()

    const { userInfo } = useSelector((state: RootState) => state.user)
const userId = userInfo?.id
    useEffect(() => {
        const playVideoFromCamera = async () => {
            const localStream = await navigator.mediaDevices.getUserMedia({
                video:true,
                audio:true
            })
            if(localVideo.current) {
                localVideo.current.srcObject = localStream
            }
            const pc = new RTCPeerConnection({
                iceServers: [
                    {
                      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
                    },
                  ],
        
            })
            // Add local tracks to the connection
            //This shares the local audio and video streams with the remote peer.
            localStream.getTracks().forEach((track) => pc.addTrack(track, localStream))

            // Listen for remote track (incoming video/audio)
            //Allows the application to show the remote peer's video/audio feed to the user.
            pc.ontrack = (event) => {
                if(remoteVideo.current) {
                    remoteVideo.current.srcObject = event.streams[0] // Display remote video
                }
            }
    
            // Listen for ICE candidates and send them via Socket.IO
            //This ensures both peers exchange their connection details, enabling them to establish a direct connection.
            pc.onicecandidate = (event) => {
                if(event.candidate) {
                    socket.emit('ice-candidate', {
                        to: userId,
                        candidate: event.candidate
                    })
                }
            };

            socket.on('offer', async (data) => {
                console.log('Offer received:', data.offer);
                await pc.setRemoteDescription(new RTCSessionDescription(data.offer));

                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit('answer', {to:data.from, answer});
            });

            socket.on('answer', async (data) => {
                console.log('Answer received', data.answer);
                await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
            })

            socket.on('ice-candidate', async (data) => {
                console.log('ICE candidate received:', data.candidate);
                await pc.addIceCandidate(new RTCIceCandidate(data.candidate))
            })



            setPeerConnection(pc)
        }
        playVideoFromCamera()
    } ,[])


    const startCall = async () => {
        if(peerConnection) {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            socket.emit('offer', {
                to: ''
            })
        }
    }

    

  return (
   <div>
     <div>VideoCall</div>
     <video className='w-[300px] mr-20' ref={localVideo} autoPlay muted  />
     <video className='w-[300px]' ref={remoteVideo} />
    
    
   </div>
  )
}

export default VideoCall