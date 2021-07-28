import { Vec2, Vec2Like } from "../math";
import { Polygon } from "./Polygon";
import { Segment } from "./Segment";
import { Circle } from "./Circle";
import { Box } from "./Box";

function getFurthestVertex(vertices: Vec2Like[], dir: Vec2Like): Vec2Like {
    let furthest = Number.NEGATIVE_INFINITY;
    let furthestVertex: Vec2Like = { x: 0, y: 0 };

    for (let i = 0; i < vertices.length; i++) {
        const v = vertices[i];
        const distance = Vec2.dot(v, dir);
        if (distance > furthest) {
            furthest = distance;
            furthestVertex = v;
        }
    }

    return furthestVertex;
}

/**
 * ポリゴンのサポート関数。
 *
 * 頂点が無いポリゴンの時、原点を返す。
 *
 * @param p ポリゴン。
 * @param dir 方向ベクトル。
 * @returns dirの方向にある最も遠い頂点。
 */
export function supportPolygon(p: Polygon, dir: Vec2Like): Vec2Like {
    return getFurthestVertex(p.vertices, dir);
}

/**
 * 線分のサポート関数。
 *
 * @param s: 線分。
 * @param dir 方向ベクトル。
 * @returns dirの方向にある最も遠い頂点。
 */
export function supportSegment(s: Segment, dir: Vec2Like): Vec2Like {
    return getFurthestVertex([s.position, s.endPosition], dir);
}

/**
 * 円のサポート関数。
 *
 * @param s: 線分。
 * @param dir 方向ベクトル。
 * @returns dirの方向にある最も遠い頂点。
 */
export function supportCircle(c: Circle, _dir: Vec2Like): Vec2Like {
    const dir = new Vec2(_dir).normalize();
    return getFurthestVertex([
        new Vec2(dir).scale(c.radius).add(c.position),
        new Vec2(dir).scale(-c.radius).add(c.position),
    ], dir);
}

/**
 * 点のサポート関数。
 *
 * @param v: 点の位置。
 * @param dir 方向ベクトル。
 * @returns dirの方向にある最も遠い頂点。
 */
export function supportVec(v: GJKShape, dir: Vec2Like): Vec2Like {
    return v.position;
}

/**
 * 矩形のサポート関数。
 *
 * @param b 矩形。
 * @param dir 方向ベクトル。
 * @returns dirの方向にある最も遠い頂点。
 */
export function supportBox(b: Box, dir: Vec2Like): Vec2Like {
    const hx = b.halfExtend.x;
    const hy = b.halfExtend.y;
    const vertices = [
        { x:  hx, y:  hy },
        { x: -hx, y:  hy },
        { x: -hx, y: -hy },
        { x:  hx, y: -hy }
    ];

    const furthestVertex = getFurthestVertex(vertices, new Vec2(dir).rotate(-b.angle));

    return new Vec2(furthestVertex).rotate(b.angle).add(b.position);
}

/**
 * ベクトル三重積。
 * 一般的な A x (B x C) でなく A x B x C であることに注意。
 *
 * @param a ベクトル。
 * @param b ベクトル。
 * @param c ベクトル。
 * @returns
 */
function tripleProduct(a: Vec2Like, b: Vec2Like, c: Vec2Like): Vec2Like {
    const z = Vec2.cross(a, b);
    return {
        x: -z * c.y,
        y: z * c.x
    };
}

/**
 * サポートのミンコフスキー差を求め結果を頂点配列に加える。
 *
 * @param s1 シェイプ１。
 * @param sup1 シェイプ２。
 * @param s2 シェイプ２のサポート関数。
 * @param sup2 シェイプ２のサポート関数。
 * @param direction サポートを求める時の方向。
 * @param vertices 頂点配列。
 * @returns サポートの向きが direction と同じ時、真。
 */
function addSupport<S1 extends GJKShape, S2 extends GJKShape>(s1: S1, sup1: SupportFn<S1>, s2: S2, sup2: SupportFn<S2>, direction: Vec2Like, vertices: Vec2Like[]): boolean {
    const support = new Vec2(sup1(s1, direction))
        .sub(sup2(s2, new Vec2(direction).negate()));

    vertices.push(support);

    return Vec2.dot(direction, support) > 0;
}

/**
 * 展開状態。
 */
type EvolveState = "found" | "evolving" | "no-intersection" | "error";

/**
 * シンプレックスを展開する。
 *
 * @param s1 シェイプ１。
 * @param sup1 シェイプ１のサポート関数。
 * @param s2 シェイプ２。
 * @param sup2 シェイプ２のサポート関数。
 * @param vertices 頂点配列。
 * @returns 展開状態。
 */
function evolveSimplex<S1 extends GJKShape, S2 extends GJKShape>(s1: S1, sup1: SupportFn<S1>, s2: S2, sup2: SupportFn<S2>, vertices: Vec2Like[]): EvolveState {
    let direction: Vec2Like;

    if (vertices.length === 0) {
        direction = new Vec2(s2.position).sub(s1.position);
    } else if (vertices.length === 1) {
        direction = new Vec2(s1.position).sub(s2.position);
    } else if (vertices.length === 2) {
        const b = vertices[1];
        const c = vertices[0];
        const cb = new Vec2(b).sub(c);
        const c0 = new Vec2(c).negate();

        direction = tripleProduct(cb, c0, cb);
    } else if (vertices.length === 3) {
        const a = vertices[2];
        const b = vertices[1];
        const c = vertices[0];

        const a0 = new Vec2(a).negate();
        const ab = new Vec2(b).sub(a);
        const ac = new Vec2(c).sub(a);

        const abPerp = new Vec2(tripleProduct(ac, ab, ab));
        const acPerp = new Vec2(tripleProduct(ab, ac, ac));

        if (abPerp.dot(a0) > 0) {
            // remove vertex c .
            vertices.splice(0, 1);
            direction = abPerp;
        } else if (acPerp.dot(a0) > 0) {
            // remove vertex b .
            vertices.splice(1, 1);
            direction = acPerp;
        } else {
            return "found";
        }

        // console.log(`direction = ${direction.x}, ${direction.y}`);
    } else {
        return "error";
    }

    return addSupport(s1, sup1, s2, sup2, direction, vertices) ?
        "evolving" :
        "no-intersection";
}

/**
 * シェイプ型。
 */
export interface GJKShape {
    /**
     * 中心座標。
     */
    position: Vec2Like
};

/**
 * サポート関数型。
 */
export type SupportFn<S extends GJKShape> = (shape: S, direction: Vec2Like) => Vec2Like;

/**
 * GJKによる交差判定。
 *
 * @param s1
 * @param sup1
 * @param s2
 * @param sup2
 * @returns
 */
export function gjkTest<S1 extends GJKShape, S2 extends GJKShape>(
    s1: S1, sup1: SupportFn<S1>,
    s2: S2, sup2: SupportFn<S2>
): boolean {
    const vertices: Vec2Like[] = [];

    let result;
    do {
        result = evolveSimplex(s1, sup1, s2, sup2, vertices);
    } while (result === "evolving");

    return result === "found";
}
