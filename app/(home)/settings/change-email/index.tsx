import { useUnmount } from 'ahooks'
import { router, Stack } from 'expo-router'
import _ from 'lodash'
import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'
import { z } from 'zod'
import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'

import { changeEmail, getEmailCode, verifyEmailCode } from '~/api/account'
import { Button, Input, Row, Screen, ScrollView, Stepper, Text, toast, YStack } from '~/components'
import { useCountDown } from '~/hooks/useCountdown'
import { useRequest } from '~/hooks/useRequest'
import { useForxlStore } from '~/hooks/useStore'

const useStore = createWithEqualityFn<{
    code: string
    vCode: string
    verificationCode: string
    verified?: boolean
}>((set) => ({
    code: "",
    verificationCode: "",
    vCode: "",
    verified: false,
}))


const GetCodeButton: FC<{
    email?: string
    type: 3 | 7
    disabled: boolean
}> = ({ email, type, disabled }) => {
    const { t } = useTranslation()
    const { countdown, setDate } = useCountDown()
    const { run: getCode, loading: sending } = useRequest(getEmailCode, {
        manual: true,
        onSuccess: (__, [{ email }]) => {
            setDate(Date.now() + 60 * 1000)
            toast.show(
                t("settings.emailVerificationCodeDesc", {
                    email,
                })
            )
        },
    })
    return countdown !== 0 ? (
        <Row h={24}>
            <Text col="$primary" fow="bold">
                {t("message.countdown", {
                    time: `${_.round(countdown / 1000)}`,
                })}
            </Text>
        </Row>
    ) : (
        <Row
            disabled={sending || disabled}
            hitSlop={16}
            h={24}
            onPress={() => {
                getCode({ email: email!, type })
            }}
        >
            {sending ? <ActivityIndicator size="small" /> : <Text col="$primary">{t("settings.getVerificationCode")}</Text>}
        </Row>
    )
}

export default function Page() {
    const { t } = useTranslation("translation")
    const email = useForxlStore((state) => state.account?.email, shallow)
    const { code, vCode, verificationCode, verified } = useStore()
    const { run, loading } = useRequest(changeEmail, {
        manual: true,
        onSuccess: () => {
            useForxlStore.setState({
                account: { ...useForxlStore.getState().account, email: code },
            })
            useStore.setState({ code: "", vCode: "" })
            toast.show(t("settings.emailChangedSuccessful"))
            router.back()
        },
    })

    const { run: verifyCode, loading: verifying } = useRequest(verifyEmailCode, {
        manual: true,
        onSuccess: () => {
            useStore.setState({ verified: true })
            toast.show(t("settings.emailVerified"))
        },
    })

    const scheme = useMemo(
        () =>
            z.object({
                code: z.string().email(t("message.email")),
            }),
        [t]
    )
    const { success, error } = scheme.safeParse({
        code,
    })
    const errors = error?.formErrors?.fieldErrors

    useUnmount(() => {
        useStore.setState({
            code: "",
            vCode: "",
            verificationCode: "",
            verified: false,
        })
    })
    return (
        <Screen p="$md" pt={32} gap={24}>
            <Stack.Screen options={{ title: t("settings.changeEmail") }} />
            <ScrollView
                f={1}
                showsVerticalScrollIndicator={false}
                keyboardDismissMode="interactive"
            >
                <Stepper>
                    <YStack gap="$sm">
                        <Row w="100%" fw="wrap" gap="$sm">
                            <Text col="$secondary">
                                {t("settings.changeEmailStepOne", {
                                    email: email,
                                })}
                            </Text>
                            <GetCodeButton
                                email={email}
                                type={7}
                                disabled={false}
                            ></GetCodeButton>
                        </Row>
                    </YStack>
                    <YStack gap="$md">
                        <Text col="$secondary">
                            {t("settings.changeEmailStepTwo", {
                                email: email,
                            })}
                        </Text>
                        <Input.OTP
                            length={4}
                            value={verificationCode}
                            onChange={(verificationCode) =>
                                useStore.setState({ verificationCode })
                            }
                        />
                        <Button
                            isLoading={verifying}
                            disabled={verifying || verificationCode.length !== 4}
                            onPress={() => {
                                verifyCode(verificationCode)
                            }}
                        >
                            {t("action.verify")}
                        </Button>
                    </YStack>
                    <YStack gap="$md">
                        <Text col="$secondary">{t("settings.changeEmailStepThree")}</Text>
                        <Input
                            value={code}
                            message={errors?.code?.[0]}
                            onChangeText={(code) => useStore.setState({ code })}
                        />
                    </YStack>
                    <YStack gap="$md">
                        <Row w="100%" gap="$sm" fw="wrap">
                            <Text col="$secondary">{t("settings.changeEmailStepFour")}</Text>
                            <GetCodeButton
                                email={code}
                                type={3}
                                disabled={!code || !verified || !success}
                            ></GetCodeButton>
                        </Row>
                        <Input.OTP
                            length={4}
                            disabled={!success || !verified}
                            value={vCode}
                            onChange={(vCode) => useStore.setState({ vCode })}
                        />
                        <Button
                            className="w-48 mt-4"
                            isLoading={loading}
                            disabled={
                                loading ||
                                !code ||
                                vCode.length !== 4 ||
                                !verified ||
                                !success
                            }
                            onPress={() => {
                                run({
                                    code,
                                    vCode,
                                    checkCode: useForxlStore.getState().account?.email!,
                                })
                            }}
                        >
                            {t("action.confirm")}
                        </Button>
                    </YStack>
                </Stepper>
            </ScrollView>

        </Screen>
    )
}
