//****************************************************************************************
/// <summary>
/// Canvas2d 動画再生・加工用 JavaScript
/// </summary>
/// <remarks>
/// 0.0.1   2017/09/21 KOUDA 新規作成 
/// </remarks>
//****************************************************************************************

var _PainterCanvas;             // canvasオブジェクト
var _PainterCanvas2d_Context;   // canvas.context
var _DefaultSize = 7;
var _DefaultColor = "#555555";
var _DefaultAlpha = 1.0;
var _CanvasX;
var _CanvasY;
var _MouseX = "";
var _MouseY = "";

/* *
 * 動画関連変数の初期化
 *     @param   canvas_id   canvasタグのID
 * */
function onInitializePainter(canvas_id, leftX, leftY) {
    // canvas の初期化
    _PainterCanvas = document.getElementById(canvas_id);
    _PainterCanvas2d_Context = _PainterCanvas.getContext("2d");

    _CanvasX = leftX;
    _CanvasY = leftY;

    //レスポンシブ対応 画面サイズでキャンバスサイズを調整します
    _PainterCanvas.width = _CanvasX;
    _PainterCanvas.height = _CanvasY;
 
    //キャンバスの背景カラーを決定。 fillRectは長方形に塗るメソッド
    _PainterCanvas2d_Context.beginPath();
    _PainterCanvas2d_Context.fillStyle = "#f5f5f5";
    _PainterCanvas2d_Context.globalAlpha = 0.0;
    _PainterCanvas2d_Context.fillRect(0, 0, _CanvasX, _CanvasY);
}

/* *
 * 動画コントロール
 * */
var painter = (function() {
    // 動画を最初に巻き戻す　→　前シリーズに移動するように変更しないとだめ
    this.onMove = function(e) {
        if (e.buttons === 1 || e.witch === 1) {
            var rect = e.target.getBoundingClientRect();
            var x = ~~(e.clientX - rect.left);
            var y = ~~(e.clientY - rect.top);
            //draw 関数にマウスの位置を渡す
            draw(x, y);
        }
    };
    // 動画を最後に早送りする　→　次シリーズに移動するように変更しないとだめ
    this.onClick = function(e) {
        if (e.button === 0) {
            var rect = e.target.getBoundingClientRect();
            var x = ~~(e.clientX - rect.left);
            var y = ~~(e.clientY - rect.top);
            //draw 関数にマウスの位置を渡す
            draw(x, y);
        }
    };
    // 左クリック終了、またはマウスが領域から外れた際、継続値を初期値に戻す
    this.drawEnd = function() {
        _MouseX = "";
        _MouseY = "";
    };
    
    this.onMenuSelect = function(id) {
        var idname = id.substring(id.indexOf("_") + 1);
        //id 値によって場合分け
        if (idname.indexOf("size") + 1) {
            _DefaultSize = ~~idname.slice(4, idname.length);
        }
        if (idname.indexOf("color") + 1) {
            _DefaultColor = "#" + idname.slice(5, idname.length);
            _PainterCanvas2d_Context.globalCompositeOperation = "source-over";
        }
        if (idname.indexOf("alpha") + 1) {
            _DefaultAlpha = (~~idname.slice(5, idname.length)) / 10;
        }
        if (idname.indexOf("eraser") + 1) {
            _PainterCanvas2d_Context.globalCompositeOperation = "destination-out";
        }
        if (idname.indexOf("clear") + 1) {
            //全消しボタン、OKされた場合は fillRect 長方形で覆います
            if (confirm("すべて消去しますか？")) {
                _PainterCanvas2d_Context.clearRect(0, 0, _CanvasX, _CanvasY);
            }
        }
    };
    
    // 動画を逆再生する　→　実装不可
    function draw(x, y) {
        _PainterCanvas2d_Context.beginPath();
        _PainterCanvas2d_Context.globalAlpha = _DefaultAlpha;
        //マウス継続値によって場合分け、直線の moveTo（スタート地点）を決定
        if (_MouseX === "") {
            //継続値が初期値の場合は、現在のマウス位置をスタート位置とする
            _PainterCanvas2d_Context.moveTo(x, y);
        } else {
            //継続値が初期値ではない場合は、前回のゴール位置を次のスタート位置とする
            _PainterCanvas2d_Context.moveTo(_MouseX, _MouseY);
        }
        //lineTo（ゴール地点）の決定、現在のマウス位置をゴール地点とする
        _PainterCanvas2d_Context.lineTo(x, y);
        //直線の角を「丸」、サイズと色を決める
        _PainterCanvas2d_Context.lineCap = "round";
        _PainterCanvas2d_Context.lineWidth = _DefaultSize * 2;
        _PainterCanvas2d_Context.strokeStyle = _DefaultColor;
        _PainterCanvas2d_Context.stroke();
        //マウス継続値に現在のマウス位置、つまりゴール位置を代入
        _MouseX = x;
        _MouseY = y;
    }
    return this;
})();

