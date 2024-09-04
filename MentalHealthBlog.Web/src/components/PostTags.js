import React from "react";
import Tag from "./Tag";
import { useDispatch } from "react-redux";
import {
  setIsHovered,
  setHoveredPost,
  setHoveredTag,
} from "./redux-toolkit/features/tagGradeSlice";

export const PostTags = (props) => {
  let dispatch = useDispatch();

  let post = props.post;

  return (
    <div
      className="post-container-tags"
      onMouseLeave={() => {
        dispatch(setIsHovered(false));
        dispatch(setHoveredPost(null));
        dispatch(setHoveredTag(null));
      }}
    >
      {post.tags.map((tag) => {
        return <Tag key={tag} post={post} tag={tag} />;
      })}
    </div>
  );
};
