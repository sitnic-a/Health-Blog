import { useSelector } from 'react-redux'
import { AddPostSuggestedEmotion } from '../AddPostSuggestedEmotion/AddPostSuggestedEmotion'

import AddPostSuggestedEmotionsCSS from './AddPostSuggestedEmotions.css'

export const AddPostSuggestedEmotions = () => {
  let { suggestedEmotions } = useSelector((store) => store.emotion)

  return (
    suggestedEmotions.length > 0 && (
      <div className="add-post-suggested-emotions-container">
        {suggestedEmotions.map((emotion) => {
          if (emotion.name.includes('Bad')) {
            return (
              <AddPostSuggestedEmotion
                key={emotion.id}
                emotionType="bad"
                emotion={emotion}
              />
            )
          } else if (emotion.name.includes('Happy')) {
            return (
              <AddPostSuggestedEmotion
                key={emotion.id}
                emotionType="happy"
                emotion={emotion}
              />
            )
          } else if (emotion.name.includes('Surprised')) {
            return (
              <AddPostSuggestedEmotion
                key={emotion.id}
                emotionType="surprised"
                emotion={emotion}
              />
            )
          } else if (emotion.name.includes('Angry')) {
            return (
              <AddPostSuggestedEmotion
                key={emotion.id}
                emotionType="angry"
                emotion={emotion}
              />
            )
          } else if (emotion.name.includes('Sad')) {
            return (
              <AddPostSuggestedEmotion
                key={emotion.id}
                emotionType="sad"
                emotion={emotion}
              />
            )
          } else if (emotion.name.includes('Disgusted')) {
            return (
              <AddPostSuggestedEmotion
                key={emotion.id}
                emotionType="disgusted"
                emotion={emotion}
              />
            )
          } else if (emotion.name.includes('Fearful')) {
            return (
              <AddPostSuggestedEmotion
                key={emotion.id}
                emotionType="fearful"
                emotion={emotion}
              />
            )
          }
        })}
      </div>
    )
  )
}
