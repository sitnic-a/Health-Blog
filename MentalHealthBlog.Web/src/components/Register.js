import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { register, getDbRoles } from "./redux-toolkit/features/userSlice";
import useFetchLocationState from "./custom/hooks/useFetchLocationState";
import { db_roles } from "./enums/roles";

export const Register = () => {
  let { dbRoles } = useSelector((store) => store.user);
  let { mentalHealthExpert } = useFetchLocationState();

  useEffect(() => {
    dispatch(getDbRoles());
  }, []);

  let navigate = useNavigate();
  let dispatch = useDispatch();

  let registerUser = async (e) => {
    e.preventDefault();
    let roles = [];
    let selectedRoles = document.querySelectorAll(
      'input[type="checkbox"]:checked'
    );

    if (mentalHealthExpert === true) {
      roles.push(db_roles.PSYCHOLOGIST);
    } else {
      selectedRoles.forEach((role) => {
        roles.push(role.value);
      });
    }

    let form = new FormData(e.target);
    let formData = form.entries();
    let data = Object.fromEntries([...formData]);

    let newUser = {
      username: data.username,
      password: data.password,
      roles: roles,
    };

    if (
      newUser.username === "" ||
      newUser.username === null ||
      newUser.password === "" ||
      newUser.password === null ||
      newUser.roles.length <= 0
    ) {
      alert("Fields are required!");
      toast.error("Invalid fields! Try again", {
        autoClose: 1500,
        position: "bottom-right",
      });
      return;
    }

    dispatch(register(newUser)).then((response) => {
      let statusCode = response.payload.statusCode;
      if (statusCode === 201) {
        navigate("/login");
      }
    });
  };

  return (
    <section className="register-container">
      <form onSubmit={registerUser}>
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
        {mentalHealthExpert !== true && (
          <div>
            <label htmlFor="register-roles">User type:</label>
            <br />
            {dbRoles.length > 0 &&
              dbRoles.map((role) => {
                return (
                  <div key={role.id}>
                    <input
                      type="checkbox"
                      name="db-role"
                      id="db-role"
                      value={role.id}
                    />
                    <label htmlFor="db-role-name">{role.name}</label>
                    <br />
                  </div>
                );
              })}
          </div>
        )}

        {mentalHealthExpert === true && (
          <div className="mental-health-expert-register-info-main-container">
            <div className="mental-health-expert-register-info name">
              <label htmlFor="mental-health-expert-first-name">
                First name:
              </label>
              <input
                name="mental-health-expert-first-name"
                type="text"
                placeholder="Enter your first name: "
              ></input>
            </div>

            <div className="mental-health-expert-register-info last-name">
              <label htmlFor="mental-health-expert-last-name">Last name:</label>
              <input
                name="mental-health-expert-last-name"
                type="text"
                placeholder="Enter your last name: "
              ></input>
            </div>

            <div className="mental-health-expert-register-info organization">
              <label htmlFor="mental-health-expert-organization">
                Organization:
              </label>
              <input
                name="mental-health-expert-organization"
                type="text"
                placeholder="Enter your organization: "
              ></input>
            </div>

            <div className="mental-health-expert-register-info phone-number">
              <label htmlFor="mental-health-expert-phone-number">
                Phone number:
              </label>
              <input
                name="mental-health-expert-phone-number"
                type="text"
                placeholder="Enter your phone number: "
              ></input>
            </div>

            <div className="mental-health-expert-register-info email">
              <label htmlFor="mental-health-expert-email">Email:</label>
              <input
                name="mental-health-expert-email"
                type="email"
                placeholder="Enter your email: "
              ></input>
            </div>

            <div className="mental-health-expert-register-info photo">
              <label htmlFor="mental-health-expert-photo">Photo:</label>
              <input name="mental-health-expert-photo" type="file"></input>
            </div>
          </div>
        )}

        <button type="submit">Register</button>
      </form>
    </section>
  );
};
