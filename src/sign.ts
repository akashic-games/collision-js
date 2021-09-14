// see https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/sign#polyfill
export function sign(x: number): number {
    return (((x > 0) as unknown as number) - ((x < 0) as unknown as number)) || +x;
}
