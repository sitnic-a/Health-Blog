import { useDispatch, useSelector } from "react-redux";
import * as signalR from "@microsoft/signalr";
import { getNewRegisteredExperts } from "../../../redux-toolkit/features/adminSlice";
import { application } from "../../../../application";
import { RequestNewExperts } from "./RequestNewExperts";
import { toast } from "react-toastify";

export const Requests = () => {
  let dispatch = useDispatch();

  var connection = new signalR.HubConnectionBuilder()
    .withUrl(`${application.application_url}/rt-new-request`, {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
    })
    .build();

  connection.on("GetNewRegisteredMentalHealthExperts", () => {
    dispatch(getNewRegisteredExperts()).then((data) => {
      let statusCode = data?.payload?.StatusCode;
      if (statusCode !== 200) {
        if (statusCode === 404) {
          toast.error("Users not fetched properly!", {
            position: "bottom-right",
          });
          return;
        }
      }
    });
  });

  connection.start().catch((e) => {
    console.log("Fetched error ", e);
  });

  return (
    <div className="requests-main-container">
      <RequestNewExperts />
    </div>
  );
};
