export interface User {
  id: string
  name: string
  email: string
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
}

export interface AuthenticationUser extends User {

}


export interface AuthUserResponse {
  user: AuthUser;
  token: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string | null;
  firstname: string | null;
  lastname: string | null;
  password: string | null;
  systemRoles: string[];
}