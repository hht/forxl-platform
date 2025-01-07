import { I18NResource } from '~/lib/utils'
import colors from '~/theme/colors'

export const DEPOSIT_STATUS: Record<number, I18NResource> = {
  0: "wallet.pendingReview",
  1: "wallet.depositPassed",
  2: "wallet.depositRejected",
  3: "wallet.depositSuccessful",
  4: "wallet.depositFailed",
  5: "wallet.withdrawReturned",
  6: "wallet.cardPendingPayment",
  7: "wallet.usdtPendingPayment",
  8: "wallet.orderCancelled",
  9: "wallet.gbkydPendingPayment",
  10: "wallet.paymentSubmitted",
  100: "wallet.thirdPartyPendingPayment",
}

export const WITHDRAW_STATUS: Record<number, I18NResource> = {
  0: "wallet.pendingReview",
  1: "wallet.withdrawPassed",
  2: "wallet.withdrawRejected",
  3: "wallet.withdrawSuccessful",
  4: "wallet.withdrawFailed",
  5: "wallet.withdrawReturned",
  100: "wallet.pendingPayment",
}

export const CHANNEL_DESCRIPTION: Record<number, I18NResource> = {
  0: "wallet.trc20",
  1: "wallet.bep20",
  3: "wallet.bank",
  10: "wallet.recharge",
  11: "wallet.reissue",
  101: "wallet.thirdParty",
  102: "wallet.usdtTransfer",
}

export const getStatusColor = (status: number) => {
  switch (status) {
    case 0:
    case 6:
    case 7:
    case 9:
    case 100:
      return colors.warning
    case 1:
    case 3:
      return colors.primary
    case 2:
    case 4:
      return colors.destructive
    default:
      return colors.secondary
  }
}
