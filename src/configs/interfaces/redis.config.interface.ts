export interface IRedisConfig {
  host: string;
  port: number;
  password: string;
  loginTimeout: number;
  redisTlsConnectionEnabled: boolean;
}
