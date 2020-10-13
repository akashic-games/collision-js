import { Vec2Like } from "./Vec2Like";
import { Vec3Like } from "./Vec3Like";
import { Vec2 } from "./Vec2";
import { Vec3 } from "./Vec3";

/**
 * 3x3行列。
 */
export class Mat33 {
    /**
     * 単位ベクトル。
     */
    static readonly identity = Object.freeze(new Mat33());

    /**
     * スケール行列を作成する。
     *
     * @param scale スケール行列。
     */
    static makeScale(scale: Vec3Like): Mat33 {
        return new Mat33(
            { x: scale.x, y: 0, z: 0 },
            { x: 0, y: scale.y, z: 0 },
            { x: 0, y: 0, z: scale.z }
        );
    }

    /** 第一列 */
    ex: Vec3;

    /** 第二列 */
    ey: Vec3;

    /** 第三列 */
    ez: Vec3;

    /**
     * コンストラクタ。
     *
     * @param ex 第一列。省略時 (1, 0, 0)。
     * @param ey 第二列。省略時 (0, 1, 0)。
     * @param ez 第三列。省略時 (0, 0, 1)。
     */
    constructor(ex?: Vec3Like, ey?: Vec3Like, ez?: Vec3Like) {
        this.ex = new Vec3(ex || { x: 1, y: 0, z: 0 });
        this.ey = new Vec3(ey || { x: 0, y: 1, z: 0 });
        this.ez = new Vec3(ez || { x: 0, y: 0, z: 1 });
    }

    /**
     * 複製する。
     */
    clone(): Mat33 {
        return new Mat33(this.ex, this.ey, this.ez);
    }

    /**
     * 比較する。
     *
     * 行列が等しい時、真。
     *
     * @param m 比較する行列。
     */
    equal(m: Mat33): boolean {
        return this.ex.equal(m.ex) && this.ey.equal(m.ey) && this.ez.equal(m.ez);
    }

    /**
     * 行列を乗算する。
     *
     * @param m 行列。
     */
    mul(m: Mat33): this {
        const m11 = this.ex.x * m.ex.x + this.ey.x * m.ex.y + this.ez.x * m.ex.z;
        const m21 = this.ex.y * m.ex.x + this.ey.y * m.ex.y + this.ez.y * m.ex.z;
        const m31 = this.ex.z * m.ex.x + this.ey.z * m.ex.y + this.ez.z * m.ex.z;
        const m12 = this.ex.x * m.ey.x + this.ey.x * m.ey.y + this.ez.x * m.ey.z;
        const m22 = this.ex.y * m.ey.x + this.ey.y * m.ey.y + this.ez.y * m.ey.z;
        const m32 = this.ex.z * m.ey.x + this.ey.z * m.ey.y + this.ez.z * m.ey.z;
        const m13 = this.ex.x * m.ez.x + this.ey.x * m.ez.y + this.ez.x * m.ez.z;
        const m23 = this.ex.y * m.ez.x + this.ey.y * m.ez.y + this.ez.y * m.ez.z;
        const m33 = this.ex.z * m.ez.x + this.ey.z * m.ez.y + this.ez.z * m.ez.z;

        this.ex.x = m11;
        this.ex.y = m21;
        this.ex.z = m31;
        this.ey.x = m12;
        this.ey.y = m22;
        this.ey.z = m32;
        this.ez.x = m13;
        this.ez.y = m23;
        this.ez.z = m33;

        return this;
    }

    /**
     * 行列式を求める。
     */
    determinant(): number {
        const m00 = this.ex.x;
        const m01 = this.ey.x;
        const m02 = this.ez.x;
        const m10 = this.ex.y;
        const m11 = this.ey.y;
        const m12 = this.ez.y;
        const m20 = this.ex.z;
        const m21 = this.ey.z;
        const m22 = this.ez.z;

        const det01 = m22 * m11 - m12 * m21
        const det11 = -m22 * m10 + m12 * m20
        const det21 = m21 * m10 - m11 * m20

        return m00 * det01 + m01 * det11 + m02 * det21
    }

    /**
     * 転置行列にする。
     */
    transpose(): this {
        const tmp1 = this.ey.x;
        const tmp2 = this.ez.x;
        const tmp3 = this.ez.y;
        this.ey.x = this.ex.y;
        this.ez.x = this.ex.z;
        this.ez.y = this.ey.z;
        this.ex.y = tmp1;
        this.ex.z = tmp2;
        this.ey.z = tmp3;
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

        const m00 = this.ex.x;
        const m01 = this.ey.x;
        const m02 = this.ez.x;
        const m10 = this.ex.y;
        const m11 = this.ey.y;
        const m12 = this.ez.y;
        const m20 = this.ex.z;
        const m21 = this.ey.z;
        const m22 = this.ez.z;

        this.ex.x = (m11 * m22 - m12 * m21) / det;
        this.ex.y = -(m10 * m22 - m12 * m20) / det;
        this.ex.z = (m10 * m21 - m11 * m20) / det;

        this.ey.x = -(m01 * m22 - m02 * m21) / det;
        this.ey.y = (m00 * m22 - m02 * m20) / det;
        this.ey.z = -(m00 * m21 - m01 * m20) / det;

        this.ez.x = (m01 * m12 - m02 * m11) / det;
        this.ez.y = -(m00 * m12 - m02 * m10) / det;
        this.ez.z = (m00 * m11 - m01 * m10) / det;

        return this;
    }

    /**
     * 単位行列にする。
     */
    setIdentity(): this {
        this.ex.x = 1;
        this.ex.y = 0;
        this.ex.z = 0;
        this.ey.x = 0;
        this.ey.y = 1;
        this.ey.z = 0;
        this.ez.x = 0;
        this.ez.y = 0;
        this.ez.z = 1;
        return this;
    }

    /**
     * Z軸回転する。
     *
     * @param angle 回転の角度[rad]。
     */
    rotateZ(angle: number): this {
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
    scale(scale: Vec3Like): this {
        const m11 = this.ex.x;
        const m21 = this.ex.y;
        const m31 = this.ex.z;
        const m12 = this.ey.x;
        const m22 = this.ey.y;
        const m32 = this.ey.z;
        const m13 = this.ez.x;
        const m23 = this.ez.y;
        const m33 = this.ez.z;

        const sx = scale.x;
        const sy = scale.y;
        const sz = scale.z;

        this.ex.x = sx * m11;
        this.ex.y = sy * m21;
        this.ex.z = sz * m31;
        this.ey.x = sx * m12;
        this.ey.y = sy * m22;
        this.ey.z = sz * m32;
        this.ez.x = sx * m13;
        this.ez.y = sy * m23;
        this.ez.z = sz * m33;

        return this;
    }

    /**
     * 平行移動する。
     *
     * @param t 平行移動量。
     */
    translate(t: Vec3Like): this {
        this.ez.x += t.x;
        this.ez.y += t.y;
        this.ez.z += t.z;
        return this;
    }

    /**
     * 平行移動量を設定する。
     *
     * @param t 平行移動量。
     */
    setTranslate(t: Vec3Like): this {
        this.ez.x = t.x;
        this.ez.y = t.y;
        this.ez.z = t.z;
        return this;
    }

    /**
     * ベクトルを乗算する。
     *
     * 結果は新しいベクトルに格納される。
     *
     * @param v ベクトル。 Z成分は０とみなされる。
     */
    mulVec2(v: Vec2Like): Vec2;

    /**
     * ベクトルを乗算する。
     *
     * @param v ベクトル。 Z成分は０とみなされる。
     * @param out 結果を格納するベクトル。
     */
    mulVec2<T extends Vec2Like>(v: Vec2Like, out: T): T;

    mulVec2<T extends Vec2Like>(v: Vec2Like, out?: T): Vec2 | T {
        const x = this.ex.x * v.x + this.ey.x * v.y + this.ez.x;
        const y = this.ex.y * v.x + this.ey.y * v.y + this.ez.y;

        if (out) {
            out.x = x;
            out.y = y;
            return out;
        } else {
            return new Vec2(x, y);
        }
    }

    /**
     * ベクトルを乗算する。
     *
     * 結果は新しいベクトルに格納される。
     *
     * @param v ベクトル。
     */
    mulVec3(v: Vec3Like): Vec3;

    /**
     * ベクトルを乗算する。
     *
     * @param v ベクトル。
     * @param out 結果を格納するベクトル。
     */
    mulVec3<T extends Vec3Like>(v: Vec3Like, out: T): T;

    mulVec3<T extends Vec3Like>(v: Vec3Like, out?: T): Vec3 | T {
        const x = this.ex.x * v.x + this.ey.x * v.y + this.ez.x * v.z;
        const y = this.ex.y * v.x + this.ey.y * v.y + this.ez.y * v.z;
        const z = this.ex.z * v.x + this.ey.z * v.y + this.ez.z * v.z;

        if (out) {
            out.x = x;
            out.y = y;
            out.z = z;
            return out;
        } else {
            return new Vec3(x, y, z);
        }
    }
}
