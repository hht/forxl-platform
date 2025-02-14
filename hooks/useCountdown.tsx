import { useCountDown as useCountDownFn } from "ahooks"
import { useState } from "react"

export const useCountDown = () => {
  const [date, setDate] = useState<number>()
  const [countdown] = useCountDownFn({
    targetDate: date,
    onEnd: () => {
      setDate(undefined)
    },
  })
  return { countdown, setDate }
}
