import { useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated'

import { DEVICE_WIDTH } from '~/lib/utils'

export const useTabs = (activeIndex: number) => {
    const offsetX = useDerivedValue(() => {
        return activeIndex * DEVICE_WIDTH
    })
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: withTiming(-offsetX.value, {
                        duration: 200,
                    }),
                },
            ],
        }
    }, [])
    return { animatedStyle }
}