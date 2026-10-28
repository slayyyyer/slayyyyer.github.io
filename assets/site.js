/* Scroll parallax for the scene, panes and watermark; pointer parallax in the hero. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var scrollItems = Array.prototype.slice.call(document.querySelectorAll("[data-speed]"));
  var mouseItems = Array.prototype.slice.call(document.querySelectorAll("[data-mouse]"));
  var hero = document.querySelector(".hero");
  var scrollQueued = false;
  var pointerQueued = false;
  var pointerX = 0;
  var pointerY = 0;

  function applyScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;

    if (!reduceMotion) {
      scrollItems.forEach(function (el) {
        var speed = parseFloat(el.getAttribute("data-speed")) || 0;
        el.style.setProperty("--par", (y * speed).toFixed(2) + "px");
      });
    }

    document.body.classList.toggle("is-scrolled", y > 140);
    scrollQueued = false;
  }

  function onScroll() {
    if (!scrollQueued) {
      scrollQueued = true;
      window.requestAnimationFrame(applyScroll);
    }
  }

  function applyPointer() {
    mouseItems.forEach(function (el) {
      var depth = parseFloat(el.getAttribute("data-mouse")) || 0;
      el.style.setProperty("--mx", (pointerX * -depth).toFixed(2) + "px");
      el.style.setProperty("--my", (pointerY * -depth).toFixed(2) + "px");
    });

    pointerQueued = false;
  }

  if (hero && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    hero.addEventListener("pointermove", function (event) {
      var rect = hero.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / rect.width - 0.5;
      pointerY = (event.clientY - rect.top) / rect.height - 0.5;

      if (!pointerQueued) {
        pointerQueued = true;
        window.requestAnimationFrame(applyPointer);
      }
    }, { passive: true });

    hero.addEventListener("pointerleave", function () {
      pointerX = 0;
      pointerY = 0;
      applyPointer();
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  applyScroll();
})();
