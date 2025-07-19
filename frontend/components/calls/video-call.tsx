"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PhoneOff, Video, VideoOff, Mic, MicOff, Monitor, Maximize2, Minimize2 } from "lucide-react"
import { useSocket } from "@/hooks/useSocket"

interface VideoCallProps {
  conversationId: string
  participant: {
    id: string
    name: string
    avatar?: string
  }
  onEndCall: () => void
}

export default function VideoCall({ conversationId, participant, onEndCall }: VideoCallProps) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [callStatus, setCallStatus] = useState<"connecting" | "connected" | "ended">("connecting")
  const [callDuration, setCallDuration] = useState(0)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const remoteStreamRef = useRef<MediaStream | null>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const socket = useSocket(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8080")

  useEffect(() => {
    initializeCall()
    return () => {
      endCall()
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (callStatus === "connected") {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [callStatus])

  const initializeCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      localStreamRef.current = stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      // Create peer connection
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
      })

      peerConnectionRef.current = peerConnection

      // Add local stream to peer connection
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream)
      })

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        remoteStreamRef.current = event.streams[0]
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0]
        }
        setCallStatus("connected")
      }

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit("ice-candidate", {
            conversationId,
            candidate: event.candidate,
          })
        }
      }

      // Socket event handlers
      if (socket) {
        socket.emit("join-video-call", { conversationId })

        socket.on("call-offer", async (offer) => {
          await peerConnection.setRemoteDescription(offer)
          const answer = await peerConnection.createAnswer()
          await peerConnection.setLocalDescription(answer)
          socket.emit("call-answer", { conversationId, answer })
        })

        socket.on("call-answer", async (answer) => {
          await peerConnection.setRemoteDescription(answer)
        })

        socket.on("ice-candidate", async (candidate) => {
          await peerConnection.addIceCandidate(candidate)
        })

        socket.on("call-ended", () => {
          setCallStatus("ended")
          onEndCall()
        })
      }

      // Create offer if initiating call
      const offer = await peerConnection.createOffer()
      await peerConnection.setLocalDescription(offer)
      if (socket) {
        socket.emit("call-offer", { conversationId, offer })
      }
    } catch (error) {
      console.error("Error initializing call:", error)
      onEndCall()
    }
  }

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoEnabled(videoTrack.enabled)
      }
    }
  }

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsAudioEnabled(audioTrack.enabled)
      }
    }
  }

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        })

        const videoTrack = screenStream.getVideoTracks()[0]
        const sender = peerConnectionRef.current?.getSenders().find((s) => s.track && s.track.kind === "video")

        if (sender) {
          await sender.replaceTrack(videoTrack)
        }

        videoTrack.onended = () => {
          setIsScreenSharing(false)
          // Switch back to camera
          if (localStreamRef.current) {
            const cameraTrack = localStreamRef.current.getVideoTracks()[0]
            if (sender) {
              sender.replaceTrack(cameraTrack)
            }
          }
        }

        setIsScreenSharing(true)
      }
    } catch (error) {
      console.error("Error sharing screen:", error)
    }
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
    setIsFullscreen(!isFullscreen)
  }

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop())
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
    }
    if (socket) {
      socket.emit("end-call", { conversationId })
    }
    setCallStatus("ended")
    onEndCall()
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={participant.avatar || "/placeholder.svg"} />
            <AvatarFallback>
              {participant.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-white font-medium">{participant.name}</h3>
            <p className="text-gray-400 text-sm">
              {callStatus === "connecting" && "Connecting..."}
              {callStatus === "connected" && formatDuration(callDuration)}
              {callStatus === "ended" && "Call ended"}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="text-white hover:bg-gray-800">
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative">
        {/* Remote Video */}
        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />

        {/* Local Video */}
        <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden">
          <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          {!isVideoEnabled && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <VideoOff className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Connection Status */}
        {callStatus === "connecting" && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white text-lg">Connecting to {participant.name}...</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-6">
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant={isAudioEnabled ? "secondary" : "destructive"}
            size="lg"
            onClick={toggleAudio}
            className="rounded-full w-14 h-14"
          >
            {isAudioEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
          </Button>

          <Button
            variant={isVideoEnabled ? "secondary" : "destructive"}
            size="lg"
            onClick={toggleVideo}
            className="rounded-full w-14 h-14"
          >
            {isVideoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
          </Button>

          <Button
            variant={isScreenSharing ? "default" : "secondary"}
            size="lg"
            onClick={toggleScreenShare}
            className="rounded-full w-14 h-14"
          >
            <Monitor className="h-6 w-6" />
          </Button>

          <Button variant="destructive" size="lg" onClick={endCall} className="rounded-full w-14 h-14">
            <PhoneOff className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}