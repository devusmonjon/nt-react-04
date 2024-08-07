export interface IUser {
  id: 2;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  middle_name: null | string;
  profile_photo: string;
  email_confirmed: boolean;
  birth_date: null | string;
  role: "SUPERADMIN" | "ADMIN" | "MODERATOR" | "USER";
}
export interface IUserRegister {
  email: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
}
