//****************************************************************************************
/// <summary>
/// Canvas2d 動画再生・加工用 JavaScript
/// </summary>
/// <remarks>
/// 0.0.1   2017/09/21 KOUDA 新規作成 
/// </remarks>
//****************************************************************************************

var _Video;              // videoオブジェクト
var _Canvas;             // canvasオブジェクト
var _Canvas2d_Context;   // canvas.context
var _ImageData;          // canvas.context.ImageData
var _PixelData;          // canvas.context.ImageData.Data
var _Rotate = 0;
var _HorizontalFlip = 1;
var _VerticalFlip = 1;

/* *
 * 動画関連変数の初期化
 *     @param   video_id    videoタグのID
 *     @param   canvas_id   canvasタグのID
 * */
function onInitializeVideo(video_id, canvas_id) {
    // video の初期化
    _Video = document.getElementById(video_id);
    _Video.autoplay = true;
    _Video.loop = true;
    // canvas の初期化
    _Canvas = document.getElementById(canvas_id);
    _Canvas2d_Context = _Canvas.getContext("2d");
}

/* *
 * ウィンドウロード時の処理にイベントを追加
 *     @param   leftX   canvasのX軸左側位置
 *     @param   leftY   canvasのY軸左側位置
 * */
function onLoadVideo(leftX, leftY, frame_rate) {
    // キャンバスのサイズを指定サイズで初期化する。指定がない場合は video のサイズで初期化
    if (leftX == null || leftX === undefined) {
        leftX = _Video.videoWidth;
    }
    if (leftY == null || leftY === undefined) {
        leftY = _Video.videoHeight;
    }
    if (frame_rate == null || frame_rate === undefined) {
        frame_rate = 60;
    }
    _Canvas.width = leftX;
    _Canvas.height = leftY;
    _Canvas.style.width = leftX;
    _Canvas.style.height = leftY;

    (function render() {
        // アニメーションの繰返しレンダリング　
        // TODO 下記のままだとフレームレートの制御はできない、修正する必要あり
        requestAnimationFrame(render);
        _Canvas2d_Context.drawImage(_Video, 0, 0, _Canvas.width, _Canvas.height);
        _ImageData = _Canvas2d_Context.getImageData(0, 0, _Canvas.width, _Canvas.height);
        _PixelData = _ImageData.data;
    })();
}

/* *
 * グレースケール処理
 *     @param   l   配列の添字
 * */
function toGrayScale(i) {
    return _PixelData[i + 0] * 0.2126 
         + _PixelData[i + 1] * 0.7152 
         + _PixelData[i + 2] * 0.0722;
}

/* *
 * 動画コントロール
 * */
var video_player = (function() {
    // 動画を最初に巻き戻す　→　前シリーズに移動するように変更しないとだめ
    this.onRewindFirst = function() {
        _Video.currentTime = 0;
    }
    // 動画を最後に早送りする　→　次シリーズに移動するように変更しないとだめ
    this.onFowardLast = function() {
        _Video.currentTime = _Video.duration;
    }
    // 動画を逆再生する　→　実装不可
    this.onReverse = function() {
        _Video.playbackRate = -1;
        _Video.play();
    }
    // 動画を再生する
    this.onStart = function() {
        _Video.playbackRate = 1;
        _Video.play();
    }
    // 動画を停止する
    this.onStop = function() {
        if (!_Video.paused) {
            _Video.pause();
        }
    }
    return this;
})();

/* *
 * 画像変換
 * */
var image_convert = (function() {
    var mode = "";
    function resize(){
        _Canvas2d_Context = _Canvas.getContext('2d');
        _Canvas2d_Context.setTransform(1, 0, 0, 1, 0, 0);
        _Canvas.width = _ImageData.width;
        _Canvas.height = _ImageData.height;
        mode = "";
    }
    // ガンマ補正
    this.onGanma = function(ganma) {
        resize();
        mode = "ganma";
        (function mov() {
            if (mode == "ganma") {
                requestAnimationFrame(mov);
            }
            for (var i = 0; i < _PixelData.length; i += 4) {
                _PixelData[i + 0] = (255 * Math.pow((_PixelData[i + 0] / 255), 1 / ganma));
                _PixelData[i + 1] = (255 * Math.pow((_PixelData[i + 1] / 255), 1 / ganma));
                _PixelData[i + 2] = (255 * Math.pow((_PixelData[i + 2] / 255), 1 / ganma));
            }
            _Canvas2d_Context.putImageData(_ImageData, 0, 0);
        })(); 
    }
    // コントラスト
    this.onContrast = function(contrast) {
        resize();
        mode = "contrast";
        (function mov() {
            if (mode == "contrast") {
                requestAnimationFrame(mov);
            }
            for (var i = 0; i < _PixelData.length; i += 4) {
                _PixelData[i + 0] = (_PixelData[i + 0] - 128) * contrast + 128;
                _PixelData[i + 1] = (_PixelData[i + 1] - 150) * contrast + 128;
                _PixelData[i + 2] = (_PixelData[i + 2] - 150) * contrast + 128;
            }
            _Canvas2d_Context.putImageData(_ImageData, 0, 0);
        })(); 
    }
    // ブライトネス
    this.onBrightness = function(brightness) {
        resize();
        mode = "brightness";
        (function mov() {
            if (mode == "brightness") {
                requestAnimationFrame(mov);
            }
            for (var i = 0; i < _PixelData.length; i += 4) {
            }
            _Canvas2d_Context.putImageData(_ImageData, 0, 0);
        })(); 
    }
    // ネガポジ反転（色の反転）
    this.onNegapoji = function() {
        resize();
        mode = "negapoji";
        (function mov() {
            if (mode == "negapoji") {
                requestAnimationFrame(mov);
            }
            for (var i = 0; i < _PixelData.length; i += 4) {
                var r = _PixelData[i + 0];
                var g = _PixelData[i + 1];
                var b = _PixelData[i + 2];
                _PixelData[i + 0] = 255 - r;
                _PixelData[i + 1] = 255 - g;
                _PixelData[i + 2] = 255 - b;
            }
            _Canvas2d_Context.putImageData(_ImageData, 0, 0);
        })(); 
    }
    // 初期値に戻す
    this.onInitialize = function(){
        resize();
        _Rotate = 0;
        _HorizontalFlip = 1;
        _VerticalFlip = 1;
        _Canvas2d_Context.putImageData(_ImageData, 0, 0);
    }
    // 自動適用
    this.onAutoApply = function() {
        resize();
        mode = "autoapply";
        (function mov() {
            if (mode == "autoapply") {
                requestAnimationFrame(mov);
            }
            _Canvas2d_Context.putImageData(_ImageData, 0, 0);
        })(); 
    }
    // 水平フリップ
    this.onHorizontalFlip = function() {
        //resize();
        mode = "horizontalflip";
        //TODO リセットを除外しているので数値反転は一旦コメントアウト
        //_HorizontalFlip *= -1;
        _HorizontalFlip = -1;

        // 上下反転
        _Canvas2d_Context.translate(parseInt(_Canvas.width / 2), parseInt(_Canvas.height / 2));
        _Canvas2d_Context.scale(_HorizontalFlip, 1);
        _Canvas2d_Context.translate(-parseInt(_Canvas.width / 2), -parseInt(_Canvas.height / 2));

        (function mov() {
            if (mode == "horizontalflip") {
                requestAnimationFrame(mov);
            }
            _Canvas2d_Context.putImageData(_ImageData, 0, 0);
        })(); 
    }
    // 垂直フリップ
    this.onVerticalFlip = function() {
        //resize();
        mode = "verticalflip";
        //TODO リセットを除外しているので数値反転は一旦コメントアウト
        //_VerticalFlip *= -1;
        _VerticalFlip = -1;

        // 左右反転
        _Canvas2d_Context.translate(parseInt(_Canvas.width / 2), parseInt(_Canvas.height / 2));
        _Canvas2d_Context.scale(1, _VerticalFlip);
        _Canvas2d_Context.translate(-parseInt(_Canvas.width / 2), -parseInt(_Canvas.height / 2));

        (function mov() {
            if (mode == "verticalflip") {
                requestAnimationFrame(mov);
            }
        })(); 
    }
    // 90°回転
    this.onRotate90 = function() {
        //resize();
        mode = "rotate90";
        _Rotate += 90;
        if (_Rotate >= 360) {
            _Rotate = 0;
        }

        // 90度回転
        _Canvas2d_Context.translate(parseInt(_Canvas.width / 2), parseInt(_Canvas.height / 2));
        _Canvas2d_Context.rotate(90 * Math.PI / 180);
        _Canvas2d_Context.translate(-parseInt(_Canvas.width / 2), -parseInt(_Canvas.height / 2));

        (function mov() {
            if (mode == "rotate90") {
                requestAnimationFrame(mov);
            }
        })(); 
    }
    // エッジ検出
    //TODO 正常に実装できてない
    this.onEdgeDetector = function() {
        resize();
        mode = "edge";
        (function mov() {
            if(mode == "edge") {
                requestAnimationFrame(mov);
            }
            for(var i = 0; i < _PixelData.length; i += 4) {
                var gray = toGrayScale(i);
                _PixelData[i] = 127 + 
                    -　_PixelData[i - _Canvas.width　*　4 - 4] - _PixelData[i - _Canvas.width　*　4] - _PixelData[i - _Canvas.width　*　4 + 4] +
                    -　_PixelData[i - 4] + 8 * _PixelData[i] - _PixelData[i + 4] +
                    -　_PixelData[i + _Canvas.width　*　4 - 4] - _PixelData[i + _Canvas.width　*　4] - _PixelData[i + _Canvas.width　*　4 + 4];
            }
            _Canvas2d_Context.putImageData(_ImageData, 0, 0);
        })(); 
    }
    //TODO 以下、非表示
    // グレースケール
    this.onGrayScale = function() {
        resize();
        mode = "grayscale";
        (function mov() {
            if (mode == "grayscale") {
                requestAnimationFrame(mov);
            }
            for (var i = 0; i < _PixelData.length; i += 4) {
                var gray = toGrayScale(i);
                _PixelData[i + 0] = gray;
                _PixelData[i + 1] = gray;
                _PixelData[i + 2] = gray;
            }
            _Canvas2d_Context.putImageData(_ImageData, 0, 0);
        })(); 
    }
    // セピア調
    this.onSepia = function() {
        resize();
        mode = "sepia";
        (function mov() {
            if (mode == "sepia") {
                requestAnimationFrame(mov);
            }
            for (var i = 0; i < _PixelData.length; i += 4) {
                var gray = toGrayScale(i);
                _PixelData[i + 0] = parseInt((gray / 255) * 240);
                _PixelData[i + 1] = parseInt((gray / 255) * 200);
                _PixelData[i + 2] = parseInt((gray / 255) * 145);
            }
            _Canvas2d_Context.putImageData(_ImageData, 0, 0);
        })(); 
    }
    return this;
})();
