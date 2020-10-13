import { clamp } from "../../math";

describe("clamp", () => {
    it("constrains a value to lie between two further values ", () => {
        expect(clamp(3, -5, 10)).toEqual(3);
        expect(clamp(-8, -5, 10)).toEqual(-5);
        expect(clamp(12, -5, 10)).toEqual(10);
    });
});
