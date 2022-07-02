{
  type Num = { value: number };
  type NumOp = Num & operators;

  type plus = (a: number) => (b: number) => number;
  const plus: plus = a => b => a + b;

  type minus = (a: number) => (b: number) => number;
  const minus: minus = a => b => a - b;


  type operators = {
    plus: (this: NumOp, a: number) => number,
    minus: (this: NumOp, a: number) => number
  };
  const operators: operators = {
    plus: function (this, a) {
      return plus(this.value)(a);
    },
    minus: function (this, a) {
      return minus(this.value)(a);
    }
  };


  type num = (a: number) => NumOp;
  const num: num = a =>
    Object.assign({ value: a }, operators);

  //test
  const n = num(2);

  console.log(
    n.plus(1)
  ); // 3

  console.log(
    n.minus(1)
  ); // 1

}
