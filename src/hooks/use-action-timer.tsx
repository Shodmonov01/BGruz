// import { useServerTime } from "@/context/server-time-context"
// import { useEffect, useState } from "react"

// const AuctionTimer = ({ activationTime }: { activationTime: string }) => {
//   const serverTime = useServerTime() // Берем серверное время из контекста
//   const [timeLeft, setTimeLeft] = useState<number>(0)

//   useEffect(() => {
//       if (!serverTime) return

//       const targetTime = new Date(activationTime).getTime()

//       setTimeLeft(Math.max(0, Math.floor((targetTime - serverTime) / 1000)))

//       const interval = setInterval(() => {
//           setTimeLeft(prevTime => Math.max(0, prevTime - 1))
//       }, 1000)

//       return () => clearInterval(interval)
//   }, [serverTime, activationTime])

//   const minutes = Math.floor(timeLeft / 60)
//   const seconds = timeLeft % 60

//   return <span>{timeLeft > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : 'Время вышло'}</span>
// }

// export default AuctionTimer

import { useServerTime } from "@/context/server-time-context"
import { useEffect, useState } from "react"

const AuctionTimer = ({ activationTime }: { activationTime: string }) => {
  const serverTime = useServerTime() // Обновляется раз в 30 сек
  const [syncTime, setSyncTime] = useState<number | null>(null) // Сохраненное серверное время
  const [syncLocalTime, setSyncLocalTime] = useState<number | null>(null) // Локальный момент синхронизации
  const [timeLeft, setTimeLeft] = useState<number>(0)

  // Когда приходит новое serverTime, обновляем только syncTime и syncLocalTime
  useEffect(() => {
    if (!serverTime) return
    const now = Date.now()
    setSyncTime(Math.floor(serverTime / 1000)) // Переводим в секунды
    setSyncLocalTime(Math.floor(now / 1000)) // Запоминаем момент получения serverTime
  }, [serverTime])

  // Обновляем локальный таймер каждую секунду
  useEffect(() => {
    if (syncTime === null || syncLocalTime === null) return

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000)
      const simulatedServerTime = syncTime + (now - syncLocalTime) // Серверное время + прошедшее время
      const targetTime = Math.floor(new Date(activationTime).getTime() / 1000)
      setTimeLeft(Math.max(0, targetTime - simulatedServerTime))
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [syncTime, syncLocalTime, activationTime])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return <span>{timeLeft > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : 'Время вышло'}</span>
}

export default AuctionTimer
