import { r, reactive, next, monadic, None, logR, R }
  from "./reactive_monad.js";

type reactiveFlag =
  <A>(rA: R<A>) => R<boolean>;
const reactiveFlag: reactiveFlag =
  rA => {
    const rFlag = r(false);
    rA.mapN(a => //mapN reactive on None
      a === None
        ? rFlag.next(false)
        : rFlag.next(true)
    );
    return rFlag;
  };

type allNoResetR =
  <A>(rAs: Array<R<A>>) => R<Array<R<A>>>;
const allNoResetR: allNoResetR =
  rAs => {
    const result = r(None);
    const rBools = rAs.map(rA => reactiveFlag(rA));
    const rBools_ = rAs.map(rA => reactiveFlag(rA));
    const changed = r(None);
    const dummy = true;
    rBools_
      .map(rBool_ =>
        rBool_
          .map(_ => changed.next(dummy))
      );
    changed
      .map(ch => {
        const bool =
          rBools
            .map(rBool => rBool.lastVal)
            .reduce((a, b) => a && b);
        bool
          ? result.next(rAs)
          : result.next(None);
      });
    return result;
  };

export { allNoResetR }