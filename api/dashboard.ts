import { request } from "~/hooks/useRequest"
import { useForxlStore } from "~/hooks/useStore"
import { getLocaleLanguage, i18n } from "~/lib/utils"

export const getBanners = async (position: number) => {
  return request<Banner[], undefined>(
    `/banner/v3/list?language=${i18n.resolvedLanguage}&position=${position}`,
    "GET"
  ).then((res) => res.filter((it) => it.status === 1 && it.isDel === 0))
}

export const getNews = async (params: {
  date: string
  page: number
}): Promise<{
  nextId?: number
  list: {
    id: number
    content: string
    date: string
    headline: string
    img: string
    instrument: string
  }[]
}> => {
  return await fetch(
    `https://news.usd.lt/get_news.php?date=${params.date}&page=${params.page}&limit=${10}&lang=${getLocaleLanguage(useForxlStore.getState().language || "en")}`
  )
    .then((res) => res.json())
    .then((res) => {
      return {
        list: res.results,
        nextId:
          res.currentPage + 1 > res.totalPages || res.results.length === 0
            ? undefined
            : res.currentPage + 1,
      }
    })
}
