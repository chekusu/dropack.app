// Caption invariant for the inline film (public/demo.js), without a browser: exactly one visible
// caption renderer, the HTML layer, even when the browser turns the native track to 'showing'
// after initialization. Runs demo.js against a minimal fake DOM whose text-track mode changes
// queue a 'change' event on the track list, as browsers do.
//   DEMO_JS=<file> node --test tests/demo.test.mjs   runs the same checks on another version
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const SRC = readFileSync(process.env.DEMO_JS || new URL('../public/demo.js', import.meta.url), 'utf8');
const tick = () => new Promise((r) => setTimeout(r, 0));
const settle = async () => { for (let i = 0; i < 4; i++) await tick(); };

class TrackList extends EventTarget {
  #items = [];
  get length() { return this.#items.length; }
  add(t) { this[this.#items.length] = t; this.#items.push(t); this.dispatchEvent(new Event('addtrack')); }
  [Symbol.iterator]() { return this.#items[Symbol.iterator](); }
}
class Track extends EventTarget {
  #mode = 'disabled';
  activeCues = [];
  constructor(list) { super(); this.list = list; }
  get mode() { return this.#mode; }
  // Script and browser changes alike queue a 'change' on the list (HTML spec, TextTrackList).
  set mode(m) { if (m !== this.#mode) { this.#mode = m; setTimeout(() => this.list.dispatchEvent(new Event('change')), 0); } }
  // A browser change whose event has not arrived yet (or never does).
  setSilently(m) { this.#mode = m; }
}

function page() {
  const el = (extra = {}) => Object.assign(new EventTarget(), { hidden: true, dataset: {}, attrs: {}, setAttribute(k, v) { this.attrs[k] = v; }, getAttribute(k) { return this.attrs[k]; }, removeAttribute(k) { delete this.attrs[k]; } }, extra);
  const tracks = new TrackList();
  const track = new Track(tracks);
  tracks.add(track);
  const video = el({
    muted: true, loop: false, paused: true, ended: false, currentTime: 0, textTracks: tracks,
    play() { this.paused = false; this.dispatchEvent(new Event('play')); return Promise.resolve(); },
    pause() { this.paused = true; this.dispatchEvent(new Event('pause')); },
  });
  const captions = el({ textContent: '' });
  const buttons = { play: el(), sound: el(), replay: el() };
  const controls = el();
  const fig = el({
    dataset: { labels: JSON.stringify({ play: 'p', pause: 'pa', soundOn: 'on', soundOff: 'off', replay: 'r', group: 'g' }) },
    classList: { add() {} },
    querySelector(sel) {
      if (sel === 'video') return video;
      if (sel === '.demo-captions') return captions;
      if (sel === '.demo-controls') return controls;
      return buttons[/data-action="(\w+)"/.exec(sel)?.[1]] ?? null;
    },
  });
  const document = Object.assign(new EventTarget(), { visibilityState: 'visible', querySelector: (s) => (s === '.demo' ? fig : null) });
  const context = {
    document,
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    IntersectionObserver: class { constructor(cb) { this.cb = cb; } observe() {} },
  };
  runInNewContext(SRC, context);
  const cue = (text) => { track.activeCues = text ? [{ text }] : []; track.dispatchEvent(new Event('cuechange')); };
  // Visible caption renderers: the HTML layer if shown, plus every natively showing track.
  const visible = () => (captions.hidden ? 0 : 1) + [...tracks].filter((t) => t.mode === 'showing').length;
  return { video, track, tracks, captions, buttons, cue, visible, Track };
}

test('the track is hidden at start and the HTML layer draws the active cue', async () => {
  const p = page();
  await settle();
  assert.equal(p.track.mode, 'hidden');
  p.cue('相机里的素材，');
  assert.equal(p.captions.textContent, '相机里的素材，');
  assert.equal(p.captions.hidden, false);
  assert.equal(p.visible(), 1);
});

test('the native track turned to showing after initialization, while the HTML caption is shown: one visible caption', async () => {
  const p = page();
  await settle();
  p.cue('整批照片，一次 AirDrop。');
  p.track.mode = 'showing'; // the browser's own automatic selection or caption preference
  await settle();
  assert.equal(p.track.mode, 'hidden', 'the native track is hidden again');
  assert.equal(p.captions.hidden, false, 'the HTML caption stays');
  assert.equal(p.captions.textContent, '整批照片，一次 AirDrop。', 'with the same cue');
  assert.equal(p.visible(), 1);
  // Later cues still arrive and are drawn once.
  p.cue('逐项存进相册。');
  assert.equal(p.captions.textContent, '逐项存进相册。');
  p.cue('');
  assert.equal(p.captions.hidden, true);
  assert.equal(p.visible(), 0);
});

test('a showing track is hidden again on media load, play, seek and cue changes, even without its change event', async () => {
  const p = page();
  await settle();
  for (const e of ['loadstart', 'loadedmetadata', 'loadeddata', 'play', 'seeked', 'cuechange']) {
    p.track.setSilently('showing');
    (e === 'cuechange' ? p.track : p.video).dispatchEvent(new Event(e));
    assert.equal(p.track.mode, 'hidden', e);
  }
  // Replay and the sound gesture restart the film; the invariant holds through them.
  p.track.setSilently('showing');
  p.buttons.replay.dispatchEvent(new Event('click'));
  await settle();
  p.cue('整批照片，一次 AirDrop。');
  assert.equal(p.visible(), 1, 'replay');
  p.track.setSilently('showing');
  p.buttons.sound.dispatchEvent(new Event('click'));
  await settle();
  assert.equal(p.track.mode, 'hidden', 'sound');
  assert.equal(p.video.muted, false, 'sound behaviour unchanged');
});

test('a track added later in showing mode is hidden too', async () => {
  const p = page();
  await settle();
  const extra = new p.Track(p.tracks);
  extra.setSilently('showing');
  p.tracks.add(extra);
  await settle();
  assert.equal(extra.mode, 'hidden');
});
