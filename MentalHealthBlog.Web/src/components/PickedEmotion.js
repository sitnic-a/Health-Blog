import React from 'react'

export const PickedEmotion = (props) => {
  let emotionType = props.emotionType
  let emotion = props.emotion
  return (
    <div
      className={`add-post-picked-emotion-container emotion-${emotionType}`}
      key={emotion.id}
    >
      {emotion.name}
    </div>
  )
}
