(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/hotSights/index"],{"01dc":function(t,e,n){"use strict";(function(t){n("5488");i(n("66fd"));var e=i(n("8336"));function i(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,n("543d")["createPage"])},1355:function(t,e,n){"use strict";var i,c=function(){var t=this,e=t.$createElement;t._self._c},o=[];n.d(e,"b",(function(){return c})),n.d(e,"c",(function(){return o})),n.d(e,"a",(function(){return i}))},"6c7c":function(t,e,n){"use strict";var i=n("a04b"),c=n.n(i);c.a},8336:function(t,e,n){"use strict";n.r(e);var i=n("1355"),c=n("e810");for(var o in c)"default"!==o&&function(t){n.d(e,t,(function(){return c[t]}))}(o);n("6c7c");var a,u=n("f0c5"),s=Object(u["a"])(c["default"],i["b"],i["c"],!1,null,null,null,!1,i["a"],a);e["default"]=s.exports},"835e":function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;n("9a96");var i=function(){n.e("components/area-search/index").then(function(){return resolve(n("2c89"))}.bind(null,n)).catch(n.oe)},c={data:function(){return{sights:[]}},components:{areaSearch:i},created:function(){this.getHotSights()},methods:{changeArea:function(t){console.log(t)},getHotSights:function(){var e=this;t.showLoading({title:"加载中...",mask:!0}),setTimeout((function(){e.sights=[{id:1,name:"洪崖洞民宿风貌区",title:"如何玩转“网红”重庆？",desc:"坐几站就到了很方便。去重庆的旅游攻略，老重庆人喜欢喝茶下棋。",location:"重庆",like:"213",isLike:0,see:"2090"},{id:2,name:"洪崖洞民宿区",title:"如何玩转“网红”重庆？重庆自由行攻略",desc:"坐几站就到了很方便。去重庆的旅游攻略，老重庆人喜欢喝茶下棋。坐几站就到了很方便。去重庆的旅游攻略，老重庆人喜欢喝茶下棋。",location:"重庆",like:"214",isLike:1,see:"2090"},{id:3,name:"洪崖洞民宿风貌",title:"如何玩转“网红”重庆？重庆自由行攻略",desc:"坐几站就到了很方便。去重庆的旅游攻略，老重庆人喜欢喝茶下棋。坐几站就到了很方便。去重庆的旅游攻略，老重庆人喜欢喝茶下棋。",location:"重庆",like:"215",isLike:0,see:"2090"}],t.hideLoading()}),1500)},toggleLike:function(t){this.sights.forEach((function(e){e.id===t&&(e.isLike=!e.isLike)}))},toDetail:function(e,n){t.navigateTo({url:"/pages/sightsDetail/index?id=".concat(e,"&name=").concat(n)})}}};e.default=c}).call(this,n("543d")["default"])},a04b:function(t,e,n){},e810:function(t,e,n){"use strict";n.r(e);var i=n("835e"),c=n.n(i);for(var o in i)"default"!==o&&function(t){n.d(e,t,(function(){return i[t]}))}(o);e["default"]=c.a}},[["01dc","common/runtime","common/vendor"]]]);