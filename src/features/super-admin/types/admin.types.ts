export interface Admin {
  id: number;
  name: string;
  email: string;
  mobile: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface GetAdminsResponse {
  success: boolean;
  count: number;
  data: Admin[];
}

export interface GetAdminResponse {
  success: boolean;
  message: string;
  data: Admin;
}

export interface CreateAdminPayload {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateAdminPayload {
  name: string;
  email: string;
  mobile: string;
}