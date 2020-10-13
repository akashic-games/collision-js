import { Vec2Like } from "./Vec2Like";
import { Vec2 } from "./Vec2";

/**
 * 2x2行列。
 */
export class Mat22 {
    /**
     * 単位ベクトル。
     */
    static readonly identity = Object.freeze(new Mat22());

    /**
     * 回転行列を作成する。　
     *
     * @param angle 回転の角度[rad]。
     */
    static makeRotate(angle: number): Mat22 {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return new Mat22({ x: c, y: s }, { x: -s, y: c });
    }

    /**
     * スケール行列を作成する。
     *
     * @param scale スケール行列。
     */
    static makeScale(scale: Vec2Like): Mat22 {
        return new Mat22({ x: scale.x, y: 0 }, { x: 0, y: scale.y });
    }

    /** 第一列。 */
    ex: Vec2;

    /** 第二列 */
    ey: Vec2;

    /**
     * コンストラクタ。
     *
     * @param ex 第一列。省略時 (1, 0)。
     * @param ey 第二列。省略時 (0, 1)。
     */
    constructor(ex?: Vec2Like, ey?: Vec2Like) {
        this.ex = new Vec2(ex || { x: 1, y: 0 });
        this.ey = new Vec2(ey || { x: 0, y: 1 });
    }

    /**
     * 複製する。
     */
    clone(): Mat22 {
        return new Mat22(this.ex, this.ey);
    }

    /**
     * 比較する。
     *
     * 行列が等しい時、真。
     *
     * @param m 比較する行列。
     */
    equal(m: Mat22): boolean {
        return this.ex.equal(m.ex) && this.ey.equal(m.ey);
    }

    /**
     * 行列を乗算する。
     *
     * @param m 行列。
     */
    mul(m: Mat22): this {
        const m11 = this.ex.x * m.ex.x + this.ey.x * m.ex.y;
        const m21 = this.ex.y * m.ex.x + this.ey.y * m.ex.y;
        const m12 = this.ex.x * m.ey.x + this.ey.x * m.ey.y;
        const m22 = this.ex.y * m.ey.x + this.ey.y * m.ey.y;

        this.ex.x = m11;
        this.ex.y = m21;
        this.ey.x = m12;
        this.ey.y = m22;

        return this;
    }

    /**
     * 行列式を求める。
     */
    determinant(): number {
        return this.ex.x * this.ey.y - this.ex.y * this.ey.x;
    }

    /**
     * 転置行列にする。
     */
    transpose(): this {
        const tmp = this.ey.x;
        this.ey.x = this.ex.y;
        this.ex.y = tmp;
        return this;
    }

    /**
     * 逆行列にする。
     *
     * 逆行列が存在しない時 null 。
     */
    inverse(): this | null {
        const det = this.determinant();
        if (det === 0) {
            return null;
        }

        const exx = this.ex.x;
        this.ex.x = this.ey.y / det;
        this.ex.y = this.ex.y * -1 / det;
        this.ey.x = this.ey.x * -1 / det;
        this.ey.y = exx / det;

        return this;
    }

    /**
     * 単位行列にする。
     */
    setIdentity(): this {
        this.ex.x = 1;
        this.ex.y = 0;
        this.ey.x = 0;
        this.ey.y = 1;
        return this;
    }

    /**
     * 回転する。
     *
     * @param angle 回転の角度[rad]。
     */
    rotate(angle: number): this {
        const m11 = this.ex.x;
        const m21 = this.ex.y;
        const m12 = this.ey.x;
        const m22 = this.ey.y;

        const c = Math.cos(angle);
        const s = Math.sin(angle);

        this.ex.x = c * m11 - s * m21;
        this.ex.y = s * m11 + c * m21;
        this.ey.x = c * m12 - s * m22;
        this.ey.y = s * m12 + c * m22;

        return this;
    }

    /**
     * スケールする。
     *
     * @param scale スケール。
     */
    scale(scale: Vec2Like): this {
        const m11 = this.ex.x;
        const m21 = this.ex.y;
        const m12 = this.ey.x;
        const m22 = this.ey.y;

        const sx = scale.x;
        const sy = scale.y;

        this.ex.x = sx * m11;
        this.ex.y = sy * m21;
        this.ey.x = sx * m12;
        this.ey.y = sy * m22;

        return this;
    }

    /**
     * ベクトルを乗算する。
     *
     * 結果は新しいベクトルに格納される。
     *
     * @param v ベクトル。
     */
    mulVec2(v: Vec2Like): Vec2;

    /**
     * ベクトルを乗算する。
     *
     * @param v ベクトル。
     * @param out 結果を格納するベクトル。
     */
    mulVec2<T extends Vec2Like>(v: Vec2Like, out: T): T;

    mulVec2<T extends Vec2Like>(v: Vec2Like, out?: T): Vec2 | T {
        const x = this.ex.x * v.x + this.ey.x * v.y;
        const y = this.ex.y * v.x + this.ey.y * v.y;

        if (out) {
            out.x = x;
            out.y = y;
            return out;
        } else {
            return new Vec2(x, y);
        }
    }
}
