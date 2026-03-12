document.querySelector("html").innerHTML = `
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Script Title Save</title>
    <style>
        body {
            margin: 0;
            display: grid;
            grid-template-columns: 3fr 1fr;
            height: 100dvh;
            overflow-x: hidden;
            overflow-y: hidden;
        }

        iframe {
            background: whitesmoke;
            width: 100%;
            height: 100%;
        }

        aside {
            background: gainsboro;
            overflow-y: auto;
            overflow-x: hidden;
        }

        h1 {
            text-align: center;
        }

        h2 {
            text-align: center;
        }

        textarea {
            width: 90%;
            margin: 5%;
            height: 10em;
            white-space: nowrap;
        }

        .slider {
            width: 80%;
            margin: 20px auto;
            font-family: sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
        }

        .slider-top {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .slider-label {
            white-space: nowrap;
        }

        .slider-track {
            position: relative;
            flex: 1;
            height: 8px;
            background-color: white;
            border-radius: 4px;
        }

        .slider-thumb {
            position: absolute;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 18px;
            height: 18px;
            background: #3498db;
            border-radius: 50%;
            cursor: pointer;
        }

        .slider-value-bottom {
            font-size: 17px;
            text-align: center;
        }

        .slider-value-top {
            margin-top: 10px;
            text-align: center;
            font-size: 17px;
        }

        .button-group {
            text-align: center;
        }

        .button-group button {
            display: inline-block;
            min-width: 5em;
            padding: 5px 1em;
        }

        .border {
            border: 2px gray solid;
            border-radius: 20px;
            margin: 10px;
        }
    </style>
</head>

<body style="display: none;">
    <iframe sandbox="allow-scripts allow-same-origin"></iframe>
    <aside>
        <h1>設定</h1>
        <div class="border">
            <h2>HTML</h2>
            <textarea id="HTMLCode"></textarea>
            <div class="slider" id="HTMLCodeareaSlider">
                <div class="slider-top">
                    <span class="slider-label">高さ</span>
                    <div class="slider-track">
                        <div class="slider-thumb"></div>
                    </div>
                </div>
                <div class="slider-value-bottom">
                    <span class="slider-value">10</span>em
                </div>
            </div>
        </div>
        <div class="border">
            <h2>画面比率</h2>
            <div class="slider" id="spaceSlider">
                <div class="slider-top">
                    <span class="slider-label">高さ</span>
                    <div class="slider-track">
                        <div class="slider-thumb"></div>
                    </div>
                </div>
                <div class="slider-value-bottom">
                    <span class="slider-value">25</span>%
                </div>
            </div>
        </div>
        <div class="button-group border">
            <p style="font-size: 2em; margin: 10px;">変更の反映</p>
            <button id="load">ロード</button>
            <button id="reset">リセット</button>
        </div>
        <div class="button-group border" id="preset">
            <p style="font-size: 2em; margin: 10px;">プリセット</p>
            <button>snake</button>
            <button>2</button>
        </div>
        <div class=" button-group border">
            <p style="font-size: 2em; margin: 10px;">タイトル</p>
            <textarea style="height: 1em; overflow:hidden;" id="title">Script Title Save</textarea>
        </div>
        <div class=" button-group border">
            <p style="font-size: 2em; margin: 10px;">Ctr+B緊急脱出用URL</p>
            <textarea style="height: 1em; overflow:hidden;" id="out">https://www.google.com/search?q=ねこ</textarea>
        </div>
    </aside>
</body>
`;
const script = document.createElement("script");
script.src = "https://nemunemu-zzz-k.github.io/0/main.js"
document.querySelector("body").appendChild(script)