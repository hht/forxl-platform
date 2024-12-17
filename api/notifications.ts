import { request } from "~/hooks/useRequest"

export const getNotifications = async (type = 0) => {
  return await request<PaginationResponse<Message>, { type: number }>(
    "/user/userMessage",
    "POST",
    { type }
  )
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

export const getNewMessageCount = async () => {
  return await request<number, undefined>("/user/newMessageCount", "POST")
}
