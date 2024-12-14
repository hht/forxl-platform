import { styled } from "@tamagui/core"
import { Image as ImageBase, ImageProps as ImageBaseProps } from "expo-image"
import { FC } from "react"
import { ImageProps } from "tamagui"

export const StyledImage = styled(ImageBase, {
  name: "Image",
  bc: "transparent",
  width: "100%",
  contentFit: "cover",
  cachePolicy: "disk",
})

export const Image: FC<ImageBaseProps & ImageProps> = ({
  children,
  ...rest
}) => {
  const blurhash = "L05=62offQofoffQfQfQfQfQfQfQ"
  return (
    <StyledImage placeholder={blurhash} {...rest}>
      {children}
    </StyledImage>
  )
}
