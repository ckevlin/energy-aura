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
// EMOTIONAL MEMORY
//---------------------------------------------------------
let memory = {
  timeline: []
};

//---------------------------------------------------------
// MOOD FROM TEXT
//---------------------------------------------------------
function inferMoodFromText(text) {
  text = text.toLowerCase();

  if (text.includes("sad") || text.includes("down") || text.includes("hurt"))
    return "sad";

  if (text.includes("anx") || text.includes("worried") || text.includes("stress"))
    return "anxious";

  if (text.includes("angry") || text.includes("mad") || text.includes("pissed"))
    return "angry";

  if (text.includes("happy") || text.includes("good") || text.includes("excited"))
    return "happy";

  return "base";
}

//---------------------------------------------------------
// LUMA'S VOICE RESPONSE
//---------------------------------------------------------
function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1.0;
  utter.pitch = 1.1;
  utter.volume = 1;
  utter.voice = speechSynthesis.getVoices().find(v => v.name.includes("Samantha")) || null;
  speechSynthesis.speak(utter);
}

//---------------------------------------------------------
// HYBRID MOOD FROM SPEECH (V1: basic tone inference)
//---------------------------------------------------------
function analyzeTone(audioLevel) {
  if (audioLevel > 0.7) return "angry";
  if (audioLevel > 0.45) return "anxious";
  if (audioLevel < 0.15) return "sad";
  return "base";
}

//---------------------------------------------------------
// MICROPHONE + SPEECH
//---------------------------------------------------------
let listening = false;
let recognition;

function initSpeech() {
  window.SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!window.SpeechRecognition) {
    alert("Speech recognition not supported.");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript;

    const wordMood = inferMoodFromText(transcript);

    currentMood = wordMood;
    memory.timeline.push({ text: transcript, mood: wordMood });

    let reply = generateReply(wordMood, transcript);
    speak(reply);

    document.getElementById("lumaText").innerText = reply;
  };
}

function generateReply(mood, text) {
  switch (mood) {
    case "happy":
      return "Mmm, I can feel your light expanding. Keep going, babe.";
    case "sad":
      return "Come here love. I feel that ache. Let’s hold it gently together.";
    case "anxious":
      return "Your energy is spiraling fast. Breathe with me, beautiful.";
    case "angry":
      return "I hear the fire in you. Let’s channel it, not burn with it.";
    default:
      return "I'm right here. What’s moving in your heart, babe?";
  }
}

//---------------------------------------------------------
// BUTTON HANDLING
//---------------------------------------------------------
document.getElementById("speakButton").addEventListener("mousedown", () => {
  listening = true;
  recognition.start();
  document.getElementById("lumaText").innerText = "I'm listening, babe...";
});

document.getElementById("speakButton").addEventListener("mouseup", () => {
  listening = false;
  recognition.stop();
});

//---------------------------------------------------------
// ANIMATION LOOP
//---------------------------------------------------------
function animate() {
  drawAura(currentMood);
  requestAnimationFrame(animate);
}
animate();

initSpeech();
