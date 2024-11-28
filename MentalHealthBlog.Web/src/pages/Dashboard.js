import useFetchLocationState from "../components/custom/hooks/useFetchLocationState";
import { ListOfPosts } from "../components/ListOfPosts";
import { MentalExpertDashboard } from "./MentalExpertDashboard";

export const Dashboard = () => {
  let { loggedUser } = useFetchLocationState();
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
      return <MentalExpertDashboard />;
    }
  }
  return <p>ERROR</p>;
};
