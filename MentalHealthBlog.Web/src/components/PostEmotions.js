import React from 'react'
import { PostEmotion } from './PostEmotion'

export const PostEmotions = (props) => {
  let emotions = props.post.emotions

  return (
    <div className="post-container-main-emotions">
      <div className="post-container-emotions">
        {emotions.map((emotion) => {
          if (emotion.name.includes('Bad')) {
            return (
              <PostEmotion
                key={emotion.id}
                emotionType="bad"
                emotion={emotion}
              />
            )
          } else if (emotion.name.includes('Happy')) {
            return (
              <PostEmotion
                key={emotion.id}
                emotionType="happy"
                emotion={emotion}
              />
            )
          } else if (emotion.name.includes('Surprised')) {
            return (
              <PostEmotion
                key={emotion.id}
                emotionType="surprised"
                emotion={emotion}
              />
            )
          } else if (emotion.name.includes('Angry')) {
            return (
              <PostEmotion
                key={emotion.id}
                emotionType="angry"
                emotion={emotion}
              />
            )
          } else if (emotion.name.includes('Sad')) {
            return (
              <PostEmotion
                key={emotion.id}
                emotionType="sad"
                emotion={emotion}
              />
            )
          } else if (emotion.name.includes('Disgusted')) {
            return (
              <PostEmotion
                key={emotion.id}
                emotionType="disgusted"
                emotion={emotion}
              />
            )
          } else if (emotion.name.includes('Fearful')) {
            return (
              <PostEmotion
                key={emotion.id}
                emotionType="fearful"
                emotion={emotion}
              />
            )
          }
        })}
      </div>
    </div>
  )
}
