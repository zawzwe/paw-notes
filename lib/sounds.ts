/**
 * Pet-attracting sound effects — local files + CDN fallback
 */

const CDN = "https://cdn.jsdelivr.net/npm/soundbind@1.1.0/assets/sounds";

const audioCache = new Map<string, HTMLAudioElement>();
let currentAudio: HTMLAudioElement | null = null;

function playUrl(url: string) {
  // Same audio playing? Toggle pause
  if (currentAudio && currentAudio.src === url) {
    if (!currentAudio.paused) {
      currentAudio.pause();
      return;
    }
    currentAudio.play().catch(() => {});
    return;
  }

  // Stop previous
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  let audio = audioCache.get(url);
  if (!audio) {
    audio = new Audio(url);
    audioCache.set(url, audio);
  }
  currentAudio = audio;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

// Stop all sounds (called when switching animals)
export function stopAllSounds() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

// ── Sounds ──

export function playMeow() {
  playUrl("/sounds/cat-meow.mp3");
}

export function playBark() {
  playUrl(`${CDN}/dog-barking.mp3`);
}

export function playBird() {
  playUrl("/sounds/bird-chirp.mp3");
}

export function playSqueak() {
  playUrl("/sounds/squeaky-toy.mp3");
}

export function playPurr() {
  playUrl("/sounds/purr.mp3");
}
