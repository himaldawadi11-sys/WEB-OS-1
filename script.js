var bootScreen = document.getElementById("bootScreen");
var phaseIgnition = document.getElementById("phaseIgnition");
var phaseLaunch = document.getElementById("phaseLaunch");
var phaseWelcome = document.getElementById("phaseWelcome");
var bootStatus = document.getElementById("bootStatus");
var ignitionCount = document.getElementById("ignitionCount");
var smokeField = document.getElementById("smokeField");

var ignitionMessages = [
  "SYSTEMS STANDBY...",
  "FUEL LINES PRESSURIZED...",
  "NAVIGATION LOCKED...",
  "CREW SYSTEMS NOMINAL..."
];

// synthesized sound effects, no audio files needed
var audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playBeep(freq, duration, type, volume) {
  var ctx = getAudioCtx();
  var osc = ctx.createOscillator();
  var gain = ctx.createGain();

  osc.type = type || "square";
  osc.frequency.value = freq;

  gain.gain.setValueAtTime(volume || 0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + duration);
}

function playCountdownBeep() {
  playBeep(880, 0.15, "square", 0.12);
}

function playIgnitionTone() {
  playBeep(1200, 0.3, "sawtooth", 0.15);
}

function playLaunchRumble() {
  var ctx = getAudioCtx();
  var bufferSize = ctx.sampleRate * 3; // 3 seconds of noise
  var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  var data = buffer.getChannelData(0);

  for (var i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.5;
  }

  var noise = ctx.createBufferSource();
  noise.buffer = buffer;

  var filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(400, ctx.currentTime);

  var gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.3);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start();
  noise.stop(ctx.currentTime + 3);
}

// toast notifications
var toastContainer = document.getElementById("toastContainer");

function showToast(title, message, type, duration) {
  var toast = document.createElement("div");
  toast.className = "toast" + (type === "warning" ? " warning" : "");

  var titleEl = document.createElement("p");
  titleEl.className = "toast-title";
  titleEl.textContent = title;

  var msgEl = document.createElement("p");
  msgEl.className = "toast-message";
  msgEl.textContent = message;

  toast.appendChild(titleEl);
  toast.appendChild(msgEl);
  toastContainer.appendChild(toast);

  // trigger the slide-in on the next frame
  requestAnimationFrame(function () {
    toast.classList.add("show");
  });

  setTimeout(function () {
    toast.classList.remove("show");
    setTimeout(function () {
      toast.remove();
    }, 350);
  }, duration || 4000);
}

// boot sequence

function runBootSequence() {
  var i = 0;
  var msgInterval = setInterval(function () {
    if (i < ignitionMessages.length) {
      bootStatus.textContent = ignitionMessages[i];
      i++;
    } else {
      clearInterval(msgInterval);
      startCountdown();
    }
  }, 500);
}

function startCountdown() {
  var counts = ["3", "2", "1", "IGNITION"];
  var i = 0;
  bootStatus.textContent = "LAUNCH SEQUENCE INITIATED";
  var countInterval = setInterval(function () {
    ignitionCount.textContent = counts[i];

    if (counts[i] === "IGNITION") {
      playIgnitionTone();
    } else {
      playCountdownBeep();
    }

    i++;
    if (i >= counts.length) {
      clearInterval(countInterval);
      setTimeout(startLaunch, 500);
    }
  }, 600);
}

function startLaunch() {
  phaseIgnition.style.display = "none";
  phaseLaunch.style.display = "flex";
  bootScreen.classList.add("shake-screen");

  playLaunchRumble();

  var smokeInterval = setInterval(function () {
    var puff = document.createElement("div");
    puff.className = "smoke-puff";
    puff.style.left = (Math.random() * 100) + "px";
    puff.style.setProperty("--driftX", (Math.random() * 40 - 20) + "px");
    smokeField.appendChild(puff);
    setTimeout(function () { puff.remove(); }, 1400);
  }, 120);

  setTimeout(function () {
    clearInterval(smokeInterval);
    bootScreen.classList.remove("shake-screen");
    phaseLaunch.style.display = "none";
    phaseWelcome.style.display = "flex";

    setTimeout(function () {
      bootScreen.classList.add("fade-out");
      setTimeout(function () {
        bootScreen.style.display = "none";
        // waits until the boot screen is actually gone before firing,
        // otherwise the toast is just hidden underneath it
        showToast("SYSTEM ONLINE", "All modules nominal. Welcome aboard.");
      }, 600);
    }, 2000);
  }, 3000);
}

// browsers won't let audio play until the user has interacted with the
// page at least once, so we hold off booting until the first click/keypress,
// unlock audio right then, and launch from there
var bootStarted = false;

function startBootOnFirstInteraction() {
  if (bootStarted) return;
  bootStarted = true;

  getAudioCtx(); // creates + unlocks the AudioContext on this gesture

  document.removeEventListener("click", startBootOnFirstInteraction);
  document.removeEventListener("keydown", startBootOnFirstInteraction);

  runBootSequence();
}

bootStatus.textContent = "CLICK ANYWHERE TO LAUNCH";
document.addEventListener("click", startBootOnFirstInteraction);
document.addEventListener("keydown", startBootOnFirstInteraction);


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


dragElement(document.querySelector("#settings"));

document.querySelector("#settingsIcon").addEventListener("click", function() {
  openWindow(document.querySelector("#settings"));
});

document.querySelector("#settingsclose").addEventListener("click", function() {
  closeWindow(document.querySelector("#settings"));
});

document.querySelector("#settingsmin").addEventListener("click", function() {
  closeWindow(document.querySelector("#settings"));
});

document.querySelectorAll(".wallpaper-thumb").forEach(function(thumb) {
  thumb.addEventListener("click", function() {
    var chosen = thumb.getAttribute("data-wallpaper");
    document.querySelector(".Desktop").style.backgroundImage = "url('" + chosen + "')";
  });
});

document.querySelector("#themeToggle").addEventListener("click", function() {
  document.documentElement.classList.toggle("dark-theme");
});


document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    closeWindow(appWindow);
    closeWindow(document.querySelector("#settings"));
    closeWindow(document.querySelector("#calculator"));
  }
});

var isMuted = false;

document.querySelector("#volumeSlider").addEventListener("input", function(e) {
  console.log("Volume set to:", e.target.value);
});

document.querySelector("#muteToggle").addEventListener("click", function() {
  isMuted = !isMuted;
  this.textContent = isMuted ? "Mute: On" : "Mute: Off";
});

document.querySelector("#brightnessSlider").addEventListener("input", function(e) {
  document.querySelector(".Desktop").style.filter = "brightness(" + e.target.value + "%)";
});

document.querySelectorAll(".settings-navitem").forEach(function(item) {
  item.addEventListener("click", function() {
    document.querySelectorAll(".settings-navitem").forEach(function(i) {
      i.classList.remove("active");
    });
    item.classList.add("active");

    document.querySelectorAll(".settings-panel").forEach(function(panel) {
      panel.style.display = "none";
    });
    document.getElementById(item.getAttribute("data-target")).style.display = "block";
  });
});

document.querySelector("#settingsSearch").addEventListener("input", function(e) {
  var query = e.target.value.toLowerCase();
  document.querySelectorAll(".settings-navitem").forEach(function(item) {
    var matches = item.textContent.toLowerCase().includes(query);
    item.style.display = matches ? "block" : "none";
  });
});

document.querySelectorAll(".accent-swatch").forEach(function(swatch) {
  swatch.addEventListener("click", function() {
    var color = swatch.getAttribute("data-accent");
    document.documentElement.style.setProperty("--accent", color);
  });
});

document.querySelector("#transparencySlider").addEventListener("input", function(e) {
  var opacity = e.target.value / 100;
  document.documentElement.style.setProperty("--window-opacity", opacity);
});


var hourHand = document.getElementById("hourHand");
var minuteHand = document.getElementById("minuteHand");
var digitalTime = document.getElementById("digitalTime");

function updateClockWidget() {
  var now = new Date();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();

  var hourDeg = (hours % 12) * 30 + minutes * 0.5;
  var minuteDeg = minutes * 6;

  hourHand.style.transform = "rotate(" + hourDeg + "deg)";
  minuteHand.style.transform = "rotate(" + minuteDeg + "deg)";

  var ampm = hours >= 12 ? "PM" : "AM";
  var displayHour = hours % 12 || 12;
  var pad = function(n) { return n.toString().padStart(2, "0"); };

  digitalTime.textContent = pad(displayHour) + ":" + pad(minutes) + ":" + pad(seconds) + " " + ampm;
}

setInterval(updateClockWidget, 1000);
updateClockWidget();


// fuel gauge - fake value that drifts up/down, with a low-fuel toast
var fakeFuel = 87;
var fuelDirection = -1;

function updateFakeFuel() {
  fakeFuel += fuelDirection * (Math.random() * 0.5);

  if (fakeFuel <= 15) fuelDirection = 1;
  if (fakeFuel >= 95) fuelDirection = -1;

  var displayValue = Math.round(fakeFuel);
  document.getElementById("fuelMiniInner").style.width = displayValue + "%";
  document.getElementById("fuelTooltip").textContent = displayValue + "% Fuel";

  // warn once when it drops to/below 20%, reset once it recovers past 25%
  if (displayValue <= 20 && !window.fuelWarned) {
    window.fuelWarned = true;
    showToast("FUEL WARNING", "Reserves below 20%. Refueling advised.", "warning");
  }
  if (displayValue > 25) {
    window.fuelWarned = false;
  }
}

setInterval(updateFakeFuel, 3000);
updateFakeFuel();


document.getElementById("brightnessIcon").addEventListener("click", function(e) {
  document.getElementById("brightnessPopup").classList.toggle("open");
  e.stopPropagation();
});

document.getElementById("topbarBrightnessSlider").addEventListener("input", function(e) {
  document.querySelector(".Desktop").style.filter = "brightness(" + e.target.value + "%)";
});

document.getElementById("wifiIcon").addEventListener("click", function(e) {
  document.getElementById("wifiPopup").classList.toggle("open");
  e.stopPropagation();
});

document.addEventListener("click", function() {
  document.getElementById("brightnessPopup").classList.remove("open");
  document.getElementById("wifiPopup").classList.remove("open");
});


dragElement(document.querySelector("#calculator"));

document.querySelector("#calculatorIcon").addEventListener("click", function() {
  openWindow(document.querySelector("#calculator"));
});

document.querySelector("#calculatorclose").addEventListener("click", function() {
  closeWindow(document.querySelector("#calculator"));
});

document.querySelector("#calculatormin").addEventListener("click", function() {
  closeWindow(document.querySelector("#calculator"));
});

var calcDisplay = document.getElementById("calcDisplay");
var calcExpression = "";

document.querySelectorAll(".calc-btn").forEach(function(btn) {
  btn.addEventListener("click", function() {
    var action = btn.getAttribute("data-action");
    var value = btn.getAttribute("data-value");

    if (action === "clear") {
      calcExpression = "";
    } else if (action === "backspace") {
      calcExpression = calcExpression.slice(0, -1);
    } else if (action === "equals") {
      try {
        // only allow digits/operators through — no eval of arbitrary input
        if (/^[0-9+\-*/.\s]+$/.test(calcExpression)) {
          calcExpression = String(Function('"use strict";return (' + calcExpression + ')')());
        } else {
          calcExpression = "Error";
        }
      } catch (e) {
        calcExpression = "Error";
      }
    } else if (value) {
      calcExpression += value;
    }

    calcDisplay.value = calcExpression || "0";
  });
});

var alienBuddy = document.getElementById("alienBuddy");
var mouseX = 0, mouseY = 0;
var alienX = 0, alienY = 0;

document.addEventListener("mousemove", function(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateAlien() {
  // ease toward the mouse position instead of snapping to it, gives it
  // a little lag/personality
  alienX += (mouseX - alienX) * 0.15;
  alienY += (mouseY - alienY) * 0.15;

  alienBuddy.style.left = alienX + "px";
  alienBuddy.style.top = alienY + "px";

  requestAnimationFrame(animateAlien);
}

animateAlien();
