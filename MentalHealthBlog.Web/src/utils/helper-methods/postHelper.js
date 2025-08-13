export const showScroll = (element, maxHeight) => {
  if (element.scrollHeight > maxHeight) {
    element.style.overflowY = "scroll";
  }
};

export const initialDisplayScrollsOnMentalHealthExpertSharingUsersMainPostContainers =
  () => {
    const __MAX_HEIGHT_SHARING_USERS_MAIN_POST_TAGS = 130;
    const __MAX_HEIGHT_SHARING_USERS_MAIN_POST_EMOTIONS = 200;

    let sharingUsersMainPostContainers = document.querySelectorAll(
      ".sharing-users-main-post-container"
    );

    sharingUsersMainPostContainers.forEach((sharingUsersMainPostContainer) => {
      let sharingUsersMainPostTags =
        sharingUsersMainPostContainer.querySelector(
          ".sharing-users-main-post-tags"
        );
      let sharingUsersMainPostEmotions =
        sharingUsersMainPostContainer.querySelector(
          ".sharing-users-main-post-emotions"
        );
      showScroll(
        sharingUsersMainPostTags,
        __MAX_HEIGHT_SHARING_USERS_MAIN_POST_TAGS
      );
      showScroll(
        sharingUsersMainPostEmotions,
        __MAX_HEIGHT_SHARING_USERS_MAIN_POST_EMOTIONS
      );
    });
  };

export const showTags = (expandIcon) => {
  let postTagsRevealActionMainContainer = expandIcon.parentNode.parentNode;

  let postTagsContainer = postTagsRevealActionMainContainer.querySelector(
    ".post-container-tags"
  );

  if (postTagsContainer.style.height === "") {
    postTagsContainer.style.height = `${postTagsContainer.scrollHeight}px`;
    postTagsContainer.style.maxHeight = `200px`;
    let height = parseInt(postTagsContainer.style.height);
    if (height > "200") {
      postTagsContainer.style.overflowY = "scroll";
    }
    postTagsContainer.style.opacity = `1`;
    expandIcon.style.transform = "rotate(180deg)";

    return;
  }
  postTagsContainer.style.height = "";
  postTagsContainer.style.opacity = `0`;
  expandIcon.style.transform = "rotate(0deg)";

  return;
};

export const showEmotions = (expandIcon) => {
  let postEmotionsRevealActionMainContainer = expandIcon.parentNode.parentNode;

  let postEmotionsContainer =
    postEmotionsRevealActionMainContainer.querySelector(
      ".post-container-emotions"
    );

  if (postEmotionsContainer.style.height === "") {
    postEmotionsContainer.style.height = `${postEmotionsContainer.scrollHeight}px`;
    postEmotionsContainer.style.maxHeight = `200px`;
    let height = parseInt(postEmotionsContainer.style.height);
    if (height > "200") {
      postEmotionsContainer.style.overflowY = "scroll";
    }
    postEmotionsContainer.style.opacity = `1`;
    expandIcon.style.transform = "rotate(180deg)";

    return;
  }
  postEmotionsContainer.style.height = "";
  postEmotionsContainer.style.opacity = `0`;
  expandIcon.style.transform = "rotate(0deg)";

  return;
};

export const swap = (clickedElement, layoutPickerTypes) => {
  let firstElement = layoutPickerTypes.children[0];
  if (clickedElement !== firstElement) {
    layoutPickerTypes.insertBefore(clickedElement, firstElement);
  }
};

export const setActiveLayoutType = (clickedElement, layouts) => {
  layouts.forEach((layoutType) => layoutType.classList.remove("layout-active"));
  clickedElement.classList.add("layout-active");
};
