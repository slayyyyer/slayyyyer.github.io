/* My World: the map/list toggle, a local-time sky, and two optional live details.
   Everything here is progressive: without this file the links and the list still work. */
(function () {
  "use strict";

  var map = document.querySelector(".world-map");
  var view = document.querySelector(".world-view");
  var toggle = document.querySelector("[data-world-toggle]");
  var status = document.querySelector("[data-world-status]");
  var buttons = toggle ? Array.prototype.slice.call(toggle.querySelectorAll("[data-view-btn]")) : [];
  var narrow = window.matchMedia("(max-width: 700px)");
  var choseView = false;

  function setView(name, announce) {
    if (!view) return;

    view.setAttribute("data-view", name);

    buttons.forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.getAttribute("data-view-btn") === name));
    });

    if (announce && status) {
      status.textContent = name === "list" ? "Showing the list view." : "Showing the map view.";
    }
  }

  if (view && toggle) {
    toggle.removeAttribute("hidden");
    setView(narrow.matches ? "list" : "map");

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        choseView = true;
        setView(button.getAttribute("data-view-btn"), true);
      });
    });

    var onBreakpoint = function () {
      if (!choseView) setView(narrow.matches ? "list" : "map");
    };

    if (narrow.addEventListener) narrow.addEventListener("change", onBreakpoint);
    else if (narrow.addListener) narrow.addListener(onBreakpoint);
  }

  /* Morning/evening/night sky, from the visitor's own clock. Day is the default. */
  if (map) {
    var hour = new Date().getHours();

    if (hour >= 20 || hour < 5) map.classList.add("is-night");
    else if (hour >= 17 || hour < 7) map.classList.add("is-dusk");
  }

  /* Two small same-origin files. Both are optional, timed out, and fail silently. */
  var LIVE = {
    "what-changed": {
      url: "/what-changed/data/today.json",
      summary: function (data) {
        if (!data || !data.date) return "";

        var parts = String(data.date).split("-");
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var date = months[Number(parts[1]) - 1] + " " + Number(parts[2]);
        var moved = 0;
        var aged = 0;
        var missing = 0;

        (data.sources || []).forEach(function (source) {
          var diff = source.diff;

          if (!diff) {
            if (!source.status || source.status.result !== "unchanged") missing += 1;
            return;
          }

          var stats = diff.stats || {};
          moved += (stats.added || 0) + (stats.changed || 0) + (stats.removed || 0);
          aged += stats.expired || 0;
        });

        if (moved) return date + " · " + moved + " moved";
        if (aged) return date + " · quiet, " + aged + " aged out";
        if (missing) return date + " · partial";
        return date + " · nothing changed";
      }
    },
    "mx-lab": {
      url: "/mx-lab/data/meta.json",
      summary: function (data) {
        var dataset = data && data.dataset;
        if (!dataset) return "";

        var seasons = Array.isArray(data.seasons) ? data.seasons : [];
        var latest = seasons.length ? seasons[seasons.length - 1].season : null;
        var bits = [];

        if (latest) bits.push(latest + " season");
        else if (dataset.seasons) bits.push(dataset.seasons + " seasons");
        if (dataset.events) bits.push(dataset.events + " events");

        return bits.join(" · ");
      }
    }
  };

  function cacheGet(id) {
    try {
      var raw = window.localStorage.getItem("world:live:" + id);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed.text === "string" ? parsed : null;
    } catch (error) {
      return null;
    }
  }

  function cacheSet(id, text) {
    try {
      window.localStorage.setItem("world:live:" + id, JSON.stringify({ text: text, at: Date.now() }));
    } catch (error) {
      /* private mode or a full store: live data simply will not persist */
    }
  }

  function showLive(id, text, stale) {
    var line = "latest: " + text + (stale ? " · stale" : "");
    var list = document.querySelector('[data-live-for="' + id + '"]');
    var group = document.querySelector('[data-live-group="' + id + '"]');
    var textNode = document.querySelector('[data-live-text="' + id + '"]');

    if (list) {
      list.textContent = line;
      list.hidden = false;
      list.classList.toggle("is-stale", Boolean(stale));
    }

    if (group && textNode) {
      textNode.textContent = line;
      textNode.classList.toggle("is-stale", Boolean(stale));
      var link = group.closest("a");
      if (link) link.classList.add("has-live");
    }
  }

  function loadLive(id, config) {
    if (!window.fetch) return;

    var controller = null;
    var timer = 0;

    try {
      controller = new AbortController();
    } catch (error) {
      controller = null;
    }

    if (controller) {
      timer = window.setTimeout(function () {
        try { controller.abort(); } catch (error) { /* already finished */ }
      }, 4000);
    }

    var options = { credentials: "same-origin" };
    if (controller) options.signal = controller.signal;

    window.fetch(config.url, options)
      .then(function (response) {
        if (!response.ok) throw new Error("live data unavailable");
        return response.json();
      })
      .then(function (data) {
        var summary = "";

        try {
          summary = config.summary(data) || "";
        } catch (error) {
          summary = "";
        }

        if (!summary) throw new Error("live data empty");
        showLive(id, summary, false);
        cacheSet(id, summary);
      })
      .catch(function () {
        var cached = cacheGet(id);
        if (cached) showLive(id, cached.text, true);
      })
      .then(function () {
        window.clearTimeout(timer);
      });
  }

  if (map) {
    window.setTimeout(function () {
      Object.keys(LIVE).forEach(function (id) {
        loadLive(id, LIVE[id]);
      });
    }, 700);
  }
})();
