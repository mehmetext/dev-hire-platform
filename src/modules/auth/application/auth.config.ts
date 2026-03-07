export abstract class AuthConfig {
  abstract getAccessTokenExpiresIn(): string; // '15m' or '15d'
  abstract getAccessTokenExpiresInSeconds(): number;
  abstract getRefreshTokenExpiresIn(): string; // '7d'
  abstract getAccessTokenSecret(): string;
  abstract getRefreshTokenSecret(): string;
}
