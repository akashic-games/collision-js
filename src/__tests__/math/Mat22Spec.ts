import { Mat22, Vec2 } from "../../math";

describe("Mat22", () => {
    it("constructs with 2 vectors", () => {
        const m = new Mat22({ x: 1, y: 2}, { x: 3, y: 4 });
        expect(m.ex.equal({ x: 1, y: 2 })).toBeTruthy();
        expect(m.ey.equal({ x: 3, y: 4 })).toBeTruthy();
    });

    it("constructs with only one vector considering second one is zero vector", () => {
        const m = new Mat22({ x: 1, y: 2 });
        expect(m.ex.equal({ x: 1, y: 2 })).toBeTruthy();
        expect(m.ey.equal({ x: 0, y: 1 })).toBeTruthy();
    });

    it("constructs identity matrix if no arguments are given", () => {
        const m = new Mat22();
        expect(m.ex.equal({ x: 1, y: 0 })).toBeTruthy();
        expect(m.ey.equal({ x: 0, y: 1 })).toBeTruthy();
    });

    it("clones", () => {
        const m = new Mat22({ x: 1, y: 2 }, { x: 3, y: 4 });
        const n = m.clone();
        expect(m.equal(n)).toBeTruthy();
    });

    it("equals", () => {
        const m = new Mat22({ x: 1, y: 2 }, { x: 3, y: 4 });
        const n = new Mat22({ x: 1, y: 2 }, { x: 3, y: 4 });
        expect(m.equal(n)).toBeTruthy();
    });

    it("muls", () => {
        const m = new Mat22({ x: 1, y: 2 }, { x: 3, y: 4 });
        const n = new Mat22({ x: 5, y: 6 }, { x: 7, y: 8 });
        const o = new Mat22(
            { x: 1 * 5 + 3 * 6, y: 2 * 5 + 4 * 6 },
            { x: 1 * 7 + 3 * 8, y: 2 * 7 + 4 * 8 }
        );
        expect(m.mul(n).equal(o)).toBeTruthy();
    });

    it("muls by vec2", () => {
        const m = new Mat22({ x: 1, y: 2 }, { x: 3, y: 4 });
        const v = new Vec2(5, 6);
        const w = new Vec2(1 * 5 + 3 * 6, 2 * 5 + 4 * 6);
        expect(m.mulVec2(v).equal(w)).toBeTruthy();
    });

    it("muls by vec2 and stores resut in given vector", () => {
        const m = new Mat22({ x: 1, y: 2 }, { x: 3, y: 4 });
        const v = new Vec2(5, 6);
        const w = new Vec2(1 * 5 + 3 * 6, 2 * 5 + 4 * 6);
        const r = new Vec2();
        expect(m.mulVec2(v, r).equal(w)).toBeTruthy();
    });

    it("muls by vec2 and stores resut in given vector-like", () => {
        const m = new Mat22({ x: 1, y: 2 }, { x: 3, y: 4 });
        const v = new Vec2(5, 6);
        const w = new Vec2(1 * 5 + 3 * 6, 2 * 5 + 4 * 6);
        const r = { x: 0, y: 0 };
        expect(w.equal(m.mulVec2(v, r))).toBeTruthy();
    });

    it("gives determinant", () => {
        const m = new Mat22({ x: 2, y: 3 }, { x: 1, y: 4 });
        const det = m.determinant();
        expect(det).toEqual(5);
    });

    it("transposes", () => {
        const m = new Mat22({ x: 2, y: 3 }, { x: 1, y: 4 });
        m.transpose();
        expect(m.ex.x).toEqual(2);
        expect(m.ex.y).toEqual(1);
        expect(m.ey.x).toEqual(3);
        expect(m.ey.y).toEqual(4);
    });

    it("inverses", () => {
        const m = new Mat22({ x: 2, y: 3 }, { x: 1, y: 4 });
        const n = m.clone();
        const det = m.determinant();
        m.inverse();
        expect(m.ex.x).toEqual(4 / det);
        expect(m.ex.y).toEqual(-3 / det);
        expect(m.ey.x).toEqual(-1 / det);
        expect(m.ey.y).toEqual(2 / det);

        m.mul(n);
        expect(m.ex.x).toBeCloseTo(1, 10);
        expect(m.ex.y).toBeCloseTo(0, 10);
        expect(m.ey.x).toBeCloseTo(0, 10);
        expect(m.ey.y).toBeCloseTo(1, 10);
    });

    it("sets identity itself", () => {
        const m = new Mat22({ x: 2, y: 3 }, { x: 1, y: 4 });
        m.setIdentity();
        expect(m.ex.x).toEqual(1);
        expect(m.ex.y).toEqual(0);
        expect(m.ey.x).toEqual(0);
        expect(m.ey.y).toEqual(1);
    });

    it("rotates", () => {
        const angle = Math.PI / 4;
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const ex = { x: 2, y: 3 };
        const ey = { x: 1, y: 4 };
        const m = new Mat22(ex, ey);
        m.rotate(angle);
        expect(m.ex.x).toEqual(c * ex.x - s * ex.y);
        expect(m.ex.y).toEqual(s * ex.x + c * ex.y);
        expect(m.ey.x).toEqual(c * ey.x - s * ey.y);
        expect(m.ey.y).toEqual(s * ey.x + c * ey.y);
    });

    it("scales", () => {
        const scale = { x: 2, y: 3 };
        const m = new Mat22({ x: 2, y: 3 }, { x: 1, y: 4 });
        m.scale(scale);
        expect(m.ex.x).toEqual(scale.x * 2);
        expect(m.ex.y).toEqual(scale.y * 3);
        expect(m.ey.x).toEqual(scale.x * 1);
        expect(m.ey.y).toEqual(scale.y * 4);
    });

    it("makes rotate matrix", () => {
        const angle = Math.PI / 6;
        const m = Mat22.makeRotate(angle);
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        expect(m.ex.equal({ x: c, y: s }));
        expect(m.ey.equal({ x: -s, y: c }));
    });

    it("makes scale matrix", () => {
        const s = { x: 2, y: 3 };
        const m = Mat22.makeScale(s);
        expect(m.ex.equal({ x: s.x, y: 0 }));
        expect(m.ey.equal({ x: 0, y: s.y }));
    });
});
