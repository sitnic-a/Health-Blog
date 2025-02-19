export function selectEmotion(emotionContainer, emotionMarker, emotionType) {
  emotionContainer.classList.remove(`suggested-emotion-${emotionType}`);
  emotionMarker.classList.remove("emotion-marker-unchecked");

  emotionContainer.classList.add(
    "add-post-suggested-emotion-container-checked"
  );
  emotionMarker.classList.add("emotion-marker-checked");
}

export function deselectEmotion(emotionContainer, emotionMarker, emotionType) {
  emotionContainer.classList.remove(
    "add-post-suggested-emotion-container-checked"
  );
  emotionMarker.classList.remove("emotion-marker-checked");

  emotionContainer.classList.add(`suggested-emotion-${emotionType}`);
  emotionMarker.classList.add("emotion-marker-unchecked");
}
