import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { application } from "../application";
import { toast } from "react-toastify";

export const Login = () => {
  let navigate = useNavigate();
  const _URL_ = "https://type.fit/api/quotes";
  //   const _URL_ = "https://api.api-ninjas.com/v1/quotes";
  const _TIME_ = 10000;
  let [zenQuote, setZenQuote] = useState("");

  useEffect(() => {
    getQuote();
  }, []);

  let getQuote = async () => {
    let response = await fetch(_URL_).then((response) => response.json());
    let arraySize = response.length;
    let randomNumber = Math.floor(Math.random() * arraySize) + 1;
    let obj = { ...response[randomNumber] };
    setZenQuote(obj.text);
    clearInterval(timer);
  };

  let timer = setInterval(getQuote, _TIME_);

  let login = async (e) => {
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
      //Set validation
      toast.error("Fields are required", {
        autoClose: 1500,
        position: "bottom-right",
      });
      // alert("Fields are required!");
      return;
    }

    let response = await fetch(`${application.application_url}/user/login`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });

    let userResponse = await response.json();

    if (userResponse.statusCode === 200) {
      // alert("Succesfully logged in");
      toast.success("Succesfully logged in", {
        autoClose: 1500,
        position: "bottom-right",
      });
      let authenticatedUser = userResponse.serviceResponseObject;
      navigate("/", {
        state: {
          loggedUser: {
            id: authenticatedUser.id,
            username: authenticatedUser.username,
            token: authenticatedUser.jwToken,
          },
        },
      });
    } else {
      // alert("Invalid credentials, try again");
      toast.error("Your credentials are not correct", {
        autoClose: 1500,
        position: "bottom-right",
      });
      form.delete("username");
      form.delete("password");
      form.set("password", "");
    }
  };

  return (
    <section className="login">
      <form onSubmit={login}>
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
      <div className="quote-container">
        <h1>{zenQuote}</h1>
      </div>
    </section>
  );
};
