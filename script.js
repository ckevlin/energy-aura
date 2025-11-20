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
    Math.

