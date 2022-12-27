export default class Cache<T> {
  keys: string[] = [];
  store: Record<string, T> = {};

  constructor(
    public size: number,
    private createKey: (...args: any[]) => string,
    private createItem: (...args: any[]) => T,
  ) {}

  get(params: P) {
    const key = this.createKey(params);
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
