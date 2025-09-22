import { useDispatch, useSelector } from 'react-redux'
import { setSuggestedEmotions } from '../../redux-toolkit/features/emotionSlice'

import { AddPostPickedEmotions } from '../AddPostPickedEmotions/AddPostPickedEmotions'
import { AddPostSuggestedEmotions } from '../AddPostSuggestedEmotions/AddPostSuggestedEmotions'

export const AddPostEmotions = () => {
  let dispatch = useDispatch()

  let { dbEmotions, suggestedEmotions } = useSelector((store) => store.emotion)
  return (
    <>
      <div className="add-post-emotions-container">
        <label className="add-post-form-field-label" htmlFor="emotion">
          Emocije
        </label>
        <br />

        <AddPostPickedEmotions />

        <input
          className="form-field"
          id="emotion"
          name="emotion"
          type="text"
          placeholder="Odaberite emocije iz liste ispod"
          onFocus={() => {
            if (suggestedEmotions?.length <= 0) {
              dispatch(setSuggestedEmotions(dbEmotions))
            }
          }}
          onKeyUp={(e) => {
            let dbEmotionsCopy = [...dbEmotions]
            if (e.target.value === '') {
              dispatch(setSuggestedEmotions(dbEmotionsCopy))
              return
            }

            let suggestedEmotionsFromList = [...dbEmotionsCopy].filter(
              (emotion) => emotion.name.includes(e.target.value)
            )
            dispatch(setSuggestedEmotions(suggestedEmotionsFromList))
          }}
        />
      </div>

      <AddPostSuggestedEmotions />
    </>
  )
}
