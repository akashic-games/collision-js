import { Vec2Like } from "../math";

/**
 * 矩形。
 */
export interface Box {
    /** 中心座標。 */
    position: Vec2Like;

    /** 縦・横の半分の長さ。 */
    halfExtend: Vec2Like;

    /** 回転角度[radian]。 */
    angle: number;
}
