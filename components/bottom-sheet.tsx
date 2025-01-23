import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet"
import { forwardRef } from "react"
import { Dimensions, StyleSheet } from "react-native"
import { XStack } from "tamagui"

import { Icon } from "./icon"
import { Text } from "./text"

import colors from "~/theme/colors"

interface BottomSheetProps {
  title?: string
  children: React.ReactNode
}

const renderBackdrop = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop
    {...props}
    disappearsOnIndex={-1}
    appearsOnIndex={0}
    opacity={0.5}
  />
)
const MAX_HEIGHT = Dimensions.get("window").height * 0.8

export const BottomSheet = forwardRef<
  BottomSheetModal,
  BottomSheetModalProps & BottomSheetProps
>(({ title, children, onDismiss, ...rest }, ref) => {
  return (
    <BottomSheetModal
      ref={ref}
      backgroundStyle={styles.container}
      backdropComponent={renderBackdrop}
      handleComponent={null}
      enableDynamicSizing
      maxDynamicContentSize={MAX_HEIGHT}
      enablePanDownToClose
      onDismiss={onDismiss}
      {...rest}
    >
      <BottomSheetView style={styles.content}>
        <XStack
          px="$md"
          py={title ? "$lg" : "$md"}
          jc="space-between"
          ai="center"
          zIndex={999}
        >
          <Text subject col="$text">
            {title}
          </Text>
          <XStack
            onPress={() => {
              const r = ref as any
              if (onDismiss) {
                onDismiss()
              } else {
                r.current?.dismiss()
              }
            }}
            pressStyle={{
              scale: 0.95,
            }}
            hitSlop={10}
          >
            <Icon name="close" color={colors.text} size={16} />
          </XStack>
        </XStack>
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  )
})

BottomSheet.displayName = "BottomSheet"

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  content: {
    height: "100%",
  },
})
