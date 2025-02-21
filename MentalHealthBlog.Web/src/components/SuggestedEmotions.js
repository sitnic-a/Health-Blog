import React from "react";
import { useSelector } from "react-redux";
import { SuggestedEmotion } from "./SuggestedEmotion";

export const SuggestedEmotions = () => {
  let { suggestedEmotions } = useSelector((store) => store.emotion);

  return (
    suggestedEmotions.length > 0 && (
      <div className="add-post-suggested-emotions-container">
        {suggestedEmotions.map((emotion) => {
          if (emotion.name.includes("Bad")) {
            return (
              <SuggestedEmotion
                key={emotion.id}
                emotionType="bad"
                emotion={emotion}
              />
            );
          } else if (emotion.name.includes("Happy")) {
            return (
              <SuggestedEmotion
                key={emotion.id}
                emotionType="happy"
                emotion={emotion}
              />
            );
          } else if (emotion.name.includes("Surprised")) {
            return (
              <SuggestedEmotion
                key={emotion.id}
                emotionType="surprised"
                emotion={emotion}
              />
            );
          } else if (emotion.name.includes("Angry")) {
            return (
              <SuggestedEmotion
                key={emotion.id}
                emotionType="angry"
                emotion={emotion}
              />
            );
          } else if (emotion.name.includes("Sad")) {
            return (
              <SuggestedEmotion
                key={emotion.id}
                emotionType="sad"
                emotion={emotion}
              />
            );
          } else if (emotion.name.includes("Disgusted")) {
            return (
              <SuggestedEmotion
                key={emotion.id}
                emotionType="disgusted"
                emotion={emotion}
              />
            );
          } else if (emotion.name.includes("Fearful")) {
            return (
              <SuggestedEmotion
                key={emotion.id}
                emotionType="fearful"
                emotion={emotion}
              />
            );
          }
        })}
      </div>
    )
  );
};
