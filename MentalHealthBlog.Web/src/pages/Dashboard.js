import { ListOfPosts } from "../components/ListOfPosts";
import { useLocation } from "react-router-dom";

export const Dashboard = () => {
  let location = useLocation();
  let loggedUser = location.state.loggedUser;
  console.log("Dashboard logged user ", loggedUser);

  if (loggedUser !== null) {
    if (loggedUser.roles.some((ur) => ur.name === "User")) {
      return <ListOfPosts />;
    }
    if (loggedUser.roles.some((ur) => ur.name === "Administrator")) {
      return <p>Admin page</p>;
    }
    if (
      loggedUser.roles.some(
        (ur) => ur.name === "Psychologist / Psychotherapist"
      )
    ) {
      return <p>Psychologist page</p>;
    }
  }
  return <p>ERROR</p>;
};
