export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}
