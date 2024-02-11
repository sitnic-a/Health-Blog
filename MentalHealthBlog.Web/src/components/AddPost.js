import React from "react";
import { useState } from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { openAddModal } from "./redux-toolkit/features/modalSlice";
import { application } from "../application";
import { createPost } from "./redux-toolkit/features/postSlice";
import {
  setSuggestedTags,
  setDisplayedSuggestedTags,
  setChosenTags,
  setPickedTags,
  getTags,
} from "./redux-toolkit/features/tagSlice";

export const AddPost = (props) => {
  let dispatch = useDispatch();
  let { isAddOpen } = useSelector((store) => store.modal);
  let { suggestedTags, displayedSuggestedTags, chosenTags, pickedTags } =
    useSelector((store) => store.tag);

  console.log("Suggested tags ", suggestedTags);

  let location = useLocation();
  let loggedUser = location.state.loggedUser;

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
    // setChosenTags((currentState) => {
    //   currentState = [...currentState, tag.name];
    //   setPickedTags([...pickedTags, tag]);
    //   return currentState;
    // });
  };

  let submitForm = async (e) => {
    let addUserObj = {
      e,
      loggedUser,
      chosenTags,
    };
    dispatch(createPost(addUserObj));
    dispatch(openAddModal(false));

    // e.preventDefault();
    // let form = new FormData(e.target);
    // let data = Object.fromEntries([...form.entries()]);

    // let newPost = {
    //   title: data.title,
    //   content: data.content,
    //   userId: loggedUser.id,
    //   tags: chosenTags,
    // };

    // if (
    //   newPost.title === "" ||
    //   newPost.title === null ||
    //   newPost.content === "" ||
    //   newPost.content === null
    // ) {
    //   toast.error("Couldn't add the post", {
    //     autoClose: 1500,
    //     position: "bottom-right",
    //   });
    //   return;
    // }

    // console.log(newPost);

    // try {
    //   let response = await fetch(`${application.application_url}/post`, {
    //     method: "POST",
    //     body: JSON.stringify(newPost),
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   });

    //   let responseJson = await response.json();
    //   if (response.status === 200) {
    //     alert("Added new post");
    //     toast.success("New post succesfully added", {
    //       autoClose: 1500,
    //       position: "bottom-right",
    //     });
    //     dispatch(openAddModal(false));
    //   } else {
    //     console.log("Some error occured");
    //     toast.error("Couldn't add the post", {
    //       autoClose: 1500,
    //       position: "bottom-right",
    //     });
    //     dispatch(openAddModal(false));
    //   }
    // } catch (error) {
    //   console.log(error);
    //   toast.error("Couldn't add the post", {
    //     autoClose: 1500,
    //     position: "bottom-right",
    //   });
    //   dispatch(openAddModal(false));
    // }

    // console.log("Form submitted");
    // window.location.reload();
  };

  return (
    <Modal
      isOpen={isAddOpen}
      style={application.modal_style}
      appElement={document.getElementById("root")}
      onRequestClose={() => dispatch(openAddModal(false))}
    >
      <form
        onSubmit={submitForm}
        id="add-post-form"
        onKeyDown={(e) => {
          e.key === "Enter" && e.preventDefault();
        }}
      >
        <div className="add-post-modal-header">
          <h2>Post</h2>
        </div>
        <div className="add-post-modal-content">
          <div className="add-post-title-container">
            <label htmlFor="title">Title</label>
            <br />
            <input
              className="add-post-title-input"
              type="text"
              id="title"
              name="title"
            />
          </div>
          <div className="add-post-content-container">
            <label htmlFor="content">Content</label>
            <br />
            <textarea
              className="add-post-content-textarea"
              name="content"
              id="content"
              rows="10"
            ></textarea>
          </div>
          <div className="add-post-picked-tags-container">
            {chosenTags.map((tag) => {
              return (
                <span
                  key={tag}
                  className="add-post-content-picked-tags-span-tag"
                >
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
          <br />
        </div>
        <button type="submit">Save</button>
      </form>
    </Modal>
  );
};
