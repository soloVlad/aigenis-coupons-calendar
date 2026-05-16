export type LoginRequest = {
  phone: string;
  password: string;
};

export type LoginResponse = {
  access: string;
  refresh: string;
};
