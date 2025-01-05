import useFetchLocationState from "../../../custom/hooks/useFetchLocationState";

import { NewMentalHealthExpertProfile } from "./NewMentalHealthExpertProfile";
export const NewExperts = () => {
  let { newlyRegisteredMentalHealthExperts } = useFetchLocationState();
  console.log(newlyRegisteredMentalHealthExperts);

  return (
    newlyRegisteredMentalHealthExperts && (
      <div className="new-experts-main-container">
        {newlyRegisteredMentalHealthExperts.map((expert) => {
          return (
            <NewMentalHealthExpertProfile key={expert.id} expert={expert} />
          );
        })}
        {/* Service, controller for printing not approved experts */}
        {/* Real-time update of new registered experts - SignalR */}
        {/* Display all not approved experts with two actions - approve and reject */}
        {/* Admin slice for cleaner code and better manipulation */}
        {/* Create component to print mental health expert */}
      </div>
    )
  );
};
