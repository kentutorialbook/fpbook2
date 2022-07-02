import { _, $ } from "./_util.js";

//-------------------------------
const f = (a: number) => a * 2;
const g = (a: number) => a + 1;
const h = (a: number) => a.toString();
//-------------------------------

{// test
  console.log(
    (1)[_](f)[_](g)[_](h)
  ); // "3"

  console.log(
    (1)[_]((f)[$](g)[$](h))
  ); // "3"

  type sub = (a: number) => (b: number) => number;
  const sub: sub = a => b => b - a;

  console.log(
    sub(1)(2)
  ); // 2 - 1

  console.log(
    (2)[_](sub(1))
  ); // 2 - 1
}


