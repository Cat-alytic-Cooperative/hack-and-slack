export class Pool {
  current = 0;
  maximum = 0;

  constructor(maximum = 0) {
    this.maximum = maximum;
    this.current = maximum;
  }

  set(amount: number) {
    this.maximum = amount;
    this.current = this.maximum;
  }

  add(amount: number) {
    this.current = Math.min(this.current + amount, this.maximum);
  }

  subtract(amount: number) {
    this.current = Math.max(this.current - amount, 0);
  }

  fill() {
    this.current = this.maximum;
  }

  empty() {
    this.current = 0;
  }
}
