//-----------------------------------------
// ($) :: (a -> b) -> a -> b
type pipe = <A, B>
  (f: (a: A) => B) => (a: A) => B;
const pipe: pipe = f => a => f(a);
//-----------------------------------------
// f .> g
type compose =
  <A, B>(f: (a: A) => B) =>
    <C>(g: (b: B) => C) =>
      (a: A) => C;
const compose: compose =
  f => g =>
    a => g(f(a));
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
    g: (b: B) => C)   // right side of compose
    => (a: A) => C    // compose(f)(g)
};
const composeOp: composeOp = {
  [$]: function (this, g) {
    return compose(this)(g);
  }
};

//-----------------------------------------
//extend Object.prototype with pipe operator
Object.assign(Object.prototype, pipeOp);
//-----------------------------------------
//extend Function.prototype with compose
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
      g: (b: B) => C
    ) => (a: A) => C
  }

}
export { _, $ }





