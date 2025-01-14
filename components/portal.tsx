// components/Portal.tsx
import { AnimatePresence, MotiView } from 'moti'
import { createContext, useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { YStack } from 'tamagui'

export const PortalContext = createContext<{
  mount: (children: React.ReactNode) => void
  unmount: () => void
}>({
  mount: () => {},
  unmount: () => {},
})

export const PortalProvider = ({ children }: { children: React.ReactNode }) => {
  const [portal, setPortal] = useState<React.ReactNode>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    setVisible(!!portal)
  }, [portal])
  return (
    <PortalContext.Provider
      value={{
        mount: (children) => setPortal(children),
        unmount: () => setVisible(false),
      }}
    >
      {children}
      <YStack
        style={[styles.container, { backgroundColor: "transparent" }]}
        pointerEvents={visible ? "auto" : "none"}
      >
        <AnimatePresence onExitComplete={() => setPortal(null)}>
          {visible && (
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "timing", duration: 200 }}
              style={[
                styles.container,
                {
                  pointerEvents: visible ? "auto" : "box-only",
                },
              ]}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>{visible && portal}</AnimatePresence>
      </YStack>
    </PortalContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
})
