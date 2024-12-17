interface ItemProps {
  label: string | React.ReactNode
  value: string | number
}

export const LANGUAGES: ItemProps[] = [
  { label: "中文", value: "zh" },
  { label: "English", value: "en" },
  { label: "日本語", value: "ja" },
  { label: "한국어", value: "ko" },
]

export type LocaleProps = {
  country: string
  flag: string
  code: string
  timezone: string
}

export const LOCALES: LocaleProps[] = [
  { country: "中国", flag: "🇨🇳", code: "+86", timezone: "UTC+08:00" },
  { country: "United States", flag: "🇺🇸", code: "+1", timezone: "UTC-05:00" },
  { country: "日本", flag: "🇯🇵", code: "+81", timezone: "UTC+09:00" },
  { country: "대한민국", flag: "🇰🇷", code: "+82", timezone: "UTC+09:00" },
  { country: "Deutschland", flag: "🇩🇪", code: "+49", timezone: "UTC+01:00" },
  { country: "France", flag: "🇫🇷", code: "+33", timezone: "UTC+01:00" },
  { country: "España", flag: "🇪🇸", code: "+34", timezone: "UTC+01:00" },
  { country: "Italia", flag: "🇮🇹", code: "+39", timezone: "UTC+01:00" },
  { country: "Россия", flag: "🇷🇺", code: "+7", timezone: "UTC+03:00" },
  { country: "भारत", flag: "🇮🇳", code: "+91", timezone: "UTC+05:30" },
  { country: "Brasil", flag: "🇧🇷", code: "+55", timezone: "UTC-03:00" },
  { country: "Canada", flag: "🇨🇦", code: "+1", timezone: "UTC-05:00" },
  { country: "Australia", flag: "🇦🇺", code: "+61", timezone: "UTC+10:00" },
  { country: "United Kingdom", flag: "🇬🇧", code: "+44", timezone: "UTC+00:00" },
  { country: "Mexico", flag: "🇲🇽", code: "+52", timezone: "UTC-06:00" },
  { country: "Indonesia", flag: "🇮🇩", code: "+62", timezone: "UTC+07:00" },
  { country: "Türkiye", flag: "🇹🇷", code: "+90", timezone: "UTC+03:00" },
  { country: "السعودية", flag: "🇸🇦", code: "+966", timezone: "UTC+03:00" },
  { country: "South Africa", flag: "🇿🇦", code: "+27", timezone: "UTC+02:00" },
  { country: "Argentina", flag: "🇦🇷", code: "+54", timezone: "UTC-03:00" },
  { country: "Nigeria", flag: "🇳🇬", code: "+234", timezone: "UTC+01:00" },
  { country: "Egypt", flag: "🇪🇬", code: "+20", timezone: "UTC+02:00" },
  { country: "Malaysia", flag: "🇲🇾", code: "+60", timezone: "UTC+08:00" },
  { country: "Philippines", flag: "🇵🇭", code: "+63", timezone: "UTC+08:00" },
  { country: "Vietnam", flag: "🇻🇳", code: "+84", timezone: "UTC+07:00" },
  { country: "Thailand", flag: "🇹🇭", code: "+66", timezone: "UTC+07:00" },
  { country: "Pakistan", flag: "🇵🇰", code: "+92", timezone: "UTC+05:00" },
  { country: "Bangladesh", flag: "🇧🇩", code: "+880", timezone: "UTC+06:00" },
  { country: "Iran", flag: "🇮🇷", code: "+98", timezone: "UTC+03:30" },
  { country: "Ukraine", flag: "🇺🇦", code: "+380", timezone: "UTC+02:00" },
  { country: "Polska", flag: "🇵🇱", code: "+48", timezone: "UTC+01:00" },
  { country: "Nederland", flag: "🇳🇱", code: "+31", timezone: "UTC+01:00" },
  { country: "Belgique", flag: "🇧🇪", code: "+32", timezone: "UTC+01:00" },
  { country: "Schweiz", flag: "🇨🇭", code: "+41", timezone: "UTC+01:00" },
  { country: "Sverige", flag: "🇸🇪", code: "+46", timezone: "UTC+01:00" },
  { country: "Norge", flag: "🇳🇴", code: "+47", timezone: "UTC+01:00" },
  { country: "Danmark", flag: "🇩🇰", code: "+45", timezone: "UTC+01:00" },
  { country: "Suomi", flag: "🇫🇮", code: "+358", timezone: "UTC+02:00" },
  { country: "Österreich", flag: "🇦🇹", code: "+43", timezone: "UTC+01:00" },
  { country: "Ελλάδα", flag: "🇬🇷", code: "+30", timezone: "UTC+02:00" },
  { country: "Portugal", flag: "🇵🇹", code: "+351", timezone: "UTC+00:00" },
  { country: "ישראל", flag: "🇮🇱", code: "+972", timezone: "UTC+02:00" },
  { country: "Singapore", flag: "🇸🇬", code: "+65", timezone: "UTC+08:00" },
  { country: "New Zealand", flag: "🇳🇿", code: "+64", timezone: "UTC+12:00" },
  { country: "Chile", flag: "🇨🇱", code: "+56", timezone: "UTC-03:00" },
  { country: "Colombia", flag: "🇨🇴", code: "+57", timezone: "UTC-05:00" },
  { country: "Perú", flag: "🇵🇪", code: "+51", timezone: "UTC-05:00" },
  { country: "Venezuela", flag: "🇻🇪", code: "+58", timezone: "UTC-04:00" },
  { country: "Cuba", flag: "🇨🇺", code: "+53", timezone: "UTC-05:00" },
  { country: "Morocco", flag: "🇲🇦", code: "+212", timezone: "UTC+01:00" },
  { country: "Kenya", flag: "🇰🇪", code: "+254", timezone: "UTC+03:00" },
  { country: "Ethiopia", flag: "🇪🇹", code: "+251", timezone: "UTC+03:00" },
]

const convertTimezoneToMinutes = (timezone: string): number => {
  const match = timezone.match(/UTC([+-]\d{2}):?(\d{2})?/)
  if (!match) return 0
  const hours = parseInt(match[1], 10)
  const minutes = match[2] ? parseInt(match[2], 10) : 0
  return hours * 60 + Math.sign(hours) * minutes
}

export const TIMEZONES = LOCALES.map((country) => ({
  ...country,
  value: convertTimezoneToMinutes(country.timezone),
}))
