export interface ICacheService {
  get(key: string): Promise<string | null>;

  exists(key: string): Promise<number>;

  set(key: string, value: string | Buffer | number, ttl: number): Promise<void>;
}
