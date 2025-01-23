import { BottomSheetModal } from "@gorhom/bottom-sheet"
import _ from "lodash"
import { FC, useEffect, useRef } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { BottomSheet, ScrollView, Text, YStack } from "~/components"
import { usePromptStore } from "~/hooks/useStore"

export const PromptSheet: FC = () => {
  const { title, desc, reloadKey } = usePromptStore()
  const { bottom } = useSafeAreaInsets()
  const ref = useRef<BottomSheetModal>(null)
  useEffect(() => {
    if (reloadKey) {
      ref.current?.present()
    }
  }, [reloadKey])
  return reloadKey ? (
    <BottomSheet ref={ref} title={title} index={0}>
      <ScrollView>
        <YStack px="$md" gap="$sm" pb={bottom + 16}>
          {_.isString(desc) ? (
            <Text title>{desc}</Text>
          ) : (
            desc?.map((item, index) => (
              <Text title key={index}>
                {item}
              </Text>
            ))
          )}
        </YStack>
      </ScrollView>
    </BottomSheet>
  ) : null
}
