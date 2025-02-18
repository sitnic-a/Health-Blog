import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setPickedEmotions,
  setSuggestedEmotions,
} from './redux-toolkit/features/emotionSlice'

import { IoIosCheckmarkCircleOutline } from 'react-icons/io'

export const EmotionsOnPostCreation = () => {
  let dispatch = useDispatch()
  let pickedEmotionsFromList = []

  let { dbEmotions, suggestedEmotions, pickedEmotions } = useSelector(
    (store) => store.emotion
  )
  return (
    <>
      <div className="add-post-emotions-container">
        <label>Emotions</label>
        <br />

        {pickedEmotions.length > 0 && (
          <div
            className="add-post-picked-emotions-container"
            style={{ marginBlock: '0.8rem' }}
          >
            {pickedEmotions.map((emotion) => {
              if (emotion.name.includes('Bad')) {
                return (
                  <div
                    className="add-post-picked-emotion-container"
                    style={{
                      background: 'red',
                    }}
                    key={emotion.id}
                  >
                    {emotion.name}
                  </div>
                )
              } else if (emotion.name.includes('Happy')) {
                return (
                  <div
                    className="add-post-picked-emotion-container"
                    style={{
                      background: 'green',
                    }}
                    key={emotion.id}
                  >
                    {emotion.name}
                  </div>
                )
              } else if (emotion.name.includes('Surprised')) {
                return (
                  <div
                    className="add-post-picked-emotion-container"
                    style={{
                      background: 'lightblue',
                    }}
                    key={emotion.id}
                  >
                    {emotion.name}
                  </div>
                )
              } else if (emotion.name.includes('Angry')) {
                return (
                  <div
                    className="add-post-picked-emotion-container"
                    style={{
                      background: 'orange',
                    }}
                    key={emotion.id}
                  >
                    {emotion.name}
                  </div>
                )
              } else if (emotion.name.includes('Sad')) {
                return (
                  <div
                    className="add-post-picked-emotion-container"
                    style={{
                      background: 'lightpink',
                    }}
                    key={emotion.id}
                  >
                    {emotion.name}
                  </div>
                )
              } else if (emotion.name.includes('Disgusted')) {
                return (
                  <div
                    className="add-post-picked-emotion-container"
                    style={{
                      background: 'limegreen',
                    }}
                    key={emotion.id}
                  >
                    {emotion.name}
                  </div>
                )
              } else if (emotion.name.includes('Fearful')) {
                return (
                  <div
                    className="add-post-picked-emotion-container"
                    style={{
                      background: 'yellow',
                    }}
                    key={emotion.id}
                  >
                    {emotion.name}
                  </div>
                )
              }
            })}
          </div>
        )}

        <input
          type="text"
          onFocus={() => {
            if (suggestedEmotions.length <= 0) {
              dispatch(setSuggestedEmotions(dbEmotions))
            }
          }}
          onKeyUp={(e) => {
            console.log('Suggested emotions ', suggestedEmotions)

            let dbEmotionsCopy = [...dbEmotions]

            if (e.target.value === '') {
              console.log('Emotion copy ', dbEmotionsCopy)
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

      {suggestedEmotions.length > 0 && (
        <div className="add-post-suggested-emotions-container">
          {suggestedEmotions.map((emotion) => {
            if (emotion.name.includes('Bad')) {
              return (
                <div
                  key={emotion.id}
                  className="add-post-suggested-emotion-container"
                  style={{ background: 'red' }}
                  onClick={() => {
                    let pickedEmotion = {
                      id: emotion.id,
                      name: emotion.name,
                    }
                    pickedEmotionsFromList = [...pickedEmotions, pickedEmotion]
                    dispatch(setPickedEmotions(pickedEmotionsFromList))
                  }}
                >
                  <IoIosCheckmarkCircleOutline className="add-post-suggested-emotion-marker" />
                  {emotion.name}
                </div>
              )
            } else if (emotion.name.includes('Happy')) {
              return (
                <div
                  key={emotion.id}
                  className="add-post-suggested-emotion-container"
                  style={{ background: 'green' }}
                  onClick={() => {
                    let pickedEmotion = {
                      id: emotion.id,
                      name: emotion.name,
                    }
                    pickedEmotionsFromList = [...pickedEmotions, pickedEmotion]
                    dispatch(setPickedEmotions(pickedEmotionsFromList))
                  }}
                >
                  <IoIosCheckmarkCircleOutline className="add-post-suggested-emotion-marker" />
                  {emotion.name}
                </div>
              )
            } else if (emotion.name.includes('Surprised')) {
              return (
                <div
                  key={emotion.id}
                  className="add-post-suggested-emotion-container"
                  style={{ background: 'lightblue' }}
                  onClick={() => {
                    let pickedEmotion = {
                      id: emotion.id,
                      name: emotion.name,
                    }
                    pickedEmotionsFromList = [...pickedEmotions, pickedEmotion]
                    dispatch(setPickedEmotions(pickedEmotionsFromList))
                  }}
                >
                  <IoIosCheckmarkCircleOutline className="add-post-suggested-emotion-marker" />
                  {emotion.name}
                </div>
              )
            } else if (emotion.name.includes('Angry')) {
              return (
                <div
                  key={emotion.id}
                  className="add-post-suggested-emotion-container"
                  style={{ background: 'orange' }}
                  onClick={() => {
                    let pickedEmotion = {
                      id: emotion.id,
                      name: emotion.name,
                    }
                    pickedEmotionsFromList = [...pickedEmotions, pickedEmotion]
                    dispatch(setPickedEmotions(pickedEmotionsFromList))
                  }}
                >
                  <IoIosCheckmarkCircleOutline className="add-post-suggested-emotion-marker" />
                  {emotion.name}
                </div>
              )
            } else if (emotion.name.includes('Sad')) {
              return (
                <div
                  key={emotion.id}
                  className="add-post-suggested-emotion-container"
                  style={{ background: 'lightpink' }}
                  onClick={() => {
                    let pickedEmotion = {
                      id: emotion.id,
                      name: emotion.name,
                    }
                    pickedEmotionsFromList = [...pickedEmotions, pickedEmotion]
                    dispatch(setPickedEmotions(pickedEmotionsFromList))
                  }}
                >
                  <IoIosCheckmarkCircleOutline className="add-post-suggested-emotion-marker" />
                  {emotion.name}
                </div>
              )
            } else if (emotion.name.includes('Disgusted')) {
              return (
                <div
                  key={emotion.id}
                  className="add-post-suggested-emotion-container"
                  style={{ background: 'limegreen' }}
                  onClick={() => {
                    let pickedEmotion = {
                      id: emotion.id,
                      name: emotion.name,
                    }
                    pickedEmotionsFromList = [...pickedEmotions, pickedEmotion]
                    dispatch(setPickedEmotions(pickedEmotionsFromList))
                  }}
                >
                  <IoIosCheckmarkCircleOutline className="add-post-suggested-emotion-marker" />
                  {emotion.name}
                </div>
              )
            } else if (emotion.name.includes('Fearful')) {
              return (
                <div
                  key={emotion.id}
                  className="add-post-suggested-emotion-container"
                  style={{ background: 'yellow' }}
                  onClick={() => {
                    let pickedEmotion = {
                      id: emotion.id,
                      name: emotion.name,
                    }
                    pickedEmotionsFromList = [...pickedEmotions, pickedEmotion]
                    dispatch(setPickedEmotions(pickedEmotionsFromList))
                  }}
                >
                  <IoIosCheckmarkCircleOutline className="add-post-suggested-emotion-marker" />
                  {emotion.name}
                </div>
              )
            }
          })}
        </div>
      )}
    </>
  )
}
