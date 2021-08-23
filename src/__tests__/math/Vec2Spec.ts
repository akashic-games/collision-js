import { Vec2 } from "../../math";

describe("Vec2", () => {

    it("constructs with x and y value", () => {
        const v = new Vec2(1, 2);
        expect(v.x).toEqual(1);
        expect(v.y).toEqual(2);
    });

    it("constructs with Vector2Like", () => {
        const v = new Vec2({ x: 1, y: 2 });
        expect(v.x).toEqual(1);
        expect(v.y).toEqual(2);
    });

    it("constructs zero vector without arguments", () => {
        const v = new Vec2();
        expect(v.x).toEqual(0);
        expect(v.y).toEqual(0);
    });

    it("clones", () => {
        const v = new Vec2(1, 2);
        const w = v.clone();
        expect(v.x).toEqual(w.x);
        expect(v.y).toEqual(w.y);
    });

    it("copies", () => {
        const v = new Vec2(0, 0);
        expect(v.copy({ x: 1, y: 2 }).equal({ x: 1, y: 2 })).toBeTruthy();
    });

    it("compares", () => {
        const v = new Vec2(1, 2);
        expect(v.equal({ x: 1, y: 2 })).toBeTruthy();
    });

    it("finds out if this vector is parallel to a vector", () => {
        expect(
            new Vec2(1, 1).normalize().parallel(new Vec2(3, 3).normalize())
        ).toBeTruthy();
        expect(
            new Vec2(1, 1).normalize().parallel(new Vec2(-3, -3).normalize())
        ).toBeTruthy();
        expect(
            new Vec2(1, 1).normalize().parallel(new Vec2(1, -1).normalize())
        ).toBeFalsy();

    })

    it("finds out if this vector is almost parallel to a vector", () => {
        expect(new Vec2(1, 1).normalize().parallel(
            new Vec2(3.01, 2.99).normalize(),
            Math.cos(Math.PI * 0.01)
        )).toBeTruthy();
        expect(new Vec2(1, 1).normalize().parallel(
            new Vec2(3.01, 2.99).normalize(),
            Math.cos(Math.PI * 0.001)
        )).toBeFalsy();
    });

    it("adds", () => {
        const v = new Vec2(1, 2);
        v.add({ x: 1, y: 2 });
        expect(v.x).toEqual(2);
        expect(v.y).toEqual(4);
    });

    it("subs", () => {
        const v = new Vec2(2, 4);
        v.sub({ x: 1, y: 2 });
        expect(v.x).toEqual(1);
        expect(v.y).toEqual(2);
    });

    it("scales", () => {
        const v = new Vec2(1, 2);
        v.scale(2);
        expect(v.x).toEqual(2);
        expect(v.y).toEqual(4);
    });

    it("muls", () => {
        const v = new Vec2(1, 2);
        v.mul({ x: 3, y: -4 });
        expect(v.x).toEqual(3);
        expect(v.y).toEqual(-8);
    });

    it("dots", () => {
        const v = new Vec2(1, 2);
        expect(v.dot({ x: 2, y: 4 })).toEqual(10);
    });

    it("crosses", () => {
        expect(new Vec2(1, 0).dot({ x: 0, y: 1 })).toEqual(0);
    });

    it("projects", () => {
        expect(new Vec2(1, 4).project({ x: 1, y: 0 }).equal({ x: 1, y: 0 })).toBeTruthy();
    });

    it("rejects", () => {
        expect(new Vec2(1, 4).reject({ x: 1, y: 0 }).equal({ x: 0, y: 4 })).toBeTruthy();
    });

    it("reflects", () => {
        expect(new Vec2(1, -1).reflect({ x: 0, y: 1 }).equal({ x: 1, y: 1 })).toBeTruthy();
    });

    it("calculates squared length", () => {
        const v = new Vec2(1, 2);
        expect(v.squaredLength()).toEqual(5);
    });

    it("calculates length", () => {
        const v = new Vec2(3, 4);
        expect(v.length()).toEqual(5);
    });

    it("normalizes", () => {
        const v = new Vec2(3, 4);
        v.normalize();
        expect(v.x).toEqual(3 / 5);
        expect(v.y).toEqual(4 / 5);
    });

    it("negates", () => {
        const v = new Vec2(3, -4);
        v.negate();
        expect(v.x).toEqual(-3);
        expect(v.y).toEqual(4);
    });

    it("rounds", () => {
        const v = new Vec2(2.4, -4.7);
        v.round();
        expect(v.x).toEqual(2);
        expect(v.y).toEqual(-5);
    });

    it("floors", () => {
        const v = new Vec2(2.4, -4.7);
        v.floor();
        expect(v.x).toEqual(2);
        expect(v.y).toEqual(-5);
    });

    it("ceils", () => {
        const v = new Vec2(2.4, -4.7);
        v.ceil();
        expect(v.x).toEqual(3);
        expect(v.y).toEqual(-4);
    });

    it("signs", () => {
        const v = new Vec2(2.4, -0);
        v.sign();
        expect(v.x).toEqual(1);
        expect(v.y).toEqual(-0);
    });

    it("rotates", () => {
        const v = new Vec2(1, 2);
        v.rotate(Math.PI / 2);
        expect(v.x).toBeCloseTo(-2, 5);
        expect(v.y).toBeCloseTo(1, 5);
    });

    it("rotates 90 degree", () => {
        const v = new Vec2(1, 2);
        v.rotate90();
        expect(v.x).toEqual(2);
        expect(v.y).toEqual(-1)
    });

    it("rotates 270 degree", () => {
        const v = new Vec2(1, 2);
        v.rotate270();
        expect(v.x).toEqual(-2);
        expect(v.y).toEqual(1)
    });

    it("copies between 2 Vec2Like", () => {
        expect(Vec2.equal(Vec2.copy({ x: 0, y: 0 }, { x: 1, y: 2 }), { x: 1, y: 2 }) ).toBeTruthy();
    });

    it("compares 2 Vec2Like", () => {
        expect(Vec2.equal({ x: 1, y: 2 }, { x: 1, y: 2 })).toBeTruthy();
        expect(Vec2.equal({ x: 1, y: 2 }, { x: 3, y: 4 })).toBeFalsy();
    });

    it("adds 2 Vec2Like", () => {
        expect(Vec2.equal(Vec2.add({ x: 1, y: 2 }, { x: 3, y: 4 }), { x: 4, y: 6 })).toBeTruthy();
    });

    it("subs 2 Vec2Like", () => {
        expect(Vec2.equal(Vec2.sub({ x: 1, y: 2 }, { x: 3, y: 4 }), { x: -2, y: -2 })).toBeTruthy();
    });

    it("dots 2 Vec2Like", () => {
        expect(Vec2.dot({ x: 1, y: 0 }, { x: 0, y: 1 })).toEqual(0);
    });

    it("crosses 2 Vec2Like", () => {
        expect(Vec2.cross({ x: 1, y: 0 }, { x: 0, y: 1 })).toEqual(1);
    });

    it("finds out if 2 vectors are parallel", () => {
        expect(Vec2.parallel(
            new Vec2(1, 1).normalize(),
            new Vec2(3, 3).normalize()
        )).toBeTruthy();
        expect(Vec2.parallel(
            new Vec2(1, 1).normalize(),
            new Vec2(-3, -3).normalize()
        )).toBeTruthy();
        expect(Vec2.parallel(
            new Vec2(1, 1).normalize(),
            new Vec2(1, -1).normalize()
        )).toBeFalsy();
    });

    it("finds out if 2 vectors are almost parallel", () => {
        expect(Vec2.parallel(
            new Vec2(1, 1).normalize(),
            new Vec2(3.01, 2.99).normalize(),
            Math.cos(Math.PI * 0.01)
        )).toBeTruthy();
        expect(Vec2.parallel(
            new Vec2(1, 1).normalize(),
            new Vec2(3.01, 2.99).normalize(),
            Math.cos(Math.PI * 0.001)
        )).toBeFalsy();
    });
});
