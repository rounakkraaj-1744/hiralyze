"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PhoneOff, Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import { useSocket } from "@/hooks/useSocket"

interface VoiceCallProps {
  conversationId: string
  participant: {
    id: string
    name: string
    avatar?: string
  }
  onEndCall: () => void
}

export default function VoiceCall({ conversationId, participant, onEndCall }: VoiceCallProps) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true)
  const [callStatus, setCallStatus] = useState<"connecting" | "connected" | "ended">("connecting")
  const [callDuration, setCallDuration] = useState(0)

  const localStreamRef = useRef<MediaStream | null>(null)
  const remoteStreamRef = useRef<MediaStream | null>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const socket = useSocket(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000")

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
      // Get user media (audio only)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      })

      localStreamRef.current = stream

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
        if (audioRef.current) {
          audioRef.current.srcObject = event.streams[0]
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
        socket.emit("join-voice-call", { conversationId })

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
      console.error("Error initializing voice call:", error)
      onEndCall()
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

  const toggleSpeaker = () => {
    if (audioRef.current) {
      audioRef.current.muted = isSpeakerEnabled
      setIsSpeakerEnabled(!isSpeakerEnabled)
    }
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
    <div className="fixed inset-0 bg-gradient-to-br from-green-900 to-green-700 z-50 flex flex-col items-center justify-center">
      <audio ref={audioRef} autoPlay />

      <div className="text-center mb-12">
        <div className="relative mb-6">
          <Avatar className="h-32 w-32 mx-auto border-4 border-white shadow-2xl">
            <AvatarImage src={participant.avatar || "/placeholder.svg"} />
            <AvatarFallback className="text-2xl">
              {participant.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          {/* Audio visualization */}
          {callStatus === "connected" && (
            <div className="absolute -inset-2 rounded-full border-2 border-white animate-ping opacity-75"></div>
          )}
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">{participant.name}</h2>
        <p className="text-green-100 text-lg">
          {callStatus === "connecting" && "Connecting..."}
          {callStatus === "connected" && `Call duration: ${formatDuration(callDuration)}`}
          {callStatus === "ended" && "Call ended"}
        </p>
      </div>

      {/* Connection Status */}
      {callStatus === "connecting" && (
        <div className="mb-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center space-x-6">
        <Button
          variant={isAudioEnabled ? "secondary" : "destructive"}
          size="lg"
          onClick={toggleAudio}
          className="rounded-full w-16 h-16 shadow-lg"
        >
          {isAudioEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
        </Button>

        <Button variant="destructive" size="lg" onClick={endCall} className="rounded-full w-20 h-20 shadow-lg">
          <PhoneOff className="h-8 w-8" />
        </Button>

        <Button
          variant={isSpeakerEnabled ? "secondary" : "outline"}
          size="lg"
          onClick={toggleSpeaker}
          className="rounded-full w-16 h-16 shadow-lg"
        >
          {isSpeakerEnabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
        </Button>
      </div>
    </div>
  )
}