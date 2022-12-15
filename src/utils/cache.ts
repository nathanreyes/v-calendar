export default class Cache<P, T> {
  keys: string[] = [];
  store: Record<string, T> = {};

  constructor(
    public size: number,
    private createKey: (params: P) => string,
    private createItem: (params: P) => T,
  ) {}

  get(params: P) {
    const key = this.createKey(params);
    return this.store[key];
  }

  getOrSet(params: P): T {
    const key = this.createKey(params);
    if (this.store[key]) return this.store[key];
    const item = this.createItem(params);
    if (this.keys.length >= this.size) {
      const removeKey = this.keys.shift();
      if (removeKey != null) {
        delete this.store[removeKey];
      }
    }
    this.keys.push(key);
    this.store[key] = item;
    return item;
  }
}
