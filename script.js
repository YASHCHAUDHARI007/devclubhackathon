/**
 * AURA MOTORS — Official Multi-Page Interactive Script
 * Pure Vanilla JavaScript (ES6+). Zero external frameworks.
 * Safe initializers that operate across all dedicated pages.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 01: INITIALIZE APPLICATION LOAD STATE & PAGE TRANSITION
  // --------------------------------------------------------------------------
  window.addEventListener('load', () => {
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
  });

  // Fast fallback if window.load already completed
  if (document.readyState === 'complete') {
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
  }

  // --------------------------------------------------------------------------
  // 02: CUSTOM CURSOR ENGINE (DESKTOP)
  // --------------------------------------------------------------------------
  const initCursor = () => {
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');

    if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;
      let ringX = mouseX;
      let ringY = mouseY;
      let isMoving = false;

      window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        if (!isMoving) {
          cursorDot.style.opacity = '1';
          cursorRing.style.opacity = '1';
          isMoving = true;
        }
      });

      const renderCursor = () => {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
        requestAnimationFrame(renderCursor);
      };
      renderCursor();

      const hoverSelectors = 'a, button, input, select, label, .tech-callout, .swatch-btn, .pill-option, .bento-card, .model-card, .liquid-glass, .metric-card, [data-expandable="true"]';
      document.querySelectorAll(hoverSelectors).forEach((el) => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      });

      document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorRing.style.opacity = '0';
      });
    }
  };

  // --------------------------------------------------------------------------
  // 03: SYNTHETIC PROPULSION SOUND ENGINE (WEB AUDIO API)
  // --------------------------------------------------------------------------
  let audioCtx = null;
  let osc = null;
  let gainNode = null;
  let filterNode = null;
  let isSoundActive = false;

  const playDriveSound = (freq = 90, duration = 2.5) => {
    if (!isSoundActive || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      gainNode.gain.cancelScheduledValues(now);
      filterNode.frequency.cancelScheduledValues(now);
      osc.frequency.cancelScheduledValues(now);

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.12, now + 0.3);

      osc.frequency.setValueAtTime(70, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 3.5, now + duration);

      filterNode.frequency.setValueAtTime(300, now);
      filterNode.frequency.exponentialRampToValueAtTime(1400, now + duration);

      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.5);
    } catch (e) {
      console.warn('Audio synthesis notice:', e);
    }
  };

  const initAudioController = () => {
    const soundToggle = document.getElementById('soundToggle');
    if (!soundToggle) return;

    const setupAudio = () => {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();

        osc = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();
        filterNode = audioCtx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(65, audioCtx.currentTime);

        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(260, audioCtx.currentTime);

        gainNode.gain.setValueAtTime(0.0001, audioCtx.currentTime);

        osc.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.start();
      }
    };

    soundToggle.addEventListener('click', () => {
      setupAudio();
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      isSoundActive = !isSoundActive;
      soundToggle.classList.toggle('active', isSoundActive);
      const soundText = soundToggle.querySelector('.sound-text');
      if (soundText) {
        soundText.textContent = isSoundActive ? 'SOUND: ACTIVE' : 'SOUND: OFF';
      }

      if (isSoundActive) {
        playDriveSound(140, 1.8);
      }
    });
  };

  // --------------------------------------------------------------------------
  // 04: GLOBAL NAVBAR & ACTIVE PAGE DETECTION (PATHNAME-BASED)
  // --------------------------------------------------------------------------
  const initNavigation = () => {
    const navbar = document.getElementById('navbar');
    const backToTopBtn = document.getElementById('backToTop');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-cta');

    // Navbar scroll blur state
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      if (navbar) {
        navbar.classList.toggle('scrolled', scrollPos > 30);
      }
      if (backToTopBtn) {
        backToTopBtn.classList.toggle('visible', scrollPos > 400);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Determine current HTML page from window.location.pathname
    const path = window.location.pathname;
    let currentFileName = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    if (!currentFileName.endsWith('.html') && currentFileName !== '') {
      currentFileName = `${currentFileName}.html`;
    }
    if (currentFileName === '' || currentFileName === '/') {
      currentFileName = 'index.html';
    }

    // Apply .active to desktop navigation links
    const navLinks = document.querySelectorAll('.nav-links .nav-link, .nav-actions .btn-nav');
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      const targetFileName = href.substring(href.lastIndexOf('/') + 1).split('#')[0];
      if (targetFileName === currentFileName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Apply .active to mobile drawer navigation links
    const mobileLinks = document.querySelectorAll('.drawer-nav .drawer-link, .drawer-footer .drawer-cta');
    mobileLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      const targetFileName = href.substring(href.lastIndexOf('/') + 1).split('#')[0];
      if (targetFileName === currentFileName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Mobile drawer toggle
    const toggleDrawer = (forceClose = false) => {
      if (!hamburgerBtn || !mobileDrawer) return;
      const isOpen = forceClose ? false : !mobileDrawer.classList.contains('open');

      hamburgerBtn.classList.toggle('active', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileDrawer.classList.toggle('open', isOpen);
      mobileDrawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    if (hamburgerBtn) {
      hamburgerBtn.addEventListener('click', () => toggleDrawer());
    }

    drawerLinks.forEach((link) => {
      link.addEventListener('click', () => toggleDrawer(true));
    });
  };

  // --------------------------------------------------------------------------
  // 05: SCROLL REVEAL OBSERVER
  // --------------------------------------------------------------------------
  const initScrollReveals = () => {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!revealElements.length) return;

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  };

  // --------------------------------------------------------------------------
  // 06: PERFORMANCE ANIMATED COUNTERS
  // --------------------------------------------------------------------------
  const initCounters = () => {
    const counterElements = document.querySelectorAll('.counter-value');
    if (!counterElements.length) return;

    let countersAnimated = false;

    const animateCounters = () => {
      if (countersAnimated) return;
      countersAnimated = true;

      counterElements.forEach((counter) => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
        const duration = 1800;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeVal = 1 - Math.pow(1 - progress, 4);
          const currentVal = (easeVal * target).toFixed(decimals);

          counter.textContent = currentVal;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target.toFixed(decimals);
          }
        };

        requestAnimationFrame(updateCounter);
      });
    };

    const targetSection = document.getElementById('performance') || document.querySelector('.metrics-grid');
    if (targetSection) {
      const counterObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounters();
            }
          });
        },
        { threshold: 0.2 }
      );
      counterObserver.observe(targetSection);
    } else {
      animateCounters();
    }
  };

  // --------------------------------------------------------------------------
  // 07: LIVE LAUNCH TELEMETRY SIMULATION
  // --------------------------------------------------------------------------
  const initLaunchSimulation = () => {
    const launchSimBtn = document.getElementById('launchSimBtn');
    const trackProgress = document.getElementById('trackProgress');
    const trackIndicator = document.getElementById('trackIndicator');
    const currentSpeedLabel = document.getElementById('currentSpeedLabel');
    const hudTimer = document.getElementById('hudTimer');
    const hudGForce = document.getElementById('hudGForce');

    if (!launchSimBtn || !trackProgress || !trackIndicator || !currentSpeedLabel || !hudTimer || !hudGForce) {
      return;
    }

    let isLaunching = false;

    launchSimBtn.addEventListener('click', () => {
      if (isLaunching) return;
      isLaunching = true;
      launchSimBtn.disabled = true;
      launchSimBtn.style.opacity = '0.6';

      playDriveSound(220, 2.8);

      const targetDuration = 2800; // 2.8 seconds
      const startTime = performance.now();

      const runLaunchStep = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / targetDuration, 1);

        const speedKmh = Math.floor(Math.pow(progress, 0.75) * 100);
        const secondsFormatted = (Math.min(elapsed, targetDuration) / 1000).toFixed(2);

        let gForce = 0;
        if (progress < 0.25) {
          gForce = (1.1 + (progress / 0.25) * 0.25).toFixed(2);
        } else {
          gForce = (1.35 - (progress - 0.25) * 0.5).toFixed(2);
        }

        const percentage = (progress * 100).toFixed(1);
        trackProgress.style.width = `${percentage}%`;
        trackIndicator.style.left = `${percentage}%`;
        currentSpeedLabel.textContent = `${speedKmh} KM/H`;
        hudTimer.innerHTML = `${secondsFormatted} <small>s</small>`;
        hudGForce.innerHTML = `${progress >= 1 ? '0.00' : gForce} <small>G</small>`;

        if (progress < 1) {
          requestAnimationFrame(runLaunchStep);
        } else {
          setTimeout(() => {
            isLaunching = false;
            launchSimBtn.disabled = false;
            launchSimBtn.style.opacity = '1';
          }, 800);
        }
      };

      requestAnimationFrame(runLaunchStep);
    });
  };

  // --------------------------------------------------------------------------
  // 08: BENTO GRID DYNAMIC CURSOR GLOW
  // --------------------------------------------------------------------------
  const initBentoEffects = () => {
    const bentoCards = document.querySelectorAll('.bento-card');
    if (!bentoCards.length) return;

    bentoCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  };

  // --------------------------------------------------------------------------
  // 09: TECHNICAL VEHICLE HOTSPOTS
  // --------------------------------------------------------------------------
  const initHotspots = () => {
    const techCallouts = document.querySelectorAll('.tech-callout');
    if (!techCallouts.length) return;

    techCallouts.forEach((callout) => {
      callout.addEventListener('click', (e) => {
        e.stopPropagation();
        const isCurrentlyActive = callout.classList.contains('active');
        techCallouts.forEach((c) => c.classList.remove('active'));
        if (!isCurrentlyActive) {
          callout.classList.add('active');
        }
      });
    });

    document.addEventListener('click', () => {
      techCallouts.forEach((c) => c.classList.remove('active'));
    });
  };

  // --------------------------------------------------------------------------
  // 10: INTERIOR COCKPIT VIEW SWITCHER
  // --------------------------------------------------------------------------
  const initInteriorSwitcher = () => {
    const interiorDisplayImg = document.getElementById('interiorDisplayImg');
    const interiorViewBtns = document.querySelectorAll('.view-btn');
    if (!interiorDisplayImg || !interiorViewBtns.length) return;

    interiorViewBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        interiorViewBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const newSrc = btn.getAttribute('data-interior-src');
        if (newSrc) {
          interiorDisplayImg.style.opacity = '0';
          setTimeout(() => {
            interiorDisplayImg.src = newSrc;
            interiorDisplayImg.style.opacity = '1';
          }, 250);
        }
      });
    });
  };

  // --------------------------------------------------------------------------
  // 11: CONFIGURATOR & DYNAMIC PRICE CALCULATOR ENGINE
  // --------------------------------------------------------------------------
  const initConfigurator = () => {
    const configuratorForm = document.getElementById('configuratorForm');
    if (!configuratorForm) return;

    const BASE_PRICE = 8900000; // Base vehicle ₹89,00,000

    const configState = {
      color: {
        id: 'black',
        name: 'Obsidian Black',
        price: 0,
        img: 'assets/profile.jpg'
      },
      wheel: {
        id: 'aero19',
        name: 'Aero 19"',
        price: 0
      },
      interior: {
        id: 'onyx',
        name: 'Onyx Alcantara',
        price: 0,
        img: 'assets/interior.jpg'
      },
      packages: {
        tech: 400000,
        track: 0
      },
      activeView: 'exterior'
    };

    const configCarImg = document.getElementById('configCarImg');
    const configBadge = document.getElementById('configBadge');
    const selectedColorName = document.getElementById('selectedColorName');
    const colorPriceTag = document.getElementById('colorPriceTag');
    const selectedWheelName = document.getElementById('selectedWheelName');
    const selectedInteriorName = document.getElementById('selectedInteriorName');
    const summaryOptionsCost = document.getElementById('summaryOptionsCost');
    const finalPriceDisplay = document.getElementById('finalPriceDisplay');
    const saveConfigBtn = document.getElementById('saveConfigBtn');
    const configSavedAlert = document.getElementById('configSavedAlert');
    const viewExteriorBtn = document.getElementById('viewExteriorBtn');
    const viewInteriorBtn = document.getElementById('viewInteriorBtn');

    const formatINR = (val) => {
      return '₹ ' + val.toLocaleString('en-IN');
    };

    const updateViewToggleButtons = () => {
      if (viewExteriorBtn && viewInteriorBtn) {
        if (configState.activeView === 'exterior') {
          viewExteriorBtn.classList.add('active');
          viewInteriorBtn.classList.remove('active');
        } else {
          viewExteriorBtn.classList.remove('active');
          viewInteriorBtn.classList.add('active');
        }
      }
    };

    const updateConfigDisplay = () => {
      if (configState.activeView === 'exterior') {
        if (configCarImg && configState.color.img) {
          if (configCarImg.src !== configState.color.img) {
            configCarImg.style.opacity = '0';
            setTimeout(() => {
              configCarImg.src = configState.color.img;
              configCarImg.style.opacity = '1';
            }, 150);
          }
        }
        if (configBadge) {
          configBadge.textContent = `AURA GT / ${configState.color.name.toUpperCase()}`;
        }
      } else {
        if (configCarImg && configState.interior.img) {
          configCarImg.style.opacity = '0';
          setTimeout(() => {
            configCarImg.src = configState.interior.img;
            configCarImg.style.opacity = '1';
          }, 150);
        }
        if (configBadge) {
          configBadge.textContent = `AURA CABIN / ${configState.interior.name.toUpperCase()}`;
        }
      }

      if (selectedColorName) selectedColorName.textContent = configState.color.name;
      if (colorPriceTag) {
        colorPriceTag.textContent = configState.color.price === 0 ? 'Included in Base' : `+${formatINR(configState.color.price)}`;
      }
      if (selectedWheelName) selectedWheelName.textContent = configState.wheel.name;
      if (selectedInteriorName) selectedInteriorName.textContent = configState.interior.name;

      const optionsSum =
        configState.color.price +
        configState.wheel.price +
        configState.interior.price +
        configState.packages.tech +
        configState.packages.track;

      const totalPrice = BASE_PRICE + optionsSum;

      if (summaryOptionsCost) {
        summaryOptionsCost.textContent = `+${formatINR(optionsSum)}`;
      }
      if (finalPriceDisplay) {
        finalPriceDisplay.textContent = formatINR(totalPrice);
      }
    };

    // Color Swatches
    const colorSwatches = document.querySelectorAll('.swatch-btn[data-type="color"]');
    colorSwatches.forEach((btn) => {
      btn.addEventListener('click', () => {
        colorSwatches.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        configState.color = {
          id: btn.getAttribute('data-color'),
          name: btn.getAttribute('data-name'),
          price: parseInt(btn.getAttribute('data-price'), 10),
          img: btn.getAttribute('data-img')
        };

        configState.activeView = 'exterior';
        updateViewToggleButtons();
        updateConfigDisplay();
      });
    });

    // Wheels
    const wheelPills = document.querySelectorAll('.pill-option[data-type="wheel"]');
    wheelPills.forEach((btn) => {
      btn.addEventListener('click', () => {
        wheelPills.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        configState.wheel = {
          id: btn.getAttribute('data-wheel'),
          name: btn.getAttribute('data-name'),
          price: parseInt(btn.getAttribute('data-price'), 10)
        };

        updateConfigDisplay();
      });
    });

    // Interior
    const interiorPills = document.querySelectorAll('.pill-option[data-type="interior"]');
    interiorPills.forEach((btn) => {
      btn.addEventListener('click', () => {
        interiorPills.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        configState.interior = {
          id: btn.getAttribute('data-interior'),
          name: btn.getAttribute('data-name'),
          price: parseInt(btn.getAttribute('data-price'), 10),
          img: btn.getAttribute('data-img')
        };

        configState.activeView = 'interior';
        updateViewToggleButtons();
        updateConfigDisplay();
      });
    });

    // Packages
    const pkgTech = document.getElementById('pkgTech');
    const pkgTrack = document.getElementById('pkgTrack');

    if (pkgTech) {
      pkgTech.addEventListener('change', () => {
        configState.packages.tech = pkgTech.checked ? parseInt(pkgTech.getAttribute('data-price'), 10) : 0;
        updateConfigDisplay();
      });
    }

    if (pkgTrack) {
      pkgTrack.addEventListener('change', () => {
        configState.packages.track = pkgTrack.checked ? parseInt(pkgTrack.getAttribute('data-price'), 10) : 0;
        updateConfigDisplay();
      });
    }

    // View Toggles
    if (viewExteriorBtn) {
      viewExteriorBtn.addEventListener('click', () => {
        configState.activeView = 'exterior';
        updateViewToggleButtons();
        updateConfigDisplay();
      });
    }

    if (viewInteriorBtn) {
      viewInteriorBtn.addEventListener('click', () => {
        configState.activeView = 'interior';
        updateViewToggleButtons();
        updateConfigDisplay();
      });
    }

    // Save to LocalStorage
    if (saveConfigBtn) {
      saveConfigBtn.addEventListener('click', () => {
        const configPayload = {
          color: configState.color,
          wheel: configState.wheel,
          interior: configState.interior,
          packages: configState.packages,
          savedAt: new Date().toISOString(),
          configCode: `AURA-GT-${Math.floor(1000 + Math.random() * 9000)}`
        };

        try {
          localStorage.setItem('aura_configuration', JSON.stringify(configPayload));
          if (configSavedAlert) {
            const alertText = configSavedAlert.querySelector('.alert-text');
            if (alertText) {
              alertText.textContent = `Build preserved (${configPayload.configCode}) to local storage!`;
            }
            configSavedAlert.classList.add('visible');
            setTimeout(() => {
              configSavedAlert.classList.remove('visible');
            }, 4500);
          }
        } catch (err) {
          console.error('Storage error:', err);
        }
      });
    }

    // Restore from LocalStorage
    const restoreSavedConfig = () => {
      try {
        const raw = localStorage.getItem('aura_configuration');
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved && saved.color) {
            const matchingColorBtn = document.querySelector(`.swatch-btn[data-color="${saved.color.id}"]`);
            if (matchingColorBtn) matchingColorBtn.click();

            const matchingWheelBtn = document.querySelector(`.pill-option[data-wheel="${saved.wheel.id}"]`);
            if (matchingWheelBtn) matchingWheelBtn.click();

            const matchingInteriorBtn = document.querySelector(`.pill-option[data-interior="${saved.interior.id}"]`);
            if (matchingInteriorBtn) matchingInteriorBtn.click();

            if (pkgTrack) {
              pkgTrack.checked = saved.packages && saved.packages.track > 0;
              configState.packages.track = pkgTrack.checked ? 350000 : 0;
            }

            if (pkgTech) {
              pkgTech.checked = saved.packages && saved.packages.tech > 0;
              configState.packages.tech = pkgTech.checked ? 400000 : 0;
            }

            configState.activeView = 'exterior';
            updateViewToggleButtons();
            updateConfigDisplay();
          }
        }
      } catch (e) {
        console.warn('Could not restore configuration:', e);
      }
    };

    restoreSavedConfig();
  };

  // --------------------------------------------------------------------------
  // 12: MODEL COMPARISON TABS (models.html)
  // --------------------------------------------------------------------------
  const initModelComparison = () => {
    const modelTabs = document.querySelectorAll('.model-tab');
    if (!modelTabs.length) return;

    const modelData = {
      'aura-s': {
        name: 'AURA S',
        tagline: 'Effortless endurance and sublime grand touring luxury.',
        power: '520 HP',
        powerPercent: '52%',
        range: '550 KM',
        rangePercent: '74%',
        sprint: '3.6 SEC',
        sprintPercent: '68%',
        speed: '225 KM/H',
        speedPercent: '72%',
        price: '₹ 74,00,000'
      },
      'aura-gt': {
        name: 'AURA GT',
        tagline: 'The gold standard of electric high-velocity grand touring.',
        power: '800 HP',
        powerPercent: '76%',
        range: '620 KM',
        rangePercent: '88%',
        sprint: '2.8 SEC',
        sprintPercent: '90%',
        speed: '250 KM/H',
        speedPercent: '80%',
        price: '₹ 89,00,000'
      },
      'aura-x': {
        name: 'AURA X',
        tagline: 'Uncompromising track weapon forged with extreme tri-motor velocity.',
        power: '1050 HP',
        powerPercent: '100%',
        range: '580 KM',
        rangePercent: '82%',
        sprint: '2.1 SEC',
        sprintPercent: '100%',
        speed: '310 KM/H',
        speedPercent: '100%',
        price: '₹ 1,18,00,000'
      }
    };

    const displayModelName = document.getElementById('displayModelName');
    const displayModelTagline = document.getElementById('displayModelTagline');
    const barPower = document.getElementById('barPower');
    const barRange = document.getElementById('barRange');
    const barSprint = document.getElementById('barSprint');
    const barSpeed = document.getElementById('barSpeed');
    const specPower = document.getElementById('specPower');
    const specRange = document.getElementById('specRange');
    const specSprint = document.getElementById('specSprint');
    const specSpeed = document.getElementById('specSpeed');
    const specPrice = document.getElementById('specPrice');

    modelTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        modelTabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const modelKey = tab.getAttribute('data-model');
        const data = modelData[modelKey];
        if (data) {
          if (displayModelName) displayModelName.textContent = data.name;
          if (displayModelTagline) displayModelTagline.textContent = data.tagline;

          if (barPower) barPower.style.width = data.powerPercent;
          if (barRange) barRange.style.width = data.rangePercent;
          if (barSprint) barSprint.style.width = data.sprintPercent;
          if (barSpeed) barSpeed.style.width = data.speedPercent;

          if (specPower) specPower.textContent = data.power;
          if (specRange) specRange.textContent = data.range;
          if (specSprint) specSprint.textContent = data.sprint;
          if (specSpeed) specSpeed.textContent = data.speed;
          if (specPrice) specPrice.textContent = data.price;
        }
      });
    });
  };

  // --------------------------------------------------------------------------
  // 13: TECHNOLOGY STORY STEP ENGINE (technology.html)
  // --------------------------------------------------------------------------
  const initTechnologyStory = () => {
    const storyBtns = document.querySelectorAll('.story-nav-btn');
    if (!storyBtns.length) return;

    const storyData = {
      battery: {
        counter: 'PILLAR 01 OF 04',
        heading: '110 kWh Structural Cell-to-Pack',
        text: 'By integrating high-density cylindrical cells directly into the bottom monocoque, the battery acts as a structural stress member—increasing torsional stiffness by 40% while shaving 85 kilograms off traditional casing weight.',
        img: 'assets/chassis.jpg',
        highlights: [
          { val: '900V', lbl: 'ARCHITECTURE' },
          { val: '350 kW', lbl: 'PEAK DC RATE' },
          { val: '+40%', lbl: 'RIGIDITY GAIN' }
        ]
      },
      motor: {
        counter: 'PILLAR 02 OF 04',
        heading: 'Dual High-Speed Permanent Magnet Drives',
        text: 'Dual silicon-carbide inverters power custom oil-cooled hairpin stator motors spinning up to 21,500 RPM. Instantaneous torque delivery with zero transmission loss.',
        img: 'assets/chassis.jpg',
        highlights: [
          { val: '800 HP', lbl: 'SYSTEM POWER' },
          { val: '1,050 Nm', lbl: 'INSTANT TORQUE' },
          { val: '21.5k', lbl: 'MAX MOTOR RPM' }
        ]
      },
      aero: {
        counter: 'PILLAR 03 OF 04',
        heading: 'Vortex-Shedding Active Aerodynamics',
        text: 'Computational fluid dynamic contours channel airflow under the flat floor toward a deployable dual-stage carbon rear diffuser, delivering 180 kg of cornering downforce without parasitic drag penalty.',
        img: 'assets/hero.jpg',
        highlights: [
          { val: '0.208', lbl: 'DRAG COEFF (CD)' },
          { val: '180 KG', lbl: 'DOWNFORCE AT 200' },
          { val: 'ACTIVE', lbl: 'WING DEPLOYMENT' }
        ]
      },
      software: {
        counter: 'PILLAR 04 OF 04',
        heading: 'AURA OS 4.2 Neural Backbone',
        text: 'Centralized computational architecture unifying traction control, battery cooling algorithms, and autonomous highway pilot. Continuous over-the-air firmware improvements sent directly over 5G.',
        img: 'assets/interior.jpg',
        highlights: [
          { val: '750 TOPS', lbl: 'NEURAL CAPACITY' },
          { val: '<1 MS', lbl: 'TORQUE LATENCY' },
          { val: 'OTA', lbl: 'UPDATES FOR LIFE' }
        ]
      }
    };

    const storyCounter = document.getElementById('storyCounter');
    const storyHeading = document.getElementById('storyHeading');
    const storyText = document.getElementById('storyText');
    const storyMediaImg = document.getElementById('storyMediaImg');
    const storyHighlights = document.getElementById('storyHighlights');

    storyBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        storyBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const storyKey = btn.getAttribute('data-story');
        const item = storyData[storyKey];
        if (item) {
          if (storyCounter) storyCounter.textContent = item.counter;
          if (storyHeading) storyHeading.textContent = item.heading;
          if (storyText) storyText.textContent = item.text;

          if (storyMediaImg && item.img) {
            storyMediaImg.style.opacity = '0';
            setTimeout(() => {
              storyMediaImg.src = item.img;
              storyMediaImg.style.opacity = '1';
            }, 200);
          }

          if (storyHighlights) {
            storyHighlights.innerHTML = item.highlights
              .map(
                (h) => `
              <div class="s-highlight-item">
                <span class="sh-val">${h.val}</span>
                <span class="sh-lbl">${h.lbl}</span>
              </div>
            `
              )
              .join('');
          }
        }
      });
    });
  };

  // --------------------------------------------------------------------------
  // 14: CONCIERGE TEST DRIVE MODAL
  // --------------------------------------------------------------------------
  const initModals = () => {
    const reserveModal = document.getElementById('reserveModal');
    if (!reserveModal) return;

    const openModalBtns = document.querySelectorAll('#openReserveModalBtn, #finalReserveBtn, #footerBookBtn, .open-modal-trigger');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const reserveForm = document.getElementById('reserveForm');
    const modalFeedback = document.getElementById('modalFeedback');

    const toggleModal = (show = true) => {
      reserveModal.classList.toggle('open', show);
      reserveModal.setAttribute('aria-hidden', show ? 'false' : 'true');
      document.body.style.overflow = show ? 'hidden' : '';
      if (!show && modalFeedback) {
        modalFeedback.textContent = '';
      }
    };

    openModalBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleModal(true);
      });
    });

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => toggleModal(false));
    }

    reserveModal.addEventListener('click', (e) => {
      if (e.target === reserveModal) {
        toggleModal(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && reserveModal.classList.contains('open')) {
        toggleModal(false);
      }
    });

    if (reserveForm) {
      reserveForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('clientName')?.value || 'Client';
        const model = document.getElementById('preferredModel')?.value || 'AURA GT';
        const city = document.getElementById('preferredCity')?.value || 'Flagship Studio';

        if (modalFeedback) {
          modalFeedback.innerHTML = `✓ Thank you, ${name}. Your priority allocation request for the <strong>${model}</strong> at our ${city} has been confirmed. A bespoke concierge advisor will contact you shortly.`;
          reserveForm.reset();
        }
      });
    }
  };

  // --------------------------------------------------------------------------
  // 15: DEDICATED CONTACT / TEST-DRIVE PAGE FORM (contact.html)
  // --------------------------------------------------------------------------
  const initContactForm = () => {
    const contactForm = document.getElementById('dedicatedContactForm');
    const contactFeedback = document.getElementById('contactFeedback');

    if (!contactForm || !contactFeedback) return;

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cName')?.value || 'Client';
      const model = document.getElementById('cModel')?.value || 'AURA GT';
      const city = document.getElementById('cCity')?.value || 'Flagship Studio';

      contactFeedback.innerHTML = `
        <div class="config-saved-alert visible" style="margin-top: 20px;">
          <span class="alert-icon">✓</span>
          <span class="alert-text">Reservation request received for ${name} (${model} · ${city}). A dedicated concierge advisor will reach out within 2 hours.</span>
        </div>
      `;
      contactForm.reset();
    });
  };

  // --------------------------------------------------------------------------
  // 16: NEWSLETTER DISPATCH FORM (FOOTER)
  // --------------------------------------------------------------------------
  const initNewsletter = () => {
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterEmail = document.getElementById('newsletterEmail');
    const newsletterMsg = document.getElementById('newsletterMsg');

    if (newsletterForm && newsletterEmail && newsletterMsg) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterEmail.value.trim();
        if (email) {
          newsletterMsg.textContent = '✓ Subscribed to confidential telemetry dispatch.';
          newsletterEmail.value = '';
          setTimeout(() => {
            newsletterMsg.textContent = '';
          }, 4000);
        }
      });
    }
  };

  // --------------------------------------------------------------------------
  // 17: LENIS-STYLE PREMIUM SMOOTH SCROLLING ENGINE
  // --------------------------------------------------------------------------
  let globalLenis = null;

  const initLenis = () => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      console.log('AURA MOTORS: prefers-reduced-motion detected; native scroll preserved.');
      return null;
    }

    // Check if Lenis is loaded
    if (typeof Lenis === 'undefined') {
      console.warn('AURA MOTORS: Lenis library not found, standard browser scroll active.');
      return null;
    }

    try {
      globalLenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        smoothTouch: false, // Critical: preserves natural, snappy iOS/Android touch scrolling
        wheelMultiplier: 0.9,
        touchMultiplier: 1.5,
        infinite: false
      });

      function raf(time) {
        if (globalLenis) {
          globalLenis.raf(time);
        }
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Handle anchor links smoothly via Lenis
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          if (href && href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            globalLenis.scrollTo(href, { offset: -70, duration: 1.2 });
          }
        });
      });

      return globalLenis;
    } catch (err) {
      console.warn('AURA MOTORS: Lenis initialization fallback:', err);
      return null;
    }
  };

  // --------------------------------------------------------------------------
  // 18: SUBTLE SCROLL-DRIVEN PARALLAX & CINEMATIC DEPTH
  // --------------------------------------------------------------------------
  const initScrollParallax = (lenis) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const heroSection = document.querySelector('.hero-section');
    const heroBgImg = document.getElementById('heroBgImg');
    const heroContent = document.querySelector('.hero-content');
    const carStageImage = document.querySelector('.car-stage-image, .the-car-media img, #carPreviewImg');
    const interiorHeroImg = document.querySelector('.interior-display-img, .interior-stage img');
    const ctaTitle = document.querySelector('.cta-title');
    const ctaSection = document.querySelector('.cta-section');

    const updateParallax = (scrollY) => {
      // 1. HERO PARALLAX
      // Hero background/image moves slightly slower (translateY 0 -> -60px)
      // Hero content moves upward (translateY 0 -> -40px)
      // Large typography gradually fades (opacity 1 -> 0.75)
      // Hero scale (1 -> 0.96)
      if (heroSection && heroBgImg && heroContent) {
        const heroHeight = heroSection.offsetHeight || window.innerHeight;
        if (scrollY <= heroHeight * 1.2) {
          const progress = Math.min(scrollY / heroHeight, 1);
          const imgY = progress * -60;
          const contentY = progress * -40;
          const opacity = 1 - progress * 0.25;
          const scale = 1 - progress * 0.04;

          heroBgImg.style.transform = `translate3d(0, ${imgY.toFixed(1)}px, 0)`;
          heroContent.style.transform = `translate3d(0, ${contentY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
          heroContent.style.opacity = opacity.toFixed(2);
        }
      }

      // 2. THE CAR / DESIGN DEPTH
      if (carStageImage) {
        const rect = carStageImage.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.top < windowHeight && rect.bottom > 0) {
          const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
          const carY = (progress - 0.5) * -40;
          carStageImage.style.transform = `translate3d(0, ${carY.toFixed(1)}px, 0)`;
        }
      }

      // 3. INTERIOR COCKPIT SUBTLE SCALE
      if (interiorHeroImg) {
        const rect = interiorHeroImg.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.top < windowHeight && rect.bottom > 0) {
          const progress = Math.min(Math.max((windowHeight - rect.top) / (windowHeight + rect.height), 0), 1);
          const scale = 1.05 - progress * 0.05;
          interiorHeroImg.style.transform = `scale(${scale.toFixed(3)})`;
        }
      }

      // 4. FINAL CTA PARALLAX
      if (ctaSection && ctaTitle) {
        const rect = ctaSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.top < windowHeight && rect.bottom > 0) {
          const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
          const ctaY = (progress - 0.5) * -25;
          ctaTitle.style.transform = `translate3d(0, ${ctaY.toFixed(1)}px, 0)`;
        }
      }
    };

    if (lenis) {
      lenis.on('scroll', (e) => {
        updateParallax(e.scroll);
      });
    } else {
      window.addEventListener('scroll', () => {
        requestAnimationFrame(() => updateParallax(window.scrollY));
      }, { passive: true });
    }
  };

  // --------------------------------------------------------------------------
  // 19: REUSABLE LIQUID GLASS & SUBTLE 3D TILT ENGINE
  // --------------------------------------------------------------------------
  const initLiquidGlassCards = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

    const glassCards = document.querySelectorAll(
      '.liquid-glass, .bento-card, .metric-card, .telemetry-box, .model-card, .price-summary-card, .interior-card, .spec-card, .config-card, .tech-story-preview'
    );
    if (!glassCards.length) return;

    glassCards.forEach((card) => {
      // Ensure .liquid-glass class is attached
      card.classList.add('liquid-glass');

      // Inject top inner highlight if not present
      if (!card.querySelector('.liquid-glass-highlight')) {
        const highlight = document.createElement('div');
        highlight.className = 'liquid-glass-highlight';
        highlight.setAttribute('aria-hidden', 'true');
        card.prepend(highlight);
      }

      // Pointer tracking & subtle physical 3D tilt
      const handlePointerMove = (e) => {
        const rect = card.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Custom CSS variables for pointer spotlight
        card.style.setProperty('--mouse-x', `${mouseX}px`);
        card.style.setProperty('--mouse-y', `${mouseY}px`);

        // Subtle 3D tilt: max approximately ±2 degrees (Desktop only)
        if (!prefersReducedMotion && !isTouch) {
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const percentX = (mouseX - centerX) / centerX;
          const percentY = (mouseY - centerY) / centerY;

          const tiltX = (percentY * -1.8).toFixed(2);
          const tiltY = (percentX * 1.8).toFixed(2);

          card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.012, 1.012, 1.012)`;
        }
      };

      const handlePointerLeave = () => {
        if (!prefersReducedMotion && !isTouch) {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        }
      };

      card.addEventListener('mousemove', handlePointerMove, { passive: true });
      card.addEventListener('mouseleave', handlePointerLeave);

      if (isTouch) {
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '25%');
      }
    });
  };

  // --------------------------------------------------------------------------
  // 20: OPTIONAL EXPANDABLE GLASS CARDS ENGINE
  // --------------------------------------------------------------------------
  const initExpandableCards = () => {
    const expandableCards = document.querySelectorAll('[data-expandable="true"]');
    if (!expandableCards.length) return;

    expandableCards.forEach((card) => {
      if (!card.hasAttribute('tabindex')) {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-expanded', 'false');
      }

      const toggleCard = (e) => {
        // Do NOT trigger expansion when clicking links, buttons, inputs, select elements, textareas
        const ignoredTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'LABEL'];
        if (ignoredTags.includes(e.target.tagName) || e.target.closest('a, button, input, select, textarea, .btn')) {
          return;
        }

        const isExpanded = card.classList.contains('expanded');
        card.classList.toggle('expanded', !isExpanded);
        card.setAttribute('aria-expanded', (!isExpanded).toString());

        const icon = card.querySelector('.expand-icon');
        if (icon) {
          icon.textContent = isExpanded ? '+' : '−';
        }
      };

      card.addEventListener('click', toggleCard);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleCard(e);
        }
      });
    });
  };

  // --------------------------------------------------------------------------
  // INITIALIZE ALL SUBSYSTEMS SAFELY
  // --------------------------------------------------------------------------
  const lenis = initLenis();
  initScrollParallax(lenis);
  initLiquidGlassCards();
  initExpandableCards();

  initCursor();
  initAudioController();
  initNavigation();
  initScrollReveals();
  initCounters();
  initLaunchSimulation();
  initBentoEffects();
  initHotspots();
  initInteriorSwitcher();
  initConfigurator();
  initModelComparison();
  initTechnologyStory();
  initModals();
  initContactForm();
  initNewsletter();
});
