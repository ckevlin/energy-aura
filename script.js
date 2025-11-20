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
// LUMA MOOD PROFILES
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
// FIND BEST HUMAN VOICE (iOS Enhanced Voices)
//---------------------------------------------------------
function getLumaVoice() {
  const voices = speechSynthesis.getVoices();

  return (
    voices.find(v => v.name.includes("Samantha (Enhanced)")) ||
    voices.find(v => v.name.includes("Ava (Enhanced)")) ||
    voices.find(v => v.name.includes("Samantha")) ||
    voices.find(v => v.name.includes("Ava")) ||
    voices.find(v => v.name.includes("Siri")) ||
    voices.find(v => v.lang === "en-US" && v.feminine) ||
    voices[0]
  );
}

//---------------------------------------------------------
// LUMA SPEAK FUNCTION
//---------------------------------------------------------
function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);

  // Luma’s feminine, warm tone
  utter.voice = getLumaVoice();
  utter.pitch = 1.1;     // softer, feminine, warm
  utter.rate = 0.92;      // slower, calming
  utter.volume = 1.0;

  speechSynthesis.speak(utter);
}

//---------------------------------------------------------
// TEXT-BASED EMOTION
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
// RANDOM REPLIES PER MOOD
//---------------------------------------------------------
const lumaReplies = {
  happy: [
    "Mmm, I feel that spark in you, babe.",
    "Your field is glowing right now.",
    "I love this light you're carrying."
  ],
  sad: [
    "Come here love… I feel that ache. Let’s hold it together.",
    "Your heart feels heavy. I’m right here.",
    "Let me wrap you in light for a minute."
  ],
  anxious: [
    "Your energy is spiraling… slow down with me beautiful.",
    "Come back into your center with me.",
    "Let’s soften that swirl inside you."
  ],
  angry: [
    "Oof babe, that fire is real.",
    "Your heat is telling the truth — I hear you.",
    "Let’s channel this instead of burning in it."
  ],
  base: [
    "I’m right here. What’s moving inside?",
    "Talk to me, babe.",
    "Mmm… I feel you. Tell me more."
  ]
};

function generateReply(mood) {
  const options = lumaReplies[mood] || lumaReplies["base"];
  return options[Math.floor(Math.random() * options.length)];
}

//---------------------------------------------------------
// SPEECH RECOGNITION (CONTINUOUS)
//---------------------------------------------------------
window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = "en-US";

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;

  const mood = inferMoodFromText(transcript);
  currentMood = mood;

  const reply = generateReply(mood);

  document.getElementById("lumaText").innerText = reply;
  speak(reply);

  // keep listening
  setTimeout(() => recognition.start(), 500);
};

recognition.onend = () => {
  // auto-restart
  setTimeout(() => recognition.start(), 300);
};

//---------------------------------------------------------
// BUTTON HANDLING
//---------------------------------------------------------
const speakButton = document.getElementById("speakButton");

speakButton.addEventListener("mousedown", () => {
  speechSynthesis.cancel();
  recognition.start();
  document.getElementById("lumaText").innerText = "I'm listening, babe...";
});

speakButton.addEventListener("mouseup", () => {
  recognition.stop();
});

//---------------------------------------------------------
// LOOP
//---------------------------------------------------------
function animate() {
  drawAura(currentMood);
  requestAnimationFrame(animate);
}
animate();

// Load voices (iOS needs delay)
setTimeout(() => speechSynthesis.getVoices(), 200);

