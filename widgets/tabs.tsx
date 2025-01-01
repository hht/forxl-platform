import { FC } from 'react'
import { Defs, Ellipse, RadialGradient, Stop, Svg } from 'react-native-svg'

export const Gradient: FC = () => {
  return (
    <Svg height="300" width="100%" style={{ position: "absolute", top: -150 }}>
      <Defs>
        <RadialGradient
          id="grad"
          cx="50%"
          cy="50%"
          r="50%"
          fx="50%"
          fy="50%"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0%" stopColor="#062E11" stopOpacity="1" />
          <Stop offset="60%" stopColor="#062E11" stopOpacity="0.6" />
          <Stop offset="100%" stopColor="#062E11" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Ellipse cx="50%" cy="50%" rx="50%" ry="50%" fill="url(#grad)" />
    </Svg>
  )
}
