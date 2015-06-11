# pScroll, pages scroll for mobile

> *pScroll* 基于[Zepto]的移动端滚动插件

### <a name="top"></a>目录
* [简介(Intro)](#intro)
* [示例(Demo)](#demo)
* [依赖(Require)](#require)
* [使用方法(Usage)](#usage)
* [参数列表(Config)](#config)
* [方法列表(API)](#api)
* [回调函数(Callback)](#callback)
* [已知问题(Issues)](#known-issues)
* [License](#license)

### <a name="intro"></a>简介(Intro) [[⬆]](#top)
pScroll是基于[Zepto]的移动端滚动插件，使用css3变换与过渡实现滚动效果。

### <a name="demo"></a>示例(Demo) [[⬆]](#top)
[Demo]


![Demo](demo.png)

### <a name="require"></a>依赖(Require) [[⬆]](#top)
[Zepto]

### <a name="usage"></a>使用方法(Usage) [[⬆]](#top)
````
new pScroll({
	// options
});
````
````
new pScroll({
	wrap : '.wrapper'
});
````
````
new pScroll({
	wrap 	 : '.wrapper',
	axis	 : 'x',
	slideend : function(){
		// do something
	}
});
````

### <a name="config"></a>参数列表(Config) [[⬆]](#top)
|   参数(args)  |     说明(desc)   | 默认值(default) | 可填值(allowed) |
|--------------|------------------|---------------|----------------|
| wrap         | 父容器            | null(*)       | selector       |
| speed        | 翻页速度          | 500           | Number          |
| easing       | 时间函数          | 'ease-in-out' | 'linear'|'ease'|'ease-in'|'ease-out'|'ease-in-out'|'cubic-bezier' |
| axis         | 翻页方向          | 'y'           | 'y'|'x'         |
| threshold    | 翻页阀值          | 50            | Number          |
| loop         | 是否循环翻页      | false          | Boolean        |
| hash         | 启动锚点功能      | false          | Boolean        |
| delay        | 延迟翻页          | false         | Boolean        |
| trigger      | 触发区域          | document      | selector       |
| prevent      | prevent         | true           | Boolean        |
| slidestart   | 开始滑动的回调函数 | null           | Function       |
| slideend     | 结束滑动的回调函数 | null           | Function       |

### <a name="api"></a>方法列表(API) [[⬆]](#top)
| 方法(API) | 说明(desc)  | 参数(args) |
|----------|-------------|-----------|
| prev     | 前翻一页     | null      |
| reload   | 重翻当前页   | null       |
| next     | 后翻一页     | null      |
| goPage   | 翻到第n页 	 | Number(*) |
| goStep   | 位移n个像素值 | Number(*) |
| on       | 开启触摸监听  | null      |
| off      | 关闭触摸监听  | null	     |

### <a name="callback"></a>回调函数(Callback) [[⬆]](#top)
| 回调函数(callback) |              说明(desc)              			| 参数(args) |
|-------------------|-----------------------------------------------|-----------|
| slidestart   		| 开始滑动时触发，参数：结束滑动页序号、开始滑动页序号。 | to、from  |
| slideend    		| 结束滑动时触发，参数：结束滑动页序号。             	| index     |

### <a name="known-issues"></a>已知问题(Issues) [[⬆]](#top)

### <a name="license"></a>License [[⬆]](#top)
Released under [MIT] LICENSE

---
[Zepto]: http://zeptojs.com/
[Demo]: https://fed-lambert.github.io/pScroll/demo.html
[MIT]: http://rem.mit-license.org/