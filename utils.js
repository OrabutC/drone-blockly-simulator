function log(text) {
  const timestamp = new Date().toLocaleTimeString();
  const logBox = document.getElementById('logBox');
  logBox.value += `[${timestamp}] ${text}\n`;
  logBox.scrollTop = logBox.scrollHeight;
}

function drawPath() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  for (let i = 0; i < simulator.path.length - 1; i++) {
    const [x1, y1] = simulator.path[i];
    const [x2, y2] = simulator.path[i + 1];
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  }
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 2;
  ctx.stroke();

  if (simulator.path.length > 0) {
    const [x, y, z] = simulator.path[simulator.path.length - 1];
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = z > 0 ? 'red' : 'green';
    ctx.fill();
    ctx.fillText(`z: ${z.toFixed(1)} cm`, x + 10, y - 10);
  }

  updateHeight();
}

function updateTimer() {
  if (timerInterval) clearInterval(timerInterval); // เคลียร์ก่อน
  if (!startTime) return;

  timerInterval = setInterval(() => {
    const now = Date.now();
    const total = elapsedTime + (now - startTime) / 1000;
    document.getElementById('timerLabel').textContent = `เวลาบิน: ${total.toFixed(1)} วินาที`;
  }, 100);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateDistance() {
  document.getElementById('distanceLabel').textContent = `ระยะทางบิน: ${simulator.totalDistance.toFixed(1)} เซนติเมตร`;
}

function updateHeight() {
  document.getElementById('heightLabel').textContent = `ความสูง: ${simulator.z.toFixed(1)} เซนติเมตร`;
}

function checkOrigin() {
  const { x, y, z } = simulator;
  const atStartXY = Math.hypot(x - 250, y - 250) < 10;
  const atGroundZ = z < 10;
  if (atStartXY && atGroundZ) {
    alert('บินเสร็จสิ้นสำเร็จ! กลับถึงจุดเริ่มต้นแล้ว');
    log('✅ กลับถึงจุดเริ่มต้นแล้ว');
  }
}

function validateNumber(value, defaultValue, type) {
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) {
    log(`${type}ไม่ถูกต้อง ใช้ค่าเริ่มต้น ${defaultValue}`);
    return defaultValue;
  }
  return num;
}

function reset() {
  simulator.reset();
  startTime = null;
  elapsedTime = 0;
  stopTimer(); // หยุดเวลา

  document.getElementById('timerLabel').textContent = 'เวลาบิน: 0.0 วินาที';
  document.getElementById('distanceLabel').textContent = 'ระยะทางบิน: 0.0 เซนติเมตร';
  document.getElementById('heightLabel').textContent = 'ความสูง: 0.0 เซนติเมตร';
  document.getElementById('logBox').value = '';
  log('รีเซ็ตระบบ');
  drawPath();

  if (typeof workspace !== 'undefined') {
    workspace.clear();
  }
}
