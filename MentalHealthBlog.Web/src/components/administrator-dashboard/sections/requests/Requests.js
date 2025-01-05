import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNewRegisteredExperts } from "../../../redux-toolkit/features/adminSlice";

import { Link } from "react-router-dom";
export const Requests = () => {
  let dispatch = useDispatch();
  let { numberOfNewlyRegisteredMentalHealthExperts } = useSelector(
    (store) => store.admin
  );

  useEffect(() => {
    dispatch(getNewRegisteredExperts());
  }, []);

  return (
    <div className="requests-main-container">
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
    </div>
  );
};
