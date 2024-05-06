import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsHovered } from "./redux-toolkit/features/tagGradeSlice";

import { TagGrade } from "./TagGrade";

export const Tag = (props) => {
  let dispatch = useDispatch();
  let { isHovered } = useSelector((store) => store.tagGrade);
  console.log("Hovered -> ", isHovered);
  let tag = props.tag;
  return (
    <>
      <span
        className="add-post-content-picked-tags-span-tag"
        onMouseOver={() => dispatch(setIsHovered(true))}
        onMouseLeave={() => dispatch(setIsHovered(false))}
      >
        {tag}
      </span>
      {isHovered && <TagGrade post={props} />}
    </>
  );
};

export default Tag;
