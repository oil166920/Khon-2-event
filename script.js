/* =====================================
   KHON RONG NAI PRESENTATION
===================================== */

document.addEventListener("DOMContentLoaded", () => {

  const slides = Array.from(
    document.querySelectorAll(".slide")
  );

  const nextButton =
    document.getElementById("nextButton");

  const prevButton =
    document.getElementById("prevButton");

  const currentSlide =
    document.getElementById("currentSlide");

  const totalSlides =
    document.getElementById("totalSlides");

  const progress =
    document.getElementById("progress");

  const menuButton =
    document.getElementById("menuButton");

  const sideMenu =
    document.getElementById("sideMenu");

  const closeMenu =
    document.getElementById("closeMenu");

  const menuOverlay =
    document.getElementById("menuOverlay");

  const fullscreenButton =
    document.getElementById("fullscreenButton");


  let current = 0;

  const total = slides.length;

  totalSlides.textContent =
    String(total).padStart(2, "0");


  /* =====================================
     SHOW SLIDE
  ===================================== */

  function showSlide(index) {

    if (index < 0) {
      index = 0;
    }

    if (index >= total) {
      index = total - 1;
    }

    slides.forEach((slide, i) => {

      slide.classList.toggle(
        "active",
        i === index
      );

    });

    current = index;

    currentSlide.textContent =
      String(current + 1).padStart(2, "0");

    const percentage =
      ((current + 1) / total) * 100;

    progress.style.width =
      percentage + "%";

    prevButton.disabled =
      current === 0;

    nextButton.disabled =
      current === total - 1;

    updateMenu();

    closeSideMenu();

    /* Reset scroll */
    const activeSlide =
      slides[current];

    if (activeSlide) {
      activeSlide.scrollTop = 0;
    }

  }


  /* =====================================
     NEXT
  ===================================== */

  function nextSlide() {

    if (current < total - 1) {
      showSlide(current + 1);
    }

  }


  /* =====================================
     PREVIOUS
  ===================================== */

  function previousSlide() {

    if (current > 0) {
      showSlide(current - 1);
    }

  }


  /* =====================================
     BUTTONS
  ===================================== */

  nextButton.addEventListener(
    "click",
    nextSlide
  );

  prevButton.addEventListener(
    "click",
    previousSlide
  );


  /* =====================================
     DATA NEXT BUTTON
  ===================================== */

  document.querySelectorAll(
    "[data-next]"
  ).forEach(button => {

    button.addEventListener(
      "click",
      nextSlide
    );

  });


  /* =====================================
     MENU
  ===================================== */

  function openSideMenu() {

    sideMenu.classList.add("open");

    menuOverlay.classList.add("active");

  }


  function closeSideMenu() {

    sideMenu.classList.remove("open");

    menuOverlay.classList.remove("active");

  }


  menuButton.addEventListener(
    "click",
    openSideMenu
  );

  closeMenu.addEventListener(
    "click",
    closeSideMenu
  );

  menuOverlay.addEventListener(
    "click",
    closeSideMenu
  );


  /* =====================================
     MENU SLIDE
  ===================================== */

  const menuItems =
    document.querySelectorAll(
      ".menu-list button"
    );

  menuItems.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const index =
          Number(
            button.dataset.slide
          );

        showSlide(index);

      }
    );

  });


  function updateMenu() {

    menuItems.forEach(
      (button, index) => {

        button.classList.toggle(
          "active",
          index === current
        );

      }
    );

  }


  /* =====================================
     RESTART
  ===================================== */

  document.querySelectorAll(
    '[data-slide]'
  ).forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const index =
          Number(
            button.dataset.slide
          );

        showSlide(index);

      }
    );

  });


  /* =====================================
     KEYBOARD
  ===================================== */

  document.addEventListener(
    "keydown",
    event => {

      switch (event.key) {

        case "ArrowRight":
        case "ArrowDown":
        case " ":
          event.preventDefault();
          nextSlide();
          break;

        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          previousSlide();
          break;

        case "Home":
          event.preventDefault();
          showSlide(0);
          break;

        case "End":
          event.preventDefault();
          showSlide(total - 1);
          break;

        case "Escape":
          closeSideMenu();
          break;

      }

    }
  );


  /* =====================================
     TOUCH SWIPE
  ===================================== */

  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener(
    "touchstart",
    event => {

      touchStartX =
        event.changedTouches[0].screenX;

      touchStartY =
        event.changedTouches[0].screenY;

    },
    {
      passive: true
    }
  );


  document.addEventListener(
    "touchend",
    event => {

      const touchEndX =
        event.changedTouches[0].screenX;

      const touchEndY =
        event.changedTouches[0].screenY;

      const diffX =
        touchEndX - touchStartX;

      const diffY =
        touchEndY - touchStartY;

      /*
        ต้องปัดในแนวนอนมากกว่าแนวตั้ง
      */

      if (
        Math.abs(diffX) > 70 &&
        Math.abs(diffX) > Math.abs(diffY)
      ) {

        if (diffX < 0) {
          nextSlide();
        } else {
          previousSlide();
        }

      }

    },
    {
      passive: true
    }
  );


  /* =====================================
     FULLSCREEN
  ===================================== */

  fullscreenButton.addEventListener(
    "click",
    async () => {

      try {

        if (!document.fullscreenElement) {

          await document.documentElement
            .requestFullscreen();

          fullscreenButton.textContent = "×";

        } else {

          await document.exitFullscreen();

          fullscreenButton.textContent = "⛶";

        }

      } catch (error) {

        console.log(
          "Fullscreen unavailable:",
          error
        );

      }

    }
  );


  document.addEventListener(
    "fullscreenchange",
    () => {

      if (!document.fullscreenElement) {
        fullscreenButton.textContent = "⛶";
      } else {
        fullscreenButton.textContent = "×";
      }

    }
  );


  /* =====================================
     INITIALIZE
  ===================================== */

  showSlide(0);

});
