//-----------------------------------------
// ($) :: (a -> b) -> a -> b
type pipe = <A, B>
  (f: (a: A) => B) => (a: A) => B;
const pipe: pipe = f => a => f(a);
//-----------------------------------------
// f .> g
type composeLR =
  <B, C>(R: (b: B) => C) =>
    <A>(L: (a: A) => B) =>
      (a: A) => C;
const composeLR: composeLR =
  R => L =>
    a => R(L(a));
//-----------------------------------------

const _ = Symbol("for pipe");
const $ = Symbol("for composition/joint");

type pipeOp = {
  [_]: <A, B>
    (this: A,
    f: (a: A) => B)
    => B
};
const pipeOp: pipeOp = {
  [_]: function (this, f) {
    return pipe(f)(this);
  }
};

type composeOp = {
  [$]: <A, B, C>
    (this: (a: A) => B, // this == f / left side
    R: (b: B) => C)   // right side of compose
    => (a: A) => C    // compose(f)(g)
};
const composeOp: composeOp = {
  [$]: function (this, R) {
    return composeLR(R)(this);
  }
};
//-----------------------------------------
//extend Object.prototype with pipe operator as 'p'
Object.assign(Object.prototype, pipeOp);
//-----------------------------------------
//extend Function.prototype with compose as 'c'
Object.assign(Function.prototype, composeOp);
//-----------------------------------------

declare global {

  interface Object {
    [_]: <A, B>(
      this: A,
      f: (a: A) => B
    ) => B
  }
  interface Function {
    [$]: <A, B, C> (
      this: (a: A) => B,
      R: (b: B) => C
    ) => (a: A) => C
  }

}
export {
  pipe, composeLR,
  _, $,
}





