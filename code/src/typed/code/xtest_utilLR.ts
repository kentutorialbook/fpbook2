
import {
  pipe, composeLR,
  _, $,
} from "./_utilLR.js";


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

}

{
  console.log("test map---------------")
  type map = <A, B>
    (f: (a: A) => B) =>
    (Arr: Array<A>) => Array<B>;
  const map: map =
    f =>
      Arr => Arr.map(f);

  console.log(
    [1, 2, 3][_](map(f))
  ); // [2,4,6]

}


{// testLR
  console.log("test pipe---------------")

  console.log(
    (1)[_](f)
  );

  console.log(
    (1)[_](pipe(f))
  );
}

{
  console.log("test composeLR---------------")

  console.log(
    (1)[_](f)[_](g)
  );
  console.log(
    (1)[_]((f)[$](g))
  );
  console.log(
    (1)[_](
      (f)[_](composeLR(g))
    )
  );

  console.log("test composeLR---------------")

  console.log(
    (1)[_]((f)[$](g)[$](h))
  ); // "3"

  console.log(
    (1)[_](
      (f)
      [_](composeLR(g))
      [_](composeLR(h))
    )
  ); // "3"

}
