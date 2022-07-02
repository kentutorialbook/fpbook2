
console.log("io-monad.js")
// emulate lazy-eval IO in eager-eval JS
{
  //(>>=) :: IO a -> (a -> IO b) -> IO b
  type map = <A, B> // function => function
    (f: (a: A) => IO<B>) =>
    (ioA: IO<A>) => IO<B>;
  const map: map =
    f => ioA => f(ioA());

  //(>>) :: IO a -> IO b -> IO b
  type and = <A, B>
    (ioB: IO<B>) =>
    (ioA: IO<A>) => IO<B>;
  const and: and =
    ioB => ioA => ioB;

  type operators = {
    map: <A, B> (
      this: IO<A>,
      f: (a: A) => IO<B>) =>
      IO<B>,
    and: <A, B>(
      this: IO<A>,
      ioB: IO<B>) =>
      IO<B>
  };
  const operators: operators = {
    map: function (this, f) {
      return map(f)(this);
    },
    and: function (this, ioB) {
      return and(ioB)(this);
    }
  };

  // IO :: * -> *
  type IO<A> = {
    (): A
  } & operators;

  type io = <A>(a: A) => IO<A>;
  const io: io = a =>
    Object.assign(
      () => a,
      operators);

  //------------------------------------------------------------
  // IO() is called "action"
  //print :: forall a. Show a => a -> IO ()
  type print =
    <T>(a: T) => IO<void>
  const print: print =
    a => io(console.log(a));
  //print function is to-do / to-console.log

  // runtime --
  // https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/set

  // main :: IO ()
  type realWorldRuntime =
    { "main": IO<void> };
  const realWorldRuntime: realWorldRuntime =
    { "main": io(undefined) };

  Object.defineProperty(realWorldRuntime,
    "main", { set: io => io() });

  {
    realWorldRuntime.main = print("Hello"); // 5
  }


  console.log("--------------------------------");
  {
    const f = (a: number) => io(a * 2);

    realWorldRuntime.main =
      io(5)
        .map(f)
        .map(f)
        .map(print)
        .and(print(7));
  }
  console.log("-------------------------------");
  {
    realWorldRuntime.main =
      print("Hello")
        .and(
          io(99)
            .map(
              (x: number) =>
                print(x)
                  .and(
                    io(1)
                      .map(
                        (y: number) =>
                          print(y)
                            .and(
                              print(x + y))
                      )
                  )
            )
        );
  }
  //---------------------------------------------
}



















