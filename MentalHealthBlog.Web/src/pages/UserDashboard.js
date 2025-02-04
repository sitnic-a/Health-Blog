import { Link } from "react-router-dom";
import { ListOfPosts } from "../components/ListOfPosts";
import useFetchLocationState from "../components/custom/hooks/useFetchLocationState";

export const UserDashboard = () => {
  let { loggedUser } = useFetchLocationState();
  return (
    <section className="user-dashboard">
      {/* Navigation bar */}
      <section className="navigation-container">
        <div className="navbar">
          <ul className="navbar-list">
            <li>
              <Link
                to={"shared-content"}
                state={{
                  loggedUser,
                }}
                className="navbar-action-shared-content"
              >
                Shared Content
              </Link>
            </li>
          </ul>
        </div>
      </section>
      <ListOfPosts />
    </section>
  );
};
