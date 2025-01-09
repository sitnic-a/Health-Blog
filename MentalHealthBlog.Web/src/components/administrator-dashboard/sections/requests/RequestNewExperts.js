import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getNewRegisteredExperts } from "../../../redux-toolkit/features/adminSlice";

export const RequestNewExperts = () => {
  let dispatch = useDispatch();
  let {
    newlyRegisteredMentalHealthExperts,
    numberOfNewlyRegisteredMentalHealthExperts,
  } = useSelector((store) => store.admin);

  useEffect(() => {
    dispatch(getNewRegisteredExperts());
  }, []);

  return (
    newlyRegisteredMentalHealthExperts && (
      <Link
        to={"/requests/new-experts"}
        className="request-link new-mental-health-expert-request-link"
      >
        {numberOfNewlyRegisteredMentalHealthExperts && (
          <span className="new-mental-health-expert-request-container-notification">
            {numberOfNewlyRegisteredMentalHealthExperts}
          </span>
        )}

        <div className="new-mental-health-expert-request-container">
          <p className="new-mental-health-expert-request-container-label">
            Mental Health Experts
          </p>
          <p className="new-mental-health-expert-request-container-info">
            Newly registered:
            {numberOfNewlyRegisteredMentalHealthExperts && (
              <span className="new-mental-health-expert-request-container-number-of-registered">
                {numberOfNewlyRegisteredMentalHealthExperts}
              </span>
            )}
          </p>
        </div>
      </Link>
    )
  );
};
