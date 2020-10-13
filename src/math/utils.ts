
/**
 * 指定された範囲に数値を制約する。
 *
 * @param val 制約したい数値。
 * @param min 制約の下限。
 * @param max 制約の上限。
 */
export function clamp(val: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, val));
}

/**
 * オーバーラップテスト。
 *
 * ２つの区間が重なっている時、真。
 *
 * @param aMin 区間Aの最小値。
 * @param aMax 区間Aの最大値。
 * @param bMin 区間Bの最小値。
 * @param bMax 区間Bの最大値。
 */
export function overlap(aMin: number, aMax: number, bMin: number, bMax: number): boolean {
    return !(bMax < aMin || aMax < bMin);
}
