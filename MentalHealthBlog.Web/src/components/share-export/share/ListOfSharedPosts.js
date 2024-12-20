import { useSelector } from "react-redux";
import { formatDateToString } from "../../utils/helper-methods/methods";

export const ListOfSharedPosts = () => {
  let { postsToShare } = useSelector((store) => store.shareExport);

  return (
    <section id="list-of-shared-posts-main-container">
      {postsToShare.map((post) => {
        let date = formatDateToString(post.createdAt);
        let tags = post.tags;
        return (
          <div key={post.id}>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
            <p>{date}</p>
            <div>
              {tags.map((tag) => {
                return <span>{tag} &nbsp;</span>;
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
  return;
};
