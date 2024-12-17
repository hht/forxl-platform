import BottomSheetBase from '@gorhom/bottom-sheet'
import { Link } from 'expo-router'
import { Fragment, useRef, useState } from 'react'
import { Defs, Ellipse, RadialGradient, Stop, Svg } from 'react-native-svg'
import { XStack, YStack } from 'tamagui'

import { BottomSheet, Button, Card, Input, Popup, ScrollView, Text, toast } from '~/components'
import colors from '~/theme/colors'

export default function Page() {
  const [visible, setVisible] = useState(false)

  const bottomSheetRef = useRef<BottomSheetBase>(null)
  return (
    <Fragment>
      <YStack ai="center" jc="center" bc="$background" gap="$md" flex={1}>
        <Svg
          height="300"
          width="100%"
          style={{ position: "absolute", top: -50 }}
        >
          <Defs>
            <RadialGradient
              id="grad"
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#062E11" stopOpacity="1" />
              <Stop offset="60%" stopColor="#062E11" stopOpacity="0.6" />
              <Stop offset="100%" stopColor="#062E11" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Ellipse cx="50%" cy="50%" rx="50%" ry="50%" fill="url(#grad)" />
        </Svg>
        <ScrollView f={1} w="100%" h={50} centerContent>
          <Card bordered gap="$lg">
            <Text head>文本例子</Text>
            <Button onPress={() => setVisible(true)}>弹出菜单</Button>
            <Button onPress={() => bottomSheetRef.current?.expand()}>
              底部弹出框
            </Button>
            <Input
              label="输入框"
              backgroundColor={colors.card}
              status="success"
            />
            <Input
              label="第二个输入框"
              backgroundColor={colors.card}
              status="error"
            />
            <Input label="第三个输入框" backgroundColor={colors.card} />
            <Link href="/partners" asChild>
              <Button type="accent">合作伙伴</Button>
            </Link>
            <Button
              type="accent"
              onPress={() => {
                toast.show(`Hello, world! ${new Date().toLocaleTimeString()}`)
              }}
            >
              消息框
            </Button>
            <Link replace href="/(anon)" asChild>
              <Button type="accent">退出系统</Button>
            </Link>
          </Card>
        </ScrollView>
      </YStack>
      <Popup
        visible={visible}
        onClose={() => setVisible(false)}
        closeOnTouchOutside
      >
        <Card gap="$lg">
          <Text head>Hello, world!</Text>
          <XStack gap="$lg" w="100%">
            <Button f={1} onPress={() => {}}>
              确定
            </Button>
            <Button type="destructive" f={1}>
              取消
            </Button>
          </XStack>
        </Card>
      </Popup>
      <BottomSheet
        ref={bottomSheetRef}
        onClose={() => bottomSheetRef.current?.close()}
      >
        <YStack p="$lg">
          <Text>Awesome 🎉</Text>
        </YStack>
      </BottomSheet>
    </Fragment>
  )
}
