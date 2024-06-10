import axios from "axios";

const API = axios.create({
  baseURL: "https://django-hello-world-roan-iota.vercel.app/api/",
});

export const register = async (username, password) => {
  const response = await API.post("register/", { username, password });
  return response.data;
};

export const login = async (username, password) => {
  const response = await API.post("login/", { username, password });
  return response.data;
};

export const getUserDetails = async (accessToken) => {
  try {
    const response = await API.get("user/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch user details");
  }
};
