export class Pool {
  current = 0;
  maximum = 0;

  constructor(maximum = 0) {
    this.maximum = maximum;
    this.current = maximum;
  }
}
