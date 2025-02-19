import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPickedEmotions,
  setSuggestedEmotions,
} from "./redux-toolkit/features/emotionSlice";

import { IoIosCheckmarkCircleOutline } from "react-icons/io";

export const EmotionsOnPostCreation = () => {
  let dispatch = useDispatch();
  let pickedEmotionsFromList = [];

  let { dbEmotions, suggestedEmotions, pickedEmotions } = useSelector(
    (store) => store.emotion
  );
  return (
    <>
      <div className="add-post-emotions-container">
        <label>Emotions</label>
        <br />

        {pickedEmotions.length > 0 && (
          <div
            className="add-post-picked-emotions-container"
            style={{ marginBlock: "0.8rem" }}
          >
            {pickedEmotions.map((emotion) => {
              if (emotion.name.includes("Bad")) {
                return (
                  <div
                    className="add-post-picked-emotion-container"
                    style={{
                      background: "red",
                    }}
                    key={emotion.id}
                  >
                    {emotion.name}
                  </div>
                );
              } else if (emotion.name.includes("Happy")) {
                return (
                  <div
                    className="add-post-picked-emotion-container"
                    style={{
                      background: "green",
                    }}
                    key={emotion.id}
                  >
                    {emotion.name}
                  </div>
                );
              } else if (emotion.name.includes("Surprised")) {
                return (
                  <div
                    className="add-post-picked-emotion-container"
                    style={{
                      background: "lightblue",
                    }}
                    key={emotion.id}
                  >
                    {emotion.name}
                  </div>
                );
              } else if (emotion.name.includes("Angry")) {
                return (
                  <div
                    className="add-post-picked-emotion-container"
                    style={{
                      background: "orange",
                    }}
                    key={emotion.id}
                  >
                    {emotion.name}
                  </div>
                );
              } else if (emotion.name.includes("Sad")) {
                return (
                  <div
                    className="add-post-picked-emotion-container"
                    style={{
                      background: "lightpink",
                    }}
                    key={emotion.id}
                  >
                    {emotion.name}
                  </div>
                );
              } else if (emotion.name.includes("Disgusted")) {
                return (
                  <div
                    className="add-post-picked-emotion-container"
                    style={{
                      background: "limegreen",
                    }}
                    key={emotion.id}
                  >
                    {emotion.name}
                  </div>
                );
              } else if (emotion.name.includes("Fearful")) {
                return (
                  <div
                    className="add-post-picked-emotion-container"
                    style={{
                      background: "yellow",
                    }}
                    key={emotion.id}
                  >
                    {emotion.name}
                  </div>
                );
              }
            })}
          </div>
        )}

        <input
          type="text"
          onFocus={() => {
            if (suggestedEmotions.length <= 0) {
              dispatch(setSuggestedEmotions(dbEmotions));
            }
          }}
          onKeyUp={(e) => {
            console.log("Suggested emotions ", suggestedEmotions);

            let dbEmotionsCopy = [...dbEmotions];

            if (e.target.value === "") {
              console.log("Emotion copy ", dbEmotionsCopy);
              dispatch(setSuggestedEmotions(dbEmotionsCopy));
              return;
            }

            let suggestedEmotionsFromList = [...dbEmotionsCopy].filter(
              (emotion) => emotion.name.includes(e.target.value)
            );
            dispatch(setSuggestedEmotions(suggestedEmotionsFromList));
          }}
        />
      </div>

      {suggestedEmotions.length > 0 && (
        <div className="add-post-suggested-emotions-container">
          {suggestedEmotions.map((emotion) => {
            if (emotion.name.includes("Bad")) {
              return (
                <div
                  key={emotion.id}
                  className="add-post-suggested-emotion-container suggested-emotion-bad"
                  data-emotion-id={emotion.id}
                  onClick={(e) => {
                    let pickedEmotion = {
                      id: emotion.id,
                      name: emotion.name,
                    };

                    let emotionContainer = e.currentTarget;
                    let emotionMarker = emotionContainer.firstChild;
                    let emotionContainerId = emotionContainer.dataset.emotionId;

                    if (
                      pickedEmotions.some(
                        (emotion) => emotion.name === pickedEmotion.name
                      )
                    ) {
                      emotionContainer.classList.remove(
                        "add-post-suggested-emotion-container-checked"
                      );
                      emotionMarker.classList.remove("emotion-marker-checked");

                      emotionContainer.classList.add("suggested-emotion-bad");
                      emotionMarker.classList.add("emotion-marker-unchecked");
                      let pickedEmotionsFromList = [...pickedEmotions].filter(
                        (emotion) => emotion.name !== pickedEmotion.name
                      );
                      dispatch(setPickedEmotions(pickedEmotionsFromList));
                      return;
                    }
                    pickedEmotionsFromList = [...pickedEmotions, pickedEmotion];
                    dispatch(setPickedEmotions(pickedEmotionsFromList));

                    if (parseInt(emotionContainerId) === emotion.id) {
                      if (
                        emotionContainer.classList.contains(
                          "suggested-emotion-bad"
                        )
                      ) {
                        emotionContainer.classList.remove(
                          "suggested-emotion-bad"
                        );
                        emotionMarker.classList.remove(
                          "emotion-marker-unchecked"
                        );

                        emotionContainer.classList.add(
                          "add-post-suggested-emotion-container-checked"
                        );
                        emotionMarker.classList.add("emotion-marker-checked");
                      }
                    }
                  }}
                >
                  <IoIosCheckmarkCircleOutline
                    id={emotion.id}
                    className="add-post-suggested-emotion-marker emotion-marker-unchecked"
                  />
                  {emotion.name}
                </div>
              );
            } else if (emotion.name.includes("Happy")) {
              return (
                <div
                  key={emotion.id}
                  className="add-post-suggested-emotion-container suggested-emotion-happy"
                  data-emotion-id={emotion.id}
                  onClick={(e) => {
                    let pickedEmotion = {
                      id: emotion.id,
                      name: emotion.name,
                    };
                    let emotionContainer = e.currentTarget;
                    let emotionMarker = emotionContainer.firstChild;
                    let emotionContainerId = emotionContainer.dataset.emotionId;

                    if (
                      pickedEmotions.some(
                        (emotion) => emotion.name === pickedEmotion.name
                      )
                    ) {
                      emotionContainer.classList.remove(
                        "add-post-suggested-emotion-container-checked"
                      );
                      emotionMarker.classList.remove("emotion-marker-checked");

                      emotionContainer.classList.add("suggested-emotion-happy");
                      emotionMarker.classList.add("emotion-marker-unchecked");
                      let pickedEmotionsFromList = [...pickedEmotions].filter(
                        (emotion) => emotion.name !== pickedEmotion.name
                      );
                      dispatch(setPickedEmotions(pickedEmotionsFromList));
                      return;
                    }
                    pickedEmotionsFromList = [...pickedEmotions, pickedEmotion];
                    dispatch(setPickedEmotions(pickedEmotionsFromList));

                    if (parseInt(emotionContainerId) === emotion.id) {
                      if (
                        emotionContainer.classList.contains(
                          "suggested-emotion-happy"
                        )
                      ) {
                        emotionContainer.classList.remove(
                          "suggested-emotion-happy"
                        );
                        emotionMarker.classList.remove(
                          "emotion-marker-unchecked"
                        );

                        emotionContainer.classList.add(
                          "add-post-suggested-emotion-container-checked"
                        );
                        emotionMarker.classList.add("emotion-marker-checked");
                      }
                    }
                  }}
                >
                  <IoIosCheckmarkCircleOutline
                    id={emotion.id}
                    className="add-post-suggested-emotion-marker emotion-marker-unchecked"
                  />
                  {emotion.name}
                </div>
              );
            } else if (emotion.name.includes("Surprised")) {
              return (
                <div
                  key={emotion.id}
                  className="add-post-suggested-emotion-container suggested-emotion-surprised"
                  data-emotion-id={emotion.id}
                  onClick={(e) => {
                    let pickedEmotion = {
                      id: emotion.id,
                      name: emotion.name,
                    };
                    let emotionContainer = e.currentTarget;
                    let emotionMarker = emotionContainer.firstChild;
                    let emotionContainerId = emotionContainer.dataset.emotionId;

                    if (
                      pickedEmotions.some(
                        (emotion) => emotion.name === pickedEmotion.name
                      )
                    ) {
                      emotionContainer.classList.remove(
                        "add-post-suggested-emotion-container-checked"
                      );
                      emotionMarker.classList.remove("emotion-marker-checked");

                      emotionContainer.classList.add(
                        "suggested-emotion-surprised"
                      );
                      emotionMarker.classList.add("emotion-marker-unchecked");
                      let pickedEmotionsFromList = [...pickedEmotions].filter(
                        (emotion) => emotion.name !== pickedEmotion.name
                      );
                      dispatch(setPickedEmotions(pickedEmotionsFromList));
                      return;
                    }
                    pickedEmotionsFromList = [...pickedEmotions, pickedEmotion];
                    dispatch(setPickedEmotions(pickedEmotionsFromList));

                    if (parseInt(emotionContainerId) === emotion.id) {
                      if (
                        emotionContainer.classList.contains(
                          "suggested-emotion-surprised"
                        )
                      ) {
                        emotionContainer.classList.remove(
                          "suggested-emotion-surprised"
                        );
                        emotionMarker.classList.remove(
                          "emotion-marker-unchecked"
                        );

                        emotionContainer.classList.add(
                          "add-post-suggested-emotion-container-checked"
                        );
                        emotionMarker.classList.add("emotion-marker-checked");
                      }
                    }
                  }}
                >
                  <IoIosCheckmarkCircleOutline
                    id={emotion.id}
                    className="add-post-suggested-emotion-marker emotion-marker-unchecked"
                  />
                  {emotion.name}
                </div>
              );
            } else if (emotion.name.includes("Angry")) {
              return (
                <div
                  key={emotion.id}
                  className="add-post-suggested-emotion-container suggested-emotion-angry"
                  data-emotion-id={emotion.id}
                  onClick={(e) => {
                    let pickedEmotion = {
                      id: emotion.id,
                      name: emotion.name,
                    };
                    let emotionContainer = e.currentTarget;
                    let emotionMarker = emotionContainer.firstChild;
                    let emotionContainerId = emotionContainer.dataset.emotionId;

                    if (
                      pickedEmotions.some(
                        (emotion) => emotion.name === pickedEmotion.name
                      )
                    ) {
                      emotionContainer.classList.remove(
                        "add-post-suggested-emotion-container-checked"
                      );
                      emotionMarker.classList.remove("emotion-marker-checked");

                      emotionContainer.classList.add("suggested-emotion-angry");
                      emotionMarker.classList.add("emotion-marker-unchecked");
                      let pickedEmotionsFromList = [...pickedEmotions].filter(
                        (emotion) => emotion.name !== pickedEmotion.name
                      );
                      dispatch(setPickedEmotions(pickedEmotionsFromList));
                      return;
                    }
                    pickedEmotionsFromList = [...pickedEmotions, pickedEmotion];
                    dispatch(setPickedEmotions(pickedEmotionsFromList));

                    if (parseInt(emotionContainerId) === emotion.id) {
                      if (
                        emotionContainer.classList.contains(
                          "suggested-emotion-angry"
                        )
                      ) {
                        emotionContainer.classList.remove(
                          "suggested-emotion-angry"
                        );
                        emotionMarker.classList.remove(
                          "emotion-marker-unchecked"
                        );

                        emotionContainer.classList.add(
                          "add-post-suggested-emotion-container-checked"
                        );
                        emotionMarker.classList.add("emotion-marker-checked");
                      }
                    }
                  }}
                >
                  <IoIosCheckmarkCircleOutline
                    id={emotion.id}
                    className="add-post-suggested-emotion-marker emotion-marker-unchecked"
                  />
                  {emotion.name}
                </div>
              );
            } else if (emotion.name.includes("Sad")) {
              return (
                <div
                  key={emotion.id}
                  className="add-post-suggested-emotion-container suggested-emotion-sad"
                  data-emotion-id={emotion.id}
                  onClick={(e) => {
                    let pickedEmotion = {
                      id: emotion.id,
                      name: emotion.name,
                    };
                    let emotionContainer = e.currentTarget;
                    let emotionMarker = emotionContainer.firstChild;
                    let emotionContainerId = emotionContainer.dataset.emotionId;

                    if (
                      pickedEmotions.some(
                        (emotion) => emotion.name === pickedEmotion.name
                      )
                    ) {
                      emotionContainer.classList.remove(
                        "add-post-suggested-emotion-container-checked"
                      );
                      emotionMarker.classList.remove("emotion-marker-checked");

                      emotionContainer.classList.add("suggested-emotion-sad");
                      emotionMarker.classList.add("emotion-marker-unchecked");
                      let pickedEmotionsFromList = [...pickedEmotions].filter(
                        (emotion) => emotion.name !== pickedEmotion.name
                      );
                      dispatch(setPickedEmotions(pickedEmotionsFromList));
                      return;
                    }
                    pickedEmotionsFromList = [...pickedEmotions, pickedEmotion];
                    dispatch(setPickedEmotions(pickedEmotionsFromList));

                    if (parseInt(emotionContainerId) === emotion.id) {
                      if (
                        emotionContainer.classList.contains(
                          "suggested-emotion-sad"
                        )
                      ) {
                        emotionContainer.classList.remove(
                          "suggested-emotion-sad"
                        );
                        emotionMarker.classList.remove(
                          "emotion-marker-unchecked"
                        );

                        emotionContainer.classList.add(
                          "add-post-suggested-emotion-container-checked"
                        );
                        emotionMarker.classList.add("emotion-marker-checked");
                      }
                    }
                  }}
                >
                  <IoIosCheckmarkCircleOutline
                    id={emotion.id}
                    className="add-post-suggested-emotion-marker emotion-marker-unchecked"
                  />
                  {emotion.name}
                </div>
              );
            } else if (emotion.name.includes("Disgusted")) {
              return (
                <div
                  key={emotion.id}
                  className="add-post-suggested-emotion-container suggested-emotion-disgusted"
                  data-emotion-id={emotion.id}
                  onClick={(e) => {
                    let pickedEmotion = {
                      id: emotion.id,
                      name: emotion.name,
                    };
                    let emotionContainer = e.currentTarget;
                    let emotionMarker = emotionContainer.firstChild;
                    let emotionContainerId = emotionContainer.dataset.emotionId;

                    if (
                      pickedEmotions.some(
                        (emotion) => emotion.name === pickedEmotion.name
                      )
                    ) {
                      emotionContainer.classList.remove(
                        "add-post-suggested-emotion-container-checked"
                      );
                      emotionMarker.classList.remove("emotion-marker-checked");

                      emotionContainer.classList.add(
                        "suggested-emotion-disgusted"
                      );
                      emotionMarker.classList.add("emotion-marker-unchecked");
                      let pickedEmotionsFromList = [...pickedEmotions].filter(
                        (emotion) => emotion.name !== pickedEmotion.name
                      );
                      dispatch(setPickedEmotions(pickedEmotionsFromList));
                      return;
                    }
                    pickedEmotionsFromList = [...pickedEmotions, pickedEmotion];
                    dispatch(setPickedEmotions(pickedEmotionsFromList));

                    if (parseInt(emotionContainerId) === emotion.id) {
                      if (
                        emotionContainer.classList.contains(
                          "suggested-emotion-disgusted"
                        )
                      ) {
                        emotionContainer.classList.remove(
                          "suggested-emotion-disgusted"
                        );
                        emotionMarker.classList.remove(
                          "emotion-marker-unchecked"
                        );

                        emotionContainer.classList.add(
                          "add-post-suggested-emotion-container-checked"
                        );
                        emotionMarker.classList.add("emotion-marker-checked");
                      }
                    }
                  }}
                >
                  <IoIosCheckmarkCircleOutline
                    id={emotion.id}
                    className="add-post-suggested-emotion-marker emotion-marker-unchecked"
                  />
                  {emotion.name}
                </div>
              );
            } else if (emotion.name.includes("Fearful")) {
              return (
                <div
                  key={emotion.id}
                  className="add-post-suggested-emotion-container suggested-emotion-fearful"
                  data-emotion-id={emotion.id}
                  onClick={(e) => {
                    let pickedEmotion = {
                      id: emotion.id,
                      name: emotion.name,
                    };
                    let emotionContainer = e.currentTarget;
                    let emotionMarker = emotionContainer.firstChild;
                    let emotionContainerId = emotionContainer.dataset.emotionId;

                    if (
                      pickedEmotions.some(
                        (emotion) => emotion.name === pickedEmotion.name
                      )
                    ) {
                      emotionContainer.classList.remove(
                        "add-post-suggested-emotion-container-checked"
                      );
                      emotionMarker.classList.remove("emotion-marker-checked");

                      emotionContainer.classList.add(
                        "suggested-emotion-fearful"
                      );
                      emotionMarker.classList.add("emotion-marker-unchecked");
                      let pickedEmotionsFromList = [...pickedEmotions].filter(
                        (emotion) => emotion.name !== pickedEmotion.name
                      );
                      dispatch(setPickedEmotions(pickedEmotionsFromList));
                      return;
                    }
                    pickedEmotionsFromList = [...pickedEmotions, pickedEmotion];
                    dispatch(setPickedEmotions(pickedEmotionsFromList));

                    if (parseInt(emotionContainerId) === emotion.id) {
                      if (
                        emotionContainer.classList.contains(
                          "suggested-emotion-fearful"
                        )
                      ) {
                        emotionContainer.classList.remove(
                          "suggested-emotion-fearful"
                        );
                        emotionMarker.classList.remove(
                          "emotion-marker-unchecked"
                        );

                        emotionContainer.classList.add(
                          "add-post-suggested-emotion-container-checked"
                        );
                        emotionMarker.classList.add("emotion-marker-checked");
                      }
                    }
                  }}
                >
                  <IoIosCheckmarkCircleOutline
                    id={emotion.id}
                    className="add-post-suggested-emotion-marker emotion-marker-unchecked"
                  />
                  {emotion.name}
                </div>
              );
            }
          })}
        </div>
      )}
    </>
  );
};
