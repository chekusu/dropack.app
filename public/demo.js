// The product film as an inline animation (no native video UI). Loaded right after its figure.
//  - Muted, it loops only while at least 35 % of it is on screen and the page is visible; with
//    prefers-reduced-motion it never starts by itself. Automatic playback is always muted.
//  - Every explicit play/replay is a sound session exactly when sound is on; leaving the view
//    or hiding the page pauses it and only an explicit gesture plays again.
//  - Sound starts only from the sound button: the film restarts from the beginning so the
//    narration is complete, plays once and stops on the final logo card. Leaving the page or
//    scrolling away pauses it, and it never resumes with sound by itself.
//  - Captions come from the page's own WebVTT track and are drawn in an HTML layer, so the
//    picture's feathered edge never fades them. That layer is the only visible caption: the track
//    is kept 'hidden' even when the browser later switches it to 'showing' by itself.
//  - Button labels and states follow the media element's own events, so fast clicks, rejected
//    play() promises, the end of the film and visibility changes cannot leave a wrong label.
(() => {
  const fig = document.querySelector('.demo');
  const video = fig?.querySelector('video');
  if (!fig || !video) return;
  const labels = JSON.parse(fig.dataset.labels);
  const $ = (k) => fig.querySelector(`[data-action="${k}"]`);
  const btn = { play: $('play'), sound: $('sound'), replay: $('replay') };
  const captions = fig.querySelector('.demo-captions');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  video.removeAttribute('controls');
  video.muted = true;
  video.loop = true;
  fig.classList.add('is-ready');
  fig.querySelector('.demo-controls').hidden = false;

  let inView = false;
  let userPaused = reduce.matches; // reduced motion: nothing starts until the visitor asks
  let soundSession = false; // true from the sound gesture until the film ends or is muted

  const play = () => video.play().catch(() => { render(); });

  // Automatic playback is only ever the muted ambient loop, never with reduced motion, and only
  // when nobody paused it, it is on screen (≥ 35 %) and the page is visible.
  function sync() {
    const visible = inView && document.visibilityState === 'visible';
    if (!visible) {
      if (!video.paused) video.pause();
      // Sound never comes back on its own: leaving ends the sound session as a user pause.
      if (soundSession) { soundSession = false; userPaused = true; }
      render();
      return;
    }
    if (video.muted && !reduce.matches && !soundSession && !userPaused && video.paused && !video.ended) play();
    render();
  }

  function render() {
    const playing = !video.paused && !video.ended;
    btn.play.setAttribute('aria-label', playing ? labels.pause : labels.play);
    btn.play.dataset.state = playing ? 'pause' : 'play';
    const audible = !video.muted;
    btn.sound.setAttribute('aria-label', audible ? labels.soundOff : labels.soundOn);
    btn.sound.setAttribute('aria-pressed', String(audible));
    btn.sound.dataset.state = audible ? 'on' : 'off';
    fig.dataset.state = video.ended ? 'ended' : playing ? 'playing' : 'paused';
  }

  btn.sound.addEventListener('click', () => {
    if (video.muted) {
      // Explicit gesture: restart so the narration is heard from its first sentence, once.
      soundSession = true;
      userPaused = false;
      video.loop = false;
      video.muted = false;
      video.currentTime = 0;
      video.play().catch(() => { video.muted = true; video.loop = true; soundSession = false; render(); });
    } else {
      soundSession = false;
      video.muted = true;
      video.loop = true;
      if (video.ended) video.currentTime = 0;
      sync();
    }
    render();
  });

  btn.play.addEventListener('click', () => {
    if (!video.paused && !video.ended) {
      userPaused = true;
      video.pause();
    } else {
      userPaused = false;
      soundSession = !video.muted; // an explicit play with sound is a sound session again
      if (soundSession) video.loop = false;
      if (video.ended) video.currentTime = 0;
      play();
    }
    render();
  });

  btn.replay.addEventListener('click', () => {
    userPaused = false;
    soundSession = !video.muted;
    video.loop = video.muted;
    video.currentTime = 0;
    play();
    render();
  });

  // With sound the film plays once and rests on the final logo card.
  video.addEventListener('ended', () => { soundSession = false; userPaused = true; render(); });
  for (const e of ['play', 'playing', 'pause', 'volumechange', 'seeked']) video.addEventListener(e, render);

  new IntersectionObserver((entries) => {
    const e = entries[entries.length - 1];
    inView = e.isIntersecting && e.intersectionRatio >= 0.35;
    sync();
  }, { threshold: [0, 0.35] }).observe(fig);
  document.addEventListener('visibilitychange', sync);
  reduce.addEventListener?.('change', () => { if (reduce.matches && !soundSession) { userPaused = true; video.pause(); } render(); });

  // Captions: the page's own track, rendered as text (never innerHTML). The HTML layer is the only
  // visible renderer, so every text track stays 'hidden' (cues and cuechange keep working, nothing
  // is drawn natively) for the life of the page. Setting it once is not enough: browsers may turn
  // the default track to 'showing' by themselves later (WebKit's automatic caption selection once
  // the media loads, caption preferences changing), which would draw each cue twice.
  const track = video.textTracks[0];
  if (track && captions) {
    const tracks = video.textTracks;
    const keepHidden = () => { for (const t of tracks) if (t.mode === 'showing') t.mode = 'hidden'; };
    const show = () => {
      keepHidden();
      const text = [...(track.activeCues ?? [])].map((c) => c.text).join('\n');
      if (captions.textContent !== text) captions.textContent = text;
      captions.hidden = !text;
    };
    tracks.addEventListener('change', show); // fires for every mode change, the browser's own too
    tracks.addEventListener('addtrack', keepHidden);
    for (const e of ['loadstart', 'loadedmetadata', 'loadeddata', 'play', 'seeked']) video.addEventListener(e, keepHidden);
    track.addEventListener('cuechange', show);
    track.mode = 'hidden';
    show();
  }
  render();
})();
