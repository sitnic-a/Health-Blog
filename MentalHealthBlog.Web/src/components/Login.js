import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  return (
    <section className="login">
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
        <button
          type="button"
          id="login-container-button"
          onClick={() => {
            navigate("/");
          }}
        >
          Login
        </button>
      </div>
      <div className="quote-container">
        <h1>{zenQuote}</h1>
      </div>
    </section>
  );
};
