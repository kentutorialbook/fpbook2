// f .> g
type compose =
  <A, B>(f: (a: A) => B) =>
    <C>(g: (b: B) => C) =>
      (a: A) => C;
const compose: compose =
  f => g =>
    a => g(f(a));

const None: any = Symbol("None");

type optionMap = <A, B>
  (f: (a: A) => R<B>) =>
  (a: A) => R<B>;
const optionMap: optionMap =
  f => a =>
    a === None
      ? r(None)
      : f(a);

type monadic = <A, B>
  (f: (a: A) => B) =>
  (a: A) => R<B>;
const monadic: monadic =
  f => compose(f)(r);

type operators = {
  // ignore None change----
  reactiveMap: <A, B>(
    this: R<A>,
    f: (a: A) => R<B>
  ) => R<B>,
  map: <A, B>(
    this: R<A>,
    f: (a: A) => B
  ) => R<B>,
  // detect None change----
  reactiveMapN: <A, B>(
    this: R<A>,
    f: (a: A) => R<B>
  ) => R<B>,
  mapN: <A, B>(
    this: R<A>,
    f: (a: A) => B
  ) => R<B>,
  //-------------------------
  next: <A>(
    this: R<A>,
    a: A
  ) => R<A>
};

const operators: operators = {
  // ignore None change----
  reactiveMap: function (this, f) {
    return reactive(f)(this);
  },
  map: function (this, f) {
    return reactive(monadic(f))(this);
  },
  // detect None change----
  reactiveMapN: function (this, f) {
    return reactiveN(f)(this);
  },
  mapN: function (this, f) {
    return reactiveN(monadic(f))(this);
  },
  //-------------------------
  next: function (this, a) {
    return next(a)(this);
  }
};

type R<A> = {
  lastVal: A, // mutable
  lastFns: Array<((a: A) => void)>, // mutable
} & operators;

type r = <A> (a: A) => R<A>;
const r: r = a =>
  Object.defineProperties(
    Object.assign(
      {
        lastVal: a, // mutable
        lastFns: [],// mutable
      },
      operators),
    {
      lastVal: {
        writable: true, // mutable
        enumerable: true, // visible
        configurable: false
      },
      lastFns: {
        writable: true, // mutable
        enumerable: false, // invisible
        configurable: false
      },
      reactiveMap: {
        writable: false,
        enumerable: false,
        configurable: false
      },
      map: {
        writable: false,
        enumerable: false,
        configurable: false
      },
      reactiveMapN: {
        writable: false,
        enumerable: false,
        configurable: false
      },
      mapN: {
        writable: false,
        enumerable: false,
        configurable: false
      },
      next: {
        writable: false,
        enumerable: false,
        configurable: false
      }
    }
  );

//----------------------------------------
type reactive = <A, B>
  (f: (a: A) => R<B>) =>
  (rA: R<A>) => R<B>;
const reactive: reactive =
  f => rA => {
    const val = rA.lastVal;
    const fns = rA.lastFns;
    const rB = optionMap(f)(val);
    const addFn = addingFn(f)(rB);
    const newFns = fns.concat([addFn]);
    rA.lastFns = newFns; // mutable
    return rB;
  };

type addingFn = <A, B>
  (f: (a: A) => R<B>) =>
  (rB: R<B>) => (a: A) => void;
const addingFn: addingFn =
  f => rB => a => {
    const rfa = optionMap(f)(a);
    const b = rfa.lastVal;
    rB.next(b);
    return undefined;
  };
//-------------------------------------
type reactiveN = <A, B>
  (f: (a: A) => R<B>) =>
  (rA: R<A>) => R<B>;
const reactiveN: reactiveN =// to detect None change
  f => rA => {
    const val = rA.lastVal;
    const fns = rA.lastFns;
    const rB = (f)(val);// no optionMap to detect None change
    const addFn = addingFnN(f)(rB);
    const newFns = fns.concat([addFn]);
    rA.lastFns = newFns; // mutable
    return rB;
  };

type addingFnN = <A, B>
  (f: (a: A) => R<B>) =>
  (rB: R<B>) => (a: A) => void;
const addingFnN: addingFnN =// to detect None change
  f => rB => a => {
    const rfa = (f)(a);// no optionMap to detect None change
    const b = rfa.lastVal;
    rB.next(b);
    return undefined;
  };
//--------------------------------------
type next = <A>(a: A) => (rA: R<A>) => R<A>;
const next: next = x => rA => {
  rA.lastVal = x; // mutable
  const fns = rA.lastFns;
  fns.map(fn => fn(x)); //perform all fns in the list
  return rA;
};

type logR = <A>(a: A) => R<A>;
const logR: logR = a => {
  console.log("== console ==");
  console.log(a);
  console.log("-------------");

  const rA = r(a);
  return rA;
};

export { r, reactive, next, monadic, None, logR, R }