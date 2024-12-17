export const toRGBA = (hex: string, alpha = 1) => {
  const matched = hex.match(/\w\w/g)?.map((x) => parseInt(x, 16))
  if (!matched) {
    console.log(`无效的颜色值: ${hex}`)
    return hex
  }
  const [r, g, b] = matched
  return `rgba(${r},${g},${b},${alpha})`
}

export default {
  primary: "#10F48A",
  accent: "#191C1E",
  destructive: "#F66754",
  warning: "#E39D35",
  background: "#000000",
  card: "#121212",
  "card/60": toRGBA("#121212", 0.6),
  border: toRGBA("#30363A", 0.4),
  text: "#ffffff",
  secondary: "#919FA6",
  tertiary: "#545D61",
}
