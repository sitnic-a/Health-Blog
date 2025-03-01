import { useNavigate } from "react-router-dom";
import useFetchLocationState from "../components/custom/hooks/useFetchLocationState";
import { verifyToken } from "../components/utils/helper-methods/jwt";
import { AdminDashboard } from "./AdminDashboard";
import { MentalExpertDashboard } from "./MentalExpertDashboard";
import { UserDashboard } from "./UserDashboard";
import { useEffect } from "react";

export const Dashboard = () => {
  let navigate = useNavigate();
  let { loggedUser } = useFetchLocationState();

  useEffect(() => {
    if (!verifyToken(loggedUser.token)) {
      navigate("login");
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
