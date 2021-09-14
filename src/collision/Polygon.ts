import { Vec2Like } from "../math";

/**
 * 多角形。
 */
export interface Polygon {
    /**
     * 多角形の位置。
     *
     * 多角形内部の座標。交差判定で用いられる。
     */
    position: Vec2Like;

    /** 多角形の頂点座標の配列。 */
    vertices: Vec2Like[];
}
