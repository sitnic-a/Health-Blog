import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  getQuote,
  setIsFailed,
} from "./redux-toolkit/features/userSlice";
import { Loader } from "./Loader";

export const Login = () => {
  let dispatch = useDispatch();
  let { authenticatedUser, isAuthenticated, isLogging, quote } = useSelector(
    (store) => store.user
  );

  let navigate = useNavigate();
  const _TIME_ = 5000;

  if (isAuthenticated) {
    navigate("/", {
      replace: true,
      state: {
        loggedUser: {
          id: authenticatedUser.id,
          username: authenticatedUser.username,
          token: authenticatedUser.jwToken,
        },
      },
    });
  }
  if (!isAuthenticated) {
    navigate("/login");
  }

  useEffect(() => {
    dispatch(getQuote());
  }, []);

  let timer = setInterval(() => {
    dispatch(getQuote());
    return clearInterval(timer);
  }, _TIME_);

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
      if (statusCode === 200 || statusCode === 201 || statusCode === 204) {
        navigate("/", {
          replace: true,
          state: {
            loggedUser: {
              id: authenticatedUser.id,
              username: authenticatedUser.username,
              token: authenticatedUser.jwToken,
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
              <div>
                <Link to={"/register"}>Create an account</Link>
              </div>
              <button type="submit" id="login-container-button">
                Login
              </button>
            </div>
          </form>
          {quote !== null && (
            <div className="quote-container">
              <div>
                <h1>{quote.text}</h1>
                <h4>{quote.author}</h4>
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
};
