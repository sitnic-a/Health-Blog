import { useDispatch, useSelector } from 'react-redux'
import { setPickedEmotions } from '../../redux-toolkit/features/emotionSlice'

import AddPostPickedEmotionCSS from './AddPostPickedEmotion.css'

export const AddPostPickedEmotion = (props) => {
  let dispatch = useDispatch()
  let { pickedEmotions } = useSelector((store) => store.emotion)

  let emotionType = props.emotionType
  let emotion = props.emotion
  return (
    <div
      className={`add-post-picked-emotion-container emotion-${emotionType}`}
      key={emotion.id}
    >
      <span
        className="add-post-picked-emotion-remove-from-list-button"
        onClick={() => {
          let pickedEmotionsFromList = [...pickedEmotions].filter(
            (pickedEmotion) => pickedEmotion.name !== emotion.name
          )
          dispatch(setPickedEmotions(pickedEmotionsFromList))
        }}
      >
        X
      </span>
      {emotion.name}
    </div>
  )
}
