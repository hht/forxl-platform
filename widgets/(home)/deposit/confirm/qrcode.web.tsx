import { QRCodeSVG } from 'qrcode.react'
import { FC } from 'react'

export const QRCode: FC<{
    value: string
    className?: string
}> = ({ value, className }) => {
    return (
        <QRCodeSVG
            value={value}
            size={128}
            level="H"
            opacity={100}
            marginSize={4}
            bgColor="#FFFFFF"
            style={{
                backgroundColor: "white",
                borderRadius: 16,
                padding: 0
            }}

        ></QRCodeSVG>
    )
}
