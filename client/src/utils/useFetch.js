import axios from "axios";
import { BASE_URL } from "../constants";

export const privateRequest = function (accessToken, refreshToken) {
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      accesstoken: "Bearer " + accessToken,
      refreshtoken: "Bearer " + refreshToken,
    },
  });
  return instance;
};

export const publicRequest = function () {
  const instance = axios.create({
    baseURL: BASE_URL,
  });
  return instance;
};
