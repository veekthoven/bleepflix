console.log("Content script loaded")

function waitForElement(selector, callback) {
  const interval = setInterval(() => {
    const element = document.querySelector(selector);
    if (element) {
      clearInterval(interval);
      callback(element);
    }
  }, 500); // Check every 500ms
}

// Wait for the video element to load
waitForElement('video', (video) => {
  console.log("Video element found!");


  // Wait for the subtitle container to load
  waitForElement('.player-timedtext', (subtitleContainer) => {
    console.log("Subtitle container found!");

    // Load the beep sound
    const beep = new Audio(chrome.runtime.getURL('beep.mp3'));

    // Function to mute the video and play a beep
    function bleepCurseWord() {
      video.muted = true;
      beep.play();

      // Unmute after a short delay (e.g., 1 second)
      setTimeout(() => {
        video.muted = false;
      }, 1000);
    }

    // Function to detect curse words in the subtitles
    function detectCurseWords(text) {
        const curseWords = [
            "compromises", "damn", "hell", "shit", "fuck", "asshole", "bitch", "crap", "dick", "piss", "bastard", 
            "douche", "slut", "whore", "cunt", "fag", "faggot", "nigger", "nigga", "pussy", "twat"
        ];

        return curseWords.some(word => text.toLowerCase().includes(word));
    }

    // Monitor subtitles for changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          const subtitleText = subtitleContainer.innerText.trim();

          if (subtitleText && detectCurseWords(subtitleText)) {
            console.log("Curse word detected:", subtitleText);
            bleepCurseWord();
          }
        }
      });
    });

    // Start observing the subtitle container
    observer.observe(subtitleContainer, {
      childList: true, // Observe changes to child elements
      subtree: true, // Observe all descendants
      characterData: true, // Observe text changes
    });
  });
});






