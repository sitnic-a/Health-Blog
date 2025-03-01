import { jwtDecode } from "jwt-decode";

export const verifyToken = (token) => {
  let decodedToken = jwtDecode(token);
  let currentDate = new Date();

  // JWT exp is in seconds
  if (decodedToken.exp * 1000 < currentDate.getTime()) {
    return false;
  }
  return true;
};
