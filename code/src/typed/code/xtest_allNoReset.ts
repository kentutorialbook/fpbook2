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


  const rA = r(1).map(f);
  const rB = r(None);
  const rC = r(9);

  const rAB = allNoResetR([rA, rB, rC]).mapN(log);


  rB.next(55);
  rB.next(333);
  rB.next(None);
  rA.next(9);
  rB.next(1);
}


