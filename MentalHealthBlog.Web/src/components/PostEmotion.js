import React from 'react'

export const PostEmotion = (props) => {
  let emotionType = props.emotionType
  let emotion = props.emotion
  return (
    <div
      className={`post-container-emotion emotion-${emotionType}`}
      key={emotion.id}
    >
      {emotion.name}
      <span className="post-container-emotion-id">{emotion.id}</span>
    </div>
  )
}
