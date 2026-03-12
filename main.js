let preset = [
    `  <style>
    body {
      background: #202124;
      color: #fff;
      font-family: sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
    }
    canvas {
      background: #111;
      box-shadow: 0 0 10px #000;
    }
    #score {
      margin-top: 10px;
      font-size: 18px;
    }

    #gameover-screen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.85);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 28px;
    }
    #restart-btn {
      margin-top: 20px;
      padding: 10px 20px;
      font-size: 20px;
      cursor: pointer;
      background: #4caf50;
      border: none;
      border-radius: 5px;
      color: #fff;
    }
    #restart-btn:hover {
      background: #43a047;
    }

    .setting-box {
      margin-top: 20px;
      font-size: 18px;
      text-align: center;
    }
    input, select {
      padding: 5px;
      font-size: 18px;
      text-align: center;
      margin-top: 5px;
    }
  </style>
   <canvas id="game" width="400" height="400"></canvas>
  <div id="score">Score: 0</div>

  <div id="gameover-screen">
    <div id="gameover-text">Snake Game</div>

    <div class="setting-box">
      エサの数：<br>
      <input id="food-count" type="number" value="1" min="1" max="20"><br><br>

      速度(ms)：<br>
      <input id="speed" type="number" value="120" min="30" max="1000"><br><br>

      壁にぶつかったら静止：<br>
      <select id="wall-stop">
        <option value="off">OFF（ゲームオーバー）</option>
        <option value="on">ON（静止）</option>
      </select><br><br>

      スペースキーで静止：<br>
      <select id="space-stop">
        <option value="off">OFF</option>
        <option value="on">ON</option>
      </select>
    </div>

    <button id="restart-btn">Start</button>
  </div>

  <script>
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");
    const box = 20;
    const rows = canvas.height / box;
    const cols = canvas.width / box;

    let snake, direction, nextDirection, bufferDirection, foods, score, gameOver;
    let gameInterval;
    let paused = false;

    let startHue = 0;

    function initGame() {
      const foodCount = Number(document.getElementById("food-count").value);
      const speed = Number(document.getElementById("speed").value);

      snake = [{ x: 10, y: 10 }];
      direction = "RIGHT";
      nextDirection = "RIGHT";
      bufferDirection = null;
      foods = [];
      score = 0;
      gameOver = false;
      paused = false;

      startHue = Math.random() * 360;

      for (let i = 0; i < foodCount; i++) {
        foods.push(spawnFood());
      }

      document.getElementById("score").textContent = "Score: 0";
      document.getElementById("gameover-screen").style.display = "none";

      clearInterval(gameInterval);
      gameInterval = setInterval(draw, speed);
    }

    document.addEventListener("keydown", e => {
      const key = e.key.toLowerCase();

      if (document.getElementById("space-stop").value === "on") {
        if (key === " ") {
          paused = !paused;
          return;
        }
      }

      if (paused && document.getElementById("wall-stop").value === "on") {
        if (["arrowleft","arrowup","arrowright","arrowdown","w","a","s","d"].includes(key)) {
          paused = false;
        }
      }

      if (paused) return;

      let newDir = null;

      if (key === "arrowleft" || key === "a") newDir = "LEFT";
      else if (key === "arrowup" || key === "w") newDir = "UP";
      else if (key === "arrowright" || key === "d") newDir = "RIGHT";
      else if (key === "arrowdown" || key === "s") newDir = "DOWN";

      if (!newDir) return;

      // ★ 逆走なら nextDirection に入れず、buffer に入れる
      if (isOpposite(direction, newDir)) {
        bufferDirection = newDir;
      } else {
        nextDirection = newDir;
      }
    });

    function isOpposite(dir1, dir2) {
      return (
        (dir1 === "LEFT" && dir2 === "RIGHT") ||
        (dir1 === "RIGHT" && dir2 === "LEFT") ||
        (dir1 === "UP" && dir2 === "DOWN") ||
        (dir1 === "DOWN" && dir2 === "UP")
      );
    }

    function spawnFood() {
      let pos;
      while (true) {
        pos = {
          x: Math.floor(Math.random() * cols),
          y: Math.floor(Math.random() * rows),
        };

        let overlap = snake.some(s => s.x === pos.x && s.y === pos.y);
        if (!overlap) break;
      }
      return pos;
    }

    function rainbowColor(i) {
      const hue = (startHue + i * 5) % 360;
      return \`hsl(\${hue}, 80%, 55%)\`;
    }

    function draw() {
      if (gameOver || paused) return;

      // ★ 先行入力バッファの処理
      if (bufferDirection && !isOpposite(direction, bufferDirection)) {
        nextDirection = bufferDirection;
        bufferDirection = null;
      }

      // ★ 移動直前に方向を確定
      direction = nextDirection;

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#e91e63";
      foods.forEach(f => {
        ctx.fillRect(f.x * box, f.y * box, box, box);
      });

      for (let i = 0; i < snake.length; i++) {
        const seg = snake[i];
        const x = seg.x * box;
        const y = seg.y * box;

        ctx.fillStyle = rainbowColor(i);
        ctx.fillRect(x, y, box, box);

        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, box, box);

        if (i === 0) drawEyes(x, y);
      }

      let head = { ...snake[0] };
      if (direction === "LEFT") head.x--;
      if (direction === "RIGHT") head.x++;
      if (direction === "UP") head.y--;
      if (direction === "DOWN") head.y++;

      if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
        if (document.getElementById("wall-stop").value === "on") {
          paused = true;
          return;
        } else {
          endGame();
          return;
        }
      }

      for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
          endGame();
          return;
        }
      }

      let ate = false;
      foods = foods.map(f => {
        if (head.x === f.x && head.y === f.y) {
          ate = true;
          return spawnFood();
        }
        return f;
      });

      if (ate) {
        snake.unshift(head);
        score++;
        document.getElementById("score").textContent = "Score: " + score;
      } else {
        snake.pop();
        snake.unshift(head);
      }
    }

    function drawEyes(x, y) {
      const eyeSize = 5;
      const pupilSize = 2;

      let leftEyeX, leftEyeY, rightEyeX, rightEyeY;
      let pupilOffsetX = 0, pupilOffsetY = 0;

      if (direction === "LEFT") {
        leftEyeX = x + 4; leftEyeY = y + 4;
        rightEyeX = x + 4; rightEyeY = y + box - 9;
        pupilOffsetX = -1;
      } else if (direction === "RIGHT") {
        leftEyeX = x + box - 9; leftEyeY = y + 4;
        rightEyeX = x + box - 9; rightEyeY = y + box - 9;
        pupilOffsetX = 1;
      } else if (direction === "UP") {
        leftEyeX = x + 4; leftEyeY = y + 4;
        rightEyeX = x + box - 9; rightEyeY = y + 4;
        pupilOffsetY = -1;
      } else if (direction === "DOWN") {
        leftEyeX = x + 4; leftEyeY = y + box - 9;
        rightEyeX = x + box - 9; rightEyeY = y + box - 9;
        pupilOffsetY = 1;
      }

      ctx.fillStyle = "#fff";
      ctx.fillRect(leftEyeX, leftEyeY, eyeSize, eyeSize);
      ctx.fillRect(rightEyeX, rightEyeY, eyeSize, eyeSize);

      ctx.fillStyle = "#000";
      ctx.fillRect(leftEyeX + 2 + pupilOffsetX, leftEyeY + 2 + pupilOffsetY, pupilSize, pupilSize);
      ctx.fillRect(rightEyeX + 2 + pupilOffsetX, rightEyeY + 2 + pupilOffsetY, pupilSize, pupilSize);
    }

    function endGame() {
      gameOver = true;
      clearInterval(gameInterval);
      document.getElementById("gameover-text").textContent = \`Game Over! Score: \${score}\`;
      document.getElementById("restart-btn").textContent = "Restart";
      document.getElementById("gameover-screen").style.display = "flex";
    }

    document.getElementById("restart-btn").addEventListener("click", initGame);

    document.getElementById("gameover-screen").style.display = "flex";
  </script>
  `
]
// =========================
// スライダー処理
// =========================
let SliderFunction = [
    {
        id: "HTMLCodeareaSlider",
        fn: function (track, thumb, valueEl) {
            document.getElementById("HTMLCode").style.height = `${valueEl.textContent}em`;
        }
    },
    {
        id: "spaceSlider",
        fn: function (track, thumb, valueEl) {
            document.body.style.gridTemplateColumns =
                `${100 - Number(valueEl.textContent)}fr ${Number(valueEl.textContent)}fr`;
        }
    }
];

document.querySelectorAll('.slider').forEach(slider => {
    const track = slider.querySelector('.slider-track');
    const thumb = slider.querySelector('.slider-thumb');
    const valueEl = slider.querySelector('.slider-value');

    let isDragging = false;
    let trackRect;

    function setInitialValue() {
        trackRect = track.getBoundingClientRect();
        let initial = Number(valueEl.textContent);
        initial = Math.max(1, Math.min(initial, 99));
        thumb.style.left = `${initial}%`;
    }

    setInitialValue();

    function updateValueFromPosition(clientX) {
        const x = clientX - trackRect.left;
        const clampedX = Math.max(0, Math.min(x, trackRect.width));
        let percent = (clampedX / trackRect.width) * 100;

        percent = Math.max(1, Math.min(percent, 99));

        thumb.style.left = `${percent}%`;
        valueEl.textContent = Math.round(percent);

        SliderFunction.forEach(e => {
            if (e.id === slider.id) {
                e.fn(track, thumb, valueEl);
            }
        });
    }

    thumb.addEventListener('pointerdown', (e) => {
        isDragging = true;
        trackRect = track.getBoundingClientRect();
        thumb.setPointerCapture(e.pointerId);
    });

    thumb.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        updateValueFromPosition(e.clientX);
    });

    thumb.addEventListener('pointerup', () => {
        isDragging = false;
    });

    track.addEventListener('pointerdown', (e) => {
        trackRect = track.getBoundingClientRect();
        updateValueFromPosition(e.clientX);
    });
});

// =========================
// iframe 初期化（初期状態でも body を作る）
// =========================
function initIframe() {
    const iframe = document.querySelector("iframe");
    const doc = iframe.contentDocument;

    doc.open();
    doc.write(`
        <!DOCTYPE html>
        <html>
        <body></body>
        </html>
    `);
    doc.close();

    attachIframeKeyListener();
}

// =========================
// iframe に HTML をロード
// =========================
function loadIframeHTML(html) {
    const iframe = document.querySelector("iframe");
    const doc = iframe.contentDocument;

    doc.open();
    doc.write(`
        <!DOCTYPE html>
        <html>
        <body>
            ${html}
        </body>
        </html>
    `);
    doc.close();

    attachIframeKeyListener();
}

// =========================
// iframe 内に keydown を仕込む
// =========================
function attachIframeKeyListener() {
    const iframe = document.querySelector("iframe");
    const doc = iframe.contentDocument;

    if (!doc) return;

    doc.addEventListener("keydown", (event) => {
        handleKey(event);
    });
}

// =========================
// 共通キー処理
// =========================
function handleKey(event) {
    if (event.ctrlKey && event.key.toLowerCase() === "b") {
        event.preventDefault();
        location.replace(document.getElementById("out").value);
    }
    if (event.ctrlKey && event.key.toLowerCase() === "e") {
        event.preventDefault();
        if (document.querySelector("body").style.display === "none"){
            document.querySelector("body").style.display = "grid";
        }else {
            document.querySelector("body").style.display = "none";
        }
    }
}

// =========================
// メイン側のキーイベント
// =========================
window.addEventListener("keydown", handleKey, true);

// =========================
// ボタン類
// =========================
document.getElementById("load").addEventListener("click", () => {
    const html = document.getElementById("HTMLCode").value;
    loadIframeHTML(html);
});

document.getElementById("reset").addEventListener("click", () => {
    loadIframeHTML("");
});

document.getElementById("title").addEventListener("input", () => {
    document.title = document.getElementById("title").value;
});

// =========================
// プリセット
// =========================
const buttons = document.querySelectorAll("#preset > button");

buttons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        if (preset[index]) {
            document.getElementById("HTMLCode").value = preset[index];
        }
    });
});

// =========================
// 初期状態で iframe をセットアップ
// =========================
initIframe();
