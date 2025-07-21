Blockly.defineBlocksWithJsonArray([
  {
    "type": "drone_takeoff",
    "message0": "เริ่มบิน",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 200,
    "tooltip": "เริ่มการบินของโดรน"
  },
  {
    "type": "drone_move_up",
    "message0": "บินขึ้น %1 เซนติเมตร",
    "args0": [{ "type": "input_value", "name": "DISTANCE", "check": "Number" }],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 160,
    "tooltip": "ให้โดรนบินขึ้นในแนวตั้ง"
  },
  {
    "type": "drone_move_down",
    "message0": "บินลง %1 เซนติเมตร",
    "args0": [{ "type": "input_value", "name": "DISTANCE", "check": "Number" }],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 160,
    "tooltip": "ให้โดรนบินลงในแนวตั้ง"
  },
  {
    "type": "drone_land",
    "message0": "ลงจอด",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 200,
    "tooltip": "ให้โดรนลงจอด"
  },
  {
    "type": "drone_move_forward",
    "message0": "เดินหน้า %1 เซนติเมตร",
    "args0": [{ "type": "input_value", "name": "DISTANCE", "check": "Number" }],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 160,
    "tooltip": "เคลื่อนโดรนไปข้างหน้า"
  },
  {
    "type": "drone_move_backward",
    "message0": "ถอยหลัง %1 เซนติเมตร",
    "args0": [{ "type": "input_value", "name": "DISTANCE", "check": "Number" }],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 160,
    "tooltip": "ถอยหลัง"
  },
  {
    "type": "drone_rotate_left",
    "message0": "หมุนซ้าย %1 องศา",
    "args0": [{ "type": "input_value", "name": "DEGREE", "check": "Number" }],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 120
  },
  {
    "type": "drone_rotate_right",
    "message0": "หมุนขวา %1 องศา",
    "args0": [{ "type": "input_value", "name": "DEGREE", "check": "Number" }],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 140
  },
  {
    "type": "drone_flip",
    "message0": "ตีลังกา",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 180
  }
]);

const workspace = Blockly.inject('blocklyDiv', {
  toolbox: `
    <xml>
      <block type="drone_takeoff"></block>
      <block type="drone_land"></block>
      <block type="drone_move_forward"><value name="DISTANCE"><shadow type="math_number"><field name="NUM">50</field></shadow></value></block>
      <block type="drone_move_backward"><value name="DISTANCE"><shadow type="math_number"><field name="NUM">50</field></shadow></value></block>
      <block type="drone_rotate_left"><value name="DEGREE"><shadow type="math_number"><field name="NUM">90</field></shadow></value></block>
      <block type="drone_rotate_right"><value name="DEGREE"><shadow type="math_number"><field name="NUM">90</field></shadow></value></block>
      <block type="drone_move_up"><value name="DISTANCE"><shadow type="math_number"><field name="NUM">50</field></shadow></value></block>
      <block type="drone_move_down"><value name="DISTANCE"><shadow type="math_number"><field name="NUM">50</field></shadow></value></block>
      <block type="drone_flip"></block>
    </xml>
  `,
  trashcan: true
});