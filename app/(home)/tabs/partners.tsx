import { useState } from 'react'
import { YStack } from 'tamagui'

import { Picker, Text, XStack } from '~/components'

export default function Page() {
  const data = [...Array(100).keys()].map((index) => ({
    value: index,
    label: `这是一个选项${index}`,
  }))
  const [value, setValue] = useState<string | number>(13)
  return (
    <YStack f={1} bc="$background" ai="center" jc="center">
      <Picker
        data={data}
        value={value}
        visibleItems={5}
        onValueChanged={(value: string | number) => {
          setValue(value)
        }}
      />
      <XStack w="100%" jc="center" p="$lg">
        <Text>{value}</Text>
      </XStack>
    </YStack>
  )
}
