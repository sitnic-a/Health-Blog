import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../components/redux-toolkit/features/userSlice";

import Cookies from "js-cookie";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let { authenticatedUser } = useSelector((store) => store.user);
  let refreshToken = Cookies.get("refreshToken");

  return (
    <div className="logout-container">
      <li className="logout-icon-container">
        <CiLogout
          className="logout-icon"
          onClick={() => {
            let logoutRequest = {
              userId: authenticatedUser.id,
              refreshToken: refreshToken,
            };
            dispatch(logout(logoutRequest)).then(() => {
              Cookies.remove("refreshToken");
              navigate("login");
            });
          }}
        />
      </li>
    </div>
  );
};
