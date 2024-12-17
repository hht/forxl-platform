import { useMount } from 'ahooks'
import { AnimatePresence, MotiView } from 'moti'
import { FC, useEffect, useState } from 'react'
import { Platform, StyleSheet } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
    runOnJS, useAnimatedStyle, useSharedValue, withSpring
} from 'react-native-reanimated'
import { Portal, Text, YStack } from 'tamagui'

import colors from '~/theme/colors'

interface ToastProps {
  id: string
  message: string
  type?: "success" | "error" | "warning" | "info"
  duration?: number
}

class ToastEmitter {
  private static listeners: Set<(toast: ToastProps) => void> = new Set()

  static addListener(listener: (toast: ToastProps) => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  static show(
    message: string,
    type: ToastProps["type"] = "info",
    duration = 3000
  ) {
    const toast: ToastProps = {
      id: Math.random().toString(),
      message,
      type,
      duration,
    }
    this.listeners.forEach((listener) => listener(toast))
  }
}

export const toast = {
  show: ToastEmitter.show.bind(ToastEmitter),
}

export const Toaster: FC<{ max?: number }> = ({ max }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  useMount(() => {
    ToastEmitter.addListener((toast: ToastProps) => {
      setToasts((prev) => {
        const newToasts = [...prev, toast]
        if (newToasts.length > (max ?? 5)) {
          return newToasts.slice(-(max ?? 5))
        }
        return newToasts
      })
      if ((toast.duration ?? 2000) > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toast.id))
        }, toast.duration)
      }
    })
  })

  return (
    <Portal>
      <YStack
        position="absolute"
        left={0}
        right={0}
        bottom={0}
        top={0}
        justifyContent="center"
        alignItems="center"
        pointerEvents="box-none"
      >
        <AnimatePresence>
          {toasts.map((toast, index) => (
            <Toast
              key={toast.id}
              toast={toast}
              onDismiss={() =>
                setToasts((prev) => prev.filter((t) => t.id !== toast.id))
              }
              index={toasts.length - 1 - index}
              total={toasts.length}
            />
          ))}
        </AnimatePresence>
      </YStack>
    </Portal>
  )
}

const Toast = ({
  toast,
  onDismiss,
  index,
  total,
}: {
  toast: ToastProps
  onDismiss: () => void
  index: number
  total: number
}) => {
  const translateY = useSharedValue(0)
  const offsetY = useSharedValue(0)
  const scale = useSharedValue(1)

  useEffect(() => {
    const yOffset = index * 12
    const scaleValue = Math.max(1 - index * 0.1, 0.5)

    offsetY.value = withSpring(yOffset, {
      damping: 15,
      stiffness: 200,
    })
    scale.value = withSpring(scaleValue, {
      damping: 15,
      stiffness: 200,
    })
  }, [index, total, offsetY, scale])

  const gesture = Gesture.Pan()
    .onChange((event) => {
      translateY.value += event.changeY
    })
    .onEnd(() => {
      if (Math.abs(translateY.value) > 50) {
        runOnJS(onDismiss)()
      } else {
        translateY.value = withSpring(0)
      }
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateY: offsetY.value },
      { scale: scale.value },
    ],
  }))

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          {
            position: "absolute",
            width: "100%",
            alignItems: "center",
          },
          animatedStyle,
        ]}
      >
        <MotiView
          from={{
            opacity: 0,
            scale: 0.5,
            translateY: 50,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            translateY: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.5,
            translateY: -20,
          }}
          transition={{
            type: "spring",
            damping: 15,
            stiffness: 150,
          }}
          style={[
            styles.toast,
            {
              zIndex: index,
            },
          ]}
        >
          <Text color="white" textAlign="center">
            {toast.message}
          </Text>
        </MotiView>
      </Animated.View>
    </GestureDetector>
  )
}

const styles = StyleSheet.create({
  toast: {
    padding: 12,
    borderRadius: 8,
    minWidth: 200,
    maxWidth: "80%",
    marginVertical: 8,
    backgroundColor: colors.card,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
      },
    }),
  },
})

export default Toaster
