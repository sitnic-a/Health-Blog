import { useDispatch, useSelector } from 'react-redux'
import { setPickedEmotions } from '../../redux-toolkit/features/emotionSlice'

import { AddPostPickedEmotion } from '../AddPostPickedEmotion/AddPostPickedEmotion'
import { CiTrash } from 'react-icons/ci'

import AddPostPickedEmotionsCSS from './AddPostPickedEmotions.css'

export const AddPostPickedEmotions = () => {
  let dispatch = useDispatch()
  let { pickedEmotions } = useSelector((store) => store.emotion)

  return (
    pickedEmotions.length > 0 && (
      <div className="add-post-picked-emotions-container">
        <CiTrash
          className="add-post-picked-emotions-unpick-all-emotions-button"
          onClick={() => {
            dispatch(setPickedEmotions([]))
          }}
        />
        {pickedEmotions.map((emotion) => {
          if (emotion.name.includes('Bad')) {
            return (
              <AddPostPickedEmotion
                key={emotion.id}
                emotionType="bad"
                emotion={emotion}
              />
            )
          } else if (emotion.name.includes('Happy')) {
            return (
              <AddPostPickedEmotion
                key={emotion.id}
                emotionType="happy"
                emotion={emotion}
              />
            )
          } else if (emotion.name.includes('Surprised')) {
            return (
              <AddPostPickedEmotion
                key={emotion.id}
                emotionType="surprised"
                emotion={emotion}
              />
            )
          } else if (emotion.name.includes('Angry')) {
            return (
              <AddPostPickedEmotion
                key={emotion.id}
                emotionType="angry"
                emotion={emotion}
              />
            )
          } else if (emotion.name.includes('Sad')) {
            return (
              <AddPostPickedEmotion
                key={emotion.id}
                emotionType="sad"
                emotion={emotion}
              />
            )
          } else if (emotion.name.includes('Disgusted')) {
            return (
              <AddPostPickedEmotion
                key={emotion.id}
                emotionType="disgusted"
                emotion={emotion}
              />
            )
          } else if (emotion.name.includes('Fearful')) {
            return (
              <AddPostPickedEmotion
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
