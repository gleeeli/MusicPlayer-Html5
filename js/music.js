/*********读取文本********/
$(document).ready(function(){
	getDayTime();
	set_right_top_2_h3();

    /********设置播放按钮***********************/
	$("#music_id_img_ch_1 li img").mouseover(function(){
		setPlayButton();
		$(this).next().css("display" , "block");
	});
	$("#music_id_img_ch_2 li img").mouseover(function(){
		setPlayButton();
		$(this).next().css("display" , "block");
	});
	$("#music_id_img_ch_3 li img").mouseover(function(){
		setPlayButton();
		$(this).next().css("display" , "block");
	});
	$("#music_id_img_ch_1 li aside").mouseover(function(){
		setPlayButton();
		$(this).css("display" , "block");
	});
	$("#music_id_img_ch_2 li aside").mouseover(function(){
		setPlayButton();
		$(this).css("display" , "block");
	});
	$("#music_id_img_ch_3 li aside").mouseover(function(){
		setPlayButton();
		$(this).css("display" , "block");
	});
});

function setPlayButton(){
	$("#music_id_img_ch_1 li img").next().css("display" , "none");
	$("#music_id_img_ch_2 li img").next().css("display" , "none");
	$("#music_id_img_ch_3 li img").next().css("display" , "none");
}
/**************设置  _right_top_2_h3  时间显示*************************/
var date = new Date();
var weekday=new Array("星期天" ,"星期一" , "星期二" , "星期三" , "星期四" , "星期五"  , "星期六");
var _right_top_2_h3 = "";
var day_time = "";
var hour = date.getHours();//获取时间

/************时间判断***********/
function getDayTime(){
	if (hour >= 3 && hour < 6) {
		day_time = "凌晨";
	}else if(hour >= 6 && hour < 10){
		day_time = "早晨";
	}else if(hour >= 10 && hour < 12){
		day_time = "上午";
	}else if(hour >= 12 && hour < 14){
		day_time = "中午";
	}else if(hour >= 14 && hour < 17){
		day_time = "下午";
	}else if(hour >= 17 && hour < 20){
		day_time = "傍晚";
	}else if(hour >= 20 && hour < 23){
		day_time = "晚上";
	}else{
		day_time = "午夜";
	}
};

/***********设置文本**********************/
function set_right_top_2_h3(){
	_right_top_2_h3 = weekday[date.getDay()] + " " +  day_time;
	document.getElementById("right_top_2_h3").innerHTML = _right_top_2_h3;
}
