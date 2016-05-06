function CanvasLayer(options) {
    this.options = options || {};
    this.paneName = this.options.paneName || 'labelPane';
    this.zIndex = this.options.zIndex || 0;
    this._map = options.map;
    this.areaArr = options.areaArr || ['南京市'];
    this.show();
}

CanvasLayer.prototype = new BMap.Overlay();

CanvasLayer.prototype.initialize = function (map) {
    this._map = map;
    var canvas = this.canvas = document.createElement("canvas");
    canvas.style.cssText = "position:absolute;" + "left:0;" + "top:0;" + "z-index:" + this.zIndex + ";";
    //this.adjustSize();
    map.getPanes()[this.paneName].appendChild(canvas);
    //var that = this;
    //map.addEventListener('resize', function () {
    //    that.adjustSize();
    //    that.draw();
    //});
    return this.canvas;
};

CanvasLayer.prototype.adjustSize = function () {
    var size = this._map.getSize();
    var canvas = this.canvas;
    canvas.width = size.width;
    canvas.height = size.height;
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
};

CanvasLayer.prototype.draw = function () {
    var map = this._map;

    var size = map.getSize();
    var center = map.getCenter();
    if (center) {
        var pixel = map.pointToOverlayPixel(center);
        this.canvas.style.left = pixel.x - size.width / 2 + 'px';
        this.canvas.style.top = pixel.y - size.height / 2 + 'px';
    }

    var points = [];
    var canvas = this.canvas;
    canvas.width = map.width;
    canvas.height = map.height;
    var context = canvas.getContext('2d');
    context.clearRect(0,0,canvas.width,canvas.height);
    context.strokeStyle = "rgba(0,0,255,0.8)";
    context.fillStyle = "rgba(230,230,250,0.5)";
    context.lineWidth = 2;

    var bdary = new BMap.Boundary();
    for(var n=0; n<this.areaArr.length; n++) {

        bdary.get("江苏省"+this.areaArr[n], function (rs) {       //获取行政区域
            // map.clearOverlays();        //清除地图覆盖物
            var count = rs.boundaries.length; //行政区域的点有多少个
            if (count === 0) {
                alert('未能获取当前输入行政区域');
                return;
            }
            var pointArray = [];
            for (var i = 0; i < count; i++) {
                var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 2, strokeColor: "#ff0000"}); //建立多边形覆盖物
                pointArray = pointArray.concat(ply.getPath());
                points = ply.getPath();
            }

            context.beginPath();
            for (var i in points) {
                var pixel = map.pointToPixel(points[i]);
                if (i == 0) {
                    context.moveTo(pixel.x, pixel.y);   //定义绘画开始的位置
                } else {
                    context.lineTo(pixel.x, pixel.y);  //画一条直线，结束点坐标是x=150,y=50
                }
            }
            context.closePath();
            for (var i = 0; i < 10; i++) {
                context.shadowColor = "RGBA(0, 0, 255," + ((10 - i) / 10) + ")";
                context.shadowOffsetX = -i * 2;
                context.shadowOffsetY = i * 2;
                context.shadowBlur = 2;
                context.stroke();  //描边
            }
            context.fill();
        });
    }
};

CanvasLayer.prototype.getContainer = function () {
    return this.canvas;
};

CanvasLayer.prototype.show = function () {
    if (!this.canvas) {
        this._map.addOverlay(this);
    }
};

CanvasLayer.prototype.hide = function () {
    this._map.removeOverlay(this);
};

CanvasLayer.prototype.setZIndex = function (zIndex) {
    this.canvas.style.zIndex = zIndex;
};

CanvasLayer.prototype.getZIndex = function () {
    return this.zIndex;
};