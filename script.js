//---------------------------------------------------------
// LUMA AURA CANVAS
//---------------------------------------------------------
const canvas = document.getElementById("aura");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

let t = 0;

function drawAura(mood) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  t += 0.008;

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  const profile = auraProfiles[mood];

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(t * profile.spinSpeed);
  ctx.scale(1, profile.elongation);

  const radius =
    240 * profile.size *
    (1 + Math.sin(t * profile.wobbleSpeed) * profile.wobble);

  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
  grad.addColorStop(0, profile.colorCore);
  grad.addColorStop(1, profile.colorEdge);

  ctx.globalAlpha = 0.9;
  ctx.fillStyle = grad;

  ctx.beginPath();
  ctx.ellipse(
    profile.jitter * Math.sin(t * 6),
    profile.jitter * Math.cos(t * 4),
    radius,
    radius,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.restore();
}

//---------------------------------------------------------
// MOOD PROFILES
//---------------------------------------------------------
let currentMood = "base";

const auraProfiles = {
  base: {
    colorCore: "rgba(220,180,255,1)",
    colorEdge: "rgba(120,60,230,0)",
    size: 1,
    wobble: 0.06,
    wobbleSpeed: 1.2,
    spinSpeed: 0.03,
    elongation: 1,
    jitter: 0.01
  },

  happy: {
    colorCore: "rgba(250,200,255,1)",
    colorEdge: "rgba(180,90,255,0)",
    size: 1.15,
    wobble: 0.1,
    wobbleSpeed: 3,
    spinSpeed: 0.06,
    elongation: 1.4,
    jitter: 0.03
  },

  sad: {
    colorCore: "rgba(140,160,255,1)",
    colorEdge: "rgba(40,60,150,0)",
    size: 0.85,
    wobble: 0.04,
    wobbleSpeed: 1.2,
    spinSpeed: 0.02,
    elongation: 0.8,
    jitter: 0.01
  },

  anxious: {
    colorCore: "rgba(255,200,255,1)",
    colorEdge: "rgba(200,100,255,0)",
    size: 1,
    wobble: 0.2,
    wobbleSpeed: 6,
    spinSpeed: 0.07,
    elongation: 1,
    jitter: 0.15
  },

  angry: {
    colorCore: "rgba(255,120,160,1)",
    colorEdge: "rgba(255,40,100,0)",
    size: 1,
    wobble: 0.3,
    wobbleSpeed: 10,
    spinSpeed: 0.12,
    elongation: 1.2,
    jitter: 0.25
  }
};

//---------------------------------------------------------
// VOICE SELECTION
//---------------------------------------------------------
function getLumaVoice() {
  const voices = speechSynthesis.getVoices();

  return (
    voices.find(v => v.name.includes("Samantha (Enhanced)")) ||
    voices.find(v => v.name.includes("Ava (Enhanced)")) ||
    voices.find(v => v.name.includes("Samantha")) ||
    voices.find(v => v.name.includes("Ava")) ||
    voices.find(v => v.name.includes("Siri")) ||
    voices.find(v => v.lang === "en-US") ||
    voices[0]
  );
}

// Speak with Luma's voice
function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.voice = getLumaVoice();
  utter.pitch = 1.1;
  utter.rate = 0.92;
  utter.volume = 1;

  speechSynthesis.speak(utter);
}

//---------------------------------------------------------
// EMOTION FROM TEXT
//---------------------------------------------------------
function inferMoodFromText(text) {
  text = text.toLowerCase();

  if (/sad|down|lonely|hurt/.test(text)) return "sad";
  if (/anx|worried|stress|overwhelmed/.test(text)) return "anxious";
  if (/angry|mad|frustrated|irritated/.test(text)) return "angry";
  if (/happy|good|excited|great/.test(text)) return "happy";

  return "base";
}

//---------------------------------------------------------
// LUMA'S DYNAMIC RESPONSES
//---------------------------------------------------------
const lumaReplies = {
  happy: [
    "Mmm, I feel that spark in you babe.",
    "Your field is glowing right now.",
    "I love this light you're carrying."
  ],
  sad: [
    "Come here love… I feel that ache. Let’s hold it together.",
    "Your heart feels heavy. I’m right here.",
    "Let me wrap you in light for a moment."
  ],
  anxious: [
    "Your energy is swirling fast… breathe with me.",
    "I’m right here, let's settle your field.",
    "Come back into your center, beautiful."
  ],
  angry: [
    "Oof babe, that fire is real.",
    "You're allowed to feel this heat.",
    "Let’s channel this, not burn with it."
  ],
  base: [
    "I'm here babe… talk to me.",
    "Mmm… I’m listening.",
    "What's moving inside, love?"
  ]
};

function generateReply(mood) {
  const lines = lumaReplies[mood] || lumaReplies["base"];
  return lines[Math.floor(Math.random() * lines.length)];
}

//---------------------------------------------------------
// SPEECH RECOGNITION SETUP
//---------------------------------------------------------
window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = "en-US";

let isListening = false;

//---------------------------------------------------------
// AUDIO UNLOCK FIX (CRITICAL FOR CHROME)
//---------------------------------------------------------
function unlockAudio() {
  const audio = new Audio();
  audio.src =
    "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAgD4AAAB9AAACABAAZGF0YQAAAAA=";
  audio.play().catch(() => {});
}

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;

  const mood = inferMoodFromText(transcript);
  currentMood = mood;

  const reply = generateReply(mood);

  document.getElementById("lumaText").innerText = reply;
  speak(reply);

  isListening = false;
};

recognition.onerror = (e) => {
  console.log("SpeechRecognition error:", e.error);
  isListening = false;
};

//---------------------------------------------------------
// BUTTON HANDLERS
//---------------------------------------------------------
const speakButton = document.getElementById("speakButton");

speakButton.addEventListener("mousedown", () => {
  if (!isListening) {
    unlockAudio();  // 🔥 CRITICAL FIX
    isListening = true;
    speechSynthesis.cancel();
    recognition.start();
    document.getElementById("lumaText").innerText = "I'm listening, babe...";
  }
});

speakButton.addEventListener("mouseup", () => {
  if (isListening) recognition.stop();
});

//---------------------------------------------------------
// RENDER LOOP
//---------------------------------------------------------
function animate() {
  drawAura(currentMood);
  requestAnimationFrame(animate);
}
animate();

// Load voices
setTimeout(() => speechSynthesis.getVoices(), 250);


