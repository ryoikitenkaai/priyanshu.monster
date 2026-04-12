document.documentElement.classList.add("js");

const sections = Array.from(document.querySelectorAll(".story-section"));
const chapterLabel = document.getElementById("active-chapter");

const visibilityRatios = new Map();
let rafId = null;

function setActiveSection(section) {
  if (!section) {
    return;
  }

  sections.forEach((item) => {
    item.classList.toggle("is-active", item === section);
  });

  if (chapterLabel) {
    chapterLabel.textContent = section.dataset.chapter || "Friends";
  }
}

function revealAllSections() {
  sections.forEach((section) => {
    section.classList.add("is-visible");
  });
  setActiveSection(sections[0]);
}

function sectionScore(section) {
  const ratio = visibilityRatios.get(section) || 0;
  const rect = section.getBoundingClientRect();
  const viewportCenter = window.innerHeight / 2;
  const sectionCenter = rect.top + rect.height / 2;
  const centerDistance = Math.abs(viewportCenter - sectionCenter);

  // Favor visible sections while still keeping stable chapter switching during scroll.
  return ratio * 1000 - centerDistance;
}

function syncActiveByViewport() {
  if (!sections.length) {
    return;
  }

  let bestSection = sections[0];
  let bestScore = Number.NEGATIVE_INFINITY;

  sections.forEach((section) => {
    const score = sectionScore(section);
    if (score > bestScore) {
      bestScore = score;
      bestSection = section;
    }
  });

  setActiveSection(bestSection);
}

function scheduleActiveSync() {
  if (rafId) {
    return;
  }

  rafId = window.requestAnimationFrame(() => {
    syncActiveByViewport();
    rafId = null;
  });
}

function initRevealObserver() {
  if (!sections.length) {
    return;
  }

  if (reducedMotionQuery.matches || !("IntersectionObserver" in window)) {
    revealAllSections();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        visibilityRatios.set(entry.target, entry.intersectionRatio);
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });

      scheduleActiveSync();
    },
    {
      threshold: [0.1, 0.25, 0.45, 0.65, 0.85],
      rootMargin: "-8% 0px -16% 0px"
    }
  );

  sections.forEach((section) => {
    visibilityRatios.set(section, 0);
    observer.observe(section);
  });

  window.addEventListener("scroll", scheduleActiveSync, { passive: true });
  window.addEventListener("resize", scheduleActiveSync);
  scheduleActiveSync();
}

initRevealObserver();
const FRIENDS = [
  {
    key: "istiyaq",
    name: "The nigga Kisser",
    title: "Istiyaq",
    badge: "Lip-sync Commander",
    status: "Kiss velocity: unstable but iconic",
    images: ["istiyaq.jpeg", "istiyaq1.jpeg", "istiyaq2.jpeg"],
    quips: [
      "Legend says mirrors blush first when Istiyaq enters.",
      "Emergency alert: kiss radius expanding too fast.",
      "Official snack: mint and dramatic entrances."
    ]
  },
  {
    key: "somnath",
    name: "The Rizzer",
    title: "Somnath",
    badge: "Conversation Hacker",
    status: "Rizz meter: legally suspicious",
    images: ["somnath.jpeg", "somnath1.jpeg"],
    quips: [
      "Somnath turned small talk into a premium subscription.",
      "When he says hello, nearby plants start smiling.",
      "Rizz intensity currently violating local gravity."
    ]
  },
  {
    key: "sumit",
    name: "the chut-vinashak",
    title: "Sumit",
    badge: "Calm Chaos Engine",
    status: "Destruction style: elegant and punctual",
    images: ["sumit.jpeg"],
    quips: [
      "Sumit does not break plans. He upgrades them to explosions.",
      "His " +
      '"fine"' +
      " means 6 tabs, 4 ideas, and one dramatic finale.",
      "Vinashak protocol active. Hide your group chat."
    ]
  }
];

const HERO_LINES = [
  "Three friends. One timeline. Unlimited roast energy.",
  "Swipe through greatness with zero chill.",
  "This gallery is sponsored by pure friendship chaos.",
  "If laughter had a dashboard, this would be it."
];

const CHAOS_LINES = [
  "Chaos deployed. Hairlines and timelines both moved.",
  "Surprise packet unlocked. Team dignity not found.",
  "New mission: keep a straight face for 5 seconds.",
  "Warning: roast engine now in overclock mode."
];

const UNLOCK_LINES = [
  "Timeline unlocked. All legends are online.",
  "One scroll executed. Roast feed fully opened.",
  "System handshake complete. Everything is now visible.",
  "Scroll key accepted. Chaos deck deployed."
];

const THEME_POOL = ["ice", "sunset", "neon"];
const AUTO_MS = 3600;
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const sliderStates = new Map();
let soundEnabled = false;
let audioContext = null;
let subtitleTicker = null;
let toastTimer = null;
let heroClicks = 0;

const heroSubtitle = document.getElementById("hero-subtitle");
const friendGrid = document.getElementById("friend-grid");
const chaosBtn = document.getElementById("chaos-btn");
const soundBtn = document.getElementById("sound-btn");
const shuffleBtn = document.getElementById("shuffle-btn");
const surpriseText = document.getElementById("surprise-text");
const toast = document.getElementById("toast");
const heroTitle = document.getElementById("hero-title");
const rootElement = document.documentElement;

function prefersReducedMotion() {
  return reducedMotionQuery.matches;
}

function preloadCriticalImages() {
  FRIENDS.forEach((friend) => {
    if (!friend.images.length) {
      return;
    }
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = friend.images[0];
    document.head.appendChild(link);
  });
}

function createCard(friend) {
  const card = document.createElement("article");
  card.className = "friend-card glass-panel";
  card.dataset.friend = friend.key;

  const slides = friend.images
    .map(
      (src, index) => `
      <figure class="slide" aria-hidden="${index === 0 ? "false" : "true"}">
        <img
          src="/ll/${src}"
          alt="${friend.name} slide ${index + 1}"
          loading="${index === 0 ? "eager" : "lazy"}"
          fetchpriority="${index === 0 ? "high" : "auto"}"
          decoding="async"
          width="960"
          height="1200"
        />
      </figure>`
    )
    .join("");

  const dots = friend.images
    .map(
      (_, index) =>
        `<button class="dot${index === 0 ? " active" : ""}" data-dot="${index}" aria-label="Go to slide ${index + 1
        }" aria-current="${index === 0 ? "true" : "false"}"></button>`
    )
    .join("");

  const controlsDisabled = friend.images.length <= 1 ? "disabled" : "";

  card.innerHTML = `
    <div class="card-head">
      <p class="friend-code">unit // ${friend.key}</p>
      <h3 class="friend-name">${friend.name}</h3>
      <p class="friend-title">${friend.name} - ${friend.title}</p>
      <span class="friend-badge">${friend.badge}</span>
    </div>

    <div class="slide-viewport" data-viewport>
      <div class="slides-track" data-track>
        ${slides}
      </div>
      <button class="slider-nav prev" data-prev aria-label="Previous image" ${controlsDisabled}>◀</button>
      <button class="slider-nav next" data-next aria-label="Next image" ${controlsDisabled}>▶</button>
      <div class="slider-dots" aria-label="Slide selector">
        ${dots}
      </div>
    </div>

    <div class="card-foot">
      <p class="status-line">${friend.status}</p>
      <button class="card-btn" data-surprise>Surprise Line</button>
    </div>
  `;

  return card;
}

function updateSlider(state, nextIndex, announce = false) {
  const safeIndex = (nextIndex + state.total) % state.total;
  state.index = safeIndex;

  const offset = safeIndex * -100;
  state.track.style.transform = `translate3d(${offset}%, 0, 0)`;

  state.slides.forEach((slide, idx) => {
    slide.setAttribute("aria-hidden", String(idx !== safeIndex));
  });

  state.dots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === safeIndex);
    dot.setAttribute("aria-current", String(idx === safeIndex));
  });

  if (announce) {
    const message = `${state.name} is now on slide ${safeIndex + 1}`;
    setToast(message);
  }
}

function jump(state, delta, announce = false) {
  updateSlider(state, state.index + delta, announce);
  playBlip(480 + state.index * 40, 0.05);
}

function randomIndex(total) {
  return Math.floor(Math.random() * total);
}

function startAutoplay(state) {
  if (state.total <= 1 || prefersReducedMotion()) {
    return;
  }

  stopAutoplay(state);
  state.timer = window.setInterval(() => {
    if (state.paused || document.hidden || !state.visible) {
      return;
    }
    jump(state, 1);
  }, AUTO_MS);
}

function stopAutoplay(state) {
  if (!state.timer) {
    return;
  }
  window.clearInterval(state.timer);
  state.timer = null;
}

function setToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  if (toastTimer) {
    window.clearTimeout(toastTimer);
  }

  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 1900);
}

function syncSoundButton() {
  soundBtn.textContent = `Sound: ${soundEnabled ? "On" : "Off"}`;
  soundBtn.setAttribute("aria-pressed", String(soundEnabled));
}

function rotateHeroSubtitle() {
  let index = 0;
  heroSubtitle.textContent = HERO_LINES[0];

  subtitleTicker = window.setInterval(() => {
    index = (index + 1) % HERO_LINES.length;
    heroSubtitle.textContent = HERO_LINES[index];
  }, 3200);
}

function getAudioContext() {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

function playBlip(frequency = 360, duration = 0.07) {
  if (!soundEnabled) {
    return;
  }

  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.035, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration + 0.01);
  } catch {
    // Audio is optional; failure here should not affect slideshow interactions.
  }
}

function attachPointerSwipe(viewport, state) {
  let startX = 0;
  let startTime = 0;

  viewport.addEventListener("pointerdown", (event) => {
    if (state.total <= 1) {
      return;
    }
    startX = event.clientX;
    startTime = Date.now();
  });

  viewport.addEventListener("pointerup", (event) => {
    if (state.total <= 1 || !startTime) {
      return;
    }

    const deltaX = event.clientX - startX;
    const elapsed = Date.now() - startTime;
    startTime = 0;

    if (elapsed > 600 || Math.abs(deltaX) < 38) {
      return;
    }

    if (deltaX > 0) {
      jump(state, -1, true);
      return;
    }

    jump(state, 1, true);
  });
}

function registerSliders() {
  const cards = friendGrid.querySelectorAll(".friend-card");

  cards.forEach((card, cardIndex) => {
    const friend = FRIENDS[cardIndex];
    const track = card.querySelector("[data-track]");
    const slides = [...card.querySelectorAll(".slide")];
    const dots = [...card.querySelectorAll("[data-dot]")];
    const viewport = card.querySelector("[data-viewport]");
    const prev = card.querySelector("[data-prev]");
    const next = card.querySelector("[data-next]");

    const state = {
      key: friend.key,
      name: friend.name,
      index: 0,
      total: friend.images.length,
      track,
      slides,
      dots,
      timer: null,
      paused: false,
      visible: true,
      quips: friend.quips,
      quipIndex: 0,
      statusEl: card.querySelector(".status-line")
    };

    sliderStates.set(friend.key, state);

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const index = Number(dot.dataset.dot || 0);
        updateSlider(state, index, true);
        playBlip(420 + index * 36, 0.05);
      });
    });

    prev.addEventListener("click", () => jump(state, -1, true));
    next.addEventListener("click", () => jump(state, 1, true));

    const surpriseBtn = card.querySelector("[data-surprise]");
    surpriseBtn.addEventListener("click", () => {
      state.quipIndex = (state.quipIndex + 1) % state.quips.length;
      const line = state.quips[state.quipIndex];
      state.statusEl.textContent = line;
      setToast(`${state.name}: ${line}`);
      card.classList.remove("pulse");
      void card.offsetWidth;
      card.classList.add("pulse");
      window.setTimeout(() => card.classList.remove("pulse"), 340);
      playBlip(640, 0.09);
    });

    card.addEventListener("mouseenter", () => {
      state.paused = true;
    });

    card.addEventListener("mouseleave", () => {
      state.paused = false;
    });

    card.addEventListener("focusin", () => {
      state.paused = true;
    });

    card.addEventListener("focusout", () => {
      state.paused = false;
    });

    attachPointerSwipe(viewport, state);
    startAutoplay(state);
  });
}

function setupVisibilityObserver() {
  if (!("IntersectionObserver" in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const key = entry.target.getAttribute("data-friend");
        if (!key) {
          return;
        }
        const state = sliderStates.get(key);
        if (!state) {
          return;
        }
        state.visible = entry.isIntersecting;
      });
    },
    {
      threshold: 0.12
    }
  );

  friendGrid.querySelectorAll(".friend-card").forEach((card) => observer.observe(card));
}

function runChaosMode() {
  const theme = THEME_POOL[randomIndex(THEME_POOL.length)];
  document.body.dataset.theme = theme;

  sliderStates.forEach((state) => {
    const next = randomIndex(state.total);
    updateSlider(state, next);
  });

  const line = CHAOS_LINES[randomIndex(CHAOS_LINES.length)];
  surpriseText.textContent = line;
  setToast(line);

  document.body.classList.add("chaos");
  window.setTimeout(() => document.body.classList.remove("chaos"), 420);

  playBlip(820, 0.1);
  playBlip(510, 0.11);
}

function shuffleAll() {
  sliderStates.forEach((state) => {
    updateSlider(state, randomIndex(state.total), true);
  });
  setToast("All timelines shuffled. Nobody is safe.");
  playBlip(730, 0.08);
}

function toggleSound() {
  soundEnabled = !soundEnabled;

  if (soundEnabled) {
    getAudioContext().resume().catch(() => {
      soundEnabled = false;
      syncSoundButton();
    });
  }

  syncSoundButton();
  playBlip(620, 0.09);
}

function setupHeroEasterEgg() {
  heroTitle.addEventListener("click", () => {
    heroClicks += 1;
    if (heroClicks < 5) {
      return;
    }

    heroClicks = 0;
    runChaosMode();
    setToast("Secret unlocked: Roast Reactor x5 combo!");
  });
}

function setupGlobalEvents() {
  chaosBtn.addEventListener("click", runChaosMode);
  shuffleBtn.addEventListener("click", shuffleAll);
  soundBtn.addEventListener("click", toggleSound);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      sliderStates.forEach((state) => stopAutoplay(state));
      return;
    }

    if (prefersReducedMotion()) {
      sliderStates.forEach((state) => stopAutoplay(state));
      return;
    }

    sliderStates.forEach((state) => startAutoplay(state));
  });

  const motionHandler = () => {
    if (prefersReducedMotion()) {
      sliderStates.forEach((state) => stopAutoplay(state));
      return;
    }
    sliderStates.forEach((state) => startAutoplay(state));
  };

  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", motionHandler);
  } else {
    reducedMotionQuery.addListener(motionHandler);
  }
}

function setupSingleScrollReveal() {
  if (!rootElement.classList.contains("intro-lock")) {
    rootElement.classList.add("revealed");
    return;
  }

  if (prefersReducedMotion()) {
    rootElement.classList.remove("intro-lock");
    rootElement.classList.add("revealed");
    return;
  }

  let touchStartY = 0;
  let unlocked = false;

  const revealAll = () => {
    if (unlocked) {
      return;
    }

    unlocked = true;
    rootElement.classList.remove("intro-lock");
    rootElement.classList.add("revealed");
    friendGrid.scrollIntoView({ behavior: "smooth", block: "start" });
    setToast(UNLOCK_LINES[randomIndex(UNLOCK_LINES.length)]);

    window.removeEventListener("wheel", handleWheel);
    window.removeEventListener("keydown", handleKeydown);
    window.removeEventListener("touchstart", handleTouchStart);
    window.removeEventListener("touchmove", handleTouchMove);
  };

  const handleWheel = (event) => {
    if (event.deltaY <= 8) {
      return;
    }
    event.preventDefault();
    revealAll();
  };

  const handleKeydown = (event) => {
    const triggerKeys = ["ArrowDown", "PageDown", " "];
    if (!triggerKeys.includes(event.key)) {
      return;
    }
    event.preventDefault();
    revealAll();
  };

  const handleTouchStart = (event) => {
    touchStartY = event.changedTouches[0]?.clientY ?? 0;
  };

  const handleTouchMove = (event) => {
    const currentY = event.changedTouches[0]?.clientY ?? touchStartY;
    if (touchStartY - currentY <= 24) {
      return;
    }
    revealAll();
  };

  window.addEventListener("wheel", handleWheel, { passive: false });
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("touchstart", handleTouchStart, { passive: true });
  window.addEventListener("touchmove", handleTouchMove, { passive: true });
}

function renderCards() {
  const fragment = document.createDocumentFragment();
  FRIENDS.forEach((friend) => {
    fragment.appendChild(createCard(friend));
  });
  friendGrid.appendChild(fragment);
}

function init() {
  preloadCriticalImages();
  renderCards();
  registerSliders();
  setupVisibilityObserver();
  setupGlobalEvents();
  setupSingleScrollReveal();
  setupHeroEasterEgg();
  rotateHeroSubtitle();
  syncSoundButton();
}

init();
