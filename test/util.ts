import { resizeArray, resizeNestedArray } from "../src/util.ts";
import { assertEquals } from "./deps.ts";

Deno.test("Array lengthening", () => {
  const array = [1, 2, 3];

  resizeArray(array, 5);
  assertEquals(array.length, 5);
  assertEquals(array, [1, 2, 3, null, null]);

  resizeArray(array, 7, 0);
  assertEquals(array.length, 7);
  assertEquals(array, [1, 2, 3, null, null, 0, 0]);
});

Deno.test("Array shortening", () => {
  const array = [1, 2, 3, 4, 5];
  resizeArray(array, 3);
  assertEquals(array.length, 3);
  assertEquals(array, [1, 2, 3]);
});

Deno.test("2D array shrinking", () => {
  const array = [
    [1, 2, 3],
    [1, 2, 3],
    [1, 2, 3],
  ];

  resizeNestedArray(array, 2, 2);

  assertEquals(array.length, 2);
  assertEquals(array[0].length, 2);
  assertEquals(array, [
    [1, 2],
    [1, 2],
  ]);
});

Deno.test("2D array growing", () => {
  const array = [
    [1, 2],
    [1, 2],
  ];

  resizeNestedArray(array, 3, 3, 0);

  assertEquals(array.length, 3);
  assertEquals(array[0].length, 3);
  assertEquals(array, [
    [1, 2, 0],
    [1, 2, 0],
    [0, 0, 0],
  ]);
});

Deno.test("2D array growing and shrinking", () => {
  const array = [
    [1, 2, 3],
    [1, 2, 3],
  ];

  resizeNestedArray(array, 2, 3, 0);

  assertEquals(array.length, 3);
  assertEquals(array[0].length, 2);
  assertEquals(array, [
    [1, 2],
    [1, 2],
    [0, 0],
  ]);
});
