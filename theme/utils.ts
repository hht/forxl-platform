export const HexToRGBA = (hex: string, alpha = 1) => {
  const matched = hex.match(/\w\w/g)?.map((x) => parseInt(x, 16))
  if (!matched) {
    console.log(`无效的颜色值: ${hex}`)
    return hex
  }
  const [r, g, b] = matched
  return `rgba(${r},${g},${b},${alpha})`
}
