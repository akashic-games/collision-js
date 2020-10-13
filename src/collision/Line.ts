import { Vec2Like } from "../math";

/**
 * 直線。
 */
export interface Line {
    /** 直線上の一点。 */
    position: Vec2Like;

    /** 直線の方向ベクトル。 */
    direction: Vec2Like;
}
