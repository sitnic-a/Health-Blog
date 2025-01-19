import { useEffect, useState } from "react";
import { getDbRoles } from "../../../redux-toolkit/features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { getDbUsers } from "../../../redux-toolkit/features/adminSlice";

export const ManageUsers = () => {
  let dispatch = useDispatch();
  let { dbRoles } = useSelector((store) => store.user);
  let { dbUsers } = useSelector((store) => store.admin);

  useEffect(() => {
    dispatch(getDbRoles());
    dispatch(getDbUsers({}));
  }, []);

  return (
    <div className="main-manage-users-container">
      <div className="manage-users-header">
        <h2>Manage users</h2>
        <h3>Filter</h3>
      </div>
      <div className="manage-users-filter-container">
        <div className="manage-users-filter select-role-filter-main-container">
          {dbRoles.length > 0 && (
            <div className="manage-users-select-filter">
              <span>Role:</span>
              <select
                className="manage-users-select-role-filter"
                name="manage-users-role"
                id="manage-users-select-role-filter"
                onChange={(e) => {
                  let __MENTAL_HEALTH_EXPERT_ROLE__ = 4;
                  let inputFilterMainContainer = document.querySelector(
                    ".input-filter-main-container"
                  );
                  if (
                    parseInt(e.target.value) === __MENTAL_HEALTH_EXPERT_ROLE__
                  ) {
                    inputFilterMainContainer.style.display = "block";
                    return;
                  }
                  inputFilterMainContainer.style.display = "none";
                }}
              >
                <option value={0}>Choose option</option>
                {dbRoles.map((role) => {
                  return (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>
        <div className="manage-users-filter input-filter-main-container">
          <span>Name/surname/organization: </span>
          <input
            name="manage-users-name-input-filter"
            className="manage-users-name-input-filter"
            type="text"
            placeholder="Enter search condition"
          />
        </div>
        <div className="manage-users-action filter-action">
          <button
            type="button"
            onClick={() => {
              let selectedRoleId = document.getElementById(
                "manage-users-select-role-filter"
              ).value;
              let searchCondition = document.querySelector(
                "input[name='manage-users-name-input-filter'"
              ).value;

              var query = {
                role: parseInt(selectedRoleId),
                searchCondition,
              };
              dispatch(getDbUsers(query));
            }}
          >
            Search
          </button>
        </div>
      </div>

      <div className="manage-users-users-list-main-container"></div>
    </div>
  );
};
