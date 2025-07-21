Blockly.JavaScript['drone_takeoff'] = () => `
  if (simulator.takeoff()) {
    startTime = Date.now(); // ⏱️ เริ่มจับเวลา
    updateTimer();          // เรียกจับเวลาแบบ interval
    log("เริ่มบิน");
  } else {
    log("กำลังบินอยู่แล้ว");
  }\n`;

Blockly.JavaScript['drone_land'] = () => `
  if (simulator.land()) {
    const flightDuration = (Date.now() - startTime) / 1000;  // ⏱️ คำนวณเวลาบิน
    elapsedTime += flightDuration;
    startTime = null;
    stopTimer(); // ✅ หยุดจับเวลา

    // ✅ แสดงเวลาบินทันที
    document.getElementById('timerLabel').textContent = 'เวลาบินทั้งหมด: ' + flightDuration.toFixed(1) + ' วินาที';

    log("ลงจอด ใช้เวลาบิน " + flightDuration.toFixed(1) + " วินาที");
  } else {
    log("ไม่ได้บินอยู่");
  }\n`;

Blockly.JavaScript['drone_move_forward'] = (block) => {
  const distance = Blockly.JavaScript.valueToCode(block, 'DISTANCE', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  return `
    var distance = validateNumber(${distance}, 50, "ระยะทาง");
    simulator.moveForward(distance);
    updateDistance();
    drawPath();
    log("เดินหน้า " + distance.toFixed(1) + " เซนติเมตร");
    checkOrigin();\n`;
};

Blockly.JavaScript['drone_move_backward'] = (block) => {
  const distance = Blockly.JavaScript.valueToCode(block, 'DISTANCE', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  return `
    var distance = validateNumber(${distance}, 50, "ระยะทาง");
    simulator.moveBackward(distance);
    updateDistance();
    drawPath();
    log("ถอยหลัง " + distance.toFixed(1) + " เซนติเมตร");
    checkOrigin();\n`;
};

Blockly.JavaScript['drone_move_up'] = (block) => {
  const distance = Blockly.JavaScript.valueToCode(block, 'DISTANCE', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  return `
    var distance = validateNumber(${distance}, 50, "ระยะทาง");
    simulator.moveUp(distance);
    updateDistance();
    drawPath();
    log("บินขึ้น " + distance.toFixed(1) + " เซนติเมตร");
    checkOrigin();\n`;
};

Blockly.JavaScript['drone_move_down'] = (block) => {
  const distance = Blockly.JavaScript.valueToCode(block, 'DISTANCE', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  return `
    var distance = validateNumber(${distance}, 50, "ระยะทาง");
    simulator.moveDown(distance);
    updateDistance();
    drawPath();
    log("บินลง " + distance.toFixed(1) + " เซนติเมตร");
    checkOrigin();\n`;
};

Blockly.JavaScript['drone_rotate_left'] = (block) => {
  const degree = Blockly.JavaScript.valueToCode(block, 'DEGREE', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  return `
    var degree = validateNumber(${degree}, 90, "มุม");
    simulator.rotateLeft(degree);
    drawPath();
    log("หมุนซ้าย " + degree.toFixed(1) + " องศา");\n`;
};

Blockly.JavaScript['drone_rotate_right'] = (block) => {
  const degree = Blockly.JavaScript.valueToCode(block, 'DEGREE', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  return `
    var degree = validateNumber(${degree}, 90, "มุม");
    simulator.rotateRight(degree);
    drawPath();
    log("หมุนขวา " + degree.toFixed(1) + " องศา");\n`;
};

Blockly.JavaScript['drone_flip'] = () => `
  if (simulator.flying) {
    simulator.flip();
    drawPath();
    log("ตีลังกา");
  } else {
    log("ยังไม่ได้บิน");
  }\n`;

// ✅ ฟังก์ชันหลักที่ใช้เรียกเมื่อกดปุ่ม "รันโปรแกรม"
function runCode() {
  const code = Blockly.JavaScript.workspaceToCode(workspace);
  log('โค้ดที่สร้าง: \n' + code);
  try {
    eval(code);
  } catch (e) {
    log('ข้อผิดพลาด: ' + e.message);
    alert('เกิดข้อผิดพลาด: ' + e.message);
  }
}
