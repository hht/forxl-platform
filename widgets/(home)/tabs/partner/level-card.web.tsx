import _ from 'lodash'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { LinearGradient } from 'tamagui/linear-gradient'
import { shallow } from 'zustand/shallow'

import { Icon, Image, Text, XStack, YStack } from '~/components'
import { usePartnerStore } from '~/hooks/useStore'

import { format, GRADIENT_COLORS, Level, LEVEL_COLORS } from './utils'
import { LEVELS } from './utils/level'

export const LevelCard: FC<{
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
                <Image source={LEVELS[level]} width={56} height={56} />
                <Text bold col={active ? LEVEL_COLORS[level] : "#5E5D5C"}>
                    {_.upperCase(dict.children[level])}
                </Text>
                {locked ? (
                    <XStack pos="absolute" r={8} t={8}>
                        <Icon
                            name="lock"
                            color={active ? LEVEL_COLORS[level] : "#5E5D5C"}
                            size={16}
                        />
                    </XStack>
                ) : null}
            </YStack>
            {partnerLevel === level ? (
                <XStack h={28} ai="center" jc="center">
                    <Text col="#2F281A" bold caption>
                        {dict.currentRank}
                    </Text>
                </XStack>
            ) : null}
        </LinearGradient>
    )
}
