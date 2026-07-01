document.addEventListener('DOMContentLoaded', () => {

  gsap.registerPlugin();

  const S = {
    preloaderDone: false, doorsRevealed: false, correctDoor: 2,
    currentPage: 0
  };

  // ===== INIT =====
  function init() {
    animatePreloader();
    initDoors();
    initWrongPopup();
    initChest();
  }

  // ===== PRELOADER: GRAND MYSTIC DOORWAY =====
  function animatePreloader() {
    const preloader = document.getElementById('preloader');
    const door = document.querySelector('.door-materialize');
    const doorPanel = document.querySelector('.door-materialize-door');
    const doorLight = document.querySelector('.door-materialize-light');
    const magicGlow = document.querySelector('.preloader-magic-glow');
    const text = document.querySelector('.preloader-text');
    const container = document.getElementById('particles-container');
    const runes = document.querySelectorAll('.rune');

    // Create golden particles
    const particles = [];
    for (let i = 0; i < 80; i++) {
      const p = document.createElement('div');
      p.className = 'particle' + (Math.random() > 0.7 ? ' particle-lg' : '');
      p.style.left = (5 + Math.random() * 90) + '%';
      p.style.top = (5 + Math.random() * 90) + '%';
      container.appendChild(p);
      particles.push(p);
    }

    const tl = gsap.timeline();

    // Everything starts immediately — particles appear
    tl.to(particles, {
      opacity: 0.7, duration: 0.6, stagger: 0.02, ease: 'power2.out'
    });

    // Magic glow appears from start
    tl.to(magicGlow, { opacity: 1, scale: 1.3, duration: 0.8, ease: 'power2.inOut' }, '-=0.4');

    // Particles drift
    particles.forEach((p) => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 20 + Math.random() * 50;
      gsap.to(p, {
        x: Math.cos(angle) * dist + (Math.random() - 0.5) * 30,
        y: Math.sin(angle) * dist + (Math.random() - 0.5) * 30,
        opacity: 0.2 + Math.random() * 0.4,
        duration: 1.5 + Math.random() * 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: Math.random() * 1.5
      });
    });

    // Door materializes fast
    tl.to(door, {
      opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.6)'
    }, '-=0.2');

    // Runes glow
    tl.to(runes, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.4');

    // Ornaments appear
    tl.to('.door-materialize-ornament-top', { opacity: 1, duration: 0.3, ease: 'power2.out' }, '-=0.5');
    tl.to('.door-materialize-ornament-ring', { opacity: 1, duration: 0.3, ease: 'power2.out' }, '-=0.2');
    tl.to('.door-materialize-knob', { opacity: 1, duration: 0.3, ease: 'power2.out' }, '-=0.1');
    tl.to('.door-materialize-carving', { opacity: 1, duration: 0.3, ease: 'power2.out' }, '-=0.05');

    // Warm glow behind door
    tl.to(doorLight, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3');

    // Text fades in briefly
    tl.to(text, { opacity: 1, duration: 0.5, ease: 'power2.inOut' }, '-=0.2');

    // Quick text fade + particles surge
    tl.to(text, { opacity: 0, duration: 0.2 });
    particles.forEach(p => gsap.killTweensOf(p));
    tl.to(particles, {
      x: function() { return (Math.random() - 0.5) * 250; },
      y: function() { return (Math.random() - 0.5) * 250; },
      opacity: 1, scale: 1.8, duration: 0.4, ease: 'power2.in'
    });

    // Door swings open
    tl.to(doorPanel, {
      rotationY: -85, duration: 0.8, ease: 'power3.inOut',
      transformOrigin: 'left center'
    }, '-=0.2');

    // Light burst
    tl.to(doorLight, {
      opacity: 2.5, scale: 3, duration: 0.4, ease: 'power2.out'
    }, '-=0.5');

    tl.to(magicGlow, {
      opacity: 2.5, scale: 4, duration: 0.4, ease: 'power2.out'
    }, '-=0.5');

    // Preloader fades
    tl.to(preloader, {
      opacity: 0, duration: 0.5, ease: 'power2.inOut',
      onComplete: () => {
        preloader.style.display = 'none';
        S.preloaderDone = true;
        revealPage1();
      }
    }, '-=0.1');
  }

  // ===== PAGE 1: REVEAL =====
  function revealPage1() {
    document.getElementById('page-1').style.display = 'flex';

    gsap.fromTo('.intro-text', { opacity: 0 }, {
      opacity: 1, duration: 1, delay: 0.3, ease: 'power2.out'
    });
    gsap.fromTo('.intro-line', { opacity: 0, y: 15 }, {
      opacity: 1, y: 0, duration: 1, stagger: 0.3, delay: 0.5, ease: 'power2.out'
    });
    gsap.fromTo('.doors-container', { opacity: 0 }, {
      opacity: 1, duration: 1, delay: 1.8, ease: 'power2.out',
      onComplete: () => { S.doorsRevealed = true; }
    });
    gsap.fromTo('.door-card', { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 1, stagger: 0.2, delay: 2.0, ease: 'power3.out'
    });
  }

  // ===== DOORS =====
  function initDoors() {
    const doors = document.querySelectorAll('.door-card');
    doors.forEach(door => {
      door.addEventListener('click', function(e) {
        e.stopPropagation();
        if (!S.doorsRevealed) return;
        const num = parseInt(this.dataset.door);
        if (num === S.correctDoor) {
          handleCorrectDoor(this);
        } else {
          handleWrongDoor(this);
        }
      });
    });
  }

  function handleWrongDoor(el) {
    el.classList.add('wrong');
    showWrongPopup();
    gsap.delayedCall(0.6, () => el.classList.remove('wrong'));
  }

  function handleCorrectDoor(el) {
    el.classList.add('correct');
    S.doorsRevealed = false;
    gsap.to('.door-card:not([data-door="2"])', {
      opacity: 0, scale: 0.8, duration: 0.5, ease: 'power2.in'
    });
    gsap.to(el, {
      scale: 1.1, duration: 0.5, ease: 'power2.out',
      onComplete: () => {
        gsap.to('.page-1-content', {
          opacity: 0, duration: 0.8, ease: 'power2.in',
          onComplete: () => {
            document.getElementById('page-1').style.display = 'none';
            startCloudTravel();
          }
        });
      }
    });
  }

  // ===== WRONG POPUP =====
  function initWrongPopup() {
    document.querySelector('.popup-btn').addEventListener('click', () => {
      hideWrongPopup();
    });
    document.getElementById('wrong-popup').addEventListener('click', (e) => {
      if (e.target === document.getElementById('wrong-popup')) {
        hideWrongPopup();
      }
    });
  }

  function showWrongPopup() {
    const popup = document.getElementById('wrong-popup');
    const content = popup.querySelector('.popup-content');
    popup.style.display = 'flex';
    gsap.fromTo(content, { scale: 0.7, opacity: 0 }, {
      scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)'
    });
  }

  function hideWrongPopup() {
    const popup = document.getElementById('wrong-popup');
    const content = popup.querySelector('.popup-content');
    gsap.to(content, {
      scale: 0.7, opacity: 0, duration: 0.3, ease: 'power2.in',
      onComplete: () => { popup.style.display = 'none'; }
    });
  }

  // ===== CLOUD TRAVEL TRANSITION =====
  function startCloudTravel() {
    const ct = document.getElementById('cloud-travel');
    ct.style.display = 'flex';
    gsap.fromTo('.cloud-content', { opacity: 0, y: 20 }, {
      opacity: 1, y: 0, duration: 1.5, ease: 'power2.out'
    });
    gsap.to('#cloud-bar', {
      width: '100%', duration: 3.5, ease: 'power1.inOut',
      onComplete: () => {
        gsap.to('.cloud-content', {
          opacity: 0, duration: 0.6, ease: 'power2.in',
          onComplete: () => {
            ct.style.display = 'none';
            revealGarden();
          }
        });
      }
    });
  }

  // ===== PAGE 2: GARDEN VIDEO =====
  function revealGarden() {
    document.getElementById('page-2').style.display = 'flex';
    S.currentPage = 2;
    animateHangingLetters();
  }

  // ===== HANGING LETTERS: NEETI DROP-IN =====
  function animateHangingLetters() {
    const groups = document.querySelectorAll('.hanging-group');
    gsap.fromTo(groups,
      { opacity: 0, y: -250 },
      {
        opacity: 1, y: 0,
        duration: 0.8,
        stagger: 0.18,
        delay: 0.6,
        ease: 'bounce.out',
        onComplete: () => startContinuousSway(groups)
      }
    );

    // Add organic hover sway using GSAP for smoother motion
    groups.forEach(group => {
      let swayTween = null;
      group.addEventListener('mouseenter', () => {
        if (swayTween) swayTween.kill();
        // Dramatic initial swing toward cursor
        swayTween = gsap.to(group, {
          rotation: -12,
          duration: 0.25,
          ease: 'power2.out',
          onComplete: () => {
            // Continuous dramatic sway while hovering
            swayTween = gsap.to(group, {
              rotation: 12,
              duration: 0.8,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1
            });
          }
        });
      });
      group.addEventListener('mouseleave', () => {
        if (swayTween) swayTween.kill();
        startSingleSway(group);
      });
    });
  }

  function startContinuousSway(groups) {
    groups.forEach(group => {
      startSingleSway(group);
    });
  }

  function startSingleSway(group) {
    function nextGust() {
      const amp = (3 + Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1);
      const dur = 1.2 + Math.random() * 2;
      gsap.to(group, {
        rotation: amp,
        duration: dur,
        ease: 'sine.inOut',
        onComplete: nextGust
      });
    }
    nextGust();
  }

  // ===== TREASURE CHEST & LETTER CARD =====
  function initChest() {
    const wrapper = document.querySelector('.chest-wrapper');
    const glow = document.querySelector('.chest-glow');
    const card = document.querySelector('.letter-card');
    const cardInner = document.querySelector('.letter-card-inner');
    const overlay = document.querySelector('.letter-card-overlay');
    const closeBtn = document.querySelector('.letter-card-close');
    let opened = false;

    function getChestCenter() {
      const rect = wrapper.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    }

    function closeCard() {
      opened = false;
      gsap.to(cardInner, {
        scale: 0.5, opacity: 0, duration: 0.3, ease: 'power2.in',
        onComplete: () => { card.style.display = 'none'; }
      });
      gsap.to(overlay, { opacity: 0, duration: 0.3 });
    }

    wrapper.addEventListener('click', () => {
      if (opened) return;
      opened = true;
      const origin = getChestCenter();
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;

      // Glow surge
      gsap.to(glow, { opacity: 1, duration: 0.6 });
      gsap.to(glow, {
        opacity: 0.6, scale: 1.5, duration: 1.2, ease: 'power2.out'
      });

      // Chest lid animation
      gsap.to(wrapper, {
        scaleY: 0.85, duration: 0.2, ease: 'power2.in',
        yoyo: true, repeat: 1,
        transformOrigin: 'bottom center'
      });

      // Show card container
      card.style.display = 'flex';
      gsap.set(cardInner, { x: origin.x - cx, y: origin.y - cy, scale: 0.2, opacity: 0 });
      gsap.set(overlay, { opacity: 0 });

      // Fly to center
      gsap.to(overlay, { opacity: 1, duration: 0.4, delay: 0.1 });
      gsap.to(cardInner, {
        x: 0, y: 0, scale: 1, opacity: 1,
        duration: 0.9, delay: 0.3,
        ease: 'back.out(1.4)',
        onComplete: () => {
          startTypewriter();
        }
      });
    });

    function resetOpened() { opened = false; }

    // Typewriter animation for main text + signature
    function startTypewriter() {
      try {
        const mainEl = document.getElementById('typewriter-text');
        if (!mainEl) return;
        const mainSource = document.getElementById('typewriter-source');
        const mainText = mainSource ? mainSource.textContent.trim() : '';
        const sigSource = document.getElementById('sig-source');
        const sigLines = sigSource ? sigSource.textContent.split('||') : [];
        let i = 0, lineIdx = 0;

        mainEl.textContent = '';

        function typeMain() {
          if (i < mainText.length) {
            mainEl.textContent += mainText.charAt(i);
            i++;
            const ch = mainText.charAt(i - 1);
            const delay = ch.match(/[.,!?;:]/) ? 120 : ch === ' ' ? 40 : 25;
            setTimeout(typeMain, delay);
          } else {
            setTimeout(typeSig, 500);
          }
        }

        function typeSig() {
          if (lineIdx >= sigLines.length) return;
          const line = sigLines[lineIdx];
          const el = document.getElementById('sig-line-' + (lineIdx + 1));
          if (!el) { lineIdx++; setTimeout(typeSig, 300); return; }
          let j = 0;
          function typeChar() {
            if (j < line.length) {
              el.textContent += line.charAt(j);
              j++;
              const ch = line.charAt(j - 1);
              const delay = ch.match(/[.,!?;:]/) ? 100 : ch === ' ' ? 35 : 20;
              setTimeout(typeChar, delay);
            } else {
              lineIdx++;
              setTimeout(typeSig, 300);
            }
          }
          typeChar();
        }

        setTimeout(typeMain, 400);

        // Fallback: show all text if typewriter hasn't started typing after 3s
        setTimeout(() => {
          if (mainEl.textContent.length === 0) {
            mainEl.textContent = mainText;
            sigLines.forEach((line, idx) => {
              const el = document.getElementById('sig-line-' + (idx + 1));
              if (el) el.textContent = line;
            });
          }
        }, 3000);
      } catch(e) {
        // Fallback: show text directly on error
        const mainEl = document.getElementById('typewriter-text');
        const mainSource = document.getElementById('typewriter-source');
        if (mainEl && mainSource) mainEl.textContent = mainSource.textContent.trim();
        const sigSource = document.getElementById('sig-source');
        if (sigSource) {
          sigSource.textContent.split('||').forEach((line, idx) => {
            const el = document.getElementById('sig-line-' + (idx + 1));
            if (el) el.textContent = line;
          });
        }
      }
    }

    overlay.addEventListener('click', closeCard);
    closeBtn.addEventListener('click', closeCard);
  }

  init();
});
