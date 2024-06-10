import axios from "axios";

const API = axios.create({
  baseURL: "https://django-hello-world-roan-iota.vercel.app/api/",
});

export const getAccessToken = () => localStorage.getItem("accessToken");

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await API.post("token/refresh/", {
      refresh: refreshToken,
    });
    localStorage.setItem("accessToken", response.data.access);
    return response.data.access;
  } catch (error) {
    console.error("Token refresh error:", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return null;
  }
};

export const isTokenExpired = (token) => {
  if (!token) {
    return true;
  }

  const [, payload] = token.split(".");
  const decodedPayload = JSON.parse(atob(payload));
  const currentTime = Math.floor(Date.now() / 1000);

  return decodedPayload.exp < currentTime;
};
