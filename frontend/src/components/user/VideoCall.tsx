import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { useEffect, useRef } from "react";
import io from "socket.io-client";
import {
  setRoomId,
  setShowIncomingVideoCall,
  setShowVideoCall,
  setVideoCall,
} from "../../features/user/userSlice";

const socket = io("http://localhost:3000"); // Replace with your server URL

function VideoCall() {
  const videoCallRef = useRef<HTMLDivElement | null>(null);
  const { roomIdUser, showIncomingVideoCall,  } = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!roomIdUser) return;

    const appId = 2101066193;
    const serverSecret = "71b0af041b6ecd70bf5c104754a25f46";

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      roomIdUser.toString(),
      Date.now().toString(),
      "User"
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
        socket.emit("leave-room", { to: showIncomingVideoCall?._id });
        dispatch(setShowVideoCall(false));
        dispatch(setRoomId(null));
        dispatch(setVideoCall(null));
        // localStorage.removeItem("roomId");
        // localStorage.removeItem("showVideoCall");
      },
    });

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
  }, [roomIdUser,  dispatch]);

  return (
    <div
    className="w-screen bg-black h-screen absolute z-[100]"
    ref={videoCallRef}
  />
  )
}

export default VideoCall;
