import { IUserRegister } from "../interfaces/user.interface";

const BASE_URL = "https://proxy-tau-one.vercel.app/api";

export const login = async (username: string, password: string) => {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  const response = await fetch(`${BASE_URL}/api/v1/auth/login/`, {
    method: "POST",
    body: formData,
  });
  return await response.json();
};
export const register = async (user: IUserRegister, profile_photo: File) => {
  const formData = new FormData();
  formData.append("username", user.username);
  formData.append("password", user.password);
  formData.append("first_name", user.first_name);
  formData.append("last_name", user.last_name);
  formData.append("email", user.email);
  formData.append("profile_photo", profile_photo);
  const response = await fetch(`${BASE_URL}/api/v1/auth/register/`, {
    method: "POST",
    body: formData,
  });
  return await response.json();
};

export const tokenRefresh = async (refreshToken: string) => {
  const formData = new FormData();
  formData.append("refresh", refreshToken);
  const response = await fetch(`${BASE_URL}/api/token/refresh/`, {
    method: "POST",
    body: formData,
  });
  return await response.json();
};

export const getUsers = async (token: string) => {
  const response = await fetch(`${BASE_URL}/api/v1/user/users/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
};

export const getUser = async (id: number, token: string) => {
  const response = await fetch(`${BASE_URL}/api/v1/user/${id}/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
};

export const deleteUser = async (id: number, token: string) => {
  const response = await fetch(`${BASE_URL}/api/v1/user/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.status;
};
