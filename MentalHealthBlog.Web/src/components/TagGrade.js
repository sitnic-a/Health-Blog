export const TagGrade = (props) => {
  const GRADE_COUNT = new Array(10).fill(0);
  let post = props.post;
  let tag = props.tag;

  return (
    <section className="post-tag-grade-container">
      <div className="tag-grade-container">
        <p>
          Grade tag {tag} for post {post.title}
        </p>
        <section className="tag-grade-stars-grade-section">
          <form className="star-rating">
            {GRADE_COUNT.map((grade, index) => {
              return (
                <div key={index}>
                  <input
                    className="radio-input"
                    type="radio"
                    id="star5"
                    name="star-input"
                    value="5"
                  />
                  <label className="radio-label" title="5 stars">
                    5 stars
                  </label>
                </div>
              );
            })}
          </form>
        </section>
      </div>
    </section>
  );
};
