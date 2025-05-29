const canvas = document.getElementById("amortiguamientoCanvas");
const ctx = canvas.getContext("2d");

const A = 100;
const omega = 2;

let t = 0;
const dt = 0.02;
let selectedMode = "sub";
let points = [];

function subamortiguado(t) {
    const lambda = 0.5;
    const mu = Math.sqrt(omega ** 2 - lambda ** 2);
    return A * Math.exp(-lambda * t) * Math.cos(mu * t);
}

function critico(t) {
    const lambda = omega;
    return A * (1 + t) * Math.exp(-lambda * t);
}

function sobreamortiguado(t) {
    const lambda = 3;
    const disc = lambda ** 2 - omega ** 2;
    const m1 = -lambda + Math.sqrt(disc);
    const m2 = -lambda - Math.sqrt(disc);
    const C1 = 0.7, C2 = 0.3;
    return A * (C1 * Math.exp(m1 * t) + C2 * Math.exp(m2 * t));
}

function getScaleY(mode) {
    if (mode === "sub") return 1;
    if (mode === "critico") return 1.5;
    if (mode === "sobre") return 3;
    return 1;
}

function drawGraph(points, mode) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const yBase = canvas.height / 2;
    const scaleY = getScaleY(mode);

    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(0, yBase);
    ctx.lineTo(canvas.width, yBase);
    ctx.stroke();

    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
        const px = (points[i].t / 10) * (canvas.width - 100) + 50;
        const py = yBase - scaleY * points[i].x;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = mode === "sub" ? "blue" : mode === "critico" ? "green" : "red";
    ctx.lineWidth = 2;
    ctx.stroke();

    const last = points[points.length - 1];
    const cx = (last.t / 10) * (canvas.width - 100) + 50;
    const cy = yBase - scaleY * last.x;
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
}

function animate() {
    let x;
    if (selectedMode === "sub") x = subamortiguado(t);
    else if (selectedMode === "critico") x = critico(t);
    else if (selectedMode === "sobre") x = sobreamortiguado(t);

    points.push({ t: t, x: x });
    if (t > 10) {
        t = 0;
        points = [];
    }

    drawGraph(points, selectedMode);
    t += dt;
    requestAnimationFrame(animate);
}

document.getElementById("btnSub").addEventListener("click", () => {
    selectedMode = "sub";
    t = 0;
    points = [];
});

document.getElementById("btnCritico").addEventListener("click", () => {
    selectedMode = "critico";
    t = 0;
    points = [];
});

document.getElementById("btnSobre").addEventListener("click", () => {
    selectedMode = "sobre";
    t = 0;
    points = [];
});

animate();
