/* =========================================
   DIGITAL BOOK
========================================= */

const pages = Array.from(
  document.querySelectorAll(".page")
);

let currentPage = 0;

let isAnimating = false;


/* =========================================
   ELEMENTS
========================================= */

const currentPageText =
  document.getElementById("currentPage");

const totalPageText =
  document.getElementById("totalPage");

const prevButton =
  document.getElementById("prevBtn");

const nextButton =
  document.getElementById("nextBtn");

const dots =
  document.getElementById("dots");


/* =========================================
   INITIALIZE
========================================= */

totalPageText.textContent =
  String(pages.length).padStart(2, "0");


/* =========================================
   CREATE DOTS
========================================= */

pages.forEach((_, index) => {

  const dot =
    document.createElement("div");

  dot.className = "dot";

  dot.addEventListener("click", () => {

    if (index > currentPage) {

      goToPage(index, "next");

    } else if (index < currentPage) {

      goToPage(index, "prev");

    }

  });

  dots.appendChild(dot);

});


/* =========================================
   UPDATE UI
========================================= */

function updateUI() {

  currentPageText.textContent =
    String(currentPage + 1).padStart(2, "0");

  prevButton.disabled =
    currentPage === 0;

  nextButton.disabled =
    currentPage === pages.length - 1;


  const allDots =
    document.querySelectorAll(".dot");

  allDots.forEach((dot, index) => {

    dot.classList.toggle(
      "active",
      index === currentPage
    );

  });

}


/* =========================================
   NEXT PAGE
========================================= */

function nextPage() {

  if (isAnimating) return;

  if (currentPage >= pages.length - 1)
    return;

  goToPage(
    currentPage + 1,
    "next"
  );

}


/* =========================================
   PREVIOUS PAGE
========================================= */

function prevPage() {

  if (isAnimating) return;

  if (currentPage <= 0)
    return;

  goToPage(
    currentPage - 1,
    "prev"
  );

}


/* =========================================
   GO TO PAGE
========================================= */

function goToPage(
  target,
  direction
) {

  if (isAnimating)
    return;

  if (
    target < 0 ||
    target >= pages.length
  )
    return;


  isAnimating = true;


  const oldPage =
    pages[currentPage];

  const newPage =
    pages[target];


  /*
   * เตรียมหน้าใหม่
   */

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
   * ถัดไป
   */

  if (direction === "next") {

    newPage.style.display = "block";

    newPage.style.zIndex = "20";

    oldPage.style.zIndex = "10";

    newPage.classList.add("flip-next");


    setTimeout(() => {

      oldPage.classList.remove("active");

      newPage.classList.remove(
        "flip-next"
      );

      newPage.classList.add(
        "active"
      );

      newPage.style.display = "";

      newPage.style.zIndex = "";

      oldPage.style.zIndex = "";

      currentPage = target;

      updateUI();

      isAnimating = false;

    }, 750);

  }


  /*
   * ย้อนกลับ
   */

  else {

    newPage.style.display = "block";

    newPage.style.zIndex = "20";

    oldPage.style.zIndex = "10";

    newPage.classList.add("flip-prev");


    setTimeout(() => {

      oldPage.classList.remove("active");

      newPage.classList.remove(
        "flip-prev"
      );

      newPage.classList.add(
        "active"
      );

      newPage.style.display = "";

      newPage.style.zIndex = "";

      oldPage.style.zIndex = "";

      currentPage = target;

      updateUI();

      isAnimating = false;

    }, 750);

  }

}


/* =========================================
   KEYBOARD
========================================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "ArrowRight" ||
      event.key === "ArrowDown" ||
      event.key === " "
    ) {

      event.preventDefault();

      nextPage();

    }


    if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowUp"
    ) {

      event.preventDefault();

      prevPage();

    }

  }
);


/* =========================================
   SWIPE
========================================= */

let touchStartX = 0;

let touchEndX = 0;


document
  .getElementById("book")
  .addEventListener(
    "touchstart",
    event => {

      touchStartX =
        event.changedTouches[0].screenX;

    },
    { passive: true }
  );


document
  .getElementById("book")
  .addEventListener(
    "touchend",
    event => {

      touchEndX =
        event.changedTouches[0].screenX;

      handleSwipe();

    },
    { passive: true }
  );


function handleSwipe() {

  const distance =
    touchEndX - touchStartX;


  /*
   * ปัดซ้าย = หน้าถัดไป
   */

  if (distance < -60) {

    nextPage();

  }


  /*
   * ปัดขวา = หน้าก่อน
   */

  if (distance > 60) {

    prevPage();

  }

}


/* =========================================
   MOUSE WHEEL
========================================= */

let wheelLock = false;


document.addEventListener(
  "wheel",
  event => {

    if (wheelLock)
      return;


    /*
     * ไม่เปลี่ยนหน้าถ้า
     * กำลังเลื่อนเนื้อหาในหน้า
     */

    const activePage =
      pages[currentPage]
        ?.querySelector(".page-inner");


    if (
      activePage &&
      Math.abs(event.deltaY) > 40
    ) {

      const atTop =
        activePage.scrollTop <= 0;

      const atBottom =
        activePage.scrollTop +
        activePage.clientHeight >=
        activePage.scrollHeight - 2;


      if (
        event.deltaY > 0 &&
        !atBottom
      ) {

        return;

      }


      if (
        event.deltaY < 0 &&
        !atTop
      ) {

        return;

      }

    }


    wheelLock = true;


    if (event.deltaY > 0) {

      nextPage();

    } else {

      prevPage();

    }


    setTimeout(() => {

      wheelLock = false;

    }, 800);

  },
  { passive: true }
);


/* =========================================
   INITIAL
========================================= */

updateUI();


/* =========================================
   GLOBAL FUNCTIONS
========================================= */

window.nextPage = nextPage;

window.prevPage = prevPage;
