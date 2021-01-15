import { Vec3Like } from "./Vec3Like";

/**
 * 3次元ベクトル。
 */
export class Vec3 {
	/**
	 * 零ベクトル。
	 */
	static readonly zero = Object.freeze({ x: 0, y: 0, z: 0 } as Vec3Like);

	/**
	 * x, y, z 要素をコピーする。
	 *
	 * @param v1 コピー先ベクトル。
	 * @param v2 コピー元ベクトル。
	 */
	static copy(v1: Vec3Like, v2: Vec3Like): Vec3Like {
		v1.x = v2.x;
		v1.y = v2.y;
		v1.z = v2.z;
		return v1;
	}

	/**
	 * 二つのベクトルを比較する。
	 *
	 * ベクトルが等しい時、真。
	 *
	 * @param v1 ベクトル。
	 * @param v2 ベクトル。
	 */
	static equal(v1: Vec3Like, v2: Vec3Like): boolean {
		return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
	}

	/**
	 * 二つのベクトルを加算する。
	 *
	 * @param v1 ベクトル。結果はこのベクトルに格納される。
	 * @param v2 ベクトル。
	 */
	static add(v1: Vec3Like, v2: Vec3Like): Vec3Like {
		v1.x += v2.x;
		v1.y += v2.y;
		v1.z += v2.z;
		return v1;
	}

	/**
	 * 二つのベクトルを減算する。
	 *
	 * @param v1 ベクトル。結果はこのベクトルに格納される。
	 * @param v2 ベクトル。
	 */
	static sub(v1: Vec3Like, v2: Vec3Like): Vec3Like {
		v1.x -= v2.x;
		v1.y -= v2.y;
		v1.z -= v2.z;
		return v1;
	}

	/**
	 * 内積を求める。
	 *
	 * @param v1 ベクトル。
	 * @param v2 ベクトル。
	 */
	static dot(v1: Vec3Like, v2: Vec3Like): number {
		return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
	}

	/**
	 * 外積を求める。
	 *
	 * @param v1 ベクトル。
	 * @param v2 ベクトル。
	 */
	static cross(v1: Vec3Like, v2: Vec3Like): Vec3Like {
		return {
			x: v1.y * v2.z - v1.z * v2.y,
			y: v1.z * v2.x - v1.x * v2.z,
			z: v1.x * v2.y - v1.y * v2.x
		};
	}

	/**
	 * 二つの単位ベクトルが平行か調べる。
	 *
	 * 二つのベクトルの内積が閾値以上の時、真（平行）。　
	 *
	 * @param v1 単位ベクトル。
	 * @param v2 単位ベクトル。
	 * @param threshold 閾値。省略時 1 。
	 */
	static parallel(v1: Vec3Like, v2: Vec3Like, threshold: number = 1): boolean {
		return Math.abs(Vec3.dot(v1, v2)) >= threshold;
	}

	/** X要素。 */
	x: number;

	/** Y要素。 */
	y: number;

	/** Z要素。 */
	z: number;

	/**
	 * コンストラクタ。
	 *
	 * @param x X要素初期値。
	 * @param y Y要素初期値。
	 * @param z Z要素初期値。
	 */
	constructor(x: number, y: number, z: number);

	/**
	 * コンストラクタ。
	 *
	 * @param vec3Like 初期値。省略時、零ベクトル。
	 */
	constructor(vec3Like?: Vec3Like);

	constructor(xOrVec3Like?: number | Vec3Like, y: number = 0, z: number = 0) {
		if (typeof xOrVec3Like === "number") {
			this.x = xOrVec3Like;
			this.y = y;
			this.z = z;
		} else {
			const v = xOrVec3Like || Vec3.zero;
			this.x = v.x;
			this.y = v.y;
			this.z = v.z;
		}
	}

	/**
	 * x, y, z 要素をこのベクトルにコピーする。
	 *
	 * @param v コピー元ベクトル。
	 */
	copy(v: Vec3Like): this {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		return this;
	}


	/**
	 * 複製する。
	 */
	clone(): Vec3 {
		return new Vec3(this.x, this.y, this.z);
	}

	/**
	 * 比較する。
	 *
	 * 等しい時、真。
	 *
	 * @param v ベクトル。
	 */
	equal(v: Vec3Like): boolean {
		return this.x === v.x && this.y === v.y && this.z === v.z;
	}

	/**
	 * このベクトルと単位ベクトルが平行か調べる。
	 *
	 * このベクトル自身が単位ベクトルでなければならない。
	 *
	 * 二つのベクトルの内積が閾値以上の時、真（平行）。　
	 *
	 * @param v 単位ベクトル。
	 * @param threshold 閾値。省略時 1 。
	 */
	parallel(v: Vec3Like, threshold: number = 1): boolean {
		return Math.abs(this.dot(v)) >= threshold;
	}

	/**
	 * 加算する。
	 *
	 * @param v ベクトル。
	 */
	add(v: Vec3Like): this {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		return this;
	}

	/**
	 * 減算する。
	 *
	 * @param v ベクトル。
	 */
	sub(v: Vec3Like): this {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		return this;
	}

	/**
	 * スケールする。
	 *
	 * @param v スケール。
	 */
	scale(v: number): this {
		this.x *= v;
		this.y *= v;
		this.z *= v;
		return this;
	}

	/**
	 * 内積を求める。
	 *
	 * @param v ベクトル。
	 */
	dot(v: Vec3Like): number {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	}

	/**
	 * 外積を求める。
	 *
	 * @param v ベクトル。
	 */
	cross(v: Vec3Like): Vec3 {
		return new Vec3(
			this.y * v.z - this.z * v.y,
			this.z * v.x - this.x * v.z,
			this.x * v.y - this.y * v.x
		);
	}

	/**
	 * 投影する。
	 *
	 * @param v 投影先のベクトル。
	 */
	project(v: Vec3Like): this {
		const d =
			v.x * v.x +
			v.y * v.y +
			v.z * v.z;

		if (d > 0) {
			const s = this.dot(v) / d;
			this.x = v.x * s;
			this.y = v.y * s;
			this.z = v.z * s;
		}

		return this;
	}

	/**
	 * 投影したベクトルから自身へ向かうベクトルにする。
	 *
	 * @param v 投影先のベクトル。
	 */
	reject(v: Vec3Like): this {
		this.sub(this.clone().project(v));
		return this;
	}

	/**
	 * 反射する。
	 *
	 * @param n 法線ベクトル。
	 */
	reflect(n: Vec3Like): this {
		const d2 = this.dot(n) * 2;
		this.sub({
			x: n.x * d2,
			y: n.y * d2,
			z: n.z * d2
		});
		return this;
	}

	/**
	 * 長さの二乗を求める。
	 */
	squaredLength(): number {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}

	/**
	 * 長さを求める。
	 */
	length(): number {
		return Math.sqrt(this.squaredLength());
	}

	/**
	 * 正規化する。
	 */
	normalize(): this {
		const len = this.length() || 1;
		this.x /= len;
		this.y /= len;
		this.z /= len;
		return this;
	}

	/**
	 * 符号を反転する。
	 */
	negate(): this {
		this.x *= -1;
		this.y *= -1;
		this.z *= -1;
		return this;
	}

	/**
	 * X軸回転する。
	 *
	 * @param angle 回転の角度[radian]。
	 */
	rotateX(angle: number): this {
		const c = Math.cos(angle);
		const s = Math.sin(angle);
		const y = c * this.y - s * this.z;
		const z = s * this.y + c * this.z;

		this.y = y;
		this.z = z;

		return this;
	}

	/**
	 * Y軸回転する。
	 *
	 * @param angle 回転の角度[radian]。
	 */
	rotateY(angle: number): this {
		const c = Math.cos(angle);
		const s = Math.sin(angle);
		const x = s * this.z + c * this.x;
		const z = c * this.z - s * this.x;

		this.x = x;
		this.z = z;

		return this;
	}

	/**
	 * Z軸回転する。
	 *
	 * @param angle 回転の角度[radian]。
	 */
	rotateZ(angle: number): this {
		const c = Math.cos(angle);
		const s = Math.sin(angle);
		const x = c * this.x - s * this.y;
		const y = s * this.x + c * this.y;

		this.x = x;
		this.y = y;

		return this;
	}
}
