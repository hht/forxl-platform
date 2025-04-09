import { FC } from 'react'
import QR from 'react-native-qrcode-skia'

export const QRCode: FC<{ value: string }> = ({ value }) => {
    return <QR
        value={value}
        style={{
            backgroundColor: "white",
            borderRadius: 16,
            padding: 16,
        }}
        size={128}
        shapeOptions={{
            shape: "circle",
            eyePatternShape: "rounded",
            eyePatternGap: 0,
            gap: 0,
        }}
    ></QR>
}