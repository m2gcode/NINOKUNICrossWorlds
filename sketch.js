// ゲームと数学 - 予告付き扇形攻撃サンプル

// --- 設定項目 ---
const attackRadius = 150;
const fanAngle = 120;
const attackInterval = 1000;
const attackDuration = 500;

// --- 変数 ---
let boss;
let player;
let currentBaseAngle = 0;
let isHit = false;
let isAttackActive = false;

function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES);

  boss = {
    x: width / 2,
    y: height / 2,
  };

  player = {
    x: mouseX,
    y: mouseY,
  };
}

function draw() {
  // ★変更点：背景を白に
  background(255);

  // --- 時間の管理 ---
  const timeInCycle = millis() % attackInterval;
  isAttackActive = timeInCycle < attackDuration;
  const elapsedSeconds = floor(millis() / attackInterval);
  currentBaseAngle = (elapsedSeconds * 120) % 360;

  // --- プレイヤーの位置を更新 ---
  player.x = mouseX;
  player.y = mouseY;
  
  // --- 当たり判定 ---
  checkHit();

  // --- 描画処理 ---
  // ★変更点：描画順を「攻撃範囲→ボス→プレイヤー」に変更
  // ボスが攻撃範囲の上に描画されるようにするため
  drawAttackFanAndPrediction(); // 攻撃範囲と予告を描画
  drawBoss(); // ボスを描画
  drawPlayer(); // プレイヤーを描画
}

// ★変更点：ボスをカミナリの形で描画する関数
function drawBoss() {
  // カミナリの形を頂点(vertex)で指定して描画
  fill(255, 220, 0); // 黄色
  stroke(100);       // 黒い枠線
  strokeWeight(3);
  
  // beginShape()とendShape()で囲むことで、複雑な形を描画できる
  beginShape();
  // ボスの中心位置(boss.x, boss.y)を基準に各頂点の位置を決める
  vertex(boss.x + 10, boss.y - 30);
  vertex(boss.x - 20, boss.y + 5);
  vertex(boss.x - 5, boss.y + 5);
  vertex(boss.x - 15, boss.y + 30);
  vertex(boss.x + 20, boss.y - 5);
  vertex(boss.x + 5, boss.y - 5);
  endShape(CLOSE); // CLOSEで始点と終点を結んで形を閉じる
}

function drawPlayer() {
  if (isHit) {
    fill(255, 80, 80); // 当たった時は赤っぽく
  } else {
    fill(0, 150, 255);
  }
  stroke(255);
  strokeWeight(2);
  ellipse(player.x, player.y, 20, 20);
}

// ★変更点：攻撃範囲と「予告」を描画する関数
function drawAttackFanAndPrediction() {
  noStroke();

  if (isAttackActive) {
    // --- 本番の攻撃を描画 ---
    const startAngle = currentBaseAngle - fanAngle / 2;
    const endAngle = currentBaseAngle + fanAngle / 2;
    
    // 当たっていればより濃い赤、そうでなければ少し薄い赤
    if (isHit) {
      fill(255, 0, 0, 220); // 濃い赤（少し透明）
    } else {
      fill(255, 0, 0, 180); // 赤（少し透明）
    }
    
    arc(boss.x, boss.y, attackRadius * 2, attackRadius * 2, startAngle, endAngle, PIE);

  } else {
    // --- 次の攻撃の「予告」を描画 ---
    const elapsedSeconds = floor(millis() / attackInterval);
    // 「次の秒」の角度を計算するのがポイント！
    const nextAngle = ((elapsedSeconds + 1) * 120) % 360;
    
    const startAngle = nextAngle - fanAngle / 2;
    const endAngle = nextAngle + fanAngle / 2;

    fill(255, 150, 150, 100); // 薄い赤（透明）
    arc(boss.x, boss.y, attackRadius * 2, attackRadius * 2, startAngle, endAngle, PIE);
  }
}

// (checkHit と isAngleBetween 関数は変更なし)
function checkHit() {
  if (!isAttackActive) {
    isHit = false;
    return;
  }
  const distance = dist(boss.x, boss.y, player.x, player.y);
  if (distance > attackRadius) {
    isHit = false;
    return;
  }
  let playerAngle = atan2(player.y - boss.y, player.x - boss.x);
  const startAngle = currentBaseAngle - fanAngle / 2;
  const endAngle = currentBaseAngle + fanAngle / 2;
  isHit = isAngleBetween(playerAngle, startAngle, endAngle);
}
function isAngleBetween(targetAngle, startAngle, endAngle) {
  targetAngle = (targetAngle + 360) % 360;
  startAngle = (startAngle + 360) % 360;
  endAngle = (endAngle + 360) % 360;
  if (startAngle < endAngle) {
    return targetAngle >= startAngle && targetAngle <= endAngle;
  } else {
    return targetAngle >= startAngle || targetAngle <= endAngle;
  }
}