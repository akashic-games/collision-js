import { Vec2, Vec2Like, clamp, overlap } from "../math";
import { AABB } from "./AABB";
import { Box } from "./Box";
import { Circle } from "./Circle";
import { Line } from "./Line";
import { Segment } from "./Segment";
import { Contact } from "./Contact";
import { Polygon } from "./Polygon";
import { gjkTest, supportPolygon } from "./gjk";

/**
 * 平行判定。
 *
 * ２つのベクトルが平行である時、真。
 *
 * Vec2 の parallel は閾値を扱う都合上、正規化されたベクトルのみ
 * サポートする。この関数は閾値を扱えないが、正規化されていないベクトルを
 * 扱える。
 *
 * @param v1 ベクトル。
 * @param v2 ベクトル。
 */
function parallel(v1: Vec2Like, v2: Vec2Like): boolean {
    return v1.x * v2.y - v1.y * v2.x === 0;
}

/**
 * 点が直線によって分けられた２つの半空間のいずれに位置するか調べる。
 *
 * 点が直線上にある時、０。そうでない時、位置する半空間に応じて正または負の値を返す。
 *
 * @param line 直線。
 * @param p 点の位置。
 */
export function whichSide(line: Line, p: Vec2Like): number {
    const x = new Vec2(p).sub(line.position);
    const n = new Vec2(-line.direction.y, line.direction.x);
    return n.dot(x);
}

/**
 * 矩形の辺を得る。
 *
 * 各辺の番号は0から始まり、下辺から時計回りに配される。a~d はそれぞれ頂点である。
 *
 * 図はX軸が右を、Y軸が下を向いている。
 *
 * ```
 *       2
 *    c-----d
 *    |     |
 *  1 |     | 3
 *    |     |
 *    b-----a
 *       0
 * ```
 *
 *  各辺の (始点, 終点) は次のようになる。
 *
 *  - 辺番号0: (a, b)
 *  - 辺番号1: (b, c)
 *  - 辺番号2: (c, d)
 *  - 辺番号3: (d, a)
 *
 * 辺番号が不正な時 null を返す。
 *
 * @param box 矩形。
 * @param idx 辺の番号。 [0, 3] 。
 */
export function getBoxEdge(box: Box, idx: number): Segment | null {
    if (idx < 0 || idx > 3) {
        return null;
    }

    const v1 = new Vec2(box.halfExtend);
    const v2 = new Vec2(box.halfExtend);

    if (idx === 0) {
        v2.x *= -1;
    } else if (idx === 1) {
        v1.x *= -1;
        v2.negate();
    } else if (idx === 2) {
        v1.negate();
        v2.y *= -1;
    } else {
        v1.y *= -1;
    }
    v1.rotate(box.angle).add(box.position);
    v2.rotate(box.angle).add(box.position);

    return {
        position: v1,
        endPosition: v2
    };
}

/**
 * 矩形の頂点の座標を得る。
 *
 * 図はX軸が右を、Y軸が下を向いている。a~bは頂点を表す。
 *
 * ```
 * c-----d
 * |     |
 * |     |
 * |     |
 * b-----a
 * ```
 *
 * - 頂点番号0: a
 * - 頂点番号1: b
 * - 頂点番号2: c
 * - 頂点番号3: d
 *
 * 頂点番号が不正な時 null を返す。
 *
 * @param b 矩形。
 * @param idx 頂点の番号 [0, 3] 。
 */
export function getBoxCorner(b: Box, idx: number): Vec2Like | null {
    if (idx < 0 || idx > 3) {
        return null;
    }

    const corner = new Vec2(b.halfExtend);

    if (idx === 1) {
        corner.x *= -1;
    } else if (idx === 2) {
        corner.negate();
    } else if (idx === 3) {
        corner.y *= -1;
    }

    return corner.rotate(b.angle).add(b.position);
}

/**
 * AABBの頂点の座標を得る。
 *
 * 図はX軸が右を、Y軸が下を向いている。a~bは頂点を表す。
 *
 * ```
 * c-----d
 * |     |
 * |     |
 * |     |
 * b-----a
 * ```
 *
 * - 頂点番号0: a
 * - 頂点番号1: b
 * - 頂点番号2: c
 * - 頂点番号3: d
 *
 * 頂点番号が不正な時 null を返す。
 *
 * @param aabb AABB 。
 * @param idx 頂点の番号 [0, 3] 。
 */
export function getAABBCorner(aabb: AABB, idx: number): Vec2Like | null {
    let corner: Vec2Like | null = null;

    if (idx === 0) {
        corner = {
            x: aabb.max.x,
            y: aabb.max.y
        };
    } else if (idx === 1) {
        corner = {
            x: aabb.min.x,
            y: aabb.max.y
        };
    } else if (idx === 2) {
        corner = {
            x: aabb.min.x,
            y: aabb.min.y
        };
    } else if (idx === 3) {
        corner = {
            x: aabb.max.x,
            y: aabb.min.y
        };
    }

    return corner;
}

/**
 * 線分と線分に重なる直線に投影した矩形の交差判定。
 *
 * @param box 矩形。
 * @param segment 線分。
 */
export function overlapBoxAndSegment(box: Box, segment: Segment): boolean {
    const edge0 = getBoxEdge(box, 0)!;
    const edge2 = getBoxEdge(box, 2)!;
    const dir = new Vec2(segment.endPosition).sub(segment.position).normalize();

    const ts1 = dir.dot(segment.position);
    const ts2 = dir.dot(segment.endPosition);
    const te01 = dir.dot(edge0.position);
    const te02 = dir.dot(edge0.endPosition);
    const te21 = dir.dot(edge2.position);
    const te22 = dir.dot(edge2.endPosition);

    const tsMin = Math.min(ts1, ts2);
    const tsMax = Math.max(ts1, ts2);
    const teMin = Math.min(te01, te02, te21, te22);
    const teMax = Math.max(te01, te02, te21, te22);

    return overlap(tsMin, tsMax, teMin, teMax);
}

/**
 * 線分と線分に重なる直線に投影したAABBの交差判定。
 *
 * @param aabb AABB 。
 * @param segment 線分。
 */
export function overlapAABBAndSegment(aabb: AABB, segment: Segment): boolean {
    const edge0: Segment = {
        position: getAABBCorner(aabb, 0)!,
        endPosition: getAABBCorner(aabb, 1)!
    }
    const edge2: Segment = {
        position: getAABBCorner(aabb, 2)!,
        endPosition: getAABBCorner(aabb, 3)!
    }
    const dir = new Vec2(segment.endPosition).sub(segment.position).normalize();

    const ts1 = dir.dot(segment.position);
    const ts2 = dir.dot(segment.endPosition);
    const te01 = dir.dot(edge0.position);
    const te02 = dir.dot(edge0.endPosition);
    const te21 = dir.dot(edge2.position);
    const te22 = dir.dot(edge2.endPosition);

    const tsMin = Math.min(ts1, ts2);
    const tsMax = Math.max(ts1, ts2);
    const teMin = Math.min(te01, te02, te21, te22);
    const teMax = Math.max(te01, te02, te21, te22);

    return overlap(tsMin, tsMax, teMin, teMax);
}

/**
 * AABB が 点 p を含むように拡張する。
 *
 * @param aabb AABB 。
 * @param p 点の位置。
 */
export function enlargeAABB(aabb: AABB, p: Vec2Like): void {
    aabb.min.x = Math.min(aabb.min.x, p.x);
    aabb.max.x = Math.max(aabb.max.x, p.x);
    aabb.min.y = Math.min(aabb.min.y, p.y);
    aabb.max.y = Math.max(aabb.max.y, p.y);
}

/**
 * 矩形に外接する AABB 生成する。
 *
 * @param b 矩形。
 */
export function createAABBFromBox(b: Box): AABB {
    const aabb: AABB = {
        min: { x: Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY },
        max: { x: Number.NEGATIVE_INFINITY, y: Number.NEGATIVE_INFINITY }
    };

    for (let i = 0; i < 4; i++) {
        const p = getBoxCorner(b, i)!;
        enlargeAABB(aabb, p);
    }

    return aabb;
}

/**
 * AABB と AABB の交差テスト。
 *
 * @param a AABB A.
 * @param b AABB B.
 */
export function aabbToAABB(a: AABB, b: AABB): boolean {
    return overlap(a.min.x, a.max.x, b.min.x, b.max.x) &&
        overlap(a.min.y, a.max.y, b.min.y, b.max.y);
}

/**
 * 円と円の交差テスト。
 *
 * @param a 円A。
 * @param b 円B。
 */
export function circleToCircle(a: Circle, b: Circle): boolean {
    const d = new Vec2(b.position).sub(a.position);
    const d2 = d.squaredLength();
    const r = b.radius + a.radius;
    const r2 = r * r;
    return d2 <= r2;
}

/**
 * 円と円の交差テスト。
 *
 * 交差しない時 null を返す。
 *
 * @param a 円A。
 * @param b 円B。
 */
export function circleToCircleContact(a: Circle, b: Circle): Contact | null {
    const d = new Vec2(b.position).sub(a.position);
    const d2 = d.squaredLength();
    const r = a.radius + b.radius;
    const r2 = r * r;

    if (d2 <= r2) {
        const separation = Math.sqrt(d2) - r;
        const normal = d.normalize();
        const point = d.clone().scale(a.radius + separation).add(a.position)
        return {
            point,
            separation,
            normal
        };
    } else {
        return null;
    }
}

/**
 * 点と点の交差テスト。
 *
 * @param a 点の位置。
 * @param b 点の位置。
 */
export function vecToVec(a: Vec2Like, b: Vec2Like): boolean {
    return a.x === b.x && a.y === b.y;
}

/**
 * 直線と直線の交差テスト。
 *
 * @param a 直線A。
 * @param b 直線B。
 */
export function lineToLine(a: Line, b: Line): boolean {
    if (parallel(a.direction, b.direction)) {
        const d = new Vec2(a.position).sub(b.position);
        return parallel(d, b.direction);
    } else {
        return true;
    }
}

/**
 * 線分と線分の交差テスト。
 *
 * @param a 線分A。
 * @param b 線分B。
 */
export function segmentToSegment(a: Segment, b: Segment): boolean {
    const dirA = new Vec2(a.endPosition).sub(a.position);
    const axisA: Line = {
        position: a.position,
        direction: dirA
    };

    if (whichSide(axisA, b.position) * whichSide(axisA, b.endPosition) > 0) {
        return false;
    }

    const dirB = new Vec2(b.endPosition).sub(b.position);
    const axisB: Line = {
        position: b.position,
        direction: dirB
    };

    if (whichSide(axisB, a.position) * whichSide(axisB, a.endPosition) > 0) {
        return false;
    }

    if (parallel(axisA.direction, axisB.direction)) {
        dirA.normalize();

        const tA1 = dirA.dot(a.position);
        const tA2 = dirA.dot(a.endPosition);
        const tB1 = dirA.dot(b.position);
        const tB2 = dirA.dot(b.endPosition);

        let tAmin: number;
        let tAmax: number;
        let tBmin: number;
        let tBmax: number;

        if (tA1 < tA2) {
            tAmin = tA1; tAmax = tA2;
        } else {
            tAmin = tA2; tAmax = tA1;
        }

        if (tB1 < tB2) {
            tBmin = tB1; tBmax = tB2;
        } else {
            tBmin = tB2; tBmax = tB1;
        }

        return overlap(tAmin, tAmax, tBmin, tBmax);
    } else {
        return true;
    }
}

/**
 * 矩形と矩形の交差判定。
 *
 * @param a 矩形。
 * @param b 矩形。
 */
export function boxToBox(a: Box, b: Box): boolean {
    if (!overlapBoxAndSegment(a, getBoxEdge(b, 0)!)) {
        return false;
    }

    if (!overlapBoxAndSegment(a, getBoxEdge(b, 3)!)) {
        return false;
    }

    if (!overlapBoxAndSegment(b, getBoxEdge(a, 0)!)) {
        return false;
    }

    if (!overlapBoxAndSegment(b, getBoxEdge(a, 3)!)) {
        return false;
    }

    return true;
}

/**
 * 円と点の交差テスト。
 *
 * @param c 円。
 * @param v 点の位置。
 */
export function circleToVec(c: Circle, v: Vec2Like): boolean {
    const dx = v.x - c.position.x;
    const dy = v.y - c.position.y;
    return dx * dx + dy * dy <= c.radius * c.radius;
}

/**
 * 円と直線の交差テスト。
 *
 * @param c 円。
 * @param l 直線。
 */
export function circleToLine(c: Circle, l: Line): boolean {
    const lc = new Vec2(c.position).sub(l.position);
    const nearest = lc.project(l.direction).add(l.position);
    return circleToVec(c, nearest);
}

/**
 * 円と線分の交差判定。
 *
 * @param c 円。
 * @param s 線分。
 */
export function circleToSegment(c: Circle, s: Segment): boolean {
    if (circleToVec(c, s.position)) {
        return true;
    }
    if (circleToVec(c, s.endPosition)) {
        return true;
    }
    const dir = new Vec2(s.endPosition).sub(s.position);
    const projected = new Vec2(c.position).sub(s.position).project(dir);
    const nearest = projected.clone().add(s.position);

    return circleToVec(c, nearest) &&
        projected.squaredLength() <= dir.squaredLength() &&
        projected.dot(dir) >= 0;
}

/**
 * 円と AABB の交差判定。
 *
 * @param c 円。
 * @param aabb AABB。
 */
export function circleToAABB(c: Circle, aabb: AABB): boolean {
    const x = clamp(c.position.x, aabb.min.x, aabb.max.x);
    const y = clamp(c.position.y, aabb.min.y, aabb.max.y);
    return circleToVec(c, { x, y });
}

/**
 * 円と矩形の交差判定。
 *
 * @param c 円。
 * @param b 矩形。
 */
export function circleToBox(c: Circle, b: Box): boolean {
    const localPos = new Vec2(c.position).sub(b.position).rotate(-b.angle);
    const min = new Vec2(b.halfExtend).scale(-1);
    const max = new Vec2(b.halfExtend);
    return circleToAABB({ position: localPos, radius: c.radius }, { min, max });
}

/**
 * AABBと点の交差判定。
 *
 * @param aabb AABB 。
 * @param v 点の位置。
 */
export function aabbToVec(aabb: AABB, v: Vec2Like): boolean {
    return aabb.min.x <= v.x && v.x <= aabb.max.x &&
           aabb.min.y <= v.y && v.y <= aabb.max.y;
}

/**
 * AABBと直線の交差判定。
 *
 * @param aabb AABB 。
 * @param l 直線。
 */
export function aabbToLine(aabb: AABB, l: Line): boolean {
    const n = new Vec2(l.direction).rotate270();
    const d = -n.dot(l.position);

    const d1 = n.dot(aabb.min) + d;
    const d2 = n.dot(aabb.max) + d;
    const d3 = n.dot({ x: aabb.max.x, y: aabb.min.y }) + d;
    const d4 = n.dot({ x: aabb.min.x, y: aabb.max.y }) + d;

    return d1 * d2 <= 0 || d1 * d3 <= 0 || d1 * d4 <= 0;
}

/**
 * AABBと線分の交差判定。
 *
 * @param aabb AABB 。
 * @param s 線分。
 */
export function aabbToSegment(aabb: AABB, s: Segment): boolean {
    const l: Line = {
        position: s.position,
        direction: new Vec2(s.endPosition).sub(s.position)
    };
    if (!aabbToLine(aabb, l)) {
        return false;
    }

    const xRange = [s.position.x, s.endPosition.x].sort((a, b) => a - b);
    if (!overlap(aabb.min.x, aabb.max.x, xRange[0], xRange[1])) {
        return false;
    }

    const yRange = [s.position.y, s.endPosition.y].sort((a, b) => a - b);
    if (!overlap(aabb.min.y, aabb.max.y, yRange[0], yRange[1])) {
        return false;
    }

    return true;
}

/**
 * AABB と矩形の交差判定。
 *
 * @param aabb AABB 。
 * @param b 矩形。
 */
export function aabbToBox(aabb: AABB, b: Box): boolean {
    const bAABB = createAABBFromBox(b);

    if (!aabbToAABB(aabb, bAABB)) {
        return false;
    }

    if (!overlapAABBAndSegment(aabb, getBoxEdge(b, 0)!)) {
        return false;
    }

    return overlapAABBAndSegment(aabb, getBoxEdge(b, 3)!);
}

/**
 * 点と直線の交差判定。
 *
 * @param v 点の位置。
 * @param l 直線。
 */
export function vecToLine(v: Vec2Like, l: Line): boolean {
    const n = new Vec2(l.direction).rotate270();
    const d = -n.dot(l.position);

    return n.dot(v) + d === 0;
}

/**
 * 点と線分の交差判定。
 *
 * @param v 点の位置。
 * @param s 線分。
 */
export function vecToSegment(v: Vec2Like, s: Segment): boolean {
    const dir = new Vec2(s.endPosition).sub(s.position);
    const n = dir.clone().rotate270();
    const d = -n.dot(s.position);

    if (n.dot(v) + d !== 0) {
        return false;
    }

    const vl = new Vec2(v).sub(s.position);

    return vl.squaredLength() < dir.squaredLength() && vl.dot(dir) >= 0;
}

/**
 * 点と矩形の交差判定。
 *
 * @param v 点の位置。
 * @param b 矩形。
 */
export function vecToBox(v: Vec2Like, b: Box): boolean {
    const lv = new Vec2(v).sub(b.position).rotate(-b.angle);

    return -b.halfExtend.x <= lv.x && lv.x <= b.halfExtend.x &&
           -b.halfExtend.y <= lv.y && lv.y <= b.halfExtend.y;
}

/**
 * 直線と線分の交差判定。
 *
 * @param l 直線。
 * @param s 線分。
 */
export function lineToSegment(l: Line, s: Segment): boolean {
    return whichSide(l, s.position) * whichSide(l, s.endPosition) < 0;
}

/**
 * 直線と矩形の交差判定。
 *
 * @param l 直線。
 * @param b 矩形。
 */
export function lineToBox(l: Line, b: Box): boolean {
    const aabb: AABB = {
        min: new Vec2(b.halfExtend).negate(),
        max: new Vec2(b.halfExtend)
    };
    const ll: Line = {
        position: new Vec2(l.position).sub(b.position).rotate(-b.angle),
        direction: new Vec2(l.direction).rotate(-b.angle)
    };
    return aabbToLine(aabb, ll);
}

/**
 * 線分と矩形の交差判定。
 *
 * @param s 線分。
 * @param b 矩形。
 */
export function segmentToBox(s: Segment, b: Box): boolean {
    const aabb: AABB = {
        min: new Vec2(b.halfExtend).negate(),
        max: new Vec2(b.halfExtend)
    };
    const sl: Segment = {
        position: new Vec2(s.position).sub(b.position).rotate(-b.angle),
        endPosition: new Vec2(s.endPosition).sub(b.position).rotate(-b.angle)
    }
    return aabbToSegment(aabb, sl);
}

/**
 * 多角形と多角形の交差判定。
 *
 * @param s1 多角形1。
 * @param b 多角形2。
 */
 export function polygonToPolygon(p1: Polygon, p2: Polygon): boolean {
    return gjkTest(p1, supportPolygon, p2, supportPolygon);
}
