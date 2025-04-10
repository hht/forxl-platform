import { FC } from 'react'
import {
    ActivityIndicator, FlatList as RNList, FlatListProps, GestureResponderEvent
} from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { XStack } from '~/components'

export const FlatList: FC<FlatListProps<any>> = ({ onRefresh, ...rest }) => {
    const touchStartY = useSharedValue(0)
    const touchStartX = useSharedValue(0)
    const pullHeight = useSharedValue(0)
    const dragging = useSharedValue(false)
    const animatedStyle = useAnimatedStyle(() => ({
        height: pullHeight.value
    }))

    const onTouchStart = (e: GestureResponderEvent) => {
        dragging.value = true
        touchStartY.value = e.nativeEvent.touches[0].pageY
        touchStartX.value = e.nativeEvent.touches[0].pageX
    }

    const onTouchMove = (e: GestureResponderEvent) => {
        if (!dragging.value) return
        const currentY = e.nativeEvent.touches[0].pageY
        const currentX = e.nativeEvent.touches[0].pageX

        // 计算水平和垂直方向的移动距离
        const verticalDiff = Math.abs(currentY - touchStartY.value)
        const horizontalDiff = Math.abs(currentX - touchStartX.value)

        // 如果水平移动距离大于垂直移动距离，忽略下拉刷新
        if (horizontalDiff > verticalDiff) {
            dragging.value = false
            pullHeight.value = withTiming(0)
            return
        }

        const diff = Math.max(0, currentY - touchStartY.value)
        if (diff > 0) {
            pullHeight.value = Math.min(100, diff / 2)
        }
        if (pullHeight.value === 100) {
            dragging.value = false
            onRefresh?.()
            pullHeight.value = withTiming(0)
        }
    }

    const onTouchEnd = () => {
        dragging.value = false
        pullHeight.value = withTiming(0)
    }

    return (
        <>
            <Animated.View style={[{ overflow: 'hidden', alignItems: 'center' }, animatedStyle]}>
                <XStack ai="center" jc="center" h={100} p="$md">
                    <ActivityIndicator />
                </XStack>
            </Animated.View>
            <RNList
                bounces={false}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                {...rest}
            />
        </>
    )
}
