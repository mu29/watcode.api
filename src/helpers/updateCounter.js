import { update } from '../services/database'

/**
 * 작품의 카운터를 변경합니다.
 *
 * @param {Number} id 작품의 아이디입니다.
 * @param {String} property 변경할 카운터 속성 이름입니다.
 * @param {Number} value 변경할 카운터 값입니다.
 */
export default async (id, property, value) => {
  await update(['Artwork', id], (artwork) => {
    let updatedValue = (artwork[property] || 0) + value
    if (updatedValue < 0) {
      updatedValue = value < 0 ? 0 : 1
    }
    return { [property]: updatedValue }
  })
}
