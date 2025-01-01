import BottomSheetBase from "@gorhom/bottom-sheet"
import { Stack } from "expo-router"
import _ from "lodash"
import { FC, Fragment, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Dimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ScrollView, XStack, YStack } from "tamagui"
import { LinearGradient } from "tamagui/linear-gradient"
import { shallow } from "zustand/shallow"

import {
  getPartnerConfig,
  getPartnerInfo,
  getReferralList,
} from "~/api/partner"
import {
  BottomSheet,
  Button,
  Card,
  copyToClipboard,
  Dialog,
  Figure,
  Icon,
  IconType,
  Justified,
  Popup,
  Row,
  Screen,
  Statistics,
  Text,
} from "~/components"
import { formatDate } from "~/hooks/useLocale"
import { useRequest } from "~/hooks/useRequest"
import { useFroxlStore, usePartnerStore } from "~/hooks/useStore"
import { formatDecimal } from "~/lib/utils"
import {
  BrandTitle,
  DefaultScreenOptions,
  NativeStackNavigationOptions,
} from "~/widgets/header"
import { Gradient } from "~/widgets/tabs"

type Level = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

const ScreenOptions: NativeStackNavigationOptions = {
  ...DefaultScreenOptions,
  headerShown: true,
  headerTitle: () => <BrandTitle />,
  headerLeft: () => null,
  headerTitleAlign: "center",
  headerStyle: {
    backgroundColor: "transparent",
  },
  headerRight: () => null,
}

const LEVELS: IconType[] = [
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

const GRADIENT_COLORS = [
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

const LEVEL_COLORS = [
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

const format = (num: number): string =>
  num >= 1_000_000
    ? `${(num / 1_000_000).toFixed(0)}M`
    : num >= 1_000
      ? `${(num / 1_000).toFixed(0)}K`
      : num.toString()

const DEVICE_WIDTH = Dimensions.get("window").width

const AccountInfo = () => {
  const { account } = useFroxlStore()
  const { t } = useTranslation()
  const dict = t("partner", {
    returnObjects: true,
  })
  const currentLevel = usePartnerStore((state) => state.partnerLevel, shallow)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const { data: referral } = useRequest(getReferralList)
  const { data } = useRequest(getPartnerInfo, {
    onSuccess: (data) => {
      usePartnerStore.setState({
        currentLevel: data?.level,
        partnerLevel: data?.level,
      })
    },
  })
  useRequest(getPartnerConfig, {
    onSuccess: (data) => {
      usePartnerStore.setState({
        config: data,
      })
    },
  })
  return (
    <Fragment>
      <Card gap="$md">
        <XStack gap={12}>
          <Figure name={LEVELS[currentLevel]} width={48} height={50} />
          <YStack gap="$sm">
            <Text col="$secondary">{dict.level}</Text>
            <XStack ai="center" gap="$sm">
              <Text subject>{_.upperCase(dict.children[currentLevel])}</Text>
              <XStack hitSlop={10} onPress={() => setVisible(true)}>
                <Icon name="info" size={12} />
              </XStack>
            </XStack>
          </YStack>
        </XStack>
        <Justified>
          <Statistics label={dict.directAccounts}>
            <Row gap="$sm">
              <Text fos={17} lh={20} fow="700">
                {`${data?.activeDirectNum ?? 0}/${data?.allDirectNum ?? 0}`}
              </Text>
              <XStack hitSlop={10} onPress={() => setVisible(true)}>
                <Icon name="info" size={12} />
              </XStack>
            </Row>
          </Statistics>
          <Statistics label={t("partner.earnBonuses")} jc="flex-end">
            <Button
              h={24}
              onPress={() => {
                copyToClipboard(
                  `https://www.FORXLMARKETS.COM/CODE=${account?.inviteCode}`
                )
              }}
            >
              <Text fow="900" col="$background">
                {t("action.share")}
              </Text>
            </Button>
          </Statistics>
        </Justified>
        <Justified>
          <Statistics label={dict.size}>
            <Text fow="700">
              {t("partner.personCount", { count: data?.teamSize })}
            </Text>
          </Statistics>
          <Statistics label={dict.volume} jc="flex-end">
            <Text>{`$${formatDecimal(data?.teamVolume ?? 0)}`}</Text>
          </Statistics>
        </Justified>
        <Justified>
          <Statistics label={dict.earned}>
            <Row gap="$xs">
              <Text fow="700">{`$${formatDecimal(data?.earned ?? 0)}`}</Text>
              <Button h={18} px="$xs" br="$xs" onPress={() => {}}>
                <Text caption col="$background">
                  {t("action.query")}
                </Text>
              </Button>
            </Row>
          </Statistics>
          <Statistics label={dict.updated} ai="flex-end">
            <Text>
              {data?.lastUpdateTime ? formatDate(data?.lastUpdateTime) : ""}
            </Text>
          </Statistics>
        </Justified>
      </Card>

      <Popup visible={visible} onClose={() => setVisible(false)}>
        <Dialog py="$md" px="$md" w={DEVICE_WIDTH - 32}>
          <Text head>{dict.partnerList}</Text>
          <ScrollView
            horizontal
            w={DEVICE_WIDTH - 32}
            h={212}
            mx={-16}
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              setCurrentIndex(
                event.nativeEvent.contentOffset.x / (DEVICE_WIDTH - 32)
              )
            }}
          >
            {referral?.map((item) => (
              <YStack gap={12} w={DEVICE_WIDTH - 32} px="$md" key={item.userId}>
                <Justified>
                  <XStack gap="$xs" ai="center">
                    <Text col="$secondary">{t("partner.accountId")}</Text>
                  </XStack>
                  <Text>{item.userId}</Text>
                </Justified>
                <Justified>
                  <Text col="$secondary">{t("partner.accountLevel")}</Text>
                  <XStack gap="$xs">
                    <Figure name={LEVELS[item.level!]} width={20} height={20} />
                    <Text>{dict.children[item.level!]}</Text>
                  </XStack>
                </Justified>
                <Justified gap="$md" ai="flex-start">
                  <Text col="$secondary">{dict.accountEmail}</Text>
                  <Text f={1} ta="right" numberOfLines={1}>
                    {item.email}
                  </Text>
                </Justified>
                <Justified>
                  <Text col="$secondary">{dict.CertificationName}</Text>
                  <Text>
                    {item.certificationName
                      ?.split(" ")
                      .map((it, index) =>
                        index === 0
                          ? _.padEnd(it.charAt(0), it.length, "*")
                          : it
                      )
                      .join(" ")}
                  </Text>
                </Justified>
                <Justified>
                  <Text col="$secondary">{dict.size}</Text>
                  <Text>
                    {t("partner.personCount", { count: item.teamSize })}
                  </Text>
                </Justified>
                <Justified>
                  <Text col="$secondary">{t("partner.fundsInvested")}</Text>
                  <Text>{`$${formatDecimal(`${item.invested}`)}`}</Text>
                </Justified>
                <Justified>
                  <Text col="$secondary">{t("partner.registerDate")}</Text>
                  <Text>
                    {formatDate(item.registrationDate ?? Date.now(), {
                      hour: undefined,
                      minute: undefined,
                    })}
                  </Text>
                </Justified>
              </YStack>
            ))}
          </ScrollView>
          <Button size="$md" type="accent" onPress={() => setVisible(false)}>
            {t("action.close")}
          </Button>
        </Dialog>
        <XStack w="100%" ai="center" jc="center" pt={12} gap="$xs">
          {referral?.map((it, index) => (
            <XStack
              key={it.userId}
              w={index === currentIndex ? 12 : "$xs"}
              h="$xs"
              bc={index === currentIndex ? "$primary" : "$secondary"}
              br="$xs"
            />
          ))}
        </XStack>
      </Popup>
    </Fragment>
  )
}

const LevelCard: FC<{
  level: Level
  locked?: boolean
  active?: boolean
}> = ({ level, locked, active }) => {
  const { config } = usePartnerStore()
  const { t } = useTranslation()
  const dict = t("partner", {
    returnObjects: true,
  })
  const partnerLevel = usePartnerStore((state) => state.partnerLevel, shallow)
  return (
    <LinearGradient
      w={148}
      h={partnerLevel === level ? 192 : 164}
      p="$xs"
      br="$xs"
      colors={active ? GRADIENT_COLORS[level] : ["#5E5D5C", "#5E5D5C"]}
      start={[0, 0]}
      end={[1, 1]}
      onPress={() => {
        usePartnerStore.setState({ currentLevel: level })
      }}
    >
      <YStack
        ai="center"
        jc="space-around"
        br="$xs"
        w="100%"
        f={1}
        bc={active ? "rgba(0,0,0,0.8)" : "#262522"}
      >
        <Text>{format(config?.[level].market ?? 0)}</Text>
        <Figure name={LEVELS[level]} width={56} height={56} />
        <Text fow="900" col={active ? LEVEL_COLORS[level] : "#5E5D5C"}>
          {_.upperCase(dict.children[level])}
        </Text>
        {locked ? (
          <XStack pos="absolute" r={8} t={8}>
            <Icon name="lock" color="#5E5D5C" size={16} />
          </XStack>
        ) : null}
      </YStack>
      {partnerLevel === level ? (
        <XStack h={28} ai="center" jc="center">
          <Text col="#2F281A" fow="700" fos={11}>
            {dict.currentRank}
          </Text>
        </XStack>
      ) : null}
    </LinearGradient>
  )
}

export default function Page() {
  const { account } = useFroxlStore()
  const { bottom } = useSafeAreaInsets()
  const { t } = useTranslation()
  const dict = t("partner", {
    returnObjects: true,
  })
  const { currentLevel, partnerLevel, currentConfig, config } = usePartnerStore(
    (state) => ({
      activeIndex: state.activeIndex,
      partnerLevel: state.partnerLevel,
      currentLevel: state.currentLevel,
      currentConfig: state.config?.find(
        (it) => it.level === state.currentLevel
      ),
      config: state.config,
    })
  )

  const bonusSheetRef = useRef<BottomSheetBase>(null)
  return (
    <Screen px={0} gap={0} pb={0}>
      <Stack.Screen options={ScreenOptions} />
      <Gradient />
      <ScrollView f={1} px="$md">
        <AccountInfo />
        <YStack py="$md" gap={12}>
          <Text col="$secondary">{t("partner.level")}</Text>
          <XStack w="100%" ai="center" jc="space-between">
            <XStack
              pos="absolute"
              l={0}
              r={0}
              t={8}
              h="$xs"
              bc="$border"
            ></XStack>
            {dict.children.map((it, index) => (
              <YStack ai="center" jc="center" key={index} f={1} gap="$xs">
                <YStack>
                  <XStack h={24} w={32} ai="center" jc="center">
                    <Figure
                      name={index === partnerLevel ? "triangleL" : "triangleS"}
                      width={index === partnerLevel ? 32 : 24}
                      height={index === partnerLevel ? 28 : 20}
                    ></Figure>
                  </XStack>
                  {index === partnerLevel ? (
                    <XStack
                      pos="absolute"
                      l={0}
                      r={0}
                      t={0}
                      b={0}
                      ai="center"
                      jc="center"
                    >
                      <Text ff="$mono" fow="900" mb={8} fos={10}>
                        {index}
                      </Text>
                    </XStack>
                  ) : null}
                </YStack>
                <Text fos={11}>{format(config?.[index].market ?? 0)}</Text>
              </YStack>
            ))}
          </XStack>
        </YStack>
        <ScrollView horizontal>
          <XStack gap="$sm" p="$md">
            {dict.children.map((it, index) => (
              <LevelCard
                level={index as Level}
                key={index}
                locked={index > partnerLevel}
                active={index === currentLevel}
              />
            ))}
          </XStack>
        </ScrollView>
        <Card gap="$md" blw="$xs" blc={LEVEL_COLORS[currentLevel] ?? "#CCB6A0"}>
          <Row gap="$sm">
            <Text fow="700" col={LEVEL_COLORS[currentLevel]}>
              {dict.children[currentLevel]}
            </Text>
            <Text fow="700">{dict.benefits}</Text>
          </Row>
          <Justified>
            <Row gap="$xs">
              <Text col="$secondary">{t("partner.tradingBonus")}</Text>
              <XStack
                hitSlop={10}
                onPress={() => bonusSheetRef.current?.expand()}
              >
                <Icon name="info" size={12} />
              </XStack>
            </Row>
            <Text>
              {t("partner.perLotMoney", {
                money: formatDecimal(currentConfig?.market ?? 0),
              })}
            </Text>
          </Justified>
          <Justified>
            <Text col="$secondary">{t("partner.minBonus")}</Text>
            <Text>
              {t("partner.perDayMoney", {
                money: formatDecimal(currentConfig?.funds ?? 0),
              })}
            </Text>
          </Justified>
          <Text fow="700" mt={12} mb={1}>
            {t("partner.requirements")}
          </Text>
          <Justified>
            <Text col="$secondary">{t("partner.balance")}</Text>
            <Text>
              {t("partner.andAboveMoney", {
                money: formatDecimal(currentConfig?.funds ?? 0),
              })}
            </Text>
          </Justified>
          <Justified>
            <Text col="$secondary">{dict.volume}</Text>
            <Text>
              {t("partner.andAboveMoney", {
                money: formatDecimal(currentConfig?.market ?? 0),
              })}
            </Text>
          </Justified>
          {currentLevel ? (
            <Justified>
              <Text col="$secondary">{t("partner.teamStructure")}</Text>
              <Row gap="$xs">
                <Text>
                  {t("partner.levenNumber", {
                    number: currentConfig?.offlineCount ?? 0,
                  })}
                </Text>
                <Text style={{ color: LEVEL_COLORS[currentLevel - 1] }}>
                  {dict.children[currentLevel - 1]}
                </Text>
              </Row>
            </Justified>
          ) : null}
        </Card>
        <XStack h="$md"></XStack>
      </ScrollView>
      <BottomSheet
        ref={bonusSheetRef}
        title={dict.bonusDesc.title}
        onClose={() => {
          bonusSheetRef.current?.close()
        }}
      >
        <YStack px="$md" gap="$md" pb={bottom + 16}>
          {dict.bonusDesc.description.map((it, index) => (
            <Text key={index}>{it}</Text>
          ))}
        </YStack>
      </BottomSheet>
    </Screen>
  )
}
