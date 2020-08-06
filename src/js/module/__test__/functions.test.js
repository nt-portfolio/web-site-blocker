import { getLen, strOmit } from "../functions";

describe("functions test", () => {
  test("getLen", () => {
    expect(getLen("Tyrannosaurus.rex")).toBe(17);
    expect(getLen("ティラノサウルス")).toBe(16);
    expect(getLen("😀smile")).toBe(9);
    expect(getLen(12345)).toBe(5);
  });

  test("strOmit", () => {
    expect(strOmit("Tyrannosaurus.rex", 10)).toBe("Tyrannosau ...");
  });
});
