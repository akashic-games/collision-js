import { Vec2Like } from "../math";

/**
 * 線分。
 */
export interface Segment {
    /** 線分の始点。 */
    position: Vec2Like;

    /** 線分の終点。 */
    endPosition: Vec2Like;
}
