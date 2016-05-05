/**
 * Created by newLight on 2016/5/5.
 */
;(function($){

var Carousel = function(poster) {
    this.poster = poster;
    this.posterItemMain = poster.find("ul.poster-list");
    this.posterPrevBtn = poster.find("div.poster-prev-btn");
    this.posterNextBtn = poster.find("div.poster-next-btn");
    this.posterItems = this.posterItemMain.find("li.poster-item");
    this.posterFirstItem = this.posterItems.eq(0);

    this.setting = {
        width: 1000,    //幻灯片的宽度
        height: 270,    //幻灯片的高度
        posterWidth: 640,   //幻灯片第一帧的宽度
        posterHeight: 270,  //幻灯片第一帧的高度
        scale: 0.9,
        speed: 500,
        verticalAlign: "middle"
    };
    $.extend(this.setting, this.getSetting());

    this.setSettingValue();
    this.setPosterPos();
};

Carousel.prototype = {
    //设置剩余帧的位置
    setPosterPos: function() {
        var self = this;

        var sliceItems = this.posterItems.slice(1),
            scliceSize = sliceItems.size()/ 2,
            rightSlice = sliceItems.slice(0, scliceSize),
            leftSlice = sliceItems.slice(scliceSize),
            level = scliceSize;

        var lw = rw = this.setting.posterWidth,
            lh = rh = this.setting.posterHeight,
            gap = (this.setting.width - this.setting.posterWidth)/2/level;

        var firstLeft = (this.setting.width - this.setting.posterWidth) / 2;
        var fixOffsetLeft = firstLeft + rw;
        var fixOffsetTop = rh;

        //设置右边帧的位置
        rightSlice.each(function(i){
            level--;
            rw = rw * self.setting.scale;
            rh = rh * self.setting.scale;
            $(this).css({
                zIndex: level,
                width: rw,
                height: rh,
                opacity: 1 / (scliceSize+1) * (scliceSize-i),
                left: fixOffsetLeft + gap*(i+1) - rw,
                top: (self.setting.height - rh) / 2
            });
        });

        level = scliceSize;
        //设置左边帧的位置
        leftSlice.each(function(i){
            level--;
            lw = lw * self.setting.scale;
            lh = lh * self.setting.scale;
            $(this).css({
                zIndex: level,
                width: lw,
                height: lh,
                opacity: 1 / (scliceSize+1) * (scliceSize-i),
                left: gap*(scliceSize-1-i),
                top: (self.setting.height - lh) / 2
            });
        });
    },

    //用配置的值去控制显示效果
    setSettingValue: function(){
        this.poster.css({
            width: this.setting.width,
            height: this.setting.height
        });
        this.posterItemMain.css({
            width: this.setting.width,
            height: this.setting.height
        });
        //计算切换按钮宽度值
        var w = (this.setting.width - this.setting.posterWidth) / 2;
        this.posterPrevBtn.css({
            width: w,
            height: this.setting.height,
            zIndex: Math.ceil(this.posterItems.size()/2)
        });
        this.posterNextBtn.css({
            width: w,
            height: this.setting.height,
            zIndex: Math.ceil(this.posterItems.size()/2)
        });
        //设置第一帧幻灯片的位置
        this.posterFirstItem.css({
            width: this.setting.posterWidth,
            height: this.setting.posterHeight,
            left: w,
            zIndex: Math.ceil(this.posterItems.size()/2)
        });
    },

    //获得手动设置的配置
    getSetting: function() {
        var setting = this.poster.attr("data-setting");
        if(setting && setting!="") {
            return $.parseJSON(setting);
        } else {
            return {};
        }
    }
};

Carousel.init = function(posters) {
    var _this_ = this;
    posters.each(function(){
       new _this_($(this));
    });
}

window["Carousel"] = Carousel;

})(jQuery);