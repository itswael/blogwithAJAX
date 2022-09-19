const { response } = require("express");

const loadCommentsBtnElement = document.getElementById("load-cmnt-btn");
const commentSectionElement = document.getElementById("comments");
const formElement = document.getElementById("cmntform");
const commentTitleElement = document.getElementById("title");
const commentTextElement = document.getElementById("text");

function createCommentsList(comments) {
  const commentListElement = document.createElement("ol");

  for (const comment of comments) {
    const commentElement = document.createElement("li");
    commentElement.innerHTML = `
        <article class="comment-item">
        <h2>${comment.title}</h2>
        <p>${comment.text}</p>
        </article>
        `;

    commentListElement.appendChild(commentElement);
  }

  return commentListElement;
}

async function fetchCommments() {
  const postId = loadCommentsBtnElement.dataset.postid;

  try{
    if (!response.ok) {
    alert("fetching comment failed");
    return;
  }
  const response = await fetch(`/posts/${postId}/comments`);
  const resData = await response.json();

  if (resData && resData.length > 0) {
    const commentListElement = createCommentsList(resData);
    commentSectionElement.innerHTML = "";
    commentSectionElement.appendChild(commentListElement);
  } else {
    commentSectionElement.textContent =
      "No comments were found for this post, be the first to comment";
  }
  }catch(error){
    alert("fetching comment failed");
  }  
}

async function saveComment(event) {
  event.preventDefault();
  const postId = loadCommentsBtnElement.dataset.postid;

  try {
    const enteredTitle = commentTitleElement.value;
    const enteredText = commentTextElement.value;
    console.dir(commentTextElement);
    // commentTitleElement.textContent='';
    // commentTextElement.textContent='';

    const comment = { title: enteredTitle, text: enteredText };
    await fetch(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify(comment),
      headers: { "content-type": "application/json" },
    });
    if (response.ok) {
      fetchCommments();
    } else {
      alert("comment not sent, try again later");
    }
  } catch (error) {
    alert("could not send request");
  }
}

loadCommentsBtnElement.addEventListener("click", fetchCommments);
formElement.addEventListener("submit", saveComment);
