var scroller = function(a){
	var self = this;
	var timer;
	var deviation=3;//滚动条上下越界差调节
	this.container = document.getElementById(a+"_container"); // 容器
	this.shower = document.getElementById(a+"_shower"); // 显示的内容
	this.scroller = document.getElementById(a+"_scroller"); // 滚动条容器
	this.scroll_up = document.getElementById(a+"_scroll_up"); // 上翻按钮
	this.scroll_down = document.getElementById(a+"_scroll_down"); // 下翻按钮
	this.scroll_bar = document.getElementById(a+"_scroll_bar"); // 滑动块
	this.clearselect = window.getSelection ? function(){ window.getSelection().removeAllRanges(); } : function(){ document.selection.empty(); };//清楚选择的文本内容，前为火狐后为IE的方法
	var m=self.container.offsetHeight;//容器高
	var ctotal=self.shower.offsetHeight;//内容总高
	if(ctotal<m)ctotal=m;//当内容高度比容器高度还低时
	var btotal=self.scroller.offsetHeight-self.scroll_up.offsetHeight-self.scroll_down.offsetHeight+parseInt(deviation*2);//滚动杆总长
	this.scroll_bar.style.height=m/ctotal*btotal+"px";	
	//console.log("m="+m+"内容高度ctotal="+ctotal+"btotal="+btotal+"高度="+m/ctotal*btotal)
	this.is_bottom = function(){ // 检测内容是不是位于底部了
		if (self.shower.offsetTop <= self.container.offsetHeight-self.shower.offsetHeight){
			return true;
		}
		return false;
	}
	this.resetright = function(){//重设滚动条的高，a为上部隐藏的内容比上总隐藏的内容
		var a = self.shower.offsetTop / (self.shower.offsetHeight - self.container.offsetHeight);   
		var b = self.scroller.offsetHeight - self.scroll_down.offsetHeight - self.scroll_bar.offsetHeight - self.scroll_up.offsetHeight+parseInt(deviation*2);//杆的移动空间
		var c = self.scroll_up.offsetHeight-deviation + (0 - b * a);//b*a为上部隐藏的内容应占滚动条的高
		self.scroll_bar.style.top = c + "px";//滚动条的位置应为
	}
	this.resetleft = function(){//根据滚动条的位置调节左边内容的，a=滚动杆当前已移动的距离/滚动杆的总移动空间
		var a = (self.scroll_bar.offsetTop - self.scroll_up.offsetHeight+deviation) / (self.scroller.offsetHeight - self.scroll_up.offsetHeight - self.scroll_down.offsetHeight - self.scroll_bar.offsetHeight+deviation*2);
		var b = self.shower.offsetHeight - self.container.offsetHeight;//总隐藏内容的高
		var c = 0 - (b * a);
		self.shower.style.top = c + "px";
	}
	this.move=function(a){//根据a值移动内容的幅度
		if (self.shower.offsetTop+a <= 0 && self.shower.offsetTop+a >= self.container.offsetHeight-self.shower.offsetHeight){
			self.shower.style.top = (self.shower.offsetTop+a)+"px";
		}else if (self.shower.offsetTop+a > 0){//当移动幅度大于实际能够上移的幅度，内容移动到顶部
			self.shower.style.top = 0+"px";
		}else if (self.shower.offsetTop+a < self.container.offsetHeight-self.shower.offsetHeight){//所移动幅度大于最大能向下移动的幅度
			self.shower.style.top = self.container.offsetHeight-self.shower.offsetHeight+"px";
		}
		self.resetright();
	}
	this.upper = function(){
		self.clear();
		timer = window.setInterval(function(){self.move(2);}, 5);
	}
	this.downer = function(){
		self.clear();
		timer = window.setInterval(function(){self.move(-2);}, 5);
	}
	this.clear = function(){
		window.clearInterval(timer);
	}
	this.test_bar = function(){//内容高度大于容器高度才现在滚动条
		if (self.container.offsetHeight < self.shower.offsetHeight){
			self.scroller.style.display = "block";
		}else {
			self.scroller.style.display = "none";
		}
	}
	this.gotobottom = function(){//显示最底部内容，滚动条移动到最下面
		var a = (self.shower.offsetHeight > self.container.offsetHeight) ? self.container.offsetHeight - self.shower.offsetHeight : 0;//总隐藏高
		self.shower.style.top = a + "px";
		self.test_bar();
		self.resetright();
	}
	this.wheel = function(){//滚轮滚动时
		var e=arguments[0]||window.event;
		var act = e.wheelDelta ? e.wheelDelta/120 : (0 -e.detail/3);//detail为fx，正3代表滚轮向上滚动，负3代表向下
		self.clear();
		self.move(20*act);//act只能为-1或+1
		try{ e.preventDefault();}//应该为阻止外部滚动条的滚动
		catch(e){}
		return false;
	}
	this.barmove = function(){
		// 记录当时鼠标的位置与
		self.clearselect;
		var mover = this;
		this.can_move_top = self.scroll_bar.offsetTop - (self.scroll_up.offsetHeight-deviation); // 这个滚动条上方的可移动距离
		this.can_move_bottom = self.scroller.offsetHeight - self.scroll_bar.offsetTop - (self.scroll_down.offsetHeight-deviation) - self.scroll_bar.offsetHeight; // 这个滚动条下方的可移动距离
		this.e=arguments[0]||window.event;
		this.starts = this.e.clientY;//鼠标指针对于浏览器页面的的Y坐标
		this.starttop = self.scroll_bar.offsetTop;//当前滚动杆距离顶部的坐标
		this.drag = function(){//拖拽滚动杆
			this.e=arguments[0]||window.event;
			this.ends = this.e.clientY;//当前的this无法判断是什么
			this.dis = this.ends - mover.starts;//鼠标移动的距离
			//console.log("鼠标移动="+this.dis+"---")
			if (this.dis < (0-mover.can_move_top))this.dis = 0-mover.can_move_top;//判断可移动的距离是否超出上下边界
			if (this.dis > mover.can_move_bottom) this.dis = mover.can_move_bottom;
			self.scroll_bar.style.top = (mover.starttop + this.dis) + "px";
			self.resetleft();//根据滚动杆的位置确定内容的位置
			self.clearselect;
		}
		this.cleardrag = function(){
			if (window.removeEventListener){
				document.removeEventListener("mousemove", mover.drag, true);//移除监听
			}else {
				document.detachEvent("onmousemove", mover.drag);
			}
			self.clearselect;
		}
		this.add_listener = function(){//监听鼠标移动和鼠标按下键事件
			if (window.addEventListener){
				document.addEventListener("mousemove", mover.drag, true);//添加监听
				document.addEventListener("mouseup", mover.cleardrag, true);//鼠标按键松开，清楚监听鼠标移动
			}else {
				document.attachEvent("onmousemove", mover.drag);
				document.attachEvent("onmouseup", mover.cleardrag);
			}
		}
		this.add_listener();//处于barmove函数内
	}
	this.outbar = function(){//鼠标点击滚动条事件
		var e=arguments[0]||window.event;
		var obj = e.srcElement ? e.srcElement : e.target;
		//console.log('输出当前点击的对象='+obj.id);
		if (obj.id == self.scroller.id){//当前事件是否是
			var y = e.offsetY || e.layerY;//鼠标在杆中的Y坐标
			var new_top = y - 0.5 * self.scroll_bar.offsetHeight;//0.5是实现滚动杆的中间点位到点击的位置
			if (y - self.scroll_up.offsetHeight+deviation < 0.5 * self.scroll_bar.offsetHeight) new_top = self.scroll_up.offsetHeight-deviation;
			if (self.scroller.offsetHeight - y - self.scroll_down.offsetHeight+deviation < 0.5 * self.scroll_bar.offsetHeight) new_top = self.scroller.offsetHeight - self.scroll_down.offsetHeight+deviation - self.scroll_bar.offsetHeight;
			self.scroll_bar.style.top = new_top + "px";
			self.resetleft();
		}
	}
	this.scroll_bar.ondrag=function(){return false;}
	this.scroll_bar.oncontextmenu=function(){return false;} //禁用鼠标右键弹出菜单
	this.scroll_bar.onselectstart=function(){return false;}//IE阻止鼠标选中滚动杆的文本， Firefox中可以使用CSS "-moz-user-select:none"属性来禁止文本选定
	if (window.addEventListener){
		this.scroll_up.addEventListener("mousedown", this.upper, true);
		this.scroll_down.addEventListener("mousedown", this.downer, true);
		this.scroll_bar.addEventListener("mousedown", this.barmove, true);
		this.scroller.addEventListener("mousedown", this.outbar, true);//当点击滚动杆时，true表示先执行out函数，后执行barmove
		this.shower.addEventListener("DOMMouseScroll", this.wheel, true);
		this.scroller.addEventListener("DOMMouseScroll", this.wheel, true);
		this.shower.addEventListener("mousewheel", this.wheel, true);
		this.scroller.addEventListener("mousewheel", this.wheel, true);
		document.addEventListener("mouseup", this.clear, true);//清除timer
	}else {
		this.scroll_up.attachEvent("onmousedown", this.upper);
		this.scroll_down.attachEvent("onmousedown", this.downer);
		this.scroll_bar.attachEvent("onmousedown", this.barmove);
		this.scroller.attachEvent("onmousedown", this.outbar);
		this.shower.attachEvent("onmousewheel", this.wheel);
		this.scroller.attachEvent("onmousewheel", this.wheel);
		document.attachEvent("onmouseup", this.clear);
	}
}
//window.onload=function(){
//	for(var i=0;i<4;i++){
//		var te = new scroller("yuyan"+i+"");
//	}
//}
