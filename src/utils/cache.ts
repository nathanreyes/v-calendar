export default class Cache<T> {
  keys: string[] = [];
  store: Record<string, T> = {};

  constructor(
    public size: number,
    public createKey: (...args: any[]) => string,
    public createItem: (...args: any[]) => T,
  ) {}

  get(...args: any[]) {
    const key = this.createKey(...args);
    return this.store[key];
  }

  getOrSet(...args: any[]): T {
    const key = this.createKey(...args);
    if (this.store[key]) return this.store[key];
    const item = this.createItem(...args);
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
