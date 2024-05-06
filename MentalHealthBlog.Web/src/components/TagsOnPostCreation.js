import React from "react";
import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  setSuggestedTags,
  setDisplayedSuggestedTags,
  setChosenTags,
  setPickedTags,
  getTags,
} from "./redux-toolkit/features/tagSlice";

export const TagsOnPostCreation = () => {
  useEffect(() => {
    dispatch(getTags());
  }, []);

  let dispatch = useDispatch();
  let { suggestedTags, displayedSuggestedTags, chosenTags, pickedTags } =
    useSelector((store) => store.tag);

  let handleTagAdding = (e) => {
    let existingTag;
    if (e.key === "Enter" && e.target.value === "") {
      return;
    }

    if (
      e.key === "Enter" &&
      suggestedTags.find((t) => t.name === e.target.value)
    ) {
      existingTag = suggestedTags.find((t) => t.name === e.target.value);
      if (existingTag !== null || existingTag !== undefined) {
        let afterEnterPickedTags = [...pickedTags, existingTag];
        dispatch(setPickedTags(afterEnterPickedTags));
        let updatedSuggestedTags = suggestedTags.filter(
          (t) => t.id !== existingTag.id
        );
        dispatch(setSuggestedTags(updatedSuggestedTags));
        let tag = e.target.value;
        let afterAddChosenTags = [...chosenTags, tag];
        dispatch(setChosenTags(afterAddChosenTags));
        dispatch(setDisplayedSuggestedTags([]));
        e.target.value = "";

        return;
      }
    }

    if (e.key === "Enter") {
      let tag = e.target.value;
      let afterAddChosenTags = [...chosenTags, tag];
      let tagToAdd = {
        id: -1,
        name: e.target.value,
      };
      let afterEnterPickedTags = [...pickedTags, tagToAdd];
      dispatch(setPickedTags(afterEnterPickedTags));
      dispatch(setChosenTags(afterAddChosenTags));
      e.target.value = "";
      return;
    }
  };

  let handleTagRemoval = (tagName) => {
    let tagThatIsNotRecorded;
    if (pickedTags.find((t) => t.id <= 0)) {
      tagThatIsNotRecorded = pickedTags.find((t) => t.name === tagName);
    }

    if (tagThatIsNotRecorded !== undefined || tagThatIsNotRecorded !== null) {
      let afterRemovePickedTags = pickedTags.filter((t) => t.name !== tagName);
      dispatch(setPickedTags(afterRemovePickedTags));
      let updatedSuggestedTagsForTagThatIsNotRecorded = [
        ...suggestedTags,
      ].filter((t) => !afterRemovePickedTags.includes(t));
      dispatch(setSuggestedTags(updatedSuggestedTagsForTagThatIsNotRecorded));
      let afterDeleteChosenTags = [...chosenTags].filter((t) => t !== tagName);
      dispatch(setChosenTags(afterDeleteChosenTags));
    }

    if (pickedTags.find((t) => t.id > 0)) {
      let tag = pickedTags.find((t) => t.name === tagName);
      let updatedSuggestedTags = [...suggestedTags, tag];
      let afterRemovePickedTags = pickedTags.filter((t) => t.id !== tag.id);
      dispatch(setPickedTags(afterRemovePickedTags));
      updatedSuggestedTags = [...updatedSuggestedTags].filter(
        (t) => !afterRemovePickedTags.includes(t)
      );
      dispatch(setSuggestedTags(updatedSuggestedTags));
      let afterDeleteChosenTags = [...chosenTags].filter((t) => t !== tagName);
      dispatch(setChosenTags(afterDeleteChosenTags));
    }
  };

  let handleSuggestedTagsChange = (e) => {
    if (e.target.value === "") {
      if (pickedTags.length > 0) {
        let currentState = suggestedTags
          .filter((t) => !pickedTags.includes(t))
          .filter((t) => t.name !== e.target.value);

        dispatch(setSuggestedTags(currentState));
        dispatch(setDisplayedSuggestedTags([]));
        return;
      }
      dispatch(getTags());
      dispatch(setDisplayedSuggestedTags([]));
      return;
    }

    let onInputTags = suggestedTags
      .filter((t) => t.name.includes(e.target.value))
      .filter((t) => !pickedTags.includes(t));
    dispatch(setDisplayedSuggestedTags(onInputTags));
  };

  let handlePickedTagClick = (tag) => {
    document.querySelector("#tag").value = "";
    let suggestedTagsAfterClick = [...suggestedTags].filter(
      (t) => t.id !== tag.id
    );
    dispatch(setSuggestedTags(suggestedTagsAfterClick));
    dispatch(setDisplayedSuggestedTags([]));

    let afterPickChosenTags = [...chosenTags, tag.name];
    dispatch(setChosenTags(afterPickChosenTags));
    let afterPickPickedTags = [...pickedTags, tag];
    dispatch(setPickedTags(afterPickPickedTags));
  };

  return (
    <>
      <div className="add-post-picked-tags-container">
        {chosenTags.map((tag) => {
          return (
            <span key={tag} className="add-post-content-picked-tags-span-tag">
              {tag}
              <span
                className="add-post-content-picked-tags-span-tag-remove"
                onClick={() => handleTagRemoval(tag)}
              >
                X
              </span>
            </span>
          );
        })}
      </div>
      <div className="add-post-tags-container">
        <label htmlFor="tag">Tags</label>
        <br />
        <input
          name="tags"
          id="tag"
          type="text"
          className="add-post-content-tags-input"
          onKeyUp={(e) => handleTagAdding(e)}
          onChange={(e) => handleSuggestedTagsChange(e)}
        />
      </div>
      {displayedSuggestedTags.length > 0 && (
        <div
          id="add-post-suggested-tags-container-id"
          className="add-post-suggested-tags-container"
        >
          {displayedSuggestedTags.map((tag) => {
            return (
              <div
                className="add-post-suggested-tag"
                key={tag.id}
                onClick={() => handlePickedTagClick(tag)}
              >
                {tag.name}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
