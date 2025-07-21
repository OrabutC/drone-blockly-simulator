class DroneSimulator {
  constructor() {
    this.x = 250;
    this.y = 250;
    this.z = 0;
    this.angle = 0;
    this.path = [[this.x, this.y, this.z]];
    this.flying = false;
    this.totalDistance = 0;
    this.ws = null; // WebSocket สำหรับ Wi-Fi
    this.isSimulationMode = true;
    this.batteryLevel = 100;
    this.droneIp = "192.168.4.1"; // IP ของโดรน Toro (ต้องเปลี่ยนตามจริง)
    this.wsPort = 81; // พอร์ต WebSocket (ต้องเปลี่ยนตามจริง)
  }

  toggleMode() {
    this.isSimulationMode = !this.isSimulationMode;
    log(`สลับโหมดเป็น: ${this.isSimulationMode ? 'จำลอง' : 'จริง'}`);
    if (!this.isSimulationMode) {
      this.connectToDrone();
    }
  }

  connectToDrone() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      log("เชื่อมต่อ Wi-Fi กับโดรนแล้ว");
      return;
    }
    this.ws = new WebSocket(`ws://${this.droneIp}:${this.wsPort}`);
    this.ws.onopen = () => {
      log("เชื่อมต่อกับโดรนผ่าน Wi-Fi สำเร็จ");
      this.startReadingBattery();
    };
    this.ws.onmessage = (event) => this.parseBatteryData(event.data);
    this.ws.onerror = (error) => log("ข้อผิดพลาดในการเชื่อมต่อ Wi-Fi: " + error);
    this.ws.onclose = () => log("การเชื่อมต่อ Wi-Fi กับโดรน");
  }

  startReadingBattery() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN && !this.isSimulationMode) {
      this.ws.send("GET_BATTERY");
      log("เริ่มอ่านข้อมูลแบตเตอรี่ผ่าน Wi-Fi");
    }
  }

  parseBatteryData(data) {
    const batteryMatch = data.match(/BATTERY: (\d+)%/);
    if (batteryMatch) {
      this.batteryLevel = parseInt(batteryMatch[1]);
      updateBattery();
      log(`ระดับแบตเตอรี่: ${this.batteryLevel}%`);
    }
    const voltageMatch = data.match(/VOLTAGE: (\d+\.\d+)V/);
    if (voltageMatch) {
      const voltage = parseFloat(voltageMatch[1]);
      this.batteryLevel = Math.min(100, Math.max(0, ((voltage - 10.5) / (11.1 - 10.5)) * 100));
      updateBattery();
      log(`ระดับแบตเตอรี่ (จากแรงดัน): ${this.batteryLevel.toFixed(1)}%`);
    }
  }

  async sendCommand(command) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN && !this.isSimulationMode) {
      this.ws.send(command);
      log("ส่งคำสั่ง: " + command);
    } else if (this.isSimulationMode) {
      log("โหมดจำลอง: ไม่ส่งคำสั่งไปโดรนจริง");
    } else {
      log("ไม่สามารถส่งคำสั่งได้ กรุณาเชื่อมต่อ Wi-Fi กับโดรน");
    }
  }

  async moveForward(distance) {
    if (this.flying) {
      if (this.isSimulationMode) {
        const rad = this.angle * Math.PI / 180;
        const oldX = this.x;
        const oldY = this.y;
        this.x += distance * Math.sin(rad);
        this.y -= distance * Math.cos(rad);
        this.path.push([this.x, this.y, this.z]);
        const deltaX = this.x - oldX;
        const deltaY = this.y - oldY;
        this.totalDistance += Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      } else {
        await this.sendCommand(`MOVE_FORWARD ${distance}`);
        this.totalDistance += distance;
      }
      updateDistance();
      drawPath();
      log(`${this.isSimulationMode ? 'จำลอง' : 'จริง'}: เดินหน้า ${distance} ซม., แบต: ${this.batteryLevel}%`);
    }
  }

  async moveBackward(distance) {
    if (this.flying) {
      if (this.isSimulationMode) {
        const rad = this.angle * Math.PI / 180;
        const oldX = this.x;
        const oldY = this.y;
        this.x -= distance * Math.sin(rad);
        this.y += distance * Math.cos(rad);
        this.path.push([this.x, this.y, this.z]);
        const deltaX = this.x - oldX;
        const deltaY = this.y - oldY;
        this.totalDistance += Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      } else {
        await this.sendCommand(`MOVE_BACKWARD ${distance}`);
        this.totalDistance += distance;
      }
      updateDistance();
      drawPath();
      log(`${this.isSimulationMode ? 'จำลอง' : 'จริง'}: ถอยหลัง ${distance} ซม., แบต: ${this.batteryLevel}%`);
    }
  }

  async moveUp(distance) {
    if (this.flying) {
      if (this.isSimulationMode) {
        const oldZ = this.z;
        this.z += distance;
        this.path.push([this.x, this.y, this.z]);
        const deltaZ = this.z - oldZ;
        this.totalDistance += Math.sqrt(deltaZ * deltaZ);
      } else {
        await this.sendCommand(`MOVE_UP ${distance}`);
        this.z += distance;
        this.totalDistance += distance;
      }
      updateHeight();
      updateDistance();
      drawPath();
      log(`${this.isSimulationMode ? 'จำลอง' : 'จริง'}: บินขึ้น ${distance} ซม., แบต: ${this.batteryLevel}%`);
    }
  }

  async moveDown(distance) {
    if (this.flying) {
      if (this.z - distance >= 0) {
        if (this.isSimulationMode) {
          const oldZ = this.z;
          this.z -= distance;
          this.path.push([this.x, this.y, this.z]);
          const deltaZ = this.z - oldZ;
          this.totalDistance += Math.sqrt(deltaZ * deltaZ);
        } else {
          await this.sendCommand(`MOVE_DOWN ${distance}`);
          this.z -= distance;
          this.totalDistance += distance;
        }
        updateHeight();
        updateDistance();
        drawPath();
        log(`${this.isSimulationMode ? 'จำลอง' : 'จริง'}: บินลง ${distance} ซม., แบต: ${this.batteryLevel}%`);
      } else {
        log("ไม่สามารถบินลงได้ อยู่ที่พื้นแล้ว");
      }
    }
  }

  async rotateLeft(degree) {
    if (this.isSimulationMode) {
      this.angle = (this.angle - degree) % 360;
    } else {
      await this.sendCommand(`ROTATE_LEFT ${degree}`);
      this.angle = (this.angle - degree) % 360;
    }
    drawPath();
    log(`${this.isSimulationMode ? 'จำลอง' : 'จริง'}: หมุนซ้าย ${degree} องศา, แบต: ${this.batteryLevel}%`);
  }

  async rotateRight(degree) {
    if (this.isSimulationMode) {
      this.angle = (this.angle + degree) % 360;
    } else {
      await this.sendCommand(`ROTATE_RIGHT ${degree}`);
      this.angle = (this.angle + degree) % 360;
    }
    drawPath();
    log(`${this.isSimulationMode ? 'จำลอง' : 'จริง'}: หมุนขวา ${degree} องศา, แบต: ${this.batteryLevel}%`);
  }

  async flip() {
    if (this.flying) {
      if (this.isSimulationMode) {
        this.angle = (this.angle + 360) % 360;
      } else {
        await this.sendCommand("FLIP");
        this.angle = (this.angle + 360) % 360;
      }
      drawPath();
      log(`${this.isSimulationMode ? 'จำลอง' : 'จริง'}: ตีลังกา, แบต: ${this.batteryLevel}%`);
    } else {
      log("ยังไม่ได้บิน");
    }
  }

  async takeoff() {
    if (!this.flying) {
      if (this.isSimulationMode) {
        this.flying = true;
        this.z = 10;
        this.path.push([this.x, this.y, this.z]);
        this.totalDistance += 10;
      } else {
        await this.sendCommand("TAKEOFF");
        this.flying = true;
        this.z = 10;
        this.totalDistance += 10;
      }
      startTime = Date.now();
      updateTimer();
      updateHeight();
      updateDistance();
      drawPath();
      log(`${this.isSimulationMode ? 'จำลอง' : 'จริง'}: เริ่มบิน, แบต: ${this.batteryLevel}%`);
      return true;
    }
    return false;
  }

  async land() {
    if (this.flying) {
      if (this.isSimulationMode) {
        this.flying = false;
        this.z = 0;
        this.path.push([this.x, this.y, this.z]);
        this.totalDistance += this.z;
      } else {
        await this.sendCommand("LAND");
        this.flying = false;
        this.z = 0;
        this.totalDistance += this.z;
      }
      elapsedTime += (Date.now() - startTime) / 1000;
      startTime = null;
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      updateHeight();
      updateDistance();
      drawPath();
      log(`${this.isSimulationMode ? 'จำลอง' : 'จริง'}: ลงจอด, แบต: ${this.batteryLevel}%`);
      return true;
    }
    return false;
  }

  reset() {
    this.x = 250;
    this.y = 250;
    this.z = 0;
    this.angle = 0;
    this.path = [[this.x, this.y, this.z]];
    this.flying = false;
    this.totalDistance = 0;
    this.batteryLevel = 100;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    startTime = null;
    elapsedTime = 0;
    updateHeight();
    updateDistance();
    updateBattery();
    drawPath();
    log('ระบบรีเซ็ต, แบต: 100%');
  }
}

// วาดเส้นทางแบบ 2D (พร้อมแสดงความสูง)
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
}

// เรียกใช้
const simulator = new DroneSimulator();
const canvas = document.getElementById('droneCanvas');
const ctx = canvas.getContext('2d');
let startTime = null;
let elapsedTime = 0;
let timerInterval = null;

drawPath();
log('ระบบพร้อมใช้งาน, แบต: 100%');

// ฟังก์ชันอัปเดตระดับแบตเตอรี่ใน UI
function updateBattery() {
  const batteryBar = document.getElementById('batteryBar');
  const batteryText = document.getElementById('batteryText');
  const width = (simulator.batteryLevel / 100) * 100;
  batteryBar.style.width = `${width}%`;
  batteryText.textContent = `${simulator.batteryLevel}%`;

  if (simulator.batteryLevel > 30) {
    batteryBar.classList.remove('low', 'critical');
    batteryBar.classList.add('high');
  } else if (simulator.batteryLevel > 10) {
    batteryBar.classList.remove('high', 'critical');
    batteryBar.classList.add('low');
  } else {
    batteryBar.classList.remove('high', 'low');
    batteryBar.classList.add('critical');
  }
}

async function connectToDrone() {
  simulator.connectToDrone();
}

function updateTimer() {
  if (!startTime || !simulator.flying) return; // หยุดถ้าไม่บิน
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      elapsedTime += (Date.now() - startTime) / 1000;
      startTime = Date.now();
      document.getElementById('timerLabel').textContent = `เวลาบิน: ${elapsedTime.toFixed(1)} วินาที`;
    }, 100);
  }
}

function updateDistance() {
  document.getElementById('distanceLabel').textContent = `ระยะทางบิน: ${simulator.totalDistance.toFixed(1)} เซนติเมตร`;
}

function updateHeight() {
  document.getElementById('heightLabel').textContent = `ความสูง: ${simulator.z.toFixed(1)} เซนติเมตร`;
}

function log(message) {
  const logBox = document.getElementById('logBox');
  logBox.value += `${new Date().toLocaleTimeString()} - ${message}\n`;
  logBox.scrollTop = logBox.scrollHeight;
}