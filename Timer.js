document.addEventListener("DOMContentLoaded", function () {
  // Get current language from localStorage
  let currentLang = localStorage.getItem("language") || "nl";

  // DOM elements
  const timerDisplay = document.getElementById("timer-time");
  const timerLabel = document.getElementById("timer-label");
  const timerCount = document.getElementById("timer-count");
  const timerProgress = document.getElementById("timer-progress");
  const startButton = document.getElementById("timer-start");
  const pauseButton = document.getElementById("timer-pause");
  const resetButton = document.getElementById("timer-reset");
  const skipButton = document.getElementById("timer-skip");

  // Input elements
  const workTimeInput = document.getElementById("work-time");
  const shortBreakInput = document.getElementById("short-break");
  const longBreakInput = document.getElementById("long-break");
  const longBreakIntervalInput = document.getElementById("long-break-interval");

  // Timer state
  let timerState = "stopped"; // 'stopped', 'running', 'paused'
  let currentPhase = "work"; // 'work', 'short-break', 'long-break'
  let timeLeft = 0;
  let totalTime = 0;
  let workCounter = 0;
  let intervalId = null;
  let longBreakInterval = 4;
  let isFirstStart = true;

  // Sound effects
  const workSound = new Audio(
    "https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3"
  );
  const breakSound = new Audio(
    "https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3"
  );

  // Initialize timer display
  function initializeTimer() {
    workCounter = 0;
    currentPhase = "work";
    longBreakInterval = parseInt(longBreakIntervalInput.value);
    timeLeft = parseInt(workTimeInput.value) * 60;
    totalTime = timeLeft;
    updateTimerDisplay();
    updatePhaseLabel();
    updateTimerCount();
    updateTimerProgress(1);
  }

  // Update timer display
  function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeLeft % 60).toString().padStart(2, "0");
    timerDisplay.textContent = `${minutes}:${seconds}`;
  }

  // Update phase label
  function updatePhaseLabel() {
    // This will use translations if available
    if (translations && currentLang) {
      if (currentPhase === "work") {
        timerLabel.textContent =
          translations[currentLang].studyPhase || "Studietijd";
      } else if (currentPhase === "short-break") {
        timerLabel.textContent =
          translations[currentLang].shortBreakPhase || "Korte Pauze";
      } else {
        timerLabel.textContent =
          translations[currentLang].longBreakPhase || "Lange Pauze";
      }
    } else {
      // Fallback if translations not available
      if (currentPhase === "work") {
        timerLabel.textContent = "Studietijd";
      } else if (currentPhase === "short-break") {
        timerLabel.textContent = "Korte Pauze";
      } else {
        timerLabel.textContent = "Lange Pauze";
      }
    }

    // Update style based on phase
    document.querySelector(".timer-display").className =
      "timer-display timer-" + currentPhase;
  }

  // Update timer count display
  function updateTimerCount() {
    timerCount.textContent = `${workCounter}/${longBreakInterval}`;
  }

  // Update the progress circle
  function updateTimerProgress(ratio) {
    const circumference = 2 * Math.PI * 120; // r = 120
    const offset = circumference * (1 - ratio);
    timerProgress.style.strokeDasharray = `${circumference}`;
    timerProgress.style.strokeDashoffset = `${offset}`;

    // Change color based on phase
    if (currentPhase === "work") {
      timerProgress.style.stroke = "var(--ucll-color)";
    } else if (currentPhase === "short-break") {
      timerProgress.style.stroke = "#4CAF50";
    } else {
      timerProgress.style.stroke = "#2196F3";
    }
  }

  // Start the timer
  function startTimer() {
    if (isFirstStart) {
      initializeTimer();
      isFirstStart = false;
    }

    timerState = "running";
    startButton.disabled = true;
    pauseButton.disabled = false;

    // Disable inputs while timer is running
    workTimeInput.disabled = true;
    shortBreakInput.disabled = true;
    longBreakInput.disabled = true;
    longBreakIntervalInput.disabled = true;

    intervalId = setInterval(function () {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
        updateTimerProgress(timeLeft / totalTime);
      } else {
        completePhase();
      }
    }, 1000);
  }

  // Pause the timer
  function pauseTimer() {
    timerState = "paused";
    clearInterval(intervalId);
    startButton.disabled = false;
    pauseButton.disabled = true;
  }

  // Reset the timer
  function resetTimer() {
    timerState = "stopped";
    clearInterval(intervalId);
    isFirstStart = true;

    startButton.disabled = false;
    pauseButton.disabled = true;

    // Enable inputs
    workTimeInput.disabled = false;
    shortBreakInput.disabled = false;
    longBreakInput.disabled = false;
    longBreakIntervalInput.disabled = false;

    initializeTimer();
  }

  // Skip to next phase
  function skipPhase() {
    completePhase();
  }

  // Complete current phase and move to next
  function completePhase() {
    // Play sound based on phase completion
    if (currentPhase === "work") {
      breakSound.play();
    } else {
      workSound.play();
    }

    clearInterval(intervalId);

    if (currentPhase === "work") {
      workCounter++;
      updateTimerCount();

      if (workCounter % longBreakInterval === 0) {
        currentPhase = "long-break";
        timeLeft = parseInt(longBreakInput.value) * 60;
      } else {
        currentPhase = "short-break";
        timeLeft = parseInt(shortBreakInput.value) * 60;
      }
    } else {
      currentPhase = "work";
      timeLeft = parseInt(workTimeInput.value) * 60;
    }

    totalTime = timeLeft;
    updateTimerDisplay();
    updatePhaseLabel();
    updateTimerProgress(1);

    // Automatically start next phase
    if (timerState === "running") {
      startTimer();
    } else {
      timerState = "stopped";
      startButton.disabled = false;
      pauseButton.disabled = true;
    }
  }

  // Event listeners
  startButton.addEventListener("click", startTimer);
  pauseButton.addEventListener("click", pauseTimer);
  resetButton.addEventListener("click", resetTimer);
  skipButton.addEventListener("click", skipPhase);

  // Initialize on load
  initializeTimer();

  // Add translations for timer phases if they don't exist
  if (typeof translations !== "undefined" && translations) {
    if (!translations.nl.studyPhase) {
      translations.nl.studyPhase = "Studietijd";
      translations.nl.shortBreakPhase = "Korte Pauze";
      translations.nl.longBreakPhase = "Lange Pauze";
    }

    if (!translations.en.studyPhase) {
      translations.en.studyPhase = "Study Time";
      translations.en.shortBreakPhase = "Short Break";
      translations.en.longBreakPhase = "Long Break";
    }
  }
});
