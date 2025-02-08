import { ImageBackground } from "expo-image"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator } from "react-native"

import { upload } from "~/api/wallet"
import { Button, Card, Icon, Text, XStack } from "~/components"
import { useRequest } from "~/hooks/useRequest"
import { useWalletStore } from "~/hooks/useStore"
import colors from "~/theme/colors"

export const UploadCard: FC = () => {
  const { image } = useWalletStore()
  const { t } = useTranslation()
  const { loading, run } = useRequest(upload, {
    manual: true,
    onSuccess: (data) => {
      if (data) {
        useWalletStore.setState({ image: data.src })
      }
    },
  })
  if (image) {
    return (
      <Card ai="center" gap="$sm" ov="hidden">
        <ImageBackground
          source={{ uri: image }}
          style={{
            width: "100%",
            height: 200,
            justifyContent: "center",
            alignItems: "center",
            aspectRatio: "auto",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <Button
            variant="outlined"
            type="icon"
            bc="$border"
            onPress={() => {
              useWalletStore.setState({ image: undefined })
            }}
          >
            <Icon name="close" />
          </Button>
        </ImageBackground>
      </Card>
    )
  }
  return (
    <Card
      ai="center"
      jc="center"
      p="$md"
      gap="$md"
      onPress={() => {
        run()
      }}
    >
      <XStack>
        {loading ? (
          <ActivityIndicator size="large" color={colors.tertiary} />
        ) : (
          <Icon name="upload" size={48} />
        )}
      </XStack>
      <Text col="$secondary">{t("wallet.uploadPhotos")}</Text>
    </Card>
  )
}
