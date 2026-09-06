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
