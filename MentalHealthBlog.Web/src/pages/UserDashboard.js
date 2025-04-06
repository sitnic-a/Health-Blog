import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ListOfPosts } from "../components/ListOfPosts";
import { Logout } from "../components/shared/Logout";

export const UserDashboard = () => {
  return (
    <section className="user-dashboard">
      {/* Navigation bar */}
      <section className="navigation-container">
        <div className="navbar">
          <ul className="navbar-list">
            <li>
              <Link
                to={"shared-posts"}
                className="navbar-action-shared-content"
              >
                Shared Content
              </Link>
            </li>
            <Logout />
          </ul>
        </div>
      </section>
      <ListOfPosts />
    </section>
  );
};
