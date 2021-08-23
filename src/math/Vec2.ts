import { Vec2Like } from "./Vec2Like";

/**
 * 2次元ベクトル。
 */
export class Vec2 {
	/**
	 * 零ベクトル。
	 */
	static readonly zero = Object.freeze({ x: 0, y: 0 } as Vec2Like);

	/**
	 * x, y 要素をコピーする。
	 *
	 * @param v1 コピー先ベクトル。
	 * @param v2 コピー元ベクトル。
	 */
	static copy(v1: Vec2Like, v2: Vec2Like): Vec2Like {
		v1.x = v2.x;
		v1.y = v2.y;
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
	static equal(v1: Vec2Like, v2: Vec2Like): boolean {
		return v1.x === v2.x && v1.y === v2.y;
	}

	/**
	 * 二つのベクトルを加算する。
	 *
	 * @param v1 ベクトル。結果はこのベクトルに格納される。
	 * @param v2 ベクトル。
	 */
	static add(v1: Vec2Like, v2: Vec2Like): Vec2Like {
		v1.x += v2.x;
		v1.y += v2.y;
		return v1;
	}

	/**
	 * 二つのベクトルを減算する。
	 *
	 * @param v1 ベクトル。結果はこのベクトルに格納される。
	 * @param v2 ベクトル。
	 */
	static sub(v1: Vec2Like, v2: Vec2Like): Vec2Like {
		v1.x -= v2.x;
		v1.y -= v2.y;
		return v1;
	}

	/**
	 * 内積を求める。
	 *
	 * @param v1 ベクトル。
	 * @param v2 ベクトル。
	 */
	static dot(v1: Vec2Like, v2: Vec2Like): number {
		return v1.x * v2.x + v1.y * v2.y;
	}

	/**
	 * 外積を求める。
	 *
	 * @param v1 ベクトル。
	 * @param v2 ベクトル。
	 */
	static cross(v1: Vec2Like, v2: Vec2Like): number {
		return v1.x * v2.y - v1.y * v2.x;
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
	static parallel(v1: Vec2Like, v2: Vec2Like, threshold: number = 1): boolean {
		return Math.abs(Vec2.dot(v1, v2)) >= threshold;
	}

	/** X要素。 */
	x: number;

	/** Y要素。 */
	y: number;

	/**
	 * コンストラクタ。
	 *
	 * @param x X要素初期値。
	 * @param y Y要素初期値。
	 */
	constructor(x: number, y: number);

	/**
	 * コンストラクタ。
	 *
	 * @param vec2Like 初期値。省略時、零ベクトル。
	 */
	constructor(vec2Like?: Vec2Like);

	constructor(xOrVec2Like?: number | Vec2Like, y: number = 0) {
		if (typeof xOrVec2Like === "number") {
			this.x = xOrVec2Like;
			this.y = y;
		} else {
			const v = xOrVec2Like || Vec2.zero;
			this.x = v.x;
			this.y = v.y;
		}
	}

	/**
	 * x, y 要素をこのベクトルにコピーする。
	 *
	 * @param v コピー元ベクトル。
	 */
	copy(v: Vec2Like): this {
		this.x = v.x;
		this.y = v.y;
		return this;
	}

	/**
	 * 複製する。
	 */
	clone(): Vec2 {
		return new Vec2(this);
	}

	/**
	 * 比較する。
	 *
	 * 等しい時、真。
	 *
	 * @param v ベクトル。
	 */
	equal(v: Vec2Like): boolean {
		return this.x === v.x && this.y === v.y;
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
	parallel(v: Vec2Like, threshold: number = 1): boolean {
		return Math.abs(this.dot(v)) >= threshold;
	}

	/**
	 * 加算する。
	 *
	 * @param v ベクトル。
	 */
	add(v: Vec2Like): this {
		this.x += v.x;
		this.y += v.y;
		return this;
	}

	/**
	 * 減算する。
	 *
	 * @param v ベクトル。
	 */
	sub(v: Vec2Like): this {
		this.x -= v.x;
		this.y -= v.y;
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
		return this;
	}

	/**
	 * アダマール積を求める。
	 *
	 * @param v ベクトル。
	 */
	mul(v: Vec2Like): this {
		this.x = this.x * v.x;
		this.y = this.y * v.y;
		return this;
	}

	/**
	 * 内積を求める。
	 *
	 * @param v ベクトル。
	 */
	dot(v: Vec2Like): number {
		return this.x * v.x + this.y * v.y;
	}

	/**
	 * 外積を求める。
	 *
	 * @param v ベクトル。
	 */
	cross(v: Vec2Like): number {
		return this.x * v.y - this.y * v.x;
	}

	/**
	 * 投影する。
	 *
	 * @param v 投影先のベクトル。
	 */
	project(v: Vec2Like): this {
		const d = v.x * v.x + v.y * v.y;

		if (d > 0) {
			const s = this.dot(v) / d;
			this.x = v.x * s;
			this.y = v.y * s;
		}

		return this;
	}

	/**
	 * 投影したベクトルから自身へ向かうベクトルにする。
	 *
	 * @param v 投影先のベクトル。
	 */
	reject(v: Vec2Like): this {
		this.sub(this.clone().project(v));
		return this;
	}

	/**
	 * 反射する。
	 *
	 * @param n 法線ベクトル。
	 */
	reflect(n: Vec2Like): this {
		const d2 = this.dot(n) * 2;
		this.sub({ x: n.x * d2, y: n.y * d2 });
		return this;
	}

	/**
	 * 長さの二乗を求める。
	 */
	squaredLength(): number {
		return this.x * this.x + this.y * this.y;
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

		return this;
	}

	/**
	 * 符号を反転する。
	 */
	negate(): this {
		this.x *= -1;
		this.y *= -1;
		return this;
	}

	/**
	 * 四捨五入する。
	 */
	round(): this {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		return this;
	}

	/**
	 * 小数点以下を切り捨てる。
	 */
	floor(): this {
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		return this;
	}

	/**
	 * 小数点以下を切り上げる。
	 */
	ceil(): this {
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		return this;
	}

	/**
	 * 角要素を符号を表す +/- 1, +/- 0 にする。
	 */
	sign(): this {
		this.x = Math.sign(this.x);
		this.y = Math.sign(this.y);
		return this;
	}

	/**
	 * 回転する。
	 *
	 * @param angle 回転の角度[radian]。
	 */
	rotate(angle: number): this {
		const c = Math.cos(angle);
		const s = Math.sin(angle);
		const x = c * this.x - s * this.y;
		const y = s * this.x + c * this.y;

		this.x = x;
		this.y = y;

		return this;
	}

	/**
	 * 90度回転する。
	 */
	rotate90(): this {
		const x = this.x;
		const y = this.y;
		this.x = y;
		this.y = -x;
		return this;
	}

	/**
	 * 270度回転する。
	 */
	rotate270(): this {
		const x = this.x;
		const y = this.y;
		this.x = -y;
		this.y = x;
		return this;
	}
}
