import express from "express";
import bodyParser from "body-parser";
import ShortUniqueId from "short-unique-id";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { writeFile } from "fs/promises";
import { readFile } from "fs/promises";
const __filename = dirname(fileURLToPath(import.meta.url));
const uid = new ShortUniqueId({ length: 10 });
const app = express();
const port = 3000;
let blogPosts = [];
let loginDetails = false;
const myUserName = "admin";
const myPassword = "1234";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__filename + "/public"));

// Add password checking middleware $fun.
function passwordCheck(req, res, next) {
  let clientPass = req.body["password"];
  let clientUserName = req.body["username"];

  if (myPassword === clientPass && myUserName === clientUserName) {
    loginDetails = true;
  }
  next();
}
app.use(passwordCheck);

// Save our blog posts to File and object is converted to a string with JSON method.
async function saveBlogPost() {
  try {
    const promise = writeFile(
      "blog-post.json",
      JSON.stringify(blogPosts),
      "utf8"
    );
    await promise;

    console.log("Post saved successfully");
  } catch (err) {
    console.error("It's Some ", err.name);
    throw err;
  }
}

// Read JSON file and convert string in to javascript obj.
async function readBlogPost() {
  try {
    const contents = await readFile("blog-post.json", { encoding: "utf8" });
    if (contents == 0) {
      return [];
    }
    return JSON.parse(contents);
  } catch (err) {
    console.error("It's Some ", err.name);
    return [];
  }
}

// Get Clicked Post Details
function getClickedPostData(postData) {
  const blogPostData = blogPosts.find(blogDetailsFind);

  function blogDetailsFind(details) {
    return details.id === postData;
  }

  console.log("We Got Post Detail");
  // console.log(blogPostData);
  return blogPostData;
}

// load all blog posts in Home page route.
readBlogPost().then((allPosts) => {
  blogPosts = allPosts;
});

// Initialize  web application and set up routes.
app.get("/", (req, res) => {
  res.render(__filename + "/views/index.ejs", {
    postContent: blogPosts,
  });
});

// login page route
app.get("/user_login", (req, res) => {
  res.render(__filename + "/views/login_form.ejs");
});

// login check
app.post("/login", (req, res) => {
  if (loginDetails) {
    res.redirect("/");
  }
});

// create new post
app.get("/create_new_post", (req, res) => {
  res.render(__filename + "/views/create_post.ejs");
});

// Add new blog posts and save.
app.post("/submit", async (req, res) => {
  const title = req.body["title"];
  const user = req.body["user"];
  const date = req.body["date"];
  const content = req.body["content"];
  const newBlogPost = {
    id: uid.rnd(),
    title: title,
    user: user,
    date: date,
    content: content,
  };
  blogPosts.push(newBlogPost);
  try {
    await saveBlogPost();
    res.redirect("/");
  } catch (err) {
    console.error("It's Some ", err.name);
    throw err;
  }
});

// Blog post view
app.use("/view_posts/:postsId", async (req, res) => {
  try {
    const getPostId = req.params.postsId;
    const clickedPostData = getClickedPostData(getPostId);

    res.render(__filename + "/views/view_post.ejs", {
      postsData: clickedPostData,
    });
  } catch (err) {
    console.error("It's Some ", err.name);
    throw err;
  }
});

// Blog post edit get.
app.use("/edit/:postUId", async (req, res) => {
  try {
    const getPostUId = req.params.postUId;
    const clickedPostData = getClickedPostData(getPostUId);

    if (clickedPostData) {
      res.render(__filename + "/views/update_post.ejs", {
        postData: clickedPostData,
      });
    }
  } catch (err) {
    console.error("It's Some", err.name);
    throw err;
  }
});

// Blog post edit and update.
app.post("/update", async (req, res) => {
  try {
    const pId = req.body["id"];
    const eTitle = req.body["title"];
    const eUser = req.body["user"];
    const eDate = req.body["date"];
    const eContent = req.body["content"];

    const updateBlogPost = {
      id: pId,
      title: eTitle,
      user: eUser,
      date: eDate,
      content: eContent,
    };
    const findBlogPostIndex = blogPosts.findIndex(
      (blogPost) => blogPost.id === pId
    );

    blogPosts[findBlogPostIndex] = updateBlogPost;

    await saveBlogPost();
    res.redirect(`/view_posts/${pId}`);
  } catch (error) {
    console.error("It's Some", error.name);
    throw error;
  }
});

// Blog post delete by using array filter method.
app.use("/delete/:postId", async (req, res) => {
  try {
    const blogPostId = req.params.postId;
    const filterBlogPost = blogPosts.filter(
      (blogPost) => blogPost.id !== blogPostId
    );
    blogPosts = filterBlogPost;

    await saveBlogPost();
    console.log("posts saving successful");
    res.redirect("/");
  } catch (error) {
    console.error("It's Some", error.name);
    throw error;
  }
});

app.listen(port, () => {
  console.log(`Server is running on ${port}.`);
});
