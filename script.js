/* =========================================================
   A BEAUTIFUL JOURNEY THROUGH OUR LOVE — script.js
   Vanilla JS only. Sections unlock one at a time.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     0. LOADING SCREEN
  --------------------------------------------------------- */
  const loadingScreen = document.getElementById('loading-screen');
  window.addEventListener('load', () => {
    setTimeout(() => loadingScreen.classList.add('hidden'), 1200);
  });
  // fallback in case 'load' already fired
  setTimeout(() => loadingScreen.classList.add('hidden'), 2500);

  /* ---------------------------------------------------------
     1. CUSTOM CURSOR
  --------------------------------------------------------- */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorGlow = document.getElementById('cursor-glow');
  window.addEventListener('mousemove', (e) => {
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  });
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('button, a, .flip-card, .hidden-heart, .mid-star, #jar-svg')) {
      cursorGlow.classList.add('grow');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('button, a, .flip-card, .hidden-heart, .mid-star, #jar-svg')) {
      cursorGlow.classList.remove('grow');
    }
  });

  /* ---------------------------------------------------------
     2. SCROLL PROGRESS (progress across whole journey, chapter-based)
  --------------------------------------------------------- */
  const progressBar = document.getElementById('scroll-progress-bar');
  const chapterOrder = ['intro','letter','journey','little','jar','reasons','promise','future','gallery','midnight','final','ending'];
  function updateProgress(chapterKey) {
    const idx = chapterOrder.indexOf(chapterKey);
    const pct = ((idx + 1) / chapterOrder.length) * 100;
    progressBar.style.width = pct + '%';
  }

  /* ---------------------------------------------------------
     3. AMBIENT NIGHT SKY CANVAS (stars, shooting stars, particles)
  --------------------------------------------------------- */
  const skyCanvas = document.getElementById('sky-canvas');
  const ctx = skyCanvas.getContext('2d');
  let W, H;
  function resizeSky() { W = skyCanvas.width = window.innerWidth; H = skyCanvas.height = window.innerHeight; }
  resizeSky();
  window.addEventListener('resize', resizeSky);

  const stars = Array.from({ length: 160 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 1.4 + 0.3,
    tw: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.015 + 0.005
  }));
  const floatParticles = Array.from({ length: 40 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 2 + 0.5,
    vy: -(Math.random() * 0.25 + 0.05),
    vx: (Math.random() - 0.5) * 0.15,
    hue: Math.random() > 0.5
  }));
  let shootingStar = null;
  function maybeSpawnShootingStar() {
    if (!shootingStar && Math.random() < 0.006) {
      const startX = Math.random() * W * 0.6;
      shootingStar = { x: startX, y: Math.random() * H * 0.3, vx: 7, vy: 3.2, life: 1 };
    }
  }

  function drawSky() {
    ctx.clearRect(0, 0, W, H);
    // twinkling stars
    stars.forEach(s => {
      s.tw += s.speed;
      const alpha = 0.5 + Math.sin(s.tw) * 0.5;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    });
    // floating particles (pink/white)
    floatParticles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.hue ? 'rgba(255,95,162,0.35)' : 'rgba(255,255,255,0.25)';
      ctx.fill();
    });
    // shooting star
    maybeSpawnShootingStar();
    if (shootingStar) {
      const s = shootingStar;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.vx * 6, s.y - s.vy * 6);
      const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 6, s.y - s.vy * 6);
      grad.addColorStop(0, 'rgba(255,255,255,0.9)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.stroke();
      s.x += s.vx; s.y += s.vy; s.life -= 0.01;
      if (s.x > W || s.y > H || s.life <= 0) shootingStar = null;
    }
    requestAnimationFrame(drawSky);
  }
  drawSky();

  /* ---------------------------------------------------------
     4. MUSIC BUTTON (no autoplay)
  --------------------------------------------------------- */
  const musicBtn = document.getElementById('music-btn');
  const musicIcon = document.getElementById('music-icon');
  const bgMusic = document.getElementById('bg-music');
  let musicPlaying = false;
  musicBtn.addEventListener('click', () => {
    document.addEventListener('click', () => {
  if (!musicPlaying) {
    bgMusic.play().catch(() => {});
    musicIcon.textContent = '♫';
    musicBtn.classList.add('playing');
    musicPlaying = true;
  }
}, { once: true });
    if (!musicPlaying) {
      bgMusic.play().catch(() => { /* placeholder mp3 may not exist yet */ });
      musicIcon.textContent = '♫';
      musicBtn.classList.add('playing');
      musicPlaying = true;
    } else {
      bgMusic.pause();
      musicIcon.textContent = '♪';
      musicBtn.classList.remove('playing');
      musicPlaying = false;
    }
  });

  /* ---------------------------------------------------------
     5. CHAPTER NAVIGATION (cinematic veil transition between sections)
  --------------------------------------------------------- */
  const veil = document.getElementById('transition-veil');
  const chapters = document.querySelectorAll('.chapter');

  function goToChapter(key) {
    const current = document.querySelector('.chapter.active');
    const next = document.querySelector(`.chapter[data-chapter="${key}"]`);
    if (!next || next === current) return;

    veil.classList.remove('flash');
    void veil.offsetWidth; // restart animation
    veil.classList.add('flash');

    setTimeout(() => {
      if (current) { current.classList.remove('active'); }
      next.classList.add('active');
      updateProgress(key);
      window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
      onChapterEnter(key);
    }, 420);
  }

  function onChapterEnter(key) {
    if (key === 'journey') buildTimeline();
    if (key === 'little') buildLittleThings();
    if (key === 'jar') buildJar();
    if (key === 'reasons') buildReasons();
    if (key === 'future') buildConstellation();
    if (key === 'gallery') buildGallery();
    if (key === 'midnight') buildMidnightSky();
    if (key === 'final') startFinalLetter();
    if (key === 'ending') startEnding();
    if (key !== 'intro') hiddenHeartsLayer.classList.add('active');
  }

  /* ---------------------------------------------------------
     6. INTRO SEQUENCE
  --------------------------------------------------------- */
  const introLines = document.querySelectorAll('.intro-line');
  const introHeart = document.getElementById('intro-heart');
  introLines.forEach((line, i) => {
    setTimeout(() => line.classList.add('show'), 900 + i * 2600);
  });
  setTimeout(() => introHeart.classList.add('show'), 900 + introLines.length * 2600);
  introHeart.addEventListener('click', () => goToChapter('letter'));

  /* ---------------------------------------------------------
     7. SECTION 1 — LOVE LETTER (typing animation)
  --------------------------------------------------------- */
  const loveLetterText = `Puttii,

I've rewritten the first line of this about six times, which is funny, because you're the one person I never have to think that hard about talking to. I think that's what I want to say first, actually — before the big stuff. Talking to you has never felt like work. Even on the days we don't have much to say, it's easy. That's rarer than people admit.

I want to tell you about the version of you that I don't think you see. You do this thing where you downplay everything good about yourself — like you're worried that taking up space is somehow rude. I notice it when you get a compliment and immediately hand it back, or when something good happens to you and your first instinct is to check if it's okay to be happy about it. Chello, it's okay. You're allowed to just have good things without explaining them away.

I also want to tell you that I notice the effort you put into people, including me, even when nobody's clapping for it. You remember the small things people mention once in passing and bring them up weeks later like it's nothing. You show up for people even when you're tired. I've watched you do it for your friends, for your family, and honestly, for me more than I probably deserve some days. That kind of care isn't loud, but it's the realest thing about you.

There's a version of this letter where I list a bunch of your qualities like I'm reading off a résumé, and I don't want to do that, because you're not a list of traits to me. You're a person I actually like being around — not just love, like, which I think matters more than people give it credit for. I like your opinions even when I don't agree with them. I like how competitive you get over things that don't matter, and then act like you weren't. I like that you overthink text messages the exact same way I do, even though neither of us will admit it out loud.

Pondati, I think what surprised me most about falling for you wasn't the big moments — though there were plenty of those — it was how normal it started to feel to build a life around someone. Checking in during a boring afternoon just because I thought of you. Saving something funny because I knew you'd get it. Planning around you without even noticing I was doing it. Nobody warns you that love mostly looks like logistics and inside jokes, not some constant fireworks show. I think I'm glad nobody warned me. I got to find that out for myself, with you.

I won't pretend we've had it all figured out. We've had the arguments that felt bigger than they were at 1am and smaller by morning. We've had the days where one of us was clearly not in the mood to be patient and the other one had to be anyway. I don't think that's a flaw in this — I think that's just what it looks like when two actual people, and not some idealized version of a couple, choose to keep doing this together. I'd rather have the real version of us than a version that looks perfect from the outside and means nothing underneath.

I think about the ordinary things more than the big ones, if I'm honest. The way you fall asleep mid-sentence and get annoyed when I point it out. The way you narrate your own cooking like you're hosting a show nobody asked for. The way you get unreasonably serious about a video game for exactly four minutes and then completely forget about it. None of that is impressive to anyone else. It's just you. And somehow it's become one of my favorite parts of my life, watching you be exactly who you are when nobody's performing for anybody.

I don't know exactly what this letter is supposed to accomplish. I guess I wanted you to have something in writing — not because I think you doubt any of this, but because I think it's good to say things plainly sometimes instead of assuming the person already knows. So: I'm glad you exist. I'm glad you exist specifically in my life, not just in general. I don't take that as owed to me. I know it's something I have to keep earning, and I intend to.

There's more I want to show you than I can say in one letter, so consider this the start of something instead of the whole thing.`;

  const letterTypingEl = document.getElementById('letter-typing');
  const letterCloser = document.getElementById('letter-closer');
  const btnLetter = document.getElementById('btn-letter');
  let letterTyped = false;

  function typeText(el, text, speed, onDone) {
    el.textContent = '';
    let i = 0;
    function step() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        // faster typing, slight randomness for a natural feel
        setTimeout(step, speed + (Math.random() * 6 - 3));
      } else if (onDone) onDone();
    }
    step();
  }

  const letterObserver = new MutationObserver(() => {
    const el = document.getElementById('section-letter');
    if (el.classList.contains('active') && !letterTyped) {
      letterTyped = true;
      typeText(letterTypingEl, loveLetterText, 14, () => {
        letterCloser.hidden = false;
        btnLetter.hidden = false;
      });
    }
  });
  letterObserver.observe(document.getElementById('section-letter'), { attributes: true, attributeFilter: ['class'] });

  btnLetter.addEventListener('click', () => goToChapter('journey'));

  /* ---------------------------------------------------------
     8. SECTION 2 — OUR JOURNEY (timeline)
  --------------------------------------------------------- */
  const timelineCaptions = [
    "I'll never forget you.",
    "This picture still makes me smile.",
   " You looked so beautiful here.",
    "I'd choose you again and again.",
    "I knew this one is mine.",
    "A completele package .",
    "You have no idea how much I love you this weirdo.",
    "This is the face I fell for.",
    "your beauty is unmatched.",
    "Still my favorite kind of afternoon."
  ];
  let timelineBuilt = false;
  function buildTimeline() {
    if (timelineBuilt) return;
    timelineBuilt = true;
    const wrap = document.getElementById('timeline');
    timelineCaptions.forEach((cap, i) => {
      const card = document.createElement('div');
      card.className = 'timeline-card glass';
      card.innerHTML = `
  <div class="timeline-thumb">
    <img src="images/pic${i + 1}.jpg"
         alt="Photo ${i + 1}"
         style="width:100%;height:100%;object-fit:cover;border-radius:12px;">
  </div>
  <div class="timeline-caption">${cap}</div>
`;
      wrap.appendChild(card);
      setTimeout(() => card.classList.add('show'), i * 160);
    });
  }
  document.getElementById('btn-journey').addEventListener('click', () => goToChapter('little'));

  /* ---------------------------------------------------------
     9. SECTION 3 — LITTLE THINGS (30 flip cards)
  --------------------------------------------------------- */
  const littleThings = [
    "The way you smile before you even realize you're smiling.",
    "The way you laugh at your own jokes first.",
    "The way you get excited over something small and try to hide it.",
    "The way you pretend you're not sleepy at 11pm.",
    "The way you care about people who don't even notice it.",
    "The way you look at me when you think I'm not paying attention.",
    "The way your eyes smile before your mouth does.",
    "The way you hum without realizing it.",
    "The way you get quiet when you're actually really happy.",
    "The way you overexplain things you're excited about.",
    "The way you say 'I'm fine' in a tone that means the opposite.",
    "The way you remember things I mentioned once, weeks ago.",
    "The way you get competitive over the smallest games.",
    "The way you apologize even when you don't need to.",
    "The way you scrunch your nose when something's too sweet.",
    "The way you talk to animals like they understand every word.",
    "The way you get shy about compliments.",
    "The way you plan things out loud, thinking as you talk.",
    "The way you double-check on people you love.",
    "The way you get dramatic about minor inconveniences.",
    "The way you go quiet right before you say something honest.",
    "The way you save the best bite of food for last.",
    "The way you text like you're mid-thought.",
    "The way you get nostalgic about things that happened last week.",
    "The way you defend the people you love without being asked to.",
    "The way you fall asleep mid-sentence.",
    "The way you narrate your own cooking.",
    "The way you get proud of yourself and try to act casual about it.",
    "The way you notice when I'm off, before I say anything.",
    "The way you make ordinary days feel like less of a routine."
  ];
  let littleBuilt = false;
  function buildLittleThings() {
    if (littleBuilt) return;
    littleBuilt = true;
    const grid = document.getElementById('little-grid');
    littleThings.forEach((text, i) => {
      const card = document.createElement('div');
      card.className = 'flip-card';
      card.tabIndex = 0;
      card.innerHTML = `
        <div class="flip-inner">
          <div class="flip-front">#${i + 1}</div>
          <div class="flip-back">${text}</div>
        </div>`;
      grid.appendChild(card);
      setTimeout(() => card.classList.add('show'), i * 45);
    });
  }
  document.getElementById('btn-little').addEventListener('click', () => goToChapter('jar'));

  /* ---------------------------------------------------------
     10. SECTION 4 — MEMORY JAR (20 notes, one at a time)
  --------------------------------------------------------- */
  const memoryNotes = [
    "The night we talked until neither of us remembered what started the conversation.",
    "The first time you called me instead of texting, just to hear a real reaction.",
    "The random Tuesday that somehow became one of my favorite days.",
    "The time you got nervous introducing me and it made me like you more.",
    "The playlist you made without telling me what half the songs meant.",
    "The argument that ended with both of us laughing at how small it was.",
    "The first time you fell asleep on a call with me.",
    "The day you showed up even though you didn't have to.",
    "The inside joke that still doesn't make sense to anyone else.",
    "The time you defended me without me even asking.",
    "The rainy day that turned into one of our best ones.",
    "The first photo of us that actually looks like us.",
    "The time you noticed I was upset before I said a word.",
    "The voice note you sent that I still haven't deleted.",
    "The first time 'we' started sounding normal instead of new.",
    "The moment I realized I wasn't just excited about you — I trusted you.",
    "The late night drive that didn't need a destination.",
    "The time you remembered something I said in passing, months later.",
    "The ordinary dinner that somehow became a core memory.",
    "The moment I knew this wasn't temporary."
  ];
  let jarBuilt = false;
  let jarOpened = 0;
  function buildJar() {
    if (jarBuilt) return;
    jarBuilt = true;
    const jarSvg = document.getElementById('jar-svg');
    const noteEl = document.getElementById('jar-note');
    const countEl = document.getElementById('jar-count');
    const shuffled = [...memoryNotes].sort(() => Math.random() - 0.5);
    jarSvg.addEventListener('click', () => {
      if (jarOpened >= shuffled.length) {
        noteEl.hidden = false;
        noteEl.classList.remove('show'); void noteEl.offsetWidth; noteEl.classList.add('show');
        noteEl.textContent = "The jar is empty now — but there's still more of us being written.";
        return;
      }
      noteEl.hidden = false;
      noteEl.classList.remove('show'); void noteEl.offsetWidth; noteEl.classList.add('show');
      noteEl.textContent = shuffled[jarOpened];
      jarOpened++;
      countEl.textContent = Math.max(shuffled.length - jarOpened, 0);
    });
  }
  document.getElementById('btn-jar').addEventListener('click', () => goToChapter('reasons'));

  /* ---------------------------------------------------------
     11. SECTION 5 — 50 REASONS
  --------------------------------------------------------- */
  const reasons = [
    "Because you ask good questions instead of just waiting for your turn to talk.",
    "Because you remember how people take their coffee, their tea, their everything.",
    "Because you apologize first, even when it's not fully your fault.",
    "Because you laugh with your whole face.",
    "Because you're competitive about things that don't matter and it's endearing.",
    "Because you take care of people quietly, without needing credit.",
    "Because you're honest even when it's inconvenient.",
    "Because you get excited about small good things.",
    "Because you notice when something's off with me before I say it.",
    "Because you're still curious about the world.",
    "Because you don't perform your feelings — you actually have them.",
    "Because you say sorry and mean it.",
    "Because you're patient with people who don't deserve it, and I've learned from that.",
    "Because you remember birthdays without being reminded.",
    "Because you make ordinary plans feel worth looking forward to.",
    "Because your opinions are actually yours, not borrowed from someone else.",
    "Because you don't need an audience to be kind.",
    "Because you take responsibility instead of deflecting.",
    "Because you still get nervous before things that matter to you.",
    "Because you root for people, even people who aren't rooting for you.",
    "Because you ask 'are you okay' and actually wait for the real answer.",
    "Because you're stubborn about the right things.",
    "Because you soften around kids and animals in a way that says everything about you.",
    "Because you know how to sit with someone in silence without it being awkward.",
    "Because you take criticism seriously instead of defensively.",
    "Because you're loyal in the boring, unglamorous way that actually counts.",
    "Because you still try, even on the days you don't feel like it.",
    "Because you don't hold grudges longer than they're worth.",
    "Because you say what you mean, eventually, even if it takes you a minute.",
    "Because you have a specific laugh reserved for things that are actually funny.",
    "Because you notice details other people skip past.",
    "Because you're generous with your time when it actually costs you something.",
    "Because you don't need to be the center of attention to enjoy yourself.",
    "Because you own your mistakes out loud.",
    "Because you get genuinely happy for other people's wins.",
    "Because you ask for help instead of pretending you don't need it — eventually.",
    "Because you're gentle with people who are having a hard day.",
    "Because you remember the small promises, not just the big ones.",
    "Because your kindness doesn't come with conditions.",
    "Because you still believe good things are possible.",
    "Because you show up even when it's inconvenient for you.",
    "Because you don't dress up the truth to make yourself look better.",
    "Because you're funny in a dry, specific way that took me a while to catch onto.",
    "Because you carry other people's bad days without making it about you.",
    "Because you say thank you and actually mean it.",
    "Because you're still working on yourself instead of pretending you're finished.",
    "Because you make me want to be a better version of myself, not out of guilt, but because you make it look worth it.",
    "Because being around you feels like being understood without having to explain myself first.",
    "Because you chose me on the ordinary days, not just the easy ones.",
    "Because, honestly, it's just you. It was always going to be you."
  ];
  let reasonIndex = 0;
  let reasonsBuilt = false;
  function spawnReasonParticles() {
    const wrap = document.getElementById('reason-particles');
    for (let i = 0; i < 10; i++) {
      const p = document.createElement('div');
      p.className = 'reason-particle';
      p.style.left = (40 + Math.random() * 20) + '%';
      p.style.top = (50 + Math.random() * 20) + '%';
      p.style.animationDelay = (Math.random() * 0.3) + 's';
      wrap.appendChild(p);
      setTimeout(() => p.remove(), 2500);
    }
  }
  function showReason(i) {
    const textEl = document.getElementById('reason-text');
    const indexEl = document.getElementById('reason-index');
    textEl.classList.remove('show'); void textEl.offsetWidth;
    textEl.textContent = reasons[i];
    textEl.classList.add('show');
    indexEl.textContent = i + 1;
    spawnReasonParticles();
    const btn = document.getElementById('btn-reason-next');
    btn.textContent = (i === reasons.length - 1) ? 'Continue' : 'Next';
  }
  function buildReasons() {
    if (reasonsBuilt) return;
    reasonsBuilt = true;
    showReason(0);
  }
  document.getElementById('btn-reason-next').addEventListener('click', () => {
    if (reasonIndex < reasons.length - 1) {
      reasonIndex++;
      showReason(reasonIndex);
    } else {
      goToChapter('promise');
    }
  });

  /* ---------------------------------------------------------
     12. SECTION 6 — PROMISE (blooming rose)
  --------------------------------------------------------- */
  let roseBuilt = false;
  function buildRose() {
    if (roseBuilt) return;
    roseBuilt = true;
    const group = document.getElementById('rose-petals');
    const petalCount = 10;
    for (let i = 0; i < petalCount; i++) {
      const angle = (360 / petalCount) * i;
      const petal = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      petal.setAttribute('cx', 0);
      petal.setAttribute('cy', -18);
      petal.setAttribute('rx', 10);
      petal.setAttribute('ry', 20);
      petal.setAttribute('fill', i % 2 === 0 ? '#ff5fa2' : '#ff8cc0');
      petal.setAttribute('opacity', '0.9');
      petal.classList.add('rose-petal');
      petal.style.setProperty('--rot', angle + 'deg');
      petal.setAttribute('transform', `rotate(${angle})`);
      petal.style.animationDelay = (i * 0.08) + 's';
      group.appendChild(petal);
    }
    const center = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    center.setAttribute('r', 8);
    center.setAttribute('fill', '#c9a66b');
    group.appendChild(center);
  }
  const promiseObserver = new MutationObserver(() => {
    const el = document.getElementById('section-promise');
    if (el.classList.contains('active')) buildRose();
  });
  promiseObserver.observe(document.getElementById('section-promise'), { attributes: true, attributeFilter: ['class'] });
  document.getElementById('btn-promise').addEventListener('click', () => goToChapter('future'));

  /* ---------------------------------------------------------
     13. SECTION 7 — FUTURE (constellation spelling H <3 P)
  --------------------------------------------------------- */
  // Simple point-grid forming H, heart, P across the viewBox (400x220)
  const constellationPoints = [
    // H
    [30,40],[30,110],[30,180],[70,40],[70,110],[70,180],
    // heart (small cluster)
    [170,70],[190,50],[210,70],[190,90],[190,130],
    // P
    [280,40],[280,110],[280,180],[320,40],[320,75],[280,75]
  ];
  const constellationLines = [
    [0,1],[1,2],[3,4],[4,5],[1,4], // H
    [6,7],[7,8],[8,9],[9,10], // heart
    [11,12],[13,14],[14,15],[15,11] // P
  ];
  let constellationBuilt = false;
  function buildConstellation() {
    if (constellationBuilt) return;
    constellationBuilt = true;
    const svg = document.getElementById('constellation-svg');
    svg.setAttribute('viewBox', '0 0 400 220');
    constellationPoints.forEach((pt, i) => {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', pt[0]); c.setAttribute('cy', pt[1]); c.setAttribute('r', 4);
      c.classList.add('const-star');
      c.style.animationDelay = (i * 0.09) + 's';
      svg.appendChild(c);
    });
    constellationLines.forEach((pair, i) => {
      const [a, b] = pair;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', constellationPoints[a][0]);
      line.setAttribute('y1', constellationPoints[a][1]);
      line.setAttribute('x2', constellationPoints[b][0]);
      line.setAttribute('y2', constellationPoints[b][1]);
      line.classList.add('const-line');
      svg.appendChild(line);
      setTimeout(() => line.classList.add('draw'), 1400 + i * 220);
    });
    setTimeout(() => {
      const lead = document.getElementById('future-lead');
      const textBox = document.getElementById('future-text');
      const btn = document.getElementById('btn-future');
      lead.hidden = false; lead.classList.add('show');
      setTimeout(() => { textBox.hidden = false; btn.hidden = false; }, 900);
    }, 1400 + constellationLines.length * 220 + 500);
  }
  document.getElementById('btn-future').addEventListener('click', () => goToChapter('gallery'));

  /* ---------------------------------------------------------
     14. SECTION 8 — GALLERY (masonry placeholders + lightbox)
  --------------------------------------------------------- */
  let galleryBuilt = false;
  function buildGallery() {
    if (galleryBuilt) return;
    galleryBuilt = true;
    const grid = document.getElementById('gallery-grid');
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.innerHTML = `<div id="lightbox-inner"></div>`;
    document.body.appendChild(lightbox);
    lightbox.addEventListener('click', () => lightbox.classList.remove('show'));

    for (let i = 1; i <= 12; i++) {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.textContent = `photo ${i}`;
      item.addEventListener('click', () => {
        document.getElementById('lightbox-inner').textContent = `photo ${i} — full view`;
        lightbox.classList.add('show');
      });
      grid.appendChild(item);
    }
  }
  document.getElementById('btn-gallery').addEventListener('click', () => goToChapter('midnight'));

  /* ---------------------------------------------------------
     15. SECTION 9 — HIDDEN HEARTS (15, scattered fixed overlay)
  --------------------------------------------------------- */
  const hiddenHeartNotes = [
    "You make quiet moments feel like enough.",
    "I saved this one just for you to find.",
    "You're the best decision I keep getting to make.",
    "Still glad I texted first that day.",
    "You make ordinary Tuesdays worth remembering.",
    "This is me, smiling at my screen for no reason.",
    "You're the calm part of my day.",
    "I like you on your worst days too.",
    "Some things I only say in the small print.",
    "You found this one — of course you did.",
    "This app has more of us hidden in it than you think.",
    "You're my favorite notification.",
    "I'm proud of you, even when I forget to say it out loud.",
    "You're the softest part of my week.",
    "Okay, that's the last one — go finish the journey."
  ];
  const hiddenHeartsLayer = document.getElementById('hidden-hearts-layer');
  const hiddenHeartNote = document.getElementById('hidden-heart-note');
  let heartsBuilt = false;
  function buildHiddenHearts() {
    if (heartsBuilt) return;
    heartsBuilt = true;
    for (let i = 0; i < 15; i++) {
      const btn = document.createElement('button');
      btn.className = 'hidden-heart';
      btn.setAttribute('aria-label', 'A tiny hidden heart');
      btn.textContent = '♥';
      btn.style.left = (5 + Math.random() * 90) + 'vw';
      btn.style.top = (8 + Math.random() * 84) + 'vh';
      btn.style.animationDelay = (Math.random() * 3) + 's';
      btn.addEventListener('click', () => {
        btn.classList.add('found');
        hiddenHeartNote.hidden = false;
        hiddenHeartNote.classList.remove('show'); void hiddenHeartNote.offsetWidth;
        hiddenHeartNote.classList.add('show');
        hiddenHeartNote.textContent = hiddenHeartNotes[i];
      });
      hiddenHeartsLayer.appendChild(btn);
    }
  }
  buildHiddenHearts();

  /* ---------------------------------------------------------
     16. SECTION 10 — MIDNIGHT SKY (25 clickable stars)
  --------------------------------------------------------- */
  const midnightSentences = [
    "I think about you at the most random times of day.",
    "You're the last thing I check on before I sleep.",
    "I still get a little nervous before I see you.",
    "You make silence feel comfortable instead of empty.",
    "I like the version of me that exists around you.",
    "You're the person I want to tell things to first.",
    "I trust you with the parts of me I don't show anyone else.",
    "You make me want to plan a future instead of just living day to day.",
    "I like how normal 'us' has started to feel.",
    "You're my favorite kind of distraction.",
    "I've never had to perform for you, and that's rare.",
    "You make hard days feel survivable.",
    "I think you're funnier than you give yourself credit for.",
    "You're the calm in most of my storms.",
    "I like watching you get excited about small things.",
    "You make me want to be more patient, more honest, more present.",
    "I still remember exactly how it felt the first time you laughed at something I said.",
    "You're proof that good things don't have to be complicated.",
    "I like being someone you can be fully yourself around.",
    "You've made ordinary life feel less ordinary.",
    "I don't take it lightly that you chose me too.",
    "You're the softest, steadiest part of my life right now.",
    "I like the way we argue and still end up okay.",
    "You make me want to keep showing up, every day, on purpose.",
    "This whole thing — all of it — was worth building for you."
  ];
  let midnightBuilt = false;
  let midnightFound = 0;
  function buildMidnightSky() {
    if (midnightBuilt) return;
    midnightBuilt = true;
    const field = document.getElementById('midnight-field');
    const noteEl = document.getElementById('midnight-note');
    const countEl = document.getElementById('midnight-count');
    const btn = document.getElementById('btn-midnight');
    midnightSentences.forEach((sentence, i) => {
      const star = document.createElement('button');
      star.className = 'mid-star';
      star.setAttribute('aria-label', 'A star with a sentence inside');
      star.style.left = (Math.random() * 94) + '%';
      star.style.top = (Math.random() * 88) + '%';
      star.style.animationDelay = (Math.random() * 2) + 's';
      star.addEventListener('click', () => {
        if (star.classList.contains('found')) {
          noteEl.hidden = false; noteEl.classList.remove('show'); void noteEl.offsetWidth; noteEl.classList.add('show');
          noteEl.textContent = sentence;
          return;
        }
        star.classList.add('found');
        midnightFound++;
        countEl.textContent = midnightFound;
        noteEl.hidden = false; noteEl.classList.remove('show'); void noteEl.offsetWidth; noteEl.classList.add('show');
        noteEl.textContent = sentence;
        if (midnightFound >= midnightSentences.length) btn.disabled = false;
      });
      field.appendChild(star);
    });
  }
  document.getElementById('btn-midnight').addEventListener('click', () => goToChapter('final'));

  /* ---------------------------------------------------------
     17. SECTION 11 — FINAL LETTER (1000+ words, typing)
  --------------------------------------------------------- */
  const finalLetterText = `Chello,

I wanted this last part to be the most honest thing I've written, so I'm going to try not to dress it up too much.

When I think back on everything before this — every section you just clicked through — I realize all of it was really circling the same idea: that you make my life feel less like something I'm managing and more like something I actually want to be living. That's not a small thing to me. A lot of people go through their whole lives without finding someone who does that, and I don't think I've fully sat with how lucky that makes me.

I want to tell you about the version of the future I actually think about, not the movie version, the real one. I picture us figuring out logistics badly, like we always do, and laughing about it after. I picture bad days where I'm not enough and you're not enough and we're both a little short with each other, and then one of us apologizes first, and it's fine, because that's what actually holds a relationship together — not the absence of hard days, but what happens after them. I picture your family's chaos at dinner and my family's quiet at dinner and somehow blending both into something that's ours. I picture years where nothing dramatic happens and I'm still glad to be there.

I think a lot of people wait for love to feel like a constant high, and get disappointed when it settles into something calmer. I don't feel that way about us. I like the calm. I like that I'm not anxious about where we stand. I like that loving you doesn't feel like a performance I have to keep up — it feels like coming home to something steady, even on the days it's hard.

I want to be honest about something else too: I don't think I was fully ready for how much you'd change my life before we started this. I don't mean that dramatically. I mean it practically — the way I think about my own future changed. I started thinking in terms of "we" without meaning to. I started making decisions with you in mind, not because you asked me to, but because it stopped making sense not to. That's not something I expected, and it's not something I take for granted.

I also want to say, plainly, that I see how hard you try. I see it in the way you check on people even when you're running on empty. I see it in the way you keep showing up for us even when you've had a long week and would rather just disappear into your own space for a bit. I see it in the way you're still working on yourself — the parts you're not totally proud of, the habits you're trying to break, the patience you're trying to build. I notice all of it, even the parts you think go unnoticed. I want you to know they don't.

There's a version of me that worries about not being enough for you — not dramatically, just in the ordinary human way everyone worries sometimes. But then I remember that you've never once made me feel like I had to be perfect to be loved by you. You've made room for my bad days, my bad moods, the version of me that isn't always easy to be around. That kind of grace isn't something I'll ever stop being grateful for.

Puttii, I don't think love is really about the big declarations, even though I've made a few of those to you already tonight. I think it's mostly about the boring stuff — remembering how you take your coffee, noticing when your voice changes on the phone, texting you something dumb because I thought of you at a random hour, staying up later than I should because the conversation was worth it. I think love is choosing, over and over, in small unremarkable ways, to keep showing up for one specific person instead of anyone else. And I keep choosing you, easily, every single time.

I know this whole thing — the site, the letters, all of it — is a little much. I'm aware. But I wanted you to have proof, something you could come back to on a day you need reminding, that this is real and it isn't going anywhere just because the excitement of "new" has worn off. If anything, I like this version of us more than the beginning. I like knowing you, actually knowing you, more than I liked the mystery of getting to know you. I'll take real over exciting every time.

Pondati, thank you for being patient with me while I figure out how to be a good partner, because I am figuring it out, not pretending I already have it perfected. Thank you for laughing at my bad jokes even when they're objectively not funny. Thank you for being someone I don't have to brace myself around. Thank you for making my ordinary days feel less ordinary, without even trying to.

I don't know what all of this looks like in five years, or ten. I don't think anyone really does. But I know what I want it to look like, and you're in every version of it I can picture. That's enough for me to keep building toward, one regular day at a time.

There's one more thing I keep coming back to, and it's this: somewhere along the way, you stopped being a person I was excited about and became a person I trust completely, and I think that shift is the actual proof that this is real. Excitement is easy — anyone can feel that at the start. Trust is the part that gets built slowly, on ordinary Tuesdays, through the small moments where you had every reason to let me down and didn't. Every time you kept your word about something small, every time you told me the truth even when a comfortable lie would've been easier, every time you chose patience over frustration — that's where this is actually made of. Not the letters. Not the sites like this one. The unremarkable, repeated proof that you're who you say you are.

I also want you to know that I don't need you to be anything other than exactly who you already are. Not a version that's calmer, or more put together, or less tired after a long week. I like the real one — the one who overthinks a text for ten minutes and then sends something completely different, the one who pretends she isn't hungry until she suddenly is, the one who gets shy about being cared for even though she deserves it constantly. I'm not in love with a highlight reel. I'm in love with the whole person, including the parts you're still working on, including the days you're difficult to love, because everyone has those and I'm not exempt from them either.

Thank you for making my heart feel at home.`;

  const finalTypingEl = document.getElementById('final-typing');
  const btnFinal = document.getElementById('btn-final');
  let finalTyped = false;
  function startFinalLetter() {
    if (finalTyped) return;
    finalTyped = true;
    typeText(finalTypingEl, finalLetterText, 11, () => { btnFinal.hidden = false; });
  }
  btnFinal.addEventListener('click', () => goToChapter('ending'));

  /* ---------------------------------------------------------
     18. ENDING — final reveal, fireworks, petals
  --------------------------------------------------------- */
  let endingStarted = false;
  function startEnding() {
    if (endingStarted) return;
    endingStarted = true;
    const line2 = document.getElementById('ending-line-2');
    const secretBtn = document.getElementById('btn-secret');
    setTimeout(() => { line2.hidden = false; }, 2200);
    setTimeout(() => { secretBtn.hidden = false; }, 4200);
  }

  document.getElementById('btn-secret').addEventListener('click', () => {
    const reveal = document.getElementById('final-reveal');
    document.getElementById('btn-secret').hidden = true;
    reveal.hidden = false;
    reveal.classList.add('show');
    launchFireworks();
    launchPetals();
    if (musicPlaying) bgMusic.volume = Math.min(1, bgMusic.volume + 0.3 || 1);
  });

  /* Fireworks (canvas particle burst) */
  const fwCanvas = document.getElementById('fireworks-canvas');
  const fwCtx = fwCanvas.getContext('2d');
  function resizeFw() { fwCanvas.width = window.innerWidth; fwCanvas.height = window.innerHeight; }
  resizeFw();
  window.addEventListener('resize', resizeFw);
  let fireworkParticles = [];
  function launchFireworks() {
    const colors = ['#ff5fa2', '#ff8cc0', '#c9a66b', '#f7f2ec'];
    function burst() {
      const cx = Math.random() * fwCanvas.width;
      const cy = Math.random() * fwCanvas.height * 0.5 + 40;
      const count = 36;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = Math.random() * 3 + 2;
        fireworkParticles.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          life: 1, color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    }
    let bursts = 0;
    const burstInterval = setInterval(() => {
      burst();
      bursts++;
      if (bursts >= 6) clearInterval(burstInterval);
    }, 500);
    animateFireworks();
  }
  function animateFireworks() {
    fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
    fireworkParticles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.03; p.life -= 0.012;
      fwCtx.globalAlpha = Math.max(p.life, 0);
      fwCtx.beginPath();
      fwCtx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
      fwCtx.fillStyle = p.color;
      fwCtx.fill();
    });
    fwCtx.globalAlpha = 1;
    fireworkParticles = fireworkParticles.filter(p => p.life > 0);
    if (document.getElementById('section-ending').classList.contains('active')) {
      requestAnimationFrame(animateFireworks);
    }
  }

  /* Rose petals falling */
  function launchPetals() {
    const container = document.getElementById('petals-container');
    let count = 0;
    const petalTimer = setInterval(() => {
      const petal = document.createElement('div');
      petal.className = 'petal';
      petal.style.left = Math.random() * 100 + 'vw';
      petal.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px');
      petal.style.animationDuration = (5 + Math.random() * 4) + 's';
      petal.style.background = Math.random() > 0.5 ? '#ff8cc0' : '#c9a66b';
      container.appendChild(petal);
      setTimeout(() => petal.remove(), 10000);
      count++;
      if (count > 60) clearInterval(petalTimer);
    }, 180);
  }

  /* ---------------------------------------------------------
     19. KEYBOARD SHORTCUTS
  --------------------------------------------------------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'm' || e.key === 'M') musicBtn.click();
  });

  /* init progress at intro */
  updateProgress('intro');
});
