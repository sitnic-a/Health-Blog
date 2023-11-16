import React from "react";
import { application } from "../application";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  let navigate = useNavigate();
  let register = async (e) => {
    e.preventDefault();
    console.log("Register invoked");
    let form = new FormData(e.target);
    let formData = form.entries();
    let data = Object.fromEntries([...formData]);

    let newUser = {
      username: data.username,
      password: data.password,
    };

    try {
      let response = await fetch(
        `${application.application_url}/user/register/${newUser.username}/${newUser.password}`,
        {
          method: "POST",
          body: JSON.stringify(newUser),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        alert("You've succesfully created your account");
        console.log(response);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className="register-container">
      <form onSubmit={register}>
        <div>
          <label htmlFor="register-username">Username:</label>
          <input
            type="text"
            name="username"
            id="register-username"
            placeholder="Enter your username"
            autoComplete="true"
          />
        </div>

        <div>
          <label htmlFor="register-password">Password:</label>
          <input type="password" name="password" id="register-password" />
        </div>

        <button type="submit">Register</button>
      </form>
    </section>
  );
};
