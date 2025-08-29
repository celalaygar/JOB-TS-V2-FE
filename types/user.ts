export interface User {
  id: string
  username: string
  firstname: string
  lastname: string
  email?: string
  role?: string
  avatar?: string
  initials?: string
  department?: string
  phone?: string
  title?: string
  status?: string
  joinDate?: string
  skills?: string[]
  languages?: string[]
  certifications?: string[]
  education?: string[]
  location?: string
  workHours?: string
  dateOfBirth?: string
  gender?: string
  company?: string
  position?: string
}

export interface AuthenticationUser extends User {

}


export interface AuthUserResponse {
  user: AuthUser;
  token: string;
}

export interface AuthUser {
  id: string;
  email?: string | null | undefined;
  image?: string | null | undefined;
  username: string | null;
  firstname: string | null;
  lastname: string | null;
  name?: string | null | undefined;
  role: string | [] | null | undefined;
  password: string | null;
  systemRoles: string[];
}

export interface RegisterRequest {
  email?: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: string;
  token?: string;
  department?: string; // UserDepartment için ayrı bir interface tanımlamanız gerekebilir
  company?: string;
  position?: string;
}


export interface UserDto {
  id?: string;
  email?: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  password?: string;
  systemRoles?: Set<SystemRole>; // TypeScript'te Set<T> olarak çevrilir.
  status?: string;
  department?: UserDepartment; // Ayrı bir arayüz veya enum olarak tanımlanmalıdır.
  phone?: string;
  dateOfBirth?: Date; // Java'daki Date, TypeScript'te Date nesnesine karşılık gelir.
  gender?: string;
  position?: string;
  company?: string;
  createdAt?: string; // LocalDateTime genellikle ISO 8601 string olarak gönderilir.
  projectSystemRole?: ProjectSystemRole; // Ayrı bir arayüz veya enum olarak tanımlanmalıdır.
  updatedAt?: string; // LocalDateTime genellikle ISO 8601 string olarak gönderilir.
}

// Örnek bağımlılık tanımlamaları
// Java modelinize göre bu kısımları düzenlemeniz gerekir.

interface SystemRole {
  id: string;
  name: string;
}

interface UserDepartment {
  id: string;
  name: string;
}

interface ProjectSystemRole {
  id: string;
  name: string;
}




export interface EmailChangeRequest {
  currentPassword: string;
  newEmail: string;
  verificationCode: string;
}


export interface EmailChangeResponse {
  success: boolean;
  message: string;
}



export interface ValidateEmailTokenResponse {
  token: string;
  newEmailPending: string;
  currentEmail: string;
  valid: boolean;
}


export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  newPassword: string;
  newToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  message: string;
  success: boolean;
}
export interface PasswordResetValidateRequest {
  token: string;
}
export interface PasswordResetConfirmRequest {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface PasswordResetValidateResponse {
  token: string;
  email: string;
  valid: boolean;
  message: string;
}
