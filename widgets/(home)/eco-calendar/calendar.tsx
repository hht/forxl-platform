import { useMemo } from "react"
import WebView from "react-native-webview"

import { i18n } from "~/lib/utils"
import colors from "~/theme/colors"

export const Calendar = () => {
  const html = useMemo(
    () => `
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body style="background-color:#000;padding:0 !important;margin:0 !important">
        <div id="economicCalendarWidget" style="background-color:#000;flex:1;padding:0;margin:0"></div>
        </div>
        <script async type="text/javascript" data-type="calendar-widget" src="https://www.tradays.com/c/js/widgets/calendar/widget.js?v=13">
        {"width":"100%","height":"100%","mode":"2","lang":"${i18n.language}","theme":1}
        </script>
    </body>
`,
    []
  )

  return (
    <WebView
      style={{ flex: 1, backgroundColor: colors.background }}
      containerStyle={{
        backgroundColor: colors.background,
        flex: 1,
        paddingHorizontal: 16,
      }}
      source={{ html }}
    ></WebView>
  )
}
