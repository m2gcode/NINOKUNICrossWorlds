// --- 設定項目 ---
const attackRadius = 150;
const fanAngle = 120;
const attackInterval = 1000;
const attackDuration = 500;
const attackName = "回転カミナリ"; // ★変更点：技の名前をここで定義

// --- 変数 ---
let boss;
let player;
let currentBaseAngle = 0;
let isHit = false;
let isAttackActive = false;

function setup() {
  // ★変更点：画面サイズに合わせてキャンバスを作成
  let canvasSize = min(windowWidth, windowHeight);
  createCanvas(canvasSize, canvasSize);
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

// ★変更点：ブラウザのウィンドウサイズが変わったときに自動で呼ばれる関数
function windowResized() {
  let canvasSize = min(windowWidth, windowHeight);
  resizeCanvas(canvasSize, canvasSize);
}


function draw() {
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
  drawAttackFanAndPrediction();
  drawBoss();
  drawPlayer();
  drawUI(); // ★変更点：UI（ユーザーインターフェース）を描画する関数を呼び出し
}

// ★変更点：UIを描画する関数を新しく作成
function drawUI() {
  // テキストの設定
  textSize(32); // 文字の大きさ
  fill(50);     // 文字の色（濃いグレー）
  noStroke();
  textAlign(CENTER, TOP); // 文字を中央揃え（水平方向）、上揃え（垂直方向）にする

  // 画面の上部中央に技の名前を表示
  text(attackName, width / 2, 20);
}


// (drawBoss, drawPlayer, drawAttackFanAndPrediction, checkHit, isAngleBetween の各関数は変更なしなので省略)
function drawBoss(){fill(255,220,0);stroke(100);strokeWeight(3);beginShape();vertex(width/2+10,height/2-30);vertex(width/2-20,height/2+5);vertex(width/2-5,height/2+5);vertex(width/2-15,height/2+30);vertex(width/2+20,height/2-5);vertex(width/2+5,height/2-5);endShape(CLOSE);}
function drawPlayer(){if(isHit){fill(255,80,80);}else{fill(0,150,255);}stroke(255);strokeWeight(2);ellipse(player.x,player.y,20,20);}
function drawAttackFanAndPrediction(){noStroke();if(isAttackActive){const startAngle=currentBaseAngle-fanAngle/2;const endAngle=currentBaseAngle+fanAngle/2;if(isHit){fill(255,0,0,220);}else{fill(255,0,0,180);}arc(width/2,height/2,attackRadius*2,attackRadius*2,startAngle,endAngle,PIE);}else{const elapsedSeconds=floor(millis()/attackInterval);const nextAngle=((elapsedSeconds+1)*120)%360;const startAngle=nextAngle-fanAngle/2;const endAngle=nextAngle+fanAngle/2;fill(255,150,150,100);arc(width/2,height/2,attackRadius*2,attackRadius*2,startAngle,endAngle,PIE);}}
function checkHit(){if(!isAttackActive){isHit=false;return;}const distance=dist(width/2,height/2,player.x,player.y);if(distance>attackRadius){isHit=false;return;}let playerAngle=atan2(player.y-height/2,player.x-width/2);const startAngle=currentBaseAngle-fanAngle/2;const endAngle=currentBaseAngle+fanAngle/2;isHit=isAngleBetween(playerAngle,startAngle,endAngle);}
function isAngleBetween(targetAngle,startAngle,endAngle){targetAngle=(targetAngle+360)%360;startAngle=(startAngle+360)%360;endAngle=(endAngle+360)%360;if(startAngle<endAngle){return targetAngle>=startAngle&&targetAngle<=endAngle;}else{return targetAngle>=startAngle||targetAngle<=endAngle;}}
// (ボスの座標を直接 width/2, height/2 に変更)
