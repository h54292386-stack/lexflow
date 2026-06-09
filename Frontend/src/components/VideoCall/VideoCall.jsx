import { useRef } from "react";


export default function VideoCall({
  localVideoRef,
  remoteVideoRef,
}) {

  return (
    <div className="fixed inset-0 bg-black z-50">

      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        className="
          absolute
          bottom-4
          right-4
          w-64
          rounded
        "
      />

      <button onClick={onEndCall} className="absolute bottom-8 left-1/2 ...">
  End Call
</button>


    </div>
  );
}