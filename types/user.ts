export interface User {
  id: string
  name: string
  firstname: string
  lastname: string
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