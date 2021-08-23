import { supportPolygon } from "../../collision/gjk";

describe("supportPolygon", () => {
    it("returns the vertex furthest in the given direction", () => {
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

