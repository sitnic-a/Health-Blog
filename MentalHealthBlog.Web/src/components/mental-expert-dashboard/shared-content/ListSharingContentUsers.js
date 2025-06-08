import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOnlyUsersThatSharedContent,
  getSharedContentOfPickedUser,
  getSharesPerUser,
  setOverlayPost,
} from "../../redux-toolkit/features/mentalExpertSlice";
import { expandShrinkSidebar } from "../../utils/helper-methods/methods";

import { BiExpandAlt } from "react-icons/bi";
import { getUserById } from "../../redux-toolkit/features/userSlice";
import { toast } from "react-toastify";

export const ListSharingContentUsers = () => {
  let dispatch = useDispatch();
  let { authenticatedUser } = useSelector((store) => store.user);

  let { usersThatSharedIncludingItsContent, usersThatSharedContent } =
    useSelector((store) => store.mentalExpert);

  let objectWithData = {
    query: {
      loggedExpertId: authenticatedUser.id,
    },
    authenticatedUser,
  };

  useEffect(() => {
    dispatch(getSharesPerUser(objectWithData)).then((data) => {
      let statusCode = data?.payload?.StatusCode;

      if (statusCode !== 200) {
        if (statusCode === 400) {
          toast.error("Fetching shares wasn't possible!", {
            position: "bottom-right",
          });
          return;
        }
        if (statusCode === 404) {
          toast.error("Couldn't fetch shares properly!", {
            position: "bottom-right",
          });
          return;
        }
      }
      console.log("Data ", data.payload);

      if (data?.payload.serviceResponseObject?.length === 0) {
        toast.warning("Nothing shared so far!", {
          position: "bottom-right",
        });
      }

      if (data?.payload.serviceResponseObject?.length > 0) {
        toast.success("Succesfully retrieved content!", {
          position: "bottom-right",
        });
      }

      dispatch(getOnlyUsersThatSharedContent(data));
    });
  }, []);

  return (
    <section className="sharing-users-main-users-container">
      <div className="sharing-users-expander-action">
        <span
          className="sharing-users-expander-icon"
          onClick={() => {
            expandShrinkSidebar();
          }}
        >
          <BiExpandAlt />
        </span>
      </div>
      <div className="sharing-users-users-container">
        {usersThatSharedContent.length > 0 &&
          usersThatSharedContent.map((user) => {
            return (
              <div
                className="sharing-user-user-container"
                key={user.id}
                onClick={() => {
                  if (window.screen.width <= 550) {
                    expandShrinkSidebar();
                    let contentAndQuery = {
                      userId: user.id,
                      usersThatSharedIncludingItsContent,
                    };
                    dispatch(getSharedContentOfPickedUser(contentAndQuery));
                    dispatch(setOverlayPost(null));
                    dispatch(getUserById(user.id));
                  }
                  let contentAndQuery = {
                    userId: user.id,
                    usersThatSharedIncludingItsContent,
                  };
                  dispatch(getSharedContentOfPickedUser(contentAndQuery));
                  dispatch(setOverlayPost(null));
                  dispatch(getUserById(user.id));
                }}
              >
                <span className="sharing-user-title">{user.username}</span>
              </div>
            );
          })}
      </div>
    </section>
  );
};
