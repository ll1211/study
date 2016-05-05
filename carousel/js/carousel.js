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
        width: 1000,    //�õ�Ƭ�Ŀ���
        height: 270,    //�õ�Ƭ�ĸ߶�
        posterWidth: 640,   //�õ�Ƭ��һ֡�Ŀ���
        posterHeight: 270,  //�õ�Ƭ��һ֡�ĸ߶�
        scale: 0.9,
        speed: 500,
        verticalAlign: "middle"
    };
    $.extend(this.setting, this.getSetting());

    this.setSettingValue();
    this.setPosterPos();
};

Carousel.prototype = {
    //����ʣ��֡��λ��
    setPosterPos: function() {
        var self = this;

        var sliceItems = this.posterItems.slice(1),
            scliceSize = sliceItems.size()/ 2,
            rightSlice = sliceItems.slice(0, scliceSize),
            level = scliceSize;

        var rw = this.setting.posterWidth,
            rh = this.setting.posterHeight,
            gap = (this.setting.width - this.setting.posterWidth)/2/level;

        var firstLeft = (this.setting.width - this.setting.posterWidth) / 2;
        var fixOffsetLeft = this.setting.width - rw - firstLeft + gap;

        //�����ұ�֡��λ��
        rightSlice.each(function(i){
            level--;
            rw = rw * self.setting.scale;
            rh = rh * self.setting.scale;
            fixOffsetLeft = fixOffsetLeft + gap;
            $(this).css({
                zIndex: level,
                width: rw,
                height: rh,
                opacity: 1 / (++i + 1),
                left: fixOffsetLeft
                //top: ,
            });
        });
    },

    //�����õ�ֵȥ������ʾЧ��
    setSettingValue: function(){
        this.poster.css({
            width: this.setting.width,
            height: this.setting.height
        });
        this.posterItemMain.css({
            width: this.setting.width,
            height: this.setting.height
        });
        //�����л���ť����ֵ
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
        //���õ�һ֡�õ�Ƭ��λ��
        this.posterFirstItem.css({
            width: this.setting.posterWidth,
            height: this.setting.posterHeight,
            left: w,
            zIndex: Math.ceil(this.posterItems.size()/2)
        });
    },

    //����ֶ����õ�����
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