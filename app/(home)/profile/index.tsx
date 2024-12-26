import BottomSheetBase from "@gorhom/bottom-sheet"
import { router, Stack } from "expo-router"
import { FC, Fragment, ReactNode, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ScrollView, XStack, YStack } from "tamagui"

import { getAttestationFlag, getProfile } from "~/api/account"
import {
  BottomSheet,
  Button,
  Card,
  Copyable,
  Dialog,
  Figure,
  Icon,
  IconType,
  Image,
  Popup,
  Text,
} from "~/components"
import { CACHE_KEY, useRequest } from "~/hooks/useRequest"
import { useFroxlStore } from "~/hooks/useStore"

const ListItem: FC<{
  title: string
  icon: IconType
  onPress?: () => void
  addonAfter?: ReactNode
}> = ({ title, icon, addonAfter, onPress }) => {
  return (
    <XStack gap="$xs" h={56} ai="center" onPress={onPress}>
      <Icon name={icon} size={24} />
      <Text f={1} fos={15} px="$sm">
        {title}
      </Text>
      {addonAfter}
      <Icon name="chevronRight" size={16}></Icon>
    </XStack>
  )
}

const LEVEL_ICON = ["lv0", "lv1", "lv2"] as const

const SupportTip: FC<{ children: ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false)
  const { t } = useTranslation()
  const dict = t("profile.tips", {
    returnObjects: true,
  })
  return (
    <Fragment>
      <Popup visible={visible} onClose={() => setVisible(false)}>
        <Dialog>
          <Text fos={20} lh={20}>
            {dict.title}
          </Text>
          <Text col="$secondary">{dict.desc}</Text>
          <XStack w="100%" gap={12} pt={12}>
            <Button
              f={1}
              size="$md"
              type="accent"
              onPress={() => {
                setVisible(false)
              }}
            >
              <Text col="$text" fow="700">
                {t("action.cancel")}
              </Text>
            </Button>
            <Button
              f={1}
              size="$md"
              onPress={() => {
                setVisible(false)
              }}
            >
              <Text col="$background" fow="700">
                {dict.action}
              </Text>
            </Button>
          </XStack>
        </Dialog>
      </Popup>
      <XStack
        hitSlop={16}
        onPress={() => {
          setVisible(true)
        }}
      >
        {children}
      </XStack>
    </Fragment>
  )
}

export default function Layout() {
  const { t } = useTranslation()
  const dict = t("profile", {
    returnObjects: true,
  })
  const account = useFroxlStore((state) => state.account)
  const { bottom } = useSafeAreaInsets()
  const bottomSheetRef = useRef<BottomSheetBase>(null)
  const { data: profile } = useRequest(getProfile, {
    cacheKey: CACHE_KEY.USER,
  })
  const { data: attestation } = useRequest(getAttestationFlag, {
    cacheKey: CACHE_KEY.ATTESTATION,
  })
  const certificated = attestation?.kyc || profile?.realName?.status === "GREEN"
  const currentLevel = certificated ? 2 : attestation?.ga ? 1 : 0
  return (
    <YStack f={1}>
      <Stack.Screen options={{ title: dict.title }}></Stack.Screen>
      <XStack px="$md" pt={12}>
        <Card p={0}>
          <XStack ai="center" gap={12} bbc="$border" p="$md" bbw={1}>
            <Image
              source={{ uri: account?.headImg }}
              w={48}
              h={48}
              br={24}
              bc="$secondary"
            />
            <YStack f={1} gap="$xs">
              <Text fos={17}>{account?.email}</Text>
              <XStack ai="center" gap="$xs">
                <Text>UID:</Text>
                <Copyable col="$primary">{`${account?.id}`}</Copyable>
              </XStack>
            </YStack>
            <SupportTip>
              <Icon name="chevronRight" size={16}></Icon>
            </SupportTip>
          </XStack>
          <XStack p="$md" ai="center" jc="space-between" gap="$xs">
            <XStack ai="center" gap="$xs">
              <Text col="$secondary">{dict.verificationLevel}</Text>
              <XStack
                hitSlop={16}
                onPress={() => {
                  bottomSheetRef.current?.expand()
                }}
              >
                <Icon name="info" size={12}></Icon>
              </XStack>
            </XStack>
            <XStack gap="$sm" ai="center">
              <Figure name={`lv${currentLevel}`} width={21} height={23} />
              <Text fos={15} col="$secondary">{`LV${currentLevel}`}</Text>
            </XStack>
          </XStack>
        </Card>
      </XStack>
      <ScrollView f={1} p="$md">
        <ListItem
          icon="gift"
          title={dict.referralProgram}
          onPress={() => {
            router.push("/referral-program")
          }}
        />
        <ListItem icon="identity" title={dict.identityVerification} />
        <ListItem icon="shield" title={dict.security} />
        <ListItem icon="settings" title={dict.settings} />
        <ListItem
          icon="document"
          title={dict.documents}
          onPress={() => {
            router.push("/documents")
          }}
        />
        <ListItem
          icon="earPhone"
          title={dict.support}
          addonAfter={<Text col="$secondary">{dict.contact}</Text>}
          onPress={() => {
            router.push("/support")
          }}
        />
      </ScrollView>
      <YStack p="$md" pb={bottom + 16}>
        <Button
          type="ghost"
          onPress={() => {
            useFroxlStore.setState({ userNumber: undefined })
          }}
        >
          {dict.logout}
        </Button>
      </YStack>
      <BottomSheet
        title={dict.verificationLevel}
        ref={bottomSheetRef}
        onClose={() => bottomSheetRef.current?.close()}
      >
        <ScrollView px="$md" gap="$md">
          {dict.levels.map((level, index) => (
            <YStack key={index} gap={12} py="$md">
              <XStack ai="center" gap="$sm">
                <Figure name={LEVEL_ICON[index]} width={21} height={23} />
                <Text fos={15}>{level.title}</Text>
              </XStack>
              <Text col="$secondary">{level.desc}</Text>
            </YStack>
          ))}
        </ScrollView>
        <YStack p="$md" pb={bottom + 16}>
          <Button
            onPress={() => {
              bottomSheetRef.current?.close()
            }}
          >
            {t("action.ok")}
          </Button>
        </YStack>
      </BottomSheet>
    </YStack>
  )
}
