import { Vec2Like } from "../math";

/**
 * 多角形。
 */
export interface Polygon {
    position: Vec2Like;

    vertices: Vec2Like[];
}
