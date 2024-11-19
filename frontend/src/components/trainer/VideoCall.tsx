import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { useEffect, useRef } from "react";
import io from "socket.io-client";
import {
  setRoomId,
  setShowVideoCall,
  setVideoCall,
} from "../../features/trainer/trainerSlice";

const socket = io("http://localhost:3000"); // Replace with your server URL if deployed

function TrainerVideoCall() {
  const videoCallRef = useRef<HTMLDivElement | null>(null);
  const { roomIdTrainer, videoCall } = useSelector(
    (state: RootState) => state.trainer
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!roomIdTrainer) return;

    const appId = 2101066193;
    const serverSecret = "71b0af041b6ecd70bf5c104754a25f46";

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      roomIdTrainer.toString(),
      Date.now().toString(),
      "Trainer"
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: videoCallRef.current,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      turnOnMicrophoneWhenJoining: true,
      turnOnCameraWhenJoining: true,
      showPreJoinView: false,
      onLeaveRoom: () => {
        console.log("onLeaveRoom hit");

        // Pass the roomId and/or userId when emitting the leave-room event
        socket.emit("leave-room", { roomId: roomIdTrainer, to: videoCall?.userID });
        
        // Dispatch actions to reset the state and leave the room
        dispatch(setShowVideoCall(false));
        dispatch(setRoomId(null));
        dispatch(setVideoCall(null));
        // localStorage.removeItem("roomId");
        // localStorage.removeItem("showVideoCall");
      },
    });

    // Handle when the user leaves the session
    socket.on("user-left", () => {
      zp.destroy();
      dispatch(setShowVideoCall(false));
      dispatch(setRoomId(null));
      dispatch(setVideoCall(null));
      localStorage.removeItem("roomId");
      localStorage.removeItem("showVideoCall");
    });

    return () => {
      zp.destroy();
      socket.off("user-left");
    };
  }, [roomIdTrainer, videoCall, dispatch]);

  return (
    <div
      className="w-screen bg-black h-screen absolute z-[100]"
      ref={videoCallRef}
    />
  );
}

export default TrainerVideoCall;
