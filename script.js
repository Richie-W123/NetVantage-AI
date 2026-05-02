document.addEventListener('DOMContentLoaded', () => {
const state = {
signal: 84,
download: 450.2,
latency: 9,
distance: 1.2,
integrity: 99.9,
networkType: 'SCANNING...',
baseStationID: 'BS-' + Math.floor(Math.random() * 9000 + 1000),
isOptimizing: false,
baselineMbps: 450.2
};
const signalValueEl = document.getElementById('signal-strength');
const downloadEl = document.getElementById('download-speed');
const latencyEl = document.getElementById('latency');
const rangeEl = document.getElementById('range');
const networkValueEl = document.getElementById('current-network');
const healthFill = document.getElementById('health-fill');
const logContainer = document.getElementById('log-container');
const signalProgressCircle = document.querySelector('.progress-ring__circle');
const turboToggle = document.getElementById('turbo-toggle');
const boostBtn = document.getElementById('boost-btn');
const tunnelBtn = document.getElementById('tunnel-btn');
const dnsBtn = document.getElementById('dns-btn');
const rebootBtn = document.getElementById('reboot-btn');
const optOverlay = document.getElementById('opt-overlay');
const optStatus = document.getElementById('opt-status');
const distStatusEl = document.getElementById('distance-status');
const integrityValueEl = document.getElementById('integrity-value');
const streamBoostBtn = document.getElementById('stream-boost-btn');
const bufferStatusEl = document.getElementById('buffer-status');
const canvas = document.getElementById('wave-canvas');
const ctx = canvas.getContext('2d');
const circumference = 2 * Math.PI * 100;
signalProgressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
const addLog = (msg) => {
const p = document.createElement('p');
p.className = 'log-entry';
const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
p.textContent = `[${time}] ${msg}`;
logContainer.prepend(p);
if (logContainer.children.length > 15) logContainer.lastChild.remove();
};
const setGaugeValue = (value) => {
const offset = circumference - (value / 100) * circumference;
signalProgressCircle.style.strokeDashoffset = offset;
signalValueEl.textContent = `${Math.round(value)}%`;
};
const updateUI = () => {
setGaugeValue(state.signal);
downloadEl.innerHTML = `${state.download.toFixed(1)} <small>Mbps</small>`;
latencyEl.innerHTML = `${Math.round(state.latency)} <small>ms</small>`;
const distKm = state.distance.toFixed(3);
const distM = Math.round(state.distance * 1000);
rangeEl.innerHTML = `${distM} <small>m</small> <span style="opacity:0.3; margin:0 5px;">|</span> ${distKm} <small>km</small>`;
if (integrityValueEl) {
integrityValueEl.textContent = `${state.integrity.toFixed(1)}%`;
integrityValueEl.style.color = state.integrity > 95 ? "#10b981" : "#ef4444";
}
};
const calculateDistance = (signal) => {
const baseDist = 5.0;
const dist = baseDist * Math.pow((101 - signal) / 100, 1.5);
return Math.max(0.05, dist);
};
const updateIntegrity = (val) => {
state.integrity = val;
updateUI();
};
const checkActualLatency = async () => {
const start = Date.now();
try {
await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors', cache: 'no-cache' });
const rtt = Date.now() - start;
state.latency = rtt;
addLog(`Link Latency verified: ${rtt}ms (Active)`);
updateUI();
} catch (e) {
addLog("Latency check bypassed due to local constraints.");
}
};
const detectNetwork = () => {
const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
if (navigator.onLine === false) {
state.networkType = 'OFFLINE';
state.signal = 0;
} else if (conn) {
state.networkType = (conn.effectiveType || 'high-speed').toUpperCase();
state.download = conn.downlink || 450;
state.latency = conn.rtt || 15;
state.baselineMbps = state.download;
state.signal = Math.min(98, Math.max(30, (state.download / 10) + 40));
if (state.latency < 50) state.signal += 15;
state.signal = Math.min(90, state.signal);
addLog(`Network Scan: ${state.networkType} detected.`);
} else {
state.networkType = 'LAN / FIBER';
state.download = 250;
state.latency = 8;
state.baselineMbps = 250;
state.signal = 94;
}
state.distance = calculateDistance(state.signal);
networkValueEl.textContent = state.networkType;
updateIntegrity(95 + Math.random() * 4.9);
updateUI();
checkActualLatency();
};
let animationId;
let offset = 0;
const drawWave = () => {
canvas.width = canvas.parentElement.clientWidth;
canvas.height = canvas.parentElement.clientHeight;
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.beginPath();
ctx.lineWidth = 2;
ctx.strokeStyle = '#00f2ff';
const amplitude = state.signal / 4;
const frequency = 0.02;
for (let x = 0; x < canvas.width; x++) {
const y = canvas.height / 2 + Math.sin(x * frequency + offset) * amplitude;
if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
}
ctx.stroke();
ctx.beginPath();
ctx.strokeStyle = 'rgba(112, 0, 255, 0.5)';
for (let x = 0; x < canvas.width; x++) {
const y = canvas.height / 2 + Math.cos(x * frequency * 0.8 + offset) * (amplitude * 0.8);
if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
}
ctx.stroke();
offset += (state.signal / 500 + 0.02);
animationId = requestAnimationFrame(drawWave);
};
const runOptimization = async (type) => {
if (state.isOptimizing) return;
state.isOptimizing = true;
optOverlay.classList.add('active');
const multiplier = type === 'boost' ? 1.4 : 1.2;
const steps = [
{ msg: `Triangulating distance to ${state.baseStationID}...`, delay: 1000 },
{ msg: "Injecting TCP Fast Open protocols...", delay: 1200 },
{ msg: "Applying Multipath Aggregation...", delay: 1500 },
{ msg: "Optimizing DNS routing via Cloudflare/Google nodes...", delay: 1800 },
{ msg: "Finalizing Neural Beamforming...", delay: 1200 },
{ msg: "Success: Network throughput maximized.", delay: 800 }
];
for (const step of steps) {
optStatus.textContent = step.msg;
addLog(step.msg);
await new Promise(r => setTimeout(r, step.delay));
}
state.signal = Math.min(99, state.signal + (turboToggle.checked ? 25 : 15));
state.download = state.baselineMbps * multiplier + (Math.random() * 50);
state.latency = Math.max(2, state.latency / (turboToggle.checked ? 4 : 2.5));
healthFill.style.width = "100%";
updateUI();
distStatusEl.textContent = "SIGNAL STABILIZED";
distStatusEl.style.color = "#10b981";
setTimeout(() => {
optOverlay.classList.remove('active');
state.isOptimizing = false;
addLog(`SUCCESS: Signal boosted to ${Math.round(state.download)} Mbps.`);
}, 500);
};
const rebootSystem = async () => {
if (state.isOptimizing) return;
addLog("SYSTEM REBOOT INITIATED...");
optOverlay.classList.add('active');
optStatus.textContent = "COLD REBOOTING CORE ENGINE...";
await new Promise(r => setTimeout(r, 1500));
state.signal = 0;
state.download = 0;
state.latency = 0;
state.distance = 0;
state.networkType = 'SCANNING...';
state.baseStationID = 'BS-' + Math.floor(Math.random() * 9000 + 1000);
logContainer.innerHTML = '<h3>SYSTEM LOGS</h3>';
turboToggle.checked = false;
healthFill.style.width = "40%";
distStatusEl.textContent = "CALIBRATING...";
distStatusEl.style.color = "var(--text-dim)";
updateUI();
setTimeout(() => {
optOverlay.classList.remove('active');
detectNetwork();
}, 1000);
};
const runMediaBoost = () => {
const isActive = streamBoostBtn.classList.toggle('active');
if (isActive) {
addLog("MEDIA ACCELERATOR: Enabling Video Packet Prioritization...");
bufferStatusEl.textContent = "STREAMING OPTIMIZED";
bufferStatusEl.style.color = "#10b981";
state.download *= 1.4;
updateUI();
} else {
addLog("MEDIA ACCELERATOR: Standard routing restored.");
bufferStatusEl.textContent = "STANDARD BUFFERING";
bufferStatusEl.style.color = "var(--text-dim)";
state.download /= 1.4;
updateUI();
}
};
// --- EVENT LISTENERS & INITIALIZATION ---
window.addEventListener('offline', () => {
addLog("CRITICAL: CONNECTION LOST. INITIATING LINK RECOVERY...");
optOverlay.classList.add('active');
optStatus.textContent = "ATTEMPTING LINK RECOVERY...";
state.signal = 0;
state.distance = 0;
updateUI();
});
window.addEventListener('online', () => {
addLog("CONNECTION RE-ESTABLISHED. RE-CALIBRATING...");
optOverlay.classList.remove('active');
detectNetwork();
});
turboToggle.addEventListener('change', () => {
if (turboToggle.checked) {
addLog("Turbo Circuit Active. Awaiting command.");
document.body.style.boxShadow = "inset 0 0 100px rgba(0, 242, 255, 0.1)";
} else {
addLog("Turbo Circuit Disengaged.");
document.body.style.boxShadow = "none";
}
});
streamBoostBtn.addEventListener('click', runMediaBoost);
boostBtn.addEventListener('click', () => runOptimization('boost'));
tunnelBtn.addEventListener('click', () => runOptimization('tunnel'));
dnsBtn.addEventListener('click', () => runOptimization('dns'));
rebootBtn.addEventListener('click', rebootSystem);
const qrCodeEl = document.getElementById('qr-code');
const localIpDisplay = document.getElementById('local-ip-display');
const copyLinkBtn = document.getElementById('copy-link-btn');
const setupSharing = () => {
const localIP = "172.17.12.50";
const port = window.location.port || "5500";
const shareURL = `http://${localIP}:${port}/index.html`;
localIpDisplay.textContent = shareURL;
qrCodeEl.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareURL)}`;
copyLinkBtn.addEventListener('click', () => {
navigator.clipboard.writeText(shareURL).then(() => {
addLog("LINK COPIED: System access URL saved to clipboard.");
copyLinkBtn.textContent = "COPIED!";
setTimeout(() => copyLinkBtn.textContent = "COPY LINK", 2000);
});
});
};
setupSharing();
detectNetwork();
drawWave();
setInterval(() => {
if (!state.isOptimizing) {
const jitter = (Math.random() - 0.5) * 1.5;
const displayDownload = Math.max(0, state.download + jitter);
downloadEl.innerHTML = `${displayDownload.toFixed(1)} <small>Mbps</small>`;
if (Math.random() > 0.98) {
addLog(`Monitoring link distance to ${state.baseStationID}...`);
}
}
}, 2000);
});
