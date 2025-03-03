import { useLocation, useNavigate } from "react-router-dom";
import useFetchLocationState from "../components/custom/hooks/useFetchLocationState";
import { verifyToken } from "../components/utils/helper-methods/jwt";
import { AdminDashboard } from "./AdminDashboard";
import { MentalExpertDashboard } from "./MentalExpertDashboard";
import { UserDashboard } from "./UserDashboard";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { refreshAccessToken } from "../components/redux-toolkit/features/userSlice";

export const Dashboard = () => {
  let navigate = useNavigate();
  let location = useLocation();
  let dispatch = useDispatch();
  let refreshToken = Cookies.get("refreshToken");
  // console.log("Refresh token ", refreshToken);

  let { loggedUser } = useFetchLocationState();
  console.log("Logged user token ", loggedUser.token);

  useEffect(() => {
    if (!verifyToken(loggedUser.token)) {
      dispatch(refreshAccessToken(refreshToken)).then((response) => {
        console.log("Refresh response ", response);

        let authenticatedUser =
          response.payload.serviceResponseObject.serviceResponseObject;
        let statusCode = parseInt(response.payload.statusCode);
        // console.log("Authenticated user ", authenticatedUser);
        if (statusCode === 201 || statusCode === 200) {
          console.log("New token ", authenticatedUser.jwToken);
          navigate("/", {
            replace: true,
            state: {
              prevUrl: window.location.href,
              loggedUser: {
                id: authenticatedUser.id,
                username: authenticatedUser.username,
                token: authenticatedUser.jwToken,
                roles: authenticatedUser.userRoles,
              },
            },
          });
          console.log("New state token ", location.state);

          // console.log("Location ", location);

          return;
        }
        console.log("Log in again");
      });
      // navigate('login')
    }
  }, []);

  if (loggedUser !== null) {
    if (loggedUser.roles.some((ur) => ur.name === "User")) {
      return <UserDashboard />;
    }
    if (loggedUser.roles.some((ur) => ur.name === "Administrator")) {
      return <AdminDashboard />;
    }
    if (
      loggedUser.roles.some(
        (ur) => ur.name === "Psychologist / Psychotherapist"
      )
    ) {
      return <MentalExpertDashboard />;
    }
  }
  return <p>ERROR</p>;
};
