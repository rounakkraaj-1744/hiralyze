"use client"

import { useEffect, useRef } from "react"
import io, { type Socket } from "socket.io-client"

export const useSocket = (serverPath: string) => {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    socketRef.current = io(serverPath)

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [serverPath])

  return socketRef.current
}
