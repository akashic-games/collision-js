import { Vec2Like } from "../math";

/**
 * 軸平行バウンディングボックス。
 */
export interface AABB {
    /** 最小の座標。 */
    min: Vec2Like;

    /** 最大の座標。 */
    max: Vec2Like;
}
