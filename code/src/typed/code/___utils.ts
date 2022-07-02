
type identity = <A>(a: A) => A;
const identity: identity = a => a;

const x = identity(3);


type identityF = <A, B>
  (f: (a: A) => B) =>
  (a: A) => B;
const identityF: identityF = f => f;


type right = <A>(a: A) => <B>(b: B) => B;
const right: right = a => b => b;


console.log("Hello world!");

type log = <A>(a: A) => A;
const log: log = a => {
  console.log("== console --");
  console.log(a);
  console.log("-------------");
  return a;
};
//-----------------------------------------
// flip :: (a -> b -> c) -> b -> a -> c
type flip = <A, B, C>
  (f: (a: A) => (b: B) => C) =>
  (b: B) => (a: A) => C;
const flip: flip =
  f => a => b => f(b)(a);


export {
  identity,
  right,
  log,
  flip
}





