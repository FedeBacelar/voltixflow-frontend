export interface ILoginRequest {
  username: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  expiresAt: string;
  userID: number;
  username: string;
  role: string;
  permissions: string[];
}
