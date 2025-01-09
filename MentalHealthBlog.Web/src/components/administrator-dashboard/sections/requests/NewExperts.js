import { useSelector } from "react-redux";

import { NewMentalHealthExpertProfile } from "./NewMentalHealthExpertProfile";
export const NewExperts = () => {
  let { newlyRegisteredMentalHealthExperts } = useSelector(
    (store) => store.admin
  );
  console.log(newlyRegisteredMentalHealthExperts);

  return (
    <>
      {newlyRegisteredMentalHealthExperts && (
        <div className="new-experts-main-container">
          {newlyRegisteredMentalHealthExperts.map((expert) => {
            return (
              <NewMentalHealthExpertProfile key={expert.id} expert={expert} />
            );
          })}
        </div>
      )}
    </>
  );
};
