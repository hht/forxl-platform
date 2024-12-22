import { MotiView } from "moti"
import { AnimatePresence } from "moti/build/core"
import { ReactNode, useCallback, useEffect } from "react"
import { BackHandler, Platform, StyleSheet, ViewStyle } from "react-native"
import { Portal } from "tamagui"

interface PopupProps {
  visible: boolean
  onClose: () => void
  children: ReactNode
  position?: "center" | "bottom"
  closeOnTouchOutside?: boolean
  style?: ViewStyle
}

export const Popup = ({
  visible,
  onClose,
  children,
  position = "center",
  closeOnTouchOutside = false,
  style,
}: PopupProps) => {
  // 处理返回按钮
  const handleBackButton = useCallback(() => {
    if (visible) {
      onClose()
      return true
    }
    return false
  }, [visible, onClose])

  // 添加返回按钮监听
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButton
    )
    return () => subscription.remove()
  }, [handleBackButton])

  return (
    <Portal>
      <AnimatePresence>
        {visible && (
          <MotiView
            from={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              type: "timing",
              duration: 200,
            }}
            style={styles.container}
            onTouchEnd={() => closeOnTouchOutside && onClose()}
          >
            <MotiView
              from={{
                opacity: 0,
                translateY: 100,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                translateY: 0,
              }}
              exit={{
                opacity: 0,
                translateY: 100,
              }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 300,
              }}
              style={[
                styles.content,
                position === "bottom" && styles.bottomContent,
                style,
              ]}
              onTouchEnd={(e) => e.stopPropagation()}
            >
              {children}
            </MotiView>
          </MotiView>
        )}
      </AnimatePresence>
    </Portal>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "auto",
  },
  content: {
    width: "90%",
    alignSelf: "center",
    flexShrink: 1,
    // web端阴影
    ...Platform.select({
      web: {
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(8px)",
      },
      default: {
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
    }),
  },
  bottomContent: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
})
