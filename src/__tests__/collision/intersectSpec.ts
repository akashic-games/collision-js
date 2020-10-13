import * as collision from "../../collision";

describe("whichSide", () => {
    it("finds out on which side given point is", () => {
        expect(collision.whichSide(
            { position: { x: 1, y: 1 }, direction: { x: 2, y: 1 } },
            { x: 2, y: 2 }
        )).toBeGreaterThan(0);
        expect(collision.whichSide(
            { position: { x: 1, y: 1 }, direction: { x: 2, y: 1 } },
            { x: 2, y: 1 }
        )).toBeLessThan(0);
        expect(collision.whichSide(
            { position: { x: 1, y: 1 }, direction: { x: 2, y: 2 } },
            { x: 1, y: 1 }
        )).toEqual(0);
    });
});

describe("AABBToAABB", () => {
    it("detects collision between AABB and AABB ", () => {
        expect(collision.aabbToAABB(
            { min: { x: 1, y: 1 }, max: { x: 3, y: 2 } },
            { min: { x: 2, y: 1.5 }, max: { x: 4, y: 3 } }
        )).toBeTruthy();
        expect(collision.aabbToAABB(
            { min: { x: 1, y: 1 }, max: { x: 3, y: 2 } },
            { min: { x: 4, y: 2 }, max: { x: 5, y: 5 } }
        )).toBeFalsy();
    });
});

describe("circleToCircle", () => {
    it("detects collision between circle and circle", () => {
        expect(collision.circleToCircle(
            { position: { x: 1, y: 2 }, radius: 1 },
            { position: { x: 2, y: 3 }, radius: 1 }
        )).toBeTruthy();
        expect(collision.circleToCircle(
            { position: { x: 1, y: 2 }, radius: 1 },
            { position: { x: 3, y: 4 }, radius: 1 }
        )).toBeFalsy();
    });
});

describe("circleToCircleContact", () => {
    it("detects collision between circle and circle", () => {
        const r1 = 1;
        const r2 = 1;
        const c1x = { x: 1, y: 2 };
        const c2x = { x: 2, y: 3 };
        const contact = collision.circleToCircleContact(
            { position: c1x, radius: r1 },
            { position: c2x, radius: r2 }
        );
        const rSum = r1 + r2;
        const dx = c2x.x - c1x.x;
        const dy = c2x.y - c1x.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const nx = dx / d;
        const ny = dy / d;
        const separation = d - rSum;

        expect(contact!.normal.x).toEqual(nx);
        expect(contact!.normal.y).toEqual(ny);
        expect(contact!.separation).toEqual(separation);
        expect(contact!.point.x).toEqual(nx * (r1 + separation) + c1x.x);
        expect(contact!.point.y).toEqual(ny * (r1 + separation) + c1x.y);

        expect(collision.circleToCircleContact(
            { position: { x: 1, y: 2 }, radius: 1 },
            { position: { x: 3, y: 4 }, radius: 1 }
        )).toBeNull();
    });
});

describe("vecToVec", () => {
    it("detects collision between vec and vec", () => {
        expect(collision.vecToVec(
            { x: 1, y: 2 }, { x: 1, y: 2 }
        )).toBeTruthy();
        expect(collision.vecToVec(
            { x: 1, y: 2 }, { x: 1, y: 3 }
        )).toBeFalsy();
    });
});

describe("lineToLine", () => {
    it("detects collision between line and line", () => {
        expect(collision.lineToLine(
            { position: { x: 1, y: 2 }, direction: { x: 1, y: 1 }},
            { position: { x: 2, y: 1 }, direction: { x: 1, y: -1 }}
        )).toBeTruthy();
        expect(collision.lineToLine(
            { position: { x: 1, y: 1 }, direction: { x: 1, y: 1 }},
            { position: { x: 2, y: 2 }, direction: { x: 1, y: 1 }}
        )).toBeTruthy();
        expect(collision.lineToLine(
            { position: { x: 1, y: 2 }, direction: { x: 1, y: 1 }},
            { position: { x: 2, y: 1 }, direction: { x: 1, y: 1 }}
        )).toBeFalsy();
    });
});

describe("segmentToSegment", () => {
    it("detects collision between segment and segment", () => {
        expect(collision.segmentToSegment(
            { position: { x: 1, y: 1 }, endPosition: { x: 3, y: 2 }},
            { position: { x: 2, y: 2 }, endPosition: { x: 4, y: 1 }}
        )).toBeTruthy();
        expect(collision.segmentToSegment(
            { position: { x: 1, y: 1 }, endPosition: { x: 3, y: 2 }},
            { position: { x: 2, y: 4 }, endPosition: { x: 3, y: 3 }}
        )).toBeFalsy();
        expect(collision.segmentToSegment(
            { position: { x: 1, y: 1 }, endPosition: { x: 3, y: 2 }},
            { position: { x: 3, y: 3 }, endPosition: { x: 4, y: 2 }}
        )).toBeFalsy();
        expect(collision.segmentToSegment(
            { position: { x: 1, y: 1 }, endPosition: { x: 5, y: 3 }},
            { position: { x: 3, y: 2 }, endPosition: { x: 7, y: 4 }}
        )).toBeTruthy();
        expect(collision.segmentToSegment(
            { position: { x: 1, y: 1 }, endPosition: { x: 5, y: 3 }},
            { position: { x: 5, y: 3 }, endPosition: { x: 7, y: 4 }}
        )).toBeTruthy();
        expect(collision.segmentToSegment(
            { position: { x: 1, y: 1 }, endPosition: { x: 3, y: 2 }},
            { position: { x: 5, y: 3 }, endPosition: { x: 7, y: 4 }}
        )).toBeFalsy();
    });
});

describe("boxToBox", () => {
    it("detects collision between box and box", () => {
        const boxA: collision.Box = {
            position: { x: 2, y: 1 }, halfExtend: { x: 1, y: 1 }, angle: Math.PI / 4
        };
        const boxB: collision.Box = {
            position: { x: 5, y: 1 }, halfExtend: { x: 1, y: 2 }, angle: Math.PI / 2
        };
        const boxC: collision.Box = {
            position: { x: 4, y: 3 }, halfExtend: { x: 1, y: 1 }, angle: 0
        };
        expect(collision.boxToBox(boxA, boxB)).toBeTruthy();
        expect(collision.boxToBox(boxA, boxC)).toBeFalsy();
    });
});

describe("circleToVec", () => {
    it("detects collision between circle and vec", () => {
        expect(collision.circleToVec(
            { position: { x: 1, y: 1 }, radius: 1 },
            { x: 1.1, y: 1.2 }
        )).toBeTruthy();
        expect(collision.circleToVec(
            { position: { x: 1, y: 1 }, radius: 1 },
            { x: 2, y: 2 }
        )).toBeFalsy();
    });
});

describe("circleToLine", () => {
    it("detects collision between circle and line", () => {
        expect(collision.circleToLine(
            { position: { x: 1, y: 1 }, radius: 1 },
            { position: { x: 0, y: 2 }, direction: { x: 2, y: -1 }}
        )).toBeTruthy();
        expect(collision.circleToLine(
            { position: { x: 1, y: 1 }, radius: 1 },
            { position: { x: 0, y: 3 }, direction: { x: 2, y: -1 }}
        )).toBeFalsy();
    });
});

describe("circleToSegment", () => {
    it("detects collision between circle and segment", () => {
        expect(collision.circleToSegment(
            { position: { x: 1, y: 1 }, radius: 1 },
            { position: { x: 0, y: 2 }, endPosition: { x: 2, y: 1 }}
        )).toBeTruthy();
        expect(collision.circleToSegment(
            { position: { x: 1, y: 1 }, radius: 1 },
            { position: { x: -1, y: 3 }, endPosition: { x: 0, y: 2 }}
        )).toBeFalsy();
    });
});

describe("circleToAABB", () => {
    it("detects collision between circle and AABB", () => {
        expect(collision.circleToAABB(
            { position: { x: 4, y: 3 }, radius: 1.5 },
            { min: { x: 1, y: 1 }, max: { x: 3, y: 2 }}
        )).toBeTruthy();
        expect(collision.circleToAABB(
            { position: { x: 4, y: 3 }, radius: 1 },
            { min: { x: 1, y: 1 }, max: { x: 3, y: 2 }}
        )).toBeFalsy();
    });
});

describe("circleToBox", () => {
    it("detects collision between circle and box", () => {
        expect(collision.circleToBox(
            { position: { x: 1, y: 2.5 }, radius: 1 },
            { position: { x: 4, y: 1 }, halfExtend: { x: 1, y: 3 }, angle: Math.PI / 2 }
        )).toBeTruthy();
        expect(collision.circleToBox(
            { position: { x: 1, y: 1 }, radius: 1 },
            { position: { x: 4, y: 1 }, halfExtend: { x: 1, y: 3 }, angle: Math.PI / 4 }
        )).toBeFalsy();
    });
});

describe("aabbToVec", () => {
    it("detects collision between AABB and vec", () => {
        expect(collision.aabbToVec(
            { min: { x: 1, y: 1 }, max: { x: 4, y: 3 }},
            { x: 3, y: 2 }
        )).toBeTruthy();
        expect(collision.aabbToVec(
            { min: { x: 1, y: 1 }, max: { x: 4, y: 3 }},
            { x: 3, y: 4 }
        )).toBeFalsy();
    });
});

describe("aabbToLine", () => {
    it("detects collision between AABB and line", () => {
        expect(collision.aabbToLine(
            { min: { x: 1, y: 1 }, max: { x: 3, y: 2 } },
            { position: { x: 0, y: 4 }, direction: { x: 1, y: -1 }}
        )).toBeTruthy();
        expect(collision.aabbToLine(
            { min: { x: 1, y: 1 }, max: { x: 3, y: 2 } },
            { position: { x: 3, y: 4 }, direction: { x: 1, y: -1 }}
        )).toBeFalsy();
    });
});

describe("aabbToSegment", () => {
    it("detects collision between AABB and segment", () => {
        expect(collision.aabbToSegment(
            { min: { x: 1, y: 1 }, max: { x: 3, y: 1.5 } },
            { position: { x: 2, y: 2 }, endPosition: { x: 10, y: -6 } }
        )).toBeTruthy();
        expect(collision.aabbToSegment(
            { min: { x: 1, y: 1 }, max: { x: 3, y: 2 } },
            { position: { x: 0, y: 4 }, endPosition: { x: 1, y: 3 } }
        )).toBeFalsy();
    });
});

describe("aabbToBox", () => {
    it("detects collision between AABB and box", () => {
        expect(collision.aabbToBox(
            { min: { x: 1, y: 1 }, max: { x: 2, y: 2 } },
            { position: { x: 3, y: 1.5 }, halfExtend: { x: 0.5, y: 1.5 }, angle: Math.PI / 2 }
        )).toBeTruthy();
        expect(collision.aabbToBox(
            { min: { x: 1, y: 1 }, max: { x: 2, y: 2 } },
            { position: { x: 3, y: 1.5 }, halfExtend: { x: 0.5, y: 1.5 }, angle: 0 }
        )).toBeFalsy();
        expect(collision.aabbToBox(
            { min: { x: -2, y: -2 }, max: { x: 1, y: 1 } },
            { position: { x: -1, y: -2.5 }, halfExtend: { x: 0.5, y: 0.5 }, angle: Math.PI / 2 }
        )).toBeTruthy();
        expect(collision.aabbToBox(
            { min: { x: -2, y: -2 }, max: { x: 1, y: 1 } },
            { position: { x: -1, y: -3 }, halfExtend: { x: 0.5, y: 0.5 }, angle: Math.PI / 2 }
        )).toBeFalsy();
    });
});

describe("vecToLine", () => {
    it("detects collision between vec and line", () => {
        expect(collision.vecToLine(
            { x: 3, y: 2 },
            { position: { x: 1, y: 1 }, direction: { x: 2, y: 1 } }
        )).toBeTruthy();
        expect(collision.vecToLine(
            { x: 3, y: 3 },
            { position: { x: 1, y: 1 }, direction: { x: 2, y: 1 } }
        )).toBeFalsy();
    });
});

describe("vecToSegment", () => {
    it("detects collision between vec and segment", () => {
        expect(collision.vecToSegment(
            { x: 3, y: 2 },
            { position: { x: 1, y: 1 }, endPosition: { x: 5, y: 3 } }
        )).toBeTruthy();
        expect(collision.vecToSegment(
            { x: 5, y: 3 },
            { position: { x: 1, y: 1 }, endPosition: { x: 3, y: 2 } }
        )).toBeFalsy();
    });
});

describe("vecToBox", () => {
    it("detects collision between vec and box", () => {
        expect(collision.vecToBox(
            { x: 2, y: 3.1 },
            { position: { x: 2, y: 2 }, halfExtend: { x: 1, y: 1 }, angle: Math.PI / 4 }
        )).toBeTruthy();
        expect(collision.vecToBox(
            { x: 2, y: 3.5 },
            { position: { x: 2, y: 2 }, halfExtend: { x: 1, y: 1 }, angle: Math.PI / 4 }
        )).toBeFalsy();
    });
});

describe("lineToSegment", () => {
    it("detects collision between line and segment", () => {
        expect(collision.lineToSegment(
            { position: { x: 3, y: 3 }, direction: { x: 1, y: -1 } },
            { position: { x: 2, y: 2, }, endPosition: { x: 4, y: 4 } }
        )).toBeTruthy();
        expect(collision.lineToSegment(
            { position: { x: 1, y: 1 }, direction: { x: 1, y: -1 } },
            { position: { x: 2, y: 2, }, endPosition: { x: 4, y: 4 } }
        )).toBeFalsy();
    });
});

describe("lineToBox", () => {
    it("detects collision between line and box", () => {
        expect(collision.lineToBox(
            { position: { x: 0, y: 3 }, direction: { x: 1, y: 1 } },
            { position: { x: 1.5, y: 1.5 }, halfExtend: { x: 0.5, y: 3.5 }, angle: 0 }
        )).toBeTruthy();
        expect(collision.lineToBox(
            { position: { x: 0, y: 3 }, direction: { x: 1, y: 1 } },
            { position: { x: 1.5, y: 1.5 }, halfExtend: { x: 0.5, y: 3.5 }, angle: -Math.PI / 4 }
        )).toBeFalsy();
        expect(collision.lineToBox(
            { position: { x: 0, y: 3 }, direction: { x: 1, y: 1 } },
            { position: { x: 1.5, y: 1.5 }, halfExtend: { x: 0.5, y: 1.5 }, angle: 0 }
        )).toBeFalsy();
        expect(collision.lineToBox(
            { position: { x: 0, y: -2 }, direction: { x: 1, y: 4 } },
            { position: { x: 1.5, y: 1 }, halfExtend: { x: 0.5, y: 1 }, angle: Math.PI / 2 }
        )).toBeTruthy();

    });
});

describe("segmentToBox", () => {
    it("detects collision between segment and box", () => {
        expect(collision.segmentToBox(
            { position: { x: 0, y: 3 }, endPosition: { x: 2, y: 5 } },
            { position: { x: 1.5, y: 1.5 }, halfExtend: { x: 0.5, y: 3.5 }, angle: 0 }
        )).toBeTruthy();
        expect(collision.segmentToBox(
            { position: { x: 0, y: 3 }, endPosition: { x: 2, y: 5 } },
            { position: { x: 1.5, y: 1.5 }, halfExtend: { x: 0.5, y: 3.5 }, angle: -Math.PI / 4 }
        )).toBeFalsy();
        expect(collision.segmentToBox(
            { position: { x: 0, y: 3 }, endPosition: { x: 2, y: 5 } },
            { position: { x: 1.5, y: 1.5 }, halfExtend: { x: 0.5, y: 1.5 }, angle: 0 }
        )).toBeFalsy();
    });
});
