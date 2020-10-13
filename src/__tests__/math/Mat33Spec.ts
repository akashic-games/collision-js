import { Mat33, Vec2, Vec3 } from "../../math";

describe("Mat33", () => {
    it("constructs with 3 vectors", () => {
        const m = new Mat33({ x: 1, y: 2, z: 3}, { x: 4, y: 5, z: 6 }, { x: 7, y: 8, z: 9 });
        expect(m.ex.equal({ x: 1, y: 2, z: 3 })).toBeTruthy();
        expect(m.ey.equal({ x: 4, y: 5, z: 6 })).toBeTruthy();
        expect(m.ez.equal({ x: 7, y: 8, z: 9 })).toBeTruthy();
    });

    it("constructs with only one vector considering the others are corresponding axis vectors", () => {
        const m = new Mat33({ x: 1, y: 2, z: 3 });
        expect(m.ex.equal({ x: 1, y: 2, z: 3 })).toBeTruthy();
        expect(m.ey.equal({ x: 0, y: 1, z: 0})).toBeTruthy();
        expect(m.ez.equal({ x: 0, y: 0, z: 1})).toBeTruthy();
    });

    it("constructs identity matrix if no arguments are given", () => {
        const m = new Mat33();
        expect(m.ex.equal({ x: 1, y: 0, z: 0 })).toBeTruthy();
        expect(m.ey.equal({ x: 0, y: 1, z: 0 })).toBeTruthy();
        expect(m.ez.equal({ x: 0, y: 0, z: 1 })).toBeTruthy();
    });

    it("clones", () => {
        const m = new Mat33(
            { x: 1, y: 2, z: 3 },
            { x: 4, y: 5, z: 6 },
            { x: 7, y: 8, z: 9 }
        );
        const n = m.clone();
        expect(m.equal(n)).toBeTruthy();
    });

    it("equals", () => {
        const m = new Mat33({ x: 1, y: 2, z: 3}, { x: 4, y: 5, z: 6 }, { x: 7, y: 8, z: 9 });
        const n = new Mat33({ x: 1, y: 2, z: 3}, { x: 4, y: 5, z: 6 }, { x: 7, y: 8, z: 9 });
        expect(m.equal(n)).toBeTruthy();
    });

    it("muls", () => {
        const m = new Mat33(
            { x: 1, y: 2, z: 3 },
            { x: 4, y: 5, z: 6 },
            { x: 7, y: 8, z: 9 }
        );
        const n = new Mat33(
            { x: 11, y: 12, z: 13 },
            { x: 14, y: 15, z: 16 },
            { x: 17, y: 18, z: 19 }
        );
        const o = new Mat33(
            {
                x: 1 * 11 + 4 * 12 + 7 * 13,
                y: 2 * 11 + 5 * 12 + 8 * 13,
                z: 3 * 11 + 6 * 12 + 9 * 13
            },
            {
                x: 1 * 14 + 4 * 15 + 7 * 16,
                y: 2 * 14 + 5 * 15 + 8 * 16,
                z: 3 * 14 + 6 * 15 + 9 * 16
            },
            {
                x: 1 * 17 + 4 * 18 + 7 * 19,
                y: 2 * 17 + 5 * 18 + 8 * 19,
                z: 3 * 17 + 6 * 18 + 9 * 19
            }
        );
        expect(m.mul(n).equal(o)).toBeTruthy();
    });

    it("muls by vec2", () => {
        const m = new Mat33(
            { x: 1, y: 2, z: 3 },
            { x: 4, y: 5, z: 6 },
            { x: 7, y: 8, z: 9 }
        );
        const v = new Vec2(10, 11);
        const w = new Vec3(
            1 * 10 + 4 * 11 + 7 * 1,
            2 * 10 + 5 * 11 + 8 * 1,
            3 * 10 + 6 * 11 + 9 * 1
        );
        expect(m.mulVec2(v).equal(w)).toBeTruthy();
    });

    it("muls by vec2 and stores resut in given vector", () => {
        const m = new Mat33(
            { x: 1, y: 2, z: 3 },
            { x: 4, y: 5, z: 6 },
            { x: 7, y: 8, z: 9 }
        );
        const v = new Vec2(10, 11);
        const w = new Vec2(
            1 * 10 + 4 * 11 + 7 * 1,
            2 * 10 + 5 * 11 + 8 * 1
        );
        const r = new Vec2();
        expect(m.mulVec2(v, r).equal(w)).toBeTruthy();
    });

    it("muls by vec2 and stores resut in given vector-like", () => {
        const m = new Mat33(
            { x: 1, y: 2, z: 3 },
            { x: 4, y: 5, z: 6 },
            { x: 7, y: 8, z: 9 }
        );
        const v = new Vec2(10, 11);
        const w = new Vec2(
            1 * 10 + 4 * 11 + 7 * 1,
            2 * 10 + 5 * 11 + 8 * 1
        );
        const r = { x: 0, y: 0 };
        expect(w.equal(m.mulVec2(v, r))).toBeTruthy();
    });

    it("muls by vec3", () => {
        const m = new Mat33(
            { x: 1, y: 2, z: 3 },
            { x: 4, y: 5, z: 6 },
            { x: 7, y: 8, z: 9 }
        );
        const v = new Vec3(10, 11, 12);
        const w = new Vec3(
            1 * 10 + 4 * 11 + 7 * 12,
            2 * 10 + 5 * 11 + 8 * 12,
            3 * 10 + 6 * 11 + 9 * 12
        );
        expect(m.mulVec3(v).equal(w)).toBeTruthy();
    });

    it("muls by vec3 and stores resut in given vector", () => {
        const m = new Mat33(
            { x: 1, y: 2, z: 3 },
            { x: 4, y: 5, z: 6 },
            { x: 7, y: 8, z: 9 }
        );
        const v = new Vec3(10, 11, 12);
        const w = new Vec3(
            1 * 10 + 4 * 11 + 7 * 12,
            2 * 10 + 5 * 11 + 8 * 12,
            3 * 10 + 6 * 11 + 9 * 12
        );
        const r = new Vec3();
        expect(m.mulVec3(v, r).equal(w)).toBeTruthy();
    });

    it("muls by vec3 and stores resut in given vector-like", () => {
        const m = new Mat33(
            { x: 1, y: 2, z: 3 },
            { x: 4, y: 5, z: 6 },
            { x: 7, y: 8, z: 9 }
        );
        const v = new Vec3(10, 11, 12);
        const w = new Vec3(
            1 * 10 + 4 * 11 + 7 * 12,
            2 * 10 + 5 * 11 + 8 * 12,
            3 * 10 + 6 * 11 + 9 * 12
        );
        const r = { x: 0, y: 0, z: 0 };
        expect(w.equal(m.mulVec3(v, r))).toBeTruthy();
    });

    it("gives determinant", () => {
        const m = new Mat33(
            { x: 1, y: 5, z: 8 },
            { x: 3, y: 4, z: 9 },
            { x: 2, y: 6, z: 7}
        );
        const det = m.determinant();
        expect(det).toEqual(39);
    });

    it("transposes", () => {
        const m = new Mat33(
            { x: 1, y: 5, z: 8 },
            { x: 3, y: 4, z: 9 },
            { x: 2, y: 6, z: 7}
        );
        m.transpose();
        expect(m.ex.x).toEqual(1);
        expect(m.ex.y).toEqual(3);
        expect(m.ex.z).toEqual(2);
        expect(m.ey.x).toEqual(5);
        expect(m.ey.y).toEqual(4);
        expect(m.ey.z).toEqual(6);
        expect(m.ez.x).toEqual(8);
        expect(m.ez.y).toEqual(9);
        expect(m.ez.z).toEqual(7);
    });

    it("inverses", () => {
        const m = new Mat33(
            { x: 1, y: -2, z: -1 },
            { x: 1, y: -1, z: -2 },
            { x: -1 , y: 1, z: 1 }
        );
        const n = m.clone();
        m.inverse();
        expect(m.ex.x).toEqual(-1);
        expect(m.ex.y).toEqual(-1);
        expect(m.ex.z).toEqual(-3);
        expect(m.ey.x).toEqual(-1);
        expect(m.ey.y === 0).toBeTruthy(); // to test -0 === 0
        expect(m.ey.z).toEqual(-1);
        expect(m.ez.x === 0).toBeTruthy();
        expect(m.ez.y).toEqual(-1);
        expect(m.ez.z).toEqual(-1);

        m.mul(n);
        expect(m.ex.x).toBeCloseTo(1, 10);
        expect(m.ex.y).toBeCloseTo(0, 10);
        expect(m.ex.z).toBeCloseTo(0, 10);
        expect(m.ey.x).toBeCloseTo(0, 10);
        expect(m.ey.y).toBeCloseTo(1, 10);
        expect(m.ey.z).toBeCloseTo(0, 10);
        expect(m.ez.x).toBeCloseTo(0, 10);
        expect(m.ez.y).toBeCloseTo(0, 10);
        expect(m.ez.z).toBeCloseTo(1, 10);
    });

    it("sets identity itself", () => {
        const m = new Mat33(
            { x: 1, y: -2, z: -1 },
            { x: 1, y: -1, z: -2 },
            { x: -1 , y: 1, z: 1 }
        );
        m.setIdentity();
        expect(m.ex.x).toEqual(1);
        expect(m.ex.y).toEqual(0);
        expect(m.ex.z).toEqual(0);
        expect(m.ey.x).toEqual(0);
        expect(m.ey.y).toEqual(1);
        expect(m.ey.z).toEqual(0);
        expect(m.ez.x).toEqual(0);
        expect(m.ez.y).toEqual(0);
        expect(m.ez.z).toEqual(1);
    });

    it("rotates around Z axis", () => {
        const angle = Math.PI / 4;
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const ex = { x: 2, y: 3, z: 1 };
        const ey = { x: 1, y: 4, z: 2 };
        const ez = { x: 4, y: 5, z: 6 };
        const m = new Mat33(ex, ey, ez);
        m.rotateZ(angle);
        expect(m.ex.x).toEqual(c * ex.x - s * ex.y);
        expect(m.ex.y).toEqual(s * ex.x + c * ex.y);
        expect(m.ex.z).toEqual(1);
        expect(m.ey.x).toEqual(c * ey.x - s * ey.y);
        expect(m.ey.y).toEqual(s * ey.x + c * ey.y);
        expect(m.ey.z).toEqual(2);
        expect(m.ez.x).toEqual(4);
        expect(m.ez.y).toEqual(5);
        expect(m.ez.z).toEqual(6);
    });

    it("scales", () => {
        const scale = { x: 2, y: 3, z: 4 };
        const ex = { x: 2, y: 3, z: 1 };
        const ey = { x: 1, y: 4, z: 2 };
        const ez = { x: 4, y: 5, z: 6 };
        const m = new Mat33(ex, ey, ez);
        m.scale(scale);
        expect(m.ex.x).toEqual(scale.x * 2);
        expect(m.ex.y).toEqual(scale.y * 3);
        expect(m.ex.z).toEqual(scale.z * 1);
        expect(m.ey.x).toEqual(scale.x * 1);
        expect(m.ey.y).toEqual(scale.y * 4);
        expect(m.ey.z).toEqual(scale.z * 2);
        expect(m.ez.x).toEqual(scale.x * 4);
        expect(m.ez.y).toEqual(scale.y * 5);
        expect(m.ez.z).toEqual(scale.z * 6);
    });

    it("makes scale matrix", () => {
        const s = { x: 2, y: 3, z: 4 };
        const m = Mat33.makeScale(s);
        expect(m.ex.equal({ x: s.x, y: 0, z: 0 }));
        expect(m.ey.equal({ x: 0, y: s.y, z: 0 }));
        expect(m.ez.equal({ x: 0, y: 0, z: s.z }));
    });
});
