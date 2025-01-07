import { request } from '~/hooks/useRequest'
import { toInfinite } from '~/lib/utils'

export const getNotifications = async ({
  type,
  currentPage = 1,
}: {
  type: string
  currentPage?: number
}) => {
  return await request<
    PaginationResponse<Message>,
    { type: number; currentPage: number; pageSize: number }
  >("/user/userMessage", "POST", {
    type: parseInt(type),
    currentPage,
    pageSize: 10,
  }).then((res) => {
    return toInfinite(res, currentPage)
  })
}

export const readAllNotifications = async (type = 0) => {
  await request<boolean, { type: number }>("/user/readAllMessage", "POST", {
    type,
  })
}

export const readNotification = async (messageId: number) => {
  await request<boolean, { messageId: number }>(
    "/user/readOneMessage",
    "POST",
    { messageId }
  )
}

/**
 * 获取新消息数量
 */

export const getNewMessageCount = async (type = 0) => {
  return await request<number, undefined>("/user/newMessageCount", "POST")
}
