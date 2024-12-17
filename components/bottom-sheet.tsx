import BottomSheetBase, {
    BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetView
} from '@gorhom/bottom-sheet'
import { forwardRef } from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import { Portal, Text, XStack } from 'tamagui'

import { Icon } from './icon'

import colors from '~/theme/colors'

interface BottomSheetModalProps {
  title?: string
  children: React.ReactNode
  onClose?: () => void
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
export const BottomSheet = forwardRef<BottomSheetBase, BottomSheetModalProps>(
  ({ title, children, onClose }, ref) => {
    return (
      <Portal>
        <BottomSheetBase
          ref={ref}
          index={-1}
          backgroundStyle={styles.container}
          backdropComponent={renderBackdrop}
          handleComponent={null}
          enableDynamicSizing
          maxDynamicContentSize={MAX_HEIGHT}
          enablePanDownToClose
          onClose={onClose}
        >
          <BottomSheetView>
            <XStack
              px="$md"
              py={title ? "$lg" : "$md"}
              jc="space-between"
              ai="center"
            >
              <Text fos={20} lh={24} col="$text">
                {title}
              </Text>
              <XStack
                onPress={onClose}
                pressStyle={{
                  scale: 0.95,
                }}
                hitSlop={10}
              >
                <Icon name="close" size={16} />
              </XStack>
            </XStack>
            {children}
          </BottomSheetView>
        </BottomSheetBase>
      </Portal>
    )
  }
)

BottomSheet.displayName = "BottomSheet"

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
})
