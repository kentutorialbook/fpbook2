import {
  _,
  $
} from "./_util.js";

import {
  identity,
  right,
  log,
}
  from "./___utils.js"

import {
  r,
  reactive,
  next,
  monadic,
  logR,
  None
} from "./reactive_monad.js";

import {
  allNoResetR
} from "./v_allNoReset.js";

{// test

  //-------------------------------
  const f = (a: number) => a * 2;
  const g = (a: number) => a + 1;
  const h = (a: number) => a * 5;
  const s = (a: number) => a.toString();
  //-------------------------------
  console.log(

    (1)
    [_](f)
    [_](g)
    [_](h)
    [_](s)

  );



  const rB = r(1);
  log(rB);
  rB.mapN(log);

  console.log("!!!!!!!!!!!!!!!!!!!!!");
  rB.next(None);



  {
    console.log("------------------------");
    const b = r(1);
    const c = r(2);

    const a =
      allNoResetR([b, c])
        .map(([b, c]) => b.lastVal + c.lastVal);

    b.next(10);
    const Log = a.map(log); // 12
    b.next(100);        // 102

  }


  {
    console.log("--?????????????????????");


    const rA = r(1);
    rA
      .reactiveMap(f[$](r))
      .reactiveMap(f[$](r))
      .reactiveMap(log[$](r));
    console.log("--?????????????????????");
    rA
      .reactiveMap(monadic(f))
      .reactiveMap(monadic(f))
      .reactiveMap(monadic(log));
    console.log("--?????????????????????");
    rA.map(f)
      .map(f)
      .map(log);
    console.log("--?????????????????????");
    rA.mapN(log);

    rA[_](next(10));
    rA.next(500);
    rA.next(None);
  }

}


