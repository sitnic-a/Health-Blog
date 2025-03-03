import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, setIsFailed } from "./redux-toolkit/features/userSlice";
import { toast } from "react-toastify";
import { Loader } from "./Loader";

export const Login = () => {
  let dispatch = useDispatch();
  let { isLogging } = useSelector((store) => store.user);

  let navigate = useNavigate();
  let loginUser = async (e) => {
    e.preventDefault();
    let form = new FormData(e.target);
    let formData = form.entries();
    let data = Object.fromEntries([...formData]);

    let user = {
      username: data.username,
      password: data.password,
    };

    if (
      user.username === "" ||
      user.username === null ||
      user.password === "" ||
      user.password === null
    ) {
      toast.error("Fields are required", {
        autoClose: 1500,
        position: "bottom-right",
      });
      dispatch(setIsFailed(true));
      return;
    }

    dispatch(login(user)).then((response) => {
      let statusCode = response.payload.statusCode;
      let authenticatedUser = response.payload.serviceResponseObject;
      // console.log('AUTH USER ', authenticatedUser)

      if (statusCode === 200 || statusCode === 201 || statusCode === 204) {
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
      }
    });
    form.delete("username");
    form.delete("password");
    form.set("password", "");
  };

  return (
    <>
      {isLogging === true ? (
        <Loader />
      ) : (
        <section className="login">
          <form onSubmit={loginUser}>
            <div className="login-container">
              <h1>
                Welcome to Mental Health Blog. Feel free to write express your
                emotions!
              </h1>
              <div>
                <label htmlFor="username">Username:</label>
                <br />
                <input
                  id="username"
                  type="text"
                  name="username"
                  autoComplete="username"
                />
              </div>
              <br />
              <div>
                <label htmlFor="password">Password:</label>
                <br />
                <input id="password" type="password" name="password" />
              </div>
              <section id="register-main-container">
                <div className="register-regular-user-main-container">
                  <Link
                    className="register-link regular-user-link"
                    to={"/register"}
                    state={{ regularUser: true }}
                  >
                    Create an account
                  </Link>
                </div>
                <div className="register-mental-health-expert-main-container">
                  <Link
                    className="register-link mental-health-expert-link"
                    to={"/register"}
                    state={{ isMentalHealthExpert: true }}
                  >
                    Register as mental health expert
                  </Link>
                </div>
              </section>
              <button type="submit" id="login-container-button">
                Login
              </button>
            </div>
          </form>
        </section>
      )}
    </>
  );
};
