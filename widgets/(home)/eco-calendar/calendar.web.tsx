import { useEffect } from "react"
import { YStack } from "tamagui"

import { i18n } from "~/lib/utils"

export const Calendar: React.FC = () => {
  useEffect(() => {
    // 创建 script 元素
    const script = document.createElement("script")
    script.src = "https://www.tradays.com/c/js/widgets/calendar/widget.js?v=13"
    script.async = true
    script.type = "text/javascript"
    script.dataset.type = "calendar-widget"
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: "100%",
      mode: "2",
      lang: i18n.language,
      theme: 1,
    })

    // 将 script 元素添加到 economicCalendarWidget 容器中
    const widgetContainer = document.getElementById("economicCalendarWidget")
    if (widgetContainer) {
      widgetContainer.appendChild(script)
    }

    // 清理函数，在组件卸载时移除 script 元素
    return () => {
      if (widgetContainer) {
        widgetContainer.removeChild(script)
      }
    }
  }, [])

  return (
    <YStack f={1} px="$md">
      <div
        id="economicCalendarWidget"
        style={{
          width: "100%",
          height: "100%",
        }}
      ></div>
    </YStack>
  )
}
