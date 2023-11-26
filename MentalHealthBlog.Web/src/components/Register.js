import React from "react";
import { application } from "../application";
import { useNavigate } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";

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

    if (
      newUser.username === "" ||
      newUser.username === null ||
      newUser.password === "" ||
      newUser.password === null
    ) {
      alert("Fields are required!");
      toast.error("Invalid fields! Try again", {
        autoClose: 1500,
        position: "bottom-right",
      });
      return;
    }

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

      let responseJSON = await response.json();
      console.log(responseJSON);

      if (responseJSON.statusCode === 201) {
        alert("You've succesfully created your account");
        toast.success("You've succesfully created your account", {
          autoClose: 1500,
          position: "bottom-right",
        });
        console.log(response);
        navigate("/login");
      } else {
        toast.warning("Couldn't register this user!", {
          autoClose: 1500,
          position: "bottom-right",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("You are not registered! Try again!", {
        autoClose: 1500,
        position: "bottom-right",
      });
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
