import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPickedEmotions } from "./redux-toolkit/features/emotionSlice";

import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import {
  deselectEmotion,
  selectEmotion,
} from "./utils/helper-methods/addPostSuggestedEmotionsMethods";

export const SuggestedEmotion = (props) => {
  let dispatch = useDispatch();
  let { pickedEmotions } = useSelector((store) => store.emotion);

  let emotionType = props.emotionType;
  let emotion = props.emotion;
  let pickedEmotionsFromList = [];

  let emotionIsAlreadyPicked = pickedEmotions.some(
    (pickedEmotion) => pickedEmotion.name === emotion.name
  );

  return (
    <div
      className={`add-post-suggested-emotion-container ${
        emotionIsAlreadyPicked === false
          ? `suggested-emotion-${emotionType}`
          : `add-post-suggested-emotion-container-checked`
      } `}
      data-emotion-id={emotion.id}
      onClick={(e) => {
        let pickedEmotion = {
          id: emotion.id,
          name: emotion.name,
        };

        let emotionContainer = e.currentTarget;
        let emotionMarker = emotionContainer.firstChild;
        let emotionContainerId = emotionContainer.dataset.emotionId;

        if (emotionIsAlreadyPicked) {
          deselectEmotion(emotionContainer, emotionMarker, emotionType);

          let pickedEmotionsFromList = [...pickedEmotions].filter(
            (emotion) => emotion.name !== pickedEmotion.name
          );
          dispatch(setPickedEmotions(pickedEmotionsFromList));
          return;
        }

        pickedEmotionsFromList = [...pickedEmotions, pickedEmotion];
        dispatch(setPickedEmotions(pickedEmotionsFromList));

        if (parseInt(emotionContainerId) === emotion.id) {
          let isSelected = emotionContainer.classList.contains(
            `suggested-emotion-${emotionType}`
          );
          if (isSelected) {
            selectEmotion(emotionContainer, emotionMarker, emotionType);
            return;
          }
        }
      }}
    >
      <IoIosCheckmarkCircleOutline
        id={emotion.id}
        className={`add-post-suggested-emotion-marker ${
          emotionIsAlreadyPicked
            ? `emotion-marker-checked`
            : "emotion-marker-unchecked"
        }`}
      />
      {emotion.name}
    </div>
  );
};
