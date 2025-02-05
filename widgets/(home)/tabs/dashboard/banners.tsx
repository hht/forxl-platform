import * as Linking from "expo-linking"
import { router } from "expo-router"
import _ from "lodash"
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  ActivityIndicator,
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native"

import { getBanners } from "~/api/dashboard"
import { Icon, ScrollView, XStack } from "~/components"
import { CACHE_KEY, useRequest } from "~/hooks/useRequest"
import { useWebViewStore } from "~/hooks/useStore"
import colors from "~/theme/colors"

export const CAROUSEL_WIDTH = Dimensions.get("window").width - 32

const AspectImage: FC<{ uri?: string; onPress: () => void }> = ({
  uri,
  ...rest
}) => {
  const [ratio, setRatio] = useState(343 / 160)
  const [loaded, setLoaded] = useState(false)
  return (
    <XStack>
      <Image
        onLoad={(e) =>
          setRatio(e.nativeEvent.source.width / e.nativeEvent.source.height)
        }
        style={{
          width: CAROUSEL_WIDTH,
          aspectRatio: ratio,
        }}
        onLoadEnd={() => setLoaded(true)}
        source={{ uri }}
        {...rest}
      />
      {loaded ? null : (
        <XStack
          pos="absolute"
          t={0}
          r={0}
          l={0}
          b={0}
          ai="center"
          jc="center"
          bc="$card"
        >
          <ActivityIndicator />
        </XStack>
      )}
    </XStack>
  )
}

export const Banners: FC<{ position: number }> = ({ position }) => {
  const { data } = useRequest(() => getBanners(position), {
    cacheKey: `${CACHE_KEY.BANNERS}.${position}`,
  })
  const ref = useRef<ScrollView>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const timerRef = useRef<NodeJS.Timeout>()
  const banners = useMemo(() => {
    if (!data?.length) return []
    if (data?.length === 1) return data
    return [data[data.length - 1], ...data, data[0]]
  }, [data])

  const onScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!banners.length) return
      const offsetX = event.nativeEvent.contentOffset.x
      const index = Math.round(offsetX / CAROUSEL_WIDTH)

      if (index === 0) {
        // 滚到最左边，跳到最后一张
        setCurrentIndex(banners!.length - 2)
        ref.current?.scrollTo({
          x: CAROUSEL_WIDTH * (banners!.length - 2),
          animated: false,
        })
      } else if (index === banners!.length - 1) {
        // 滚到最右边，跳到第一张
        setCurrentIndex(1)
        ref.current?.scrollTo({
          x: CAROUSEL_WIDTH,
          animated: false,
        })
      } else {
        setCurrentIndex(index)
      }
      setIsScrolling(false)
    },
    [banners]
  )

  useEffect(() => {
    if (isScrolling || !banners.length || banners.length === 1) return
    timerRef.current = setInterval(() => {
      const next = (currentIndex + 1) % banners.length
      if (next === 0) {
        setCurrentIndex(1)
        ref.current?.scrollTo({
          x: 0,
          animated: false,
        })
        ref.current?.scrollTo({
          x: CAROUSEL_WIDTH,
          animated: true,
        })
      } else {
        setCurrentIndex(next)
        ref.current?.scrollTo({
          x: next * CAROUSEL_WIDTH,
          animated: true,
        })
      }
    }, 3000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [currentIndex, isScrolling, banners])
  if (!data || data.length === 0) {
    return null
  }
  return (
    <XStack w="100%" br="$sm" ov="hidden" mt="$md">
      <ScrollView
        ref={ref}
        horizontal
        w="100%"
        scrollEnabled={data.length > 1}
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={() => setIsScrolling(true)}
        onMomentumScrollEnd={onScrollEnd}
        contentOffset={{ x: CAROUSEL_WIDTH, y: 0 }}
      >
        {banners?.map((banner, index) => (
          <AspectImage
            key={index}
            uri={banner.img}
            onPress={() => {
              if (!banner.jumpUrl) {
                return
              }
              switch (banner.jumpType) {
                case 0:
                  router.push(banner.jumpUrl as any)
                  return
                case 1:
                  useWebViewStore.setState({
                    title: banner.name,
                    uri: banner.jumpUrl as string,
                  })
                  router.push("/web-view")
                  return
                case 2:
                  Linking.openURL(banner.jumpUrl)
              }
            }}
          />
        ))}
      </ScrollView>
      <XStack pos="absolute" w="100%" jc="center" bottom={0} gap="$sm" p="$sm">
        {_.times(data?.length ?? 0).map((index) => (
          <Icon
            name="dot"
            width={13}
            key={index}
            height={3}
            color={currentIndex === index + 1 ? colors.text : colors.secondary}
          ></Icon>
        ))}
      </XStack>
    </XStack>
  )
}
