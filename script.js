function launchOs() {
  document.querySelector(".welcome").style.display = "none";
  document.querySelector(".Desktop").style.display = "block";
}

function updateTime() {
  var currentTime = new Date().toLocaleString();
  document.querySelector("#timeElement").innerHTML = currentTime;
}

setInterval(updateTime, 1000);
updateTime();


dragElement(document.getElementById("window"));

function dragElement(element) {
  var initialX = 0, initialY = 0, currentX = 0, currentY = 0;


  if (document.getElementById(element.id + "header")) {
    document.getElementById(element.id + "header").onmousedown = startDragging;
  } else {
    element.onmousedown = startDragging;
  }

  function startDragging(e) {
    e = e || window.event;


    e.preventDefault();
    initialX = e.clientX;
    initialY = e.clientY;
    document.onmouseup = stopDragging;
    document.onmousemove = dragElement;
  }


  function dragElement(e) {
    e = e || window.event;
    e.preventDefault();
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;
    element.style.top = (element.offsetTop - currentY) + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";
  }

  function stopDragging() {

    document.onmouseup = null;
    document.onmousemove = null;

  }
}


var appWindow = document.querySelector("#window");

function closeWindow(element) {
  element.style.display = "none";

}
function openWindow(element) {

  element.style.display = "flex";
}

document.querySelector("#windowclose").addEventListener("click", function() {
  closeWindow(appWindow);
});

document.querySelector("#os-name").addEventListener("click", function() {
  openWindow(appWindow);
});



dragElement(document.querySelector("#spacenews"));

document.querySelector("#spacenewsclose").addEventListener("click", function() {
  closeWindow(document.querySelector("#spacenews"));
});


document.querySelector("#start").addEventListener("click", function() {
  openWindow(document.querySelector("#spacenews"));
});


dragElement(document.querySelector("#about"));

document.querySelector("#aboutclose").addEventListener("click", function() {
  closeWindow(document.querySelector("#about"));
});



document.querySelector("#aboutIcon").addEventListener("click", function() {
  openWindow(document.querySelector("#about"));
});

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    closeWindow(document.querySelector("#window"));
    closeWindow(document.querySelector("#spacenews"));
    closeWindow(document.querySelector("#about"));
  }



  
});


let spacePosts = [];

let userData = JSON.parse(localStorage.getItem("spaceUserData")) || {};

function saveUserData() {
  localStorage.setItem("spaceUserData", JSON.stringify(userData));
}

async function fetchSpaceNews() {
  try {
    const response = await fetch("https://api.spaceflightnewsapi.net/v4/articles/?limit=10");
    const data = await response.json();

    spacePosts = data.results.map(article => {
      const saved = userData[article.id] || { likes: 0, liked: false, comments: [] };
      return {
        id: article.id,
        title: article.title,
        date: new Date(article.published_at).toLocaleDateString(),
        content: article.summary,
        image: article.image_url,
        url: article.url,
        likes: saved.likes,
        liked: saved.liked,
        comments: saved.comments
      };
    });

    renderFeed(); 
  } catch (error) {
    document.querySelector("#feedContainer").innerHTML = "<p>Couldn't load space news right now. Try again later!</p>";
    console.error("News fetch failed:", error);
  }
}

fetchSpaceNews();


function renderFeed() {
  const container = document.querySelector("#feedContainer");
  container.innerHTML = "";

  spacePosts.forEach(post => {
    const postDiv = document.createElement("div");
    postDiv.className = "feedpost";

    postDiv.innerHTML = `
      <p class="feedheading">What's happening in space?</p>
      ${post.image ? `<img src="${post.image}" class="postimage">` : ""}
      <h4 class="newstitle">${post.title}</h4>
      <p class="newsdate">${post.date}</p>
      <p class="newscontent">${post.content}</p>
      <div class="postactions">
        <button class="likebtn" data-id="${post.id}">${post.liked ? "❤️" : "🤍"} ${post.likes}</button>
      </div>
      <div class="comments" id="comments-${post.id}">
        ${post.comments.map(c => `<p class="comment">💬 ${c}</p>`).join("")}
      </div>
      <div class="addcomment">
        <input type="text" placeholder="Add a comment..." id="commentInput-${post.id}">
        <button class="commentbtn" data-id="${post.id}">Send</button>
      </div>
    `;

    container.appendChild(postDiv);
  });

  attachFeedListeners();
}

function attachFeedListeners() {
  document.querySelectorAll(".likebtn").forEach(btn => {
    btn.addEventListener("click", function() {
      const id = this.dataset.id;
      const post = spacePosts.find(p => p.id == id);
      post.liked = !post.liked;
      post.likes += post.liked ? 1 : -1;
      userData[id] = { likes: post.likes, liked: post.liked, comments: post.comments };
      saveUserData();
      renderFeed();
    });
  });

  document.querySelectorAll(".commentbtn").forEach(btn => {
    btn.addEventListener("click", function() {
      const id = this.dataset.id;
      const input = document.querySelector(`#commentInput-${id}`);
      if (input.value.trim() === "") return;

      const post = spacePosts.find(p => p.id == id);
      post.comments.push(input.value.trim());
      userData[id] = { likes: post.likes, liked: post.liked, comments: post.comments };
      saveUserData();
      renderFeed();
    });
  });
}
