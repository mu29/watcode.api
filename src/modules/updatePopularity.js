import { update } from '../services/database'

/**
 * 작품의 인기도를 늘려줍니다.
 *
 * @param {Number} id 작품의 아이디입니다.
 * @param {Number} value 올려줄 인기도 값입니다.
 */
export default async (id, value) => {
  await update(['Popularity', id], (popularity) => {
    // 일별 인기도 소스를 가져옵니다.
    const today = parseInt(Date.now() / (86400 * 1000))
    const source = popularity.source || Array(30).fill(0)
    // 날짜가 변경된 경우 가장 오래된 인기도 데이터를 삭제합니다.
    let gap = today - popularity.updatedAt
    while (gap > 0) {
      source.shift()
      source.push(0)
      gap--
    }
    // 오늘 인기도를 늘려줍니다.
    source.push(source.pop() + value)
    source.reverse()

    const sum = (src, count) => src.slice(0, count).reduce((e, r) => e + r, 0)

    return {
      id,
      daily: sum(source, 2),
      weekly: sum(source, 7),
      monthly: sum(source, 30),
      source: source.reverse(),
      updatedAt: today,
    }
  })
}
