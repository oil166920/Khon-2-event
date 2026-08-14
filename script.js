/* =========================================
   KHON RONG NAI
   DIGITAL BOOK PRESENTATION
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const pages =
  Array.from(
    document.querySelectorAll(".page")
  );


const book =
  document.querySelector(".book");


const currentPageElement =
  document.getElementById("currentPage");


const totalPageElement =
  document.getElementById("totalPage");


const prevButton =
  document.getElementById("prevBtn");


const nextButton =
  document.getElementById("nextBtn");


const progressBar =
  document.getElementById("progressBar");


const fullscreenButton =
  document.getElementById("fullscreenBtn");


const soundButton =
  document.getElementById("soundBtn");


/* =========================================
   STATE
========================================= */

let currentPage = 0;

let isAnimating = false;

let startX = 0;

let endX = 0;

let wheelLocked = false;

let presentationTimer = null;


/* =========================================
   TOTAL PAGE
========================================= */

totalPageElement.textContent =
  String(pages.length).padStart(2, "0");


/* =========================================
   UPDATE UI
========================================= */

function updateUI() {

  const page =
    currentPage + 1;


  currentPageElement.textContent =
    String(page).padStart(2, "0");


  prevButton.disabled =
    currentPage === 0;


  nextButton.disabled =
    currentPage === pages.length - 1;


  const progress =
    (page / pages.length) * 100;


  progressBar.style.width =
    `${progress}%`;

}


/* =========================================
   NEXT
========================================= */

function nextPage() {

  if (isAnimating)
    return;


  if (
    currentPage >=
    pages.length - 1
  ) {

    return;

  }


  changePage(
    currentPage + 1,
    "next"
  );

}


/* =========================================
   PREVIOUS
========================================= */

function previousPage() {

  if (isAnimating)
    return;


  if (currentPage <= 0)
    return;


  changePage(
    currentPage - 1,
    "prev"
  );

}


/* =========================================
   CHANGE PAGE
========================================= */

function changePage(
  targetPage,
  direction
) {

  if (isAnimating)
    return;


  if (
    targetPage < 0 ||
    targetPage >= pages.length
  ) {

    return;

  }


  isAnimating = true;


  const oldPage =
    pages[currentPage];


  const newPage =
    pages[targetPage];


  newPage.classList.remove(
    "active",
    "flip-next",
    "flip-prev"
  );


  oldPage.classList.remove(
    "flip-next",
    "flip-prev"
  );


  /*
   * NEXT
   */

  if (direction === "next") {

    newPage.style.display =
      "block";

    newPage.style.zIndex =
      "20";

    oldPage.style.zIndex =
      "10";


    /*
     * Force browser reflow
     */

    void newPage.offsetWidth;


    newPage.classList.add(
      "flip-next"
    );


    setTimeout(() => {

      oldPage.classList.remove(
        "active"
      );


      newPage.classList.remove(
        "flip-next"
      );


      newPage.classList.add(
        "active"
      );


      newPage.style.display =
        "";

      newPage.style.zIndex =
        "";

      oldPage.style.zIndex =
        "";


      currentPage =
        targetPage;


      updateUI();


      isAnimating =
        false;

    }, 780);

  }


  /*
   * PREVIOUS
   */

  else {

    newPage.style.display =
      "block";

    newPage.style.zIndex =
      "20";

    oldPage.style.zIndex =
      "10";


    void newPage.offsetWidth;


    newPage.classList.add(
      "flip-prev"
    );


    setTimeout(() => {

      oldPage.classList.remove(
        "active"
      );


      newPage.classList.remove(
        "flip-prev"
      );


      newPage.classList.add(
        "active"
      );


      newPage.style.display =
        "";

      newPage.style.zIndex =
        "";

      oldPage.style.zIndex =
        "";


      currentPage =
        targetPage;


      updateUI();


      isAnimating =
        false;

    }, 780);

  }

}


/* =========================================
   KEYBOARD
========================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "ArrowRight" ||
      event.key === "ArrowDown"
    ) {

      event.preventDefault();

      nextPage();

    }


    if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowUp"
    ) {

      event.preventDefault();

      previousPage();

    }


    /*
     * Space
     */

    if (
      event.code === "Space"
    ) {

      event.preventDefault();

      nextPage();

    }


    /*
     * F = Fullscreen
     */

    if (
      event.key.toLowerCase() === "f"
    ) {

      toggleFullscreen();

    }


    /*
     * P = Presentation
     */

    if (
      event.key.toLowerCase() === "p"
    ) {

      toggleAutoPresentation();

    }


    /*
     * Escape
     */

    if (
      event.key === "Escape"
    ) {

      stopAutoPresentation();

    }

  }
);


/* =========================================
   TOUCH SWIPE
========================================= */

book.addEventListener(
  "touchstart",
  event => {

    startX =
      event.changedTouches[0]
        .screenX;

  },
  {
    passive: true
  }
);


book.addEventListener(
  "touchend",
  event => {

    endX =
      event.changedTouches[0]
        .screenX;


    const distance =
      endX - startX;


    /*
     * Swipe left
     */

    if (distance < -60) {

      nextPage();

    }


    /*
     * Swipe right
     */

    if (distance > 60) {

      previousPage();

    }

  },
  {
    passive: true
  }
);


/* =========================================
   MOUSE WHEEL
========================================= */

document.addEventListener(
  "wheel",
  event => {

    if (wheelLocked)
      return;


    const activePage =
      pages[currentPage]
        ?.querySelector(
          ".page-content"
        );


    /*
     * ถ้าเนื้อหาในหน้ายังเลื่อนได้
     * ให้เลื่อนเนื้อหาก่อน
     */

    if (activePage) {

      const canScrollDown =
        activePage.scrollTop +
        activePage.clientHeight <
        activePage.scrollHeight - 3;


      const canScrollUp =
        activePage.scrollTop > 3;


      if (
        event.deltaY > 0 &&
        canScrollDown
      ) {

        return;

      }


      if (
        event.deltaY < 0 &&
        canScrollUp
      ) {

        return;

      }

    }


    wheelLocked =
      true;


    if (event.deltaY > 0) {

      nextPage();

    } else {

      previousPage();

    }


    setTimeout(
      () => {
        wheelLocked = false;
      },
      850
    );

  },
  {
    passive: true
  }
);


/* =========================================
   FULLSCREEN
========================================= */

async function toggleFullscreen() {

  try {

    if (!document.fullscreenElement) {

      await document.documentElement
        .requestFullscreen();

    } else {

      await document.exitFullscreen();

    }

  } catch (error) {

    console.log(
      "Fullscreen error:",
      error
    );

  }

}


fullscreenButton.addEventListener(
  "click",
  toggleFullscreen
);


/* =========================================
   FULLSCREEN ICON
========================================= */

document.addEventListener(
  "fullscreenchange",
  () => {

    if (
      document.fullscreenElement
    ) {

      fullscreenButton.textContent =
        "✕";

    } else {

      fullscreenButton.textContent =
        "⛶";

    }

  }
);


/* =========================================
   AUTO PRESENTATION
========================================= */

function startAutoPresentation() {

  stopAutoPresentation();


  presentationTimer =
    setInterval(
      () => {

        if (
          currentPage <
          pages.length - 1
        ) {

          nextPage();

        } else {

          stopAutoPresentation();

        }

      },
      8000
    );

}


function stopAutoPresentation() {

  if (
    presentationTimer
  ) {

    clearInterval(
      presentationTimer
    );

    presentationTimer =
      null;

  }

}


function toggleAutoPresentation() {

  if (
    presentationTimer
  ) {

    stopAutoPresentation();

  } else {

    startAutoPresentation();

  }

}


/* =========================================
   SIMPLE SOUND
========================================= */

let audioContext = null;

let soundEnabled = false;


function createAudio() {

  if (!audioContext) {

    audioContext =
      new (
        window.AudioContext ||
        window.webkitAudioContext
      )();

  }

}


function pageSound() {

  if (!soundEnabled)
    return;


  try {

    createAudio();


    const oscillator =
      audioContext.createOscillator();


    const gain =
      audioContext.createGain();


    oscillator.type =
      "sine";


    oscillator.frequency.value =
      520;


    gain.gain.setValueAtTime(
      .0001,
      audioContext.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
      .025,
      audioContext.currentTime + .01
    );


    gain.gain.exponentialRampToValueAtTime(
      .0001,
      audioContext.currentTime + .12
    );


    oscillator.connect(gain);

    gain.connect(
      audioContext.destination
    );


    oscillator.start();

    oscillator.stop(
      audioContext.currentTime + .13
    );

  } catch (error) {

    console.log(error);

  }

}


/* =========================================
   SOUND BUTTON
========================================= */

soundButton.addEventListener(
  "click",
  () => {

    soundEnabled =
      !soundEnabled;


    soundButton.textContent =
      soundEnabled
        ? "🔊"
        : "🔇";


    if (soundEnabled) {

      createAudio();

      pageSound();

    }

  }
);


/* =========================================
   ADD PAGE SOUND
========================================= */

const originalChangePage =
  changePage;


/*
 * เล่นเสียงทุกครั้งที่เปลี่ยนหน้า
 */

const observer =
  new MutationObserver(
    () => {

      if (
        isAnimating
      ) {

        pageSound();

      }

    }
  );


observer.observe(
  book,
  {
    subtree: true,
    attributes: true,
    attributeFilter: [
      "class"
    ]
  }
);


/* =========================================
   BUTTON EVENTS
========================================= */

prevButton.addEventListener(
  "click",
  previousPage
);


nextButton.addEventListener(
  "click",
  nextPage
);


/* =========================================
   DOUBLE CLICK = FULLSCREEN
========================================= */

document.addEventListener(
  "dblclick",
  event => {

    /*
     * ไม่ทำบนปุ่ม
     */

    if (
      event.target.closest("button")
    ) {

      return;

    }


    toggleFullscreen();

  }
);


/* =========================================
   START
========================================= */

updateUI();


/* =========================================
   GLOBAL
========================================= */

window.nextPage =
  nextPage;


window.previousPage =
  previousPage;


window.toggleFullscreen =
  toggleFullscreen;


window.toggleAutoPresentation =
  toggleAutoPresentation;
