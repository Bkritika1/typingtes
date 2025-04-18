
const quotes = [
  "Anyone who has not experienced despair and frustration and never truly experienced joy.",
  "Anyone who does not evolve is a relic of the past.",
  "How would you live if you had the same amount of money that say the prince of Saudi Arabia has but didn't have to look after a country or a business? What would your house look like? And your yard? What would you wear? Would you still work?",
  "Better to be a loser among winners than to be a winner among losers.",
  "The world operates on sheep mentality, and I hate it.",
  "Guilt, disgust, and despair are the worst human emotions.",
  "I hope I’m wrong, but if and when everybody’s basic needs are fulfilled, the concept of what’s basic will change, and thus, there will never be a time when everybody’s needs are fulfilled."
];

let timerInterval;
let timeLeft = 0;
let hasStarted = false;
let originalText = "";
let errorCount = 0;
let testDuration = 0;

function fetchQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById("text-display").textContent = quote;
  originalText = quote;
}

function startTest(duration) {
  clearInterval(timerInterval);
  hasStarted = false;
  errorCount = 0;
  testDuration = duration;
  timeLeft = duration;

  document.getElementById("accuracy").textContent = "0%";
  document.getElementById("errors").textContent = "0";
  document.getElementById("time-left").textContent = timeLeft + "s";
  document.getElementById("input-field").value = "";
  document.getElementById("input-field").disabled = false;
  document.getElementById("input-field").focus();
  document.getElementById("text-display").classList.remove("highlighted");

  fetchQuote();
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("time-left").textContent = timeLeft + "s";
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endTest();
    }
  }, 1000);
}

function endTest() {
  const input = document.getElementById("input-field").value.trim();
  const wordCount = input.split(/\s+/).filter(Boolean).length;
  const wpm = Math.round((wordCount / testDuration) * 60);

  localStorage.setItem("lastWPM", wpm);
  document.getElementById("last-wpm").textContent = wpm;
  document.getElementById("input-field").disabled = true;

  document.getElementById("popup").style.display = "flex";
  document.getElementById("result-summary").innerHTML = `
    <strong>WPM:</strong> ${wpm}<br/>
    <strong>Accuracy:</strong> ${document.getElementById("accuracy").textContent}<br/>
    <strong>Errors:</strong> ${errorCount}
  `;
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

function bindEvents() {
  document.querySelectorAll(".timer-buttons button").forEach(button => {
    button.addEventListener("click", () => {
      const duration = parseInt(button.dataset.time);
      startTest(duration);
    });
  });

  document.getElementById("input-field").addEventListener("keydown", function () {
    if (!hasStarted && timeLeft > 0) {
      hasStarted = true;
      startTimer();
    }
  });

  document.getElementById("input-field").addEventListener("input", function () {
    const typed = this.value;
    let errors = 0;
    let displayHTML = "";

    const trimmedTyped = typed.substring(0, originalText.length);

    for (let i = 0; i < originalText.length; i++) {
      const originalChar = originalText[i];
      const typedChar = trimmedTyped[i];

      if (typedChar == null) {
        displayHTML += `<span>${originalChar}</span>`;
      } else if (typedChar === originalChar) {
        displayHTML += `<span class="correct">${originalChar}</span>`;
      } else {
        displayHTML += `<span class="incorrect">${originalChar}</span>`;
        errors++;
      }
    }

    document.getElementById("text-display").innerHTML = displayHTML;

    errorCount = errors;

    const accuracy = typed.length
      ? Math.max(0, Math.round(((typed.length - errors) / typed.length) * 100))
      : 100;

    document.getElementById("accuracy").textContent = accuracy + "%";
    document.getElementById("errors").textContent = errorCount;
  });

  
  
document.getElementById("close-btn").addEventListener("click",  function(){
  const control = document.getElementById("popup");
 
  
  if(control.style.display=== "none"){
      control.style.display ="block";
  }else{
      control.style.display ="none";
  }
});
}

function init() {
  bindEvents();
  fetchQuote();
}

window.addEventListener("DOMContentLoaded", init);

