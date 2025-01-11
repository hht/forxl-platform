import { MotiView } from "moti"
import { ReactNode, useCallback, useContext, useEffect } from "react"
import { BackHandler, Platform, StyleSheet, ViewStyle } from "react-native"

import { PortalContext } from "./portal"

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
  const { mount, unmount } = useContext(PortalContext)
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

  useEffect(() => {
    if (visible) {
      mount(
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
          style={[styles.content, style]}
        >
          {children}
        </MotiView>
      )
    } else {
      unmount()
    }

    return () => unmount()
  }, [
    visible,
    children,
    position,
    style,
    mount,
    closeOnTouchOutside,
    onClose,
    unmount,
  ])

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButton
    )
    return () => subscription.remove()
  }, [handleBackButton])

  return null
}

const styles = StyleSheet.create({
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
})
