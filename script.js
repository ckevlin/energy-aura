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
    elongation
