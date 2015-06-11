/*!
 *  Project: pScroll
 *  Description: 移动端翻页插件
 *  Version : 1.0.2.20150606
 *  Author: Lixinliang
 *  License:
 *  Include: Zepto (http://zeptojs.com/)
 */
!function ( global, factory ) {
	var plugin = 'pScroll'
    if (typeof define == 'function') {
        define(plugin, ['zepto'], function () {
        	return factory(Zepto)
        })
    } else {
        global[plugin] = factory(Zepto)
    }
}(this, function ( $ ) {
	var handle = ['prev','reload','next','goPage','goStep','on','off'];
	var option = {
		speed	   : 500,				//翻页速度 默认500ms
		easing	   : 'ease-in-out',		//时间函数 默认ease-in-out
		axis	   : 'y',				//翻页方向 默认y轴
		threshold  : 50,				//翻页阀值 默认50px
		loop	   : false,				//是否循环翻页 默认否
		hash	   : false,	 			//启动锚点功能 默认否
		delay	   : false,				//延迟翻页 默认否
		trigger	   : document,			//触发区域 默认Document对象
		prevent    : true,				//阻止移动端浏览器默认事件 默认是
		wrap	   : $(),				//父容器 必须
		slidestart : function(){},		//开始滑动的回调函数
		slideend   : function(){}		//结束滑动的回调函数
	};
	function pScroll ( conf ) {
		this.speed = conf.speed;
		this.easing = conf.easing;
		this.axis = conf.axis;
		this.threshold = conf.threshold;
		this.loop = conf.loop;
		this.hash = conf.hash;
		this.delay = conf.delay;
		this.trigger = conf.trigger;
		this.prevent = conf.prevent;
		if (this.prevent) {
			$(document).on('touchmove',function(e){e.preventDefault()});
		}
		this.wrap = $(conf.wrap);
		this.slidestart = conf.slidestart;
		this.slideend = conf.slideend;
		this.pages = this.wrap.children();
		this.length = this.pages.length;
		this.index = 0;
		this.touching = false;
		this.animating = false;
		this.register = false;
		this.startPos = 0;
		this.movePos = 0;
		this.endPos = 0;
		this.startTS = 0;
		this.pageSize = this.axis === 'y' ? this.pages.height() : this.pages.width();
		this.size = this.pageSize * this.length;
		var direction = this.axis === 'y' ? 'height' : 'width';
		this.pages.css(direction, this.pageSize);
		this.wrap.css(direction, this.size);
		this.pagePos = [];
		var temp = 0;
		var temp = 0;
		for (var i = 0 ; i < this.length; i++) {
			this.pagePos.push([0 - temp, 1 - temp - this.pageSize, 0]);
			temp += this.pageSize;
		}
		this.topPage = 0;
		if (this.hash) {
			var hash = parseInt(location.hash.substring(1));
			hash = isNaN(hash) ? 0 : hash;
			this.index = hash;
			if (hash !== 0) {
				this.goStep(this.pagePos[hash][0]);
			}
		}
		this.init();
	}
	var prototype = {
		init : function () {
			var self = this;
			var TF = '-webkit-transform';
			// var TF = 'transform';
			var TS = '-webkit-transition';
			// var TS = 'transition';
			var proto = this.wrap.__proto__;
			var extend = {
				transform : function ( value ) {
					if (typeof value == 'undefined') {
						var str = this.css(TF) || '';
						var	result = str.match(/translate\((.*)\)/);
						var	ret;
						if (!result || result.length == 0) {
							this.css(TF, 'translate(0,0)');
							ret = [0,0];
						} else {
							ret = result[1].split(',');
						}
						return parseInt(ret[self.axis === 'y' ? 1 : 0]);
					} else {
						this.css(TF, self.axis === 'y' ? ('translate(0,' + value + 'px)') : ('translate(' + value + 'px,0)') );
					}
				},
				addTransition : function () {
					this.css(TS, TF + ' ' + self.speed + 'ms ' + self.easing);
				},
				removeTransition : function () {
					this.css(TS, TF + ' 0 linear');
				}
			};
			extend.__proto__ = proto;
			this.wrap.__proto__ = extend;
			this.wrap.on('webkitTransitionEnd', function ( e ) {
				if (self.animating) {
					self.animating = false;
					self.slideend.apply(self.pages[self.index], [self.index]);
				}
				return false
			});
			this.bind();
			this.on();
		},
		getPos : function ( e ) {
			var ev = e.changedTouches[0];
			return this.axis === 'y' ? ev.pageY : ev.pageX;
		},
		touchstart : function ( e ) {
			if (this.animating) {
				this.touching = false;
				return;
			}
			this.startPos = this.getPos(e);
			this.wrap.removeTransition();
			this.startTS = this.wrap.transform();
			this.touching = true;
		},
		touchmove : function( e ) {
			if (this.animating) return;
			if (!this.touching) return;
			e.preventDefault();
			this.movePos = this.getPos(e);
			if (!this.loop) {
				if (this.startTS === this.pagePos[0][0] && this.movePos > this.startPos) {
					//第一页 不能上拉
					return;
				}
				if (this.startTS === this.pagePos[this.length - 1][0] && this.movePos < this.startPos) {
					//最后一页 不能下拉
					return;
				}
			}
			this.goStep(this.startTS + this.movePos - this.startPos);
		},
		touchend : function( e ) {
			if (this.animating) return;
			this.endPos = this.getPos(e);
			if (!this.touching || this.endPos == this.startPos) {
				//没有移动
				return;
			}
			if (this.endPos < this.startPos) {
				//向下滚屏
				if (Math.abs(this.endPos - this.startPos) >= this.threshold) {
					//偏移值超过阀值
					this.next();
				} else{
					this.reload();
				}
			} else {
				//向上滚屏
				if (Math.abs(this.endPos - this.startPos) >= this.threshold) {
					//偏移值超过阀值
					this.prev();
				} else {
					this.reload();
				}
			}
		},
		prev : function () {
			var index = this.index;
			if (this.loop) {
				index--;
				index = index % this.length;
				if (index < 0) {
					index += this.length;
				}
				if (this.index == this.topPage) {
					this.pullUp();
				}
			} else if (index != 0) {
				index--;
			}
			this.goPage(index);
		},
		reload : function () {
			this.goPage(this.index);
		},
		next : function () {
			var index = this.index;
			if (this.loop) {
				index++;
				index = index % this.length;
				if (index < 0) {
					index += this.length;
				}
				if (index == this.topPage) {
					this.pullDown();
				}
			} else if (index != this.length - 1) {
				index++;
			}
			this.goPage(index);
		},
		goPage : function ( to ) {
			var from = this.index;
			if (to >= this.length) {
				to = this.length - 1;
			} else if (to < 0) {
				to = 0;
			}
			this.index = to;
			this.hash && (location.hash = '#'+to);
			this.wrap.addTransition();
			this.wrap.transform(this.pagePos[to][0]);
			if (to !== from) {
				this.animating = true;
			}
			this.slidestart.apply(this.pages[from],[to,from]);
		},
		goStep : function ( step ) {
			if (this.loop) {
				var topLimit = this.pagePos[this.topPage][0];
				if (step > topLimit) {
					this.pullUp();
				}
				if (step < topLimit - this.size + this.pageSize) {
					this.pullDown();
				}
			}
			this.wrap.transform(step);
		},
		pullUp : function () {
			if (this.topPage == 0) {
				this.topPage = this.length-1;
			} else {
				this.topPage --;
			}
			var counter = --this.pagePos[this.topPage][2];
			this.pagePos[this.topPage][0] += this.size;
			this.pagePos[this.topPage][1] += this.size;
			this.wrap.transform.call(this.pages.eq(this.topPage), counter * this.size);
		},
		pullDown : function () {
			var counter = ++this.pagePos[this.topPage][2];
			this.pagePos[this.topPage][0] -= this.size;
			this.pagePos[this.topPage][1] -= this.size;
			this.wrap.transform.call(this.pages.eq(this.topPage), counter * this.size);
			if (this.topPage == this.length - 1) {
				this.topPage = 0;
			} else {
				this.topPage ++;
			}
		},
		bind : function () {
			this.touchstart = this.touchstart.bind(this);
			this.touchmove  = this.touchmove.bind(this);
			this.touchend   = this.touchend.bind(this);
		},
		on : function () {
			if (!this.register) {
				(!this.delay) && $(this.trigger).on('touchmove', this.touchmove);
				$(this.trigger).on('touchstart', this.touchstart).on('touchend', this.touchend);
				this.register = true;
			}
		},
		off : function () {
			if (this.register) {
				(!this.delay) && $(this.trigger).off('touchmove', this.touchmove);
				$(this.trigger).off('touchstart', this.touchstart).off('touchend', this.touchend);
				this.register = false;
			}
		}
	}
	for (var i in prototype) {
		pScroll.prototype[i] = prototype[i];
	}
	return function ( conf ) {
		if (!$(conf.wrap).children().length) {
			throw new Error('pScroll require a wrapper with page(s)');
		}
		var plugin = new pScroll($.extend({}, option, conf));
		var ret = {};
		for (var i = 0, l = handle.length; i < l; i++) {
			ret[handle[i]] = (function ( name ) {
				var ret = plugin[name].apply(plugin, Array.prototype.slice.call(arguments, 1))
				return typeof ret === 'undefined' ? this : ret;
			}).bind(ret, handle[i]);
		}
		ret.plugin = plugin;
		return ret;
	}
})