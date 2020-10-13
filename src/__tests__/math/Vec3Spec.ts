import { Vec3 } from "../../math";

describe("Vec3", () => {

    it("constructs with x and y value", () => {
        const v = new Vec3(1, 2, 3);
        expect(v.x).toEqual(1);
        expect(v.y).toEqual(2);
        expect(v.z).toEqual(3);
    });

    it("constructs with Vector2Like", () => {
        const v = new Vec3({ x: 1, y: 2, z: 3});
        expect(v.x).toEqual(1);
        expect(v.y).toEqual(2);
        expect(v.z).toEqual(3);
    });

    it("constructs zero vector without arguments", () => {
        const v = new Vec3();
        expect(v.x).toEqual(0);
        expect(v.y).toEqual(0);
        expect(v.z).toEqual(0);
    });

    it("clones", () => {
        const v = new Vec3(1, 2, 3);
        const w = v.clone();
        expect(v.x).toEqual(w.x);
        expect(v.y).toEqual(w.y);
        expect(v.z).toEqual(w.z);
    });

    it("copies", () => {
        const v = new Vec3(0, 0, 0);
        expect(v.copy({ x: 1, y: 2, z: 3 }).equal({ x: 1, y: 2, z: 3 })).toBeTruthy();
    });

    it("equals", () => {
        const v = new Vec3(1, 2, 3);
        expect(v.equal({ x: 1, y: 2, z: 3 })).toBeTruthy();
    });

    it("finds out if this vector is parallel to a vector", () => {
        expect(new Vec3(1, 1, 1).normalize().parallel(
            new Vec3(3, 3, 3).normalize()
        )).toBeTruthy();
        expect(new Vec3(1, 1, 1).normalize().parallel(
            new Vec3(-3, -3, -3).normalize()
        )).toBeTruthy();
        expect(new Vec3(1, 1, 1).normalize().parallel(
            new Vec3(1, -1, 1).normalize()
        )).toBeFalsy();

    })

    it("finds out if this vector is almost parallel to a vector", () => {
        expect(new Vec3(1, 1, 1).normalize().parallel(
            new Vec3(3.01, 2.99, 3).normalize(),
            Math.cos(Math.PI * 0.001)
        )).toBeTruthy();
        expect(new Vec3(1, 1, 1).normalize().parallel(
            new Vec3(3.01, 2.99, 3).normalize(),
            Math.cos(Math.PI * 0.0001)
        )).toBeFalsy();
    });

    it("adds", () => {
        const v = new Vec3(1, 2, 3);
        v.add({ x: 1, y: 2, z: 3 });
        expect(v.x).toEqual(2);
        expect(v.y).toEqual(4);
        expect(v.z).toEqual(6);
    });

    it("subs", () => {
        const v = new Vec3(2, 4, 6);
        v.sub({ x: 1, y: 2, z: 3 });
        expect(v.x).toEqual(1);
        expect(v.y).toEqual(2);
        expect(v.z).toEqual(3);
    });

    it("scales", () => {
        const v = new Vec3(1, 2, 3);
        v.scale(2);
        expect(v.x).toEqual(2);
        expect(v.y).toEqual(4);
        expect(v.z).toEqual(6);
    });

    it("dots", () => {
        const v = new Vec3(1, 2, 3);
        expect(v.dot({ x: 2, y: 4, z: 6 })).toEqual(28);
    });

    it("crosses", () => {
        expect(new Vec3(1, 0, 1).dot({ x: 0, y: 1, z: 0 })).toEqual(0);
    });

    it("projects", () => {
        const projected = new Vec3(1, 1, 1).project(new Vec3(1, 1, 0).normalize());
        expect(projected.x).toEqual(1);
        expect(projected.y).toEqual(1);
        expect(projected.z).toEqual(0);
    });

    it("rejects", () => {
        const projected = new Vec3(1, 1, 1).reject(new Vec3(1, 1, 0).normalize());
        expect(projected.x).toEqual(0);
        expect(projected.y).toEqual(0);
        expect(projected.z).toBeCloseTo(1);
    });

    it("reflects", () => {
        const reflected = new Vec3(1, 0, 0).reflect(new Vec3(-1, 0, 1).normalize());
        expect(reflected.x).toBeCloseTo(0, 10)
        expect(reflected.y).toBeCloseTo(0, 10)
        expect(reflected.z).toBeCloseTo(1, 10)
    });

    it("calculates squared length", () => {
        const v = new Vec3(2, 4, 4);
        expect(v.squaredLength()).toEqual(36);
    });

    it("calculates length", () => {
        const v = new Vec3(2, 4, 4);
        expect(v.length()).toEqual(6);
    });

    it("normalizes", () => {
        const v = new Vec3(2, 4, 4);
        v.normalize();
        expect(v.x).toEqual(2 / 6);
        expect(v.y).toEqual(4 / 6);
        expect(v.z).toEqual(4 / 6);
    });

    it("negate", () => {
        const v = new Vec3(3, -4, 5);
        v.negate();
        expect(v.x).toEqual(-3);
        expect(v.y).toEqual(4);
        expect(v.z).toEqual(-5);
    });

    it("rotates about X asis", () => {
        const v = new Vec3(0, 1, 2);
        v.rotateX(Math.PI / 2);
        expect(v.x).toEqual(0);
        expect(v.y).toBeCloseTo(-2, 5);
        expect(v.z).toBeCloseTo(1, 5);
    });

    it("rotates about Y asis", () => {
        const v = new Vec3(2, 0, 1);
        v.rotateY(Math.PI / 2);
        expect(v.x).toBeCloseTo(1, 5);
        expect(v.y).toEqual(0);
        expect(v.z).toBeCloseTo(-2, 5);
    });

    it("rotates about Z asis", () => {
        const v = new Vec3(1, 2, 0);
        v.rotateZ(Math.PI / 2);
        expect(v.x).toBeCloseTo(-2, 5);
        expect(v.y).toBeCloseTo(1, 5);
        expect(v.z).toEqual(0);
    });

    it("copies between 2 Vec3Like", () => {
        expect(Vec3.equal(Vec3.copy({ x: 0, y: 0, z: 0 }, { x: 1, y: 2, z: 3 }), { x: 1, y: 2, z: 3 }) ).toBeTruthy();
    });

    it("compares 2 Vec3Likes", () => {
        expect(Vec3.equal({ x: 1, y: 2, z: 3 }, { x: 1, y: 2, z: 3 })).toBeTruthy();
        expect(Vec3.equal({ x: 1, y: 2, z: 3 }, { x: 4, y: 5, z: 6 })).toBeFalsy();
    });

    it("adds 2 Vec3Likes", () => {
        expect(Vec3.equal(Vec3.add({ x: 1, y: 2, z: 3 }, { x: 4, y: 5, z: 6 }), { x: 5, y: 7, z: 9 })).toBeTruthy();
    });

    it("subs 2 Vec3Likes", () => {
        expect(Vec3.equal(Vec3.sub({ x: 1, y: 2, z: 3 }, { x: 4, y: 5, z: 6 }), { x: -3, y: -3, z: -3 })).toBeTruthy();
    });

    it("dots 2 Vec3Likes", () => {
        expect(Vec3.dot({ x: 1, y: 0, z: 1 }, { x: 0, y: 1, z: 0 })).toEqual(0);
    });

    it("crosses 2 Vec3Likes", () => {
        const v = Vec3.cross({ x: 1, y: 2, z: 3 }, { x: 4, y: 5, z: 6 });
        expect(v.x).toEqual(2 * 6 - 3 * 5);
        expect(v.y).toEqual(3 * 4 - 1 * 6);
        expect(v.z).toEqual(1 * 5 - 2 * 4);
    });

    it("finds out if 2 normal vectors are parallel", () => {
        expect(Vec3.parallel(
            new Vec3(1, 1, 1).normalize(),
            new Vec3(3, 3, 3).normalize()
        )).toBeTruthy();
        expect(Vec3.parallel(
            new Vec3(1, 1, 1).normalize(),
            new Vec3(-3, -3, -3).normalize()
        )).toBeTruthy();
        expect(Vec3.parallel(
            new Vec3(1, 1, 1).normalize(),
            new Vec3(1, -1, 1).normalize()
        )).toBeFalsy();
    });

    it("finds out if 2 normal vectors are almost parallel", () => {
        expect(Vec3.parallel(
            new Vec3(1, 1, 1).normalize(),
            new Vec3(3.01, 2.99, 3).normalize(),
            Math.cos(Math.PI * 0.001)
        )).toBeTruthy();
        expect(Vec3.parallel(
            new Vec3(1, 1, 1).normalize(),
            new Vec3(3.01, 2.99, 3).normalize(),
            Math.cos(Math.PI * 0.0001)
        )).toBeFalsy();
    });
});
