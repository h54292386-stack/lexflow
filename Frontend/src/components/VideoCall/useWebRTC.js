import { useRef, useState } from "react";
import { getSocket } from "../../socket.js";

export default function useWebRTC() {
    const peerConnection = useRef(null);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const localStreamRef = useRef(null);
    const [remoteStream, setRemoteStream] = useState(null);

    const startLocalMedia = async (callType = "video") => {
        try {
            const stream =
                await navigator.mediaDevices.getUserMedia({
                    video:  callType === "video",
                    audio: true,
                });

            localStreamRef.current = stream;

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            return stream;
        } catch (error) {
            console.error("Media error:", error);
        }
    };

    const createPeerConnection = (partnerId) => {
        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" }
            ],
        });

        // ADD TRACKS HERE (ONLY ONCE)
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                pc.addTrack(track, localStreamRef.current);
            });
        }

        pc.ontrack = (event) => {
            const stream = event.streams[0];
            setRemoteStream(stream);

            requestAnimationFrame(() => {
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = stream;
                }
            });

        };

        pc.onicecandidate = (event) => {
            if (!event.candidate) return;

            const socket = getSocket();
            socket.emit("ice-candidate", {
                to: partnerId,
                candidate: event.candidate,
            });
        };

        pc.oniceconnectionstatechange = () => {
            console.log("ICE STATE:", pc.iceConnectionState);
        };

        peerConnection.current = pc;
        return pc;
    };

    const createOffer = async (partnerId) => {
        if (!peerConnection.current) {
            createPeerConnection(partnerId);
        }

        const pc = peerConnection.current;

        const offer = await pc.createOffer();
        await pc.setLocalDescription(
            offer
        );

        return offer;
    };

    const createAnswer = async (offer, partnerId) => {
        if (!peerConnection.current) {
            createPeerConnection(partnerId);
        }

        const pc = peerConnection.current;

        await pc.setRemoteDescription(new RTCSessionDescription(offer));

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(
            answer
        );

        return answer;
    };

    const endCall = () => {
        if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null;
        }

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }

        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null;
        }

        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
        }
    };

    return {
        peerConnection,
        localVideoRef,
        remoteVideoRef,
        localStream: localStreamRef.current,
        remoteStream,
        startLocalMedia,
        createPeerConnection,
        createOffer,
        createAnswer,
        endCall,
    };
}



