import { MdOutlineAddCircleOutline } from "react-icons/md";

export const ListOfPostsHeader = () => {
  return (
    <section className="list-of-posts-header">
      <h1 className="list-of-posts-author">Written by: ...</h1>
      <button data-action-add="add" type="button" onClick={() => alert("Add")}>
        <MdOutlineAddCircleOutline />
        Add new post
      </button>
    </section>
  );
};
