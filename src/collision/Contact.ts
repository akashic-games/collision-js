import { Vec2 } from "../math";

/**
 * 接触情報。
 */
export interface Contact {
    /**
     * 接触した位置。ワールド座標系。
     */
    point: Vec2;

    /**
     * 侵入距離。負の値。
     */
    separation: number;

    /**
     * 接触した二体を A, B とする時 A からみた B への単位ベクトル。ワールド座標系。
     */
    normal: Vec2;
}
