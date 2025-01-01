import { Dimensions } from "react-native"

import { IconType } from "~/components"

export type Level = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export const LEVELS: IconType[] = [
  "bronze",
  "silver",
  "gold",
  "platinum",
  "diamond",
  "emerald",
  "ruby",
  "sapphire",
  "crown",
]

export const GRADIENT_COLORS = [
  ["#D7D2D2", "#A29283", "#CFC6BC"],
  ["#FBFBFB", "#E3E3E3", "#B9B9B9"],
  ["#FFECD2", "#FFDB97"],
  ["#E6EDF6", "#87ADE2"],
  ["#A198F8", "#FBF9FD", "#8265EB"],
  ["#8FF4DC", "#F9FDFB", "#65EB98"],
  ["#8FC7F4", "#F9FDFB", "#5B8AF0"],
  ["#F48F8F", "#F9FDFB", "#F05B5B"],
  ["#F4E58F", "#F9FDFB", "#F0AB5B"],
]

export const LEVEL_COLORS = [
  "#A29283",
  "#E3E3E3",
  "#FFDB97",
  "#87ADE2",
  "#8265EB",
  "#65EB98",
  "#5B8AF0",
  "#F05B5B",
  "#F0AB5B",
]

export const format = (num: number): string =>
  num >= 1_000_000
    ? `${(num / 1_000_000).toFixed(0)}M`
    : num >= 1_000
      ? `${(num / 1_000).toFixed(0)}K`
      : num.toString()
