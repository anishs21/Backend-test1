let countShow = document.querySelector(".wordCount h3");
let content = document.querySelector("#contents");
// post editor words count.

function postWordCount() {
  let words = content.value;
  let count = 0;
  let wordsSplit = words.split(" ");

  for (let i = 0; i < wordsSplit.length; i++) {
    if (wordsSplit[i] != " ") {
      count += 1;
    }
  }

  countShow.innerHTML = count - 1;
}
postWordCount();

content.addEventListener("input", (e) => {
  let words = e.target.value;
  let count = 0;
  let wordsSplit = words.split(" ");

  for (let i = 0; i < wordsSplit.length; i++) {
    if (wordsSplit[i] != " ") {
      count += 1;
    }
  }
  countShow.innerHTML = count - 1;
});
