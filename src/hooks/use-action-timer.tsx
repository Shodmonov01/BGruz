import { useServerTime } from "@/context/server-time-context"
import { useEffect, useState } from "react"

const AuctionTimer = ({ activationTime }: { activationTime: string }) => {
  const serverTime = useServerTime() // Берем серверное время из контекста
  const [timeLeft, setTimeLeft] = useState<number>(0)

  useEffect(() => {
      if (!serverTime) return

      const targetTime = new Date(activationTime).getTime()

      setTimeLeft(Math.max(0, Math.floor((targetTime - serverTime) / 1000)))

      const interval = setInterval(() => {
          setTimeLeft(prevTime => Math.max(0, prevTime - 1))
      }, 1000)

      return () => clearInterval(interval)
  }, [serverTime, activationTime])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return <span>{timeLeft > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : 'Время вышло'}</span>
}

export default AuctionTimer