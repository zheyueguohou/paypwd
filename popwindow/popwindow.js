/*!
 * popwindow 0.0.1
 * by heheda
 * Copyright 2016.4
 */

 
if (typeof jQuery === 'undefined') {
    throw new Error('requires jQuery');
}

var popwindow;
(function ($) {
    "use strict";
    //jQuery.foo = function() {   alert("This is a test.");  }; 
    //所以此处也相当于$.extend({foo: function(){}});
    $.popwindow = function (options) {
        if (typeof options === 'undefined') options = {};
        return new popwindow(this, options);
    };
    popwindow = function (ele, options) {
        /*
         * constructor function Jconfirm,
         * options = user options.
         */
        // this.element = ele;
        this.opts = $.extend({}, popwindow.pluginDefaults, options);
        this.template = '<div class="pop-window" style="display: none;"><div class="pop-bg"></div><div class="pop-box">';
        this._init();
    };
    popwindow.prototype = {
        _init: function () {
            var that = this;
            this._bindHtml();
            this._renderHtml();
            this._show();
            this._bindEvent();
        },
        _bindHtml: function(){
            var opts = this.opts;
            //拼接html
            //标题
            if(opts.title)
                this.template += '<div class="pop-title">'+opts.title+'</div>';
            //副标题
            if(opts.subtitle)
                this.template += '<div class="pop-subtitle">'+opts.subtitle+'</div>';
            //密码框
            this.template += '<ul class="pop-input"><li></li><li></li><li></li><li></li><li></li><li></li></ul>';
            //提示
            if(opts.tip)
                this.template += '<div class="pop-tip">'+opts.tip+'</div>';

            this.template += '<div class="pop-key"><div class="key" data-value="1">1</div><div class="key" data-value="2">2</div><div class="key" data-value="3">3</div><div class="key" data-value="4">4</div><div class="key" data-value="5">5</div><div class="key" data-value="6">6</div><div class="key" data-value="7">7</div><div class="key" data-value="8">8</div><div class="key" data-value="9">9</div><div class="key" data-value="-2">CLEAR</div><div class="key" data-value="0">0</div><div class="key" data-value="-1">DEL</div></div></div></div>';
            
        },
        _renderHtml: function(){
			
            $('body').append(this.template);
        },
        _setStyle: function(){
            
        },
        _show: function(){
            $('.pop-window').show();
            $('.pop-window .pop-bg').addClass('fade');
            $('.pop-window .pop-box').addClass('fade');
            
        },

        _hide: function(){
            $('.pop-window .pop-bg').removeClass('fade');
            $('.pop-window .pop-box').removeClass('fade');
            setTimeout(function(){
                $('.pop-window').remove();
                }, 300);
            
        },

        _bindEvent: function(ele){
            var that = this;
            var password = '';
			// var LOCK = 0;
            $('.pop-key .key').click(function(){
                var thisV = $(this).attr('data-value');
                var pwdlen = password.length;
                if(thisV!='-2' && thisV!='-1' && pwdlen==6){return;}
				
                switch(thisV){
                    case('-1'): if(pwdlen==0)break;password = password.substring(0, password.length-1);$('.pop-input li').eq(pwdlen-1).removeClass('active');break;
                    case('-2'): if(pwdlen==0)break;password = '';$('.pop-input li').removeClass('active');break;
                    default:$('.pop-input li').eq(pwdlen).addClass('active');
                            if(password.length>=6) break; password += thisV;

                            if(password.length==6){
                                //解除绑定时间
                                var _tmppd = password;

                                if($.isFunction(that.opts.callfunc)){
                                    $('.pop-subtitle').html('<span>加载中...</span>');
                                    setTimeout(function(){//此地方需加延迟，不然会有卡顿
                                        that.opts.callfunc(_tmppd,that);
                                    }, 100);
                                    
                                }

                            }

                    }        
                           
            });

            $('.pop-bg').click(function(){
                that._hide();
            });

            //监控android的回退按钮，回退时关闭此框
            window.addEventListener("popstate", function() {
                that._hide();
            });
        }
    };
	
    popwindow.pluginDefaults = {
        title: '',
        subtitle: '',
        tip: '',
        zindex: 99999,
        callfunc: function (password,obj) {
        }
    };
})(jQuery);