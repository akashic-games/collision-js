import * as collision from "../../collision";
import { supportPolygon } from "../../collision/gjk";

describe("supportPolygon", () => {
    it("returns furthest vertex in given direction", () => {
        const polygon = {
            position: { x: 1, y: 2 / 3 },
            vertices: [
                { x: 0, y: 0 },
                { x: 3, y: 0 },
                { x: 0, y: 2 }
            ]
        };
        const direction = {
            x: 2,
            y: 5
        };
        const furthest = supportPolygon(
            polygon,
            direction
        );
        expect(furthest.x).toEqual(0);
        expect(furthest.y).toEqual(2);
    });
});

describe("polygonToPolygon", () => {
    it("detects collision between polygon and polygon", () => {
        expect(collision.polygonToPolygon(
            {
                position: { x: 2, y: 2 },
                vertices: [
                    { x: 1, y: 1 },
                    { x: 3, y: 1 },
                    { x: 3, y: 3 },
                    { x: 1, y: 3 }
                ]
            },
            {
                position: { x: 1, y: 2 / 3 },
                vertices: [
                    { x: 0, y: 0 },
                    { x: 3, y: 0 },
                    { x: 0, y: 2 }
                ]
            }
        )).toBeTruthy();

        expect(collision.polygonToPolygon(
            {
                position: { x: 3, y: 3 },
                vertices: [
                    { x: 2, y: 2 },
                    { x: 4, y: 2 },
                    { x: 4, y: 4 },
                    { x: 2, y: 4 }
                ]
            },
            {
                position: { x: 1, y: 2 / 3 },
                vertices: [
                    { x: 0, y: 0 },
                    { x: 3, y: 0 },
                    { x: 0, y: 2 }
                ]
            }
        )).toBeFalsy();
    });
});
