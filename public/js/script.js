let postCreateBtn = document.querySelector("#post-create-btn");

document.addEventListener("DOMContentLoaded", () => {

  // post create button $fun
  postCreateBtn.addEventListener("click", () => {
    window.location.assign("/create_new_post");
  });
});

// A post view $fun
async function postView(data) {
  try {
    window.location.assign(`/view_posts/${data.id}`);
  } catch (error) {
    console.error("It's Some ", error.name);
    throw error;
  }

}
