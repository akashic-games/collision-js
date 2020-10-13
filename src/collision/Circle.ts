import { Vec2Like } from "../math";

/**
 * 円。
 */
export interface Circle {
    /** 中心座標。 */
    position: Vec2Like;

    /** 半径。 */
    radius: number;
}
