import { useSelector } from "react-redux";
import { formatDateToString } from "../../utils/helper-methods/methods";

export const ListOfSharedPosts = () => {
  let { postsToShare } = useSelector((store) => store.shareExport);

  return (
    <section id="list-of-shared-posts-main-container">
      {postsToShare.map((post, index) => {
        let date = formatDateToString(post.createdAt);
        let tags = post.tags;
        return (
          <div key={index}>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
            <p>{date}</p>
            <div>
              {tags.map((tag, index) => {
                return <span key={index}>{tag} &nbsp;</span>;
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
  return;
};
