(function(){
	findError();
	getBrowser();
	setContains();
    
	initializeLeft();
	initializeRight();
	initializeWhole();
	XMLJson();//位于246行
	
})();
//---------------------------------------------------找出错误
function findError(){
	onerror=handleErr;
	function handleErr(msg,url,l){
		var txt="";
		txt+="本页中存在错误";
		txt+="错误"+msg+".\n";
		txt+="url:"+url+"\n";
		txt+="行"+l+"\n";
		txt+="点击，确定\n\n";
		alert(txt);
		return true;
	}
}
//---------------------------------------------------判断当前浏览器是什么浏览器，如果是火狐则增加contains方法
function getBrowser(){
	var browser=navigator.userAgent;//取得浏览器属性
	if(browser.indexOf("Firefox")>0){
		return "Firefox";
	}else if(browser.indexOf("MSIE")>0){
		return "IE";
	}
	
}
//---------------------------------------------------定义contains方法解决onmouseout冒泡事件
function setContains(){
	if(typeof(HTMLElement)!="undefined"){
		HTMLElement.prototype.contains=function(obj){
			
			while(obj!=null&&typeof(obj.tagName)!="undefind"){
				if(obj==this)return true;
				obj=obj.parentNode;
			}
			return false;
		};
	}
}
//---------初始化整体
function initializeWhole(){
	var main=document.getElementById("yuyanMusic_main");
    var browseHeight=window.innerHeight;
    var marginTop=(browseHeight-500)/2;
    main.style.marginTop=marginTop+"px";
}
//---------------------------------------------------初始化音乐列表的内容，即加入蝴蝶图片
function initializeLeft(){//初始化左部列表
	var musicListlis=document.getElementById("musicList_navigation").getElementsByTagName("li");
	var index=0;
	 for(var i=0;i<musicListlis.length;i++){
		 var butterflyDiv=document.createElement("div");
		     butterflyDiv.id="two_butterfly";
		     butterflyDiv.className="two_butterfly";
		     var img=document.createElement("img");
		     img.src="images/musicPicture/two_butterfly.gif";
		     butterflyDiv.appendChild(img);
		     musicListlis[i].appendChild(butterflyDiv);
		     if(i==0){musicListlis[i].childNodes[1].style.display="block";}//在第一个位置显示蝴蝶飞的效果
		     //初始化完成，添加事件
		     butterflyDiv.onmouseover=changeBufLayer;
		     musicListlis[i].onclick=showListIndex;//调用了下面的函数
		     musicListlis[i].onmouseout=function(event){
		    	 var Event = event || window.event;
		         if(Event){
		         	if(this.contains(Event.relatedTarget||Event.toElement)){//当鼠标离开进入的是子元素时则返回false
		         		return false;
		         	 }else{
		         		this.childNodes[1].style.zIndex="2";
		             }
		         }
		     }
	 }
	 var musicList=document.getElementById("musicList_content");
	     musicList.children[0].style.display="block";
}
//---------------------------------------------------实现鼠标移到蝴蝶上方，蝴蝶下移，离开反之
function changeBufLayer(event){
	 var Event = event || window.event;
	 var beforeObject=Event.relatedTarget||Event.fromElement;//引起事件的事件源对象
	 var musicListlis=document.getElementById("musicList_navigation").getElementsByTagName("li");
	 for(var i=0;i<musicListlis.length;i++){
		 if(musicListlis[i].children[0]===beforeObject) return false;
	 }
	 this.style.zIndex="-1";
	 //document.write("进入了蝴蝶图片");
	// document.writeln(1);
	// alert(event.type+beforeObject.id);
}
//---------------------------------------------------实现点击切换音乐列表的内容,以及显示与隐藏蝴蝶飞
 function showListIndex(){
	 var lis=document.getElementById("musicList_navigation").getElementsByTagName("li");
	 var divs=document.getElementById("musicList_content").children;
	 var index=getIndex(this);
	 for(var i=0;i<divs.length;i++){
		 if(i==index){
		 divs[i].style.display="block";
		 lis[i].childNodes[1].style.display="block";
		 }else {
			 divs[i].style.display="none";
			 lis[i].childNodes[1].style.display="none";
		 }
	 }
	 
 }
//---------------------------------------------------初始化右边列表
 function initializeRight(){//初始化右部列表
	 var navLis=document.getElementById("musicPlayer_navigation").children[0].getElementsByTagName("li");
	     for(var k=0;k<navLis.length;k++){
		    	if(k==0)navLis[k].style.backgroundImage="url('images/musicPicture/play_list_onclick.png')";
		    	if(k==1)navLis[k].style.backgroundImage="url('images/musicPicture/play_list_unonclick.png')";
		    	navLis[k].onclick=showRightByIndex;
	     }
	     var divs=document.getElementById("musicPlayer_show").children;
	         divs[0].style.display="block";
	     var divBar=document.getElementById("progress_bar");
	         divBar.innerHTML="<img src=\"images/musicPicture/progress_playing.png\" height=\"6\"><div class=\"clearFloat\"></div>";
	     changeFunctionBtn();
	    initializePlayMode();//初始化播放模式
 }
//---------------------------------------------------初始化功能键或实现鼠标悬浮或停留时更改背景图片
 function changeFunctionBtn(){
	 var allBtns=document.getElementById("major_major").children;
	 for(var i=0;i<allBtns.length-1;i++){//减一是因为播放模式mode的背景不在这里初始化
		 allBtns[i].style.backgroundImage="url(images/musicPicture/"+allBtns[i].id+".png)";
		 if(allBtns[i].id!="voice"){
		 allBtns[i].onmouseover=function(){
			 this.style.backgroundImage="url(images/musicPicture/"+this.id+"_glow.png)";
		 }
		 allBtns[i].onmouseout=function(){
			 this.style.backgroundImage="url(images/musicPicture/"+this.id+".png)";
		 }
		 }
	 }
	 
 }

//---------------------------------------------------初始化播放模式
var Mode="顺序播放";
 function initializePlayMode(){
	 var ul=document.getElementById("mode_ul");
	     var pngName=new Array("list_cycle","single_cycle","random_play","order_play");
	     var spantxt=new Array("列表循环","单曲循环","随机播放","顺序播放");
	     var lihtml="";
	     for(var i=0;i<pngName.length;i++){
	    	 var li=document.createElement("li");
	    	 var span=document.createElement("span");
	    	 var txt=document.createTextNode(spantxt[i]);
	    	     span.appendChild(txt);
	    	     li.style.backgroundImage="url(images/musicPicture/mode/"+pngName[i]+".png)";
		    	 if(i==(pngName.length-1)){
		    		 li.style.display="block";//显示默认的播放模式
		    		 li.style.color="transparent";
		    		 }else {
		    			 li.style.display="none";
		    			 }
	    	    li.appendChild(span);
	    	     ul.appendChild(li);

	     }
	     //清浮动
	     var clearDiv=document.createElement("div");
	         clearDiv.className="clearFloat";
	         ul.appendChild(clearDiv);
	         
//----------------到此ul初始化完成
         var lis=ul.children;
     for(var i=0;i<pngName.length;i++){
    	 lis[i].onmouseover=function(){
    		 for(var t=0;t<pngName.length-1;t++){
    			 lis[t].style.display="block";
    			    lis[t].style.color="transparent";//设置span里面字体的颜色  	
    		 }
    		  		 
    			 ul.style.height="120px";
    			 ul.style.top="-60px";
    			var img=this.style.backgroundImage.split(".");
    		 this.style.backgroundImage=img[0]+"_red."+img[1];
    	 };
    	 lis[i].onmouseout=function(){
    		 for(var t=0;t<pngName.length-1;t++){
    			 lis[t].style.display="none";
    			 this.style.color="transparent";//让字体颜色变得透明
    		 }
    		 var img=this.style.backgroundImage.split("_");
    		 var src=img[0]+"_"+img[1]+".png\")";
    		  this.style.backgroundImage=src;
    		     ul.style.height="20px";
    			 ul.style.top="0px";
    	 }
    	 lis[i].onclick=function(){//点击播放模式时实现将点击的背景图片和文字与最后一个li的背景图片交换
    		 var x=getIndex(this);
    		 var img=this.style.backgroundImage.split("_");
    		 var src=img[0]+"_"+img[1]+".png\")";
    		 this.style.backgroundImage=src;
    		 var url=lis[pngName.length-1].style.backgroundImage;//获取第4个背景图片
    		 var playTxt=lis[pngName.length-1].children[0].innerHTML;
    		lis[pngName.length-1].style.backgroundImage=this.style.backgroundImage;//将最后一个播放模式的背景图片改成当前点击元素的背景图片
    		Mode=this.children[0].innerHTML;
    		lis[pngName.length-1].children[0].innerHTML=this.children[0].innerHTML;
    		this.style.backgroundImage=url;
    		this.children[0].innerHTML=playTxt;
    		
   		 for(var t=0;t<pngName.length-1;t++){
			 lis[t].style.display="none";
			
		 }
   		     ul.style.height="20px";
			 ul.style.top="0px";
    	 };
     }
 }
//---------------------------------------------------实现右边点击切换显示div，以及li背景色改变
 function showRightByIndex(){
	 var divs=document.getElementById("musicPlayer_show").children;
	 var index=getIndex(this);
	 for(var i=0;i<divs.length;i++){
		 if(index==i){
			 divs[i].style.display="block";
		 }else {
			 divs[i].style.display="none";
		 }
	 }
	 //点击导航列表下面li变色
	 var lis=document.getElementById("musicPlayer_navigation").children[0].getElementsByTagName("li");
	 
		for(var n=0;n<lis.length;n++){
		if(lis[n]===this){
			lis[n].style.backgroundImage="url('images/musicPicture/play_list_onclick.png')";
			lis[n].style.color="white";
		}else {
			lis[n].style.backgroundImage="url('images/musicPicture/play_list_unonclick.png')";
			lis[n].style.color="black";
		}
		}
 }
//---------------------------------------------------返回点击序号显示或者隐藏播放模式
 function showModeByindex(index){
	 var modelis=document.getElementById("positon_relative").children[0].children;
	 for(var i=0;i<(modelis.length-1);i++){
    	 if(i==index){
    		 modelis[i].style.display="block";
    		 modelis[i].children[0].style.visibility="hidden";
    	 }else {
    		 modelis[i].style.display="none";
    	 }
     }
 }

//---------------------------------------------------获得歌曲jison
 function XMLJson(){	 
	 var xmlhttp,musicData;
	 var jisonUrl="others/json/musicData.json";
	 this.jsonData;
	 loadJson(jisonUrl);
	 
	 function loadJson(url){
	 if(window.XMLHttpRequest){
		 xmlhttp=new XMLHttpRequest();
	 }else if(window.ActiveXObject){//IE7以下的版本
		 xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	 }
	 if(xmlhttp!=null){
		 xmlhttp.onreadystatechange=getMusicData;
		 xmlhttp.open("get", url, true);
		 xmlhttp.send(null);
	 }
	 }
	 function getMusicData(){
		 if(xmlhttp.readyState===4){
			 if(xmlhttp.status===0||xmlhttp.status===200){
				 jsonData=eval("("+xmlhttp.responseText+")");//取的json内容
				 initializeList(jsonData);
				 initializePlayer(jsonData);
				//alert(jsonData);
			 }else {
				 alert("获取歌词出错-"+xmlhttp.status+"错误");
			 }
		 }
	 }
 }

//---------------------------------------------------初始化列表
 function initializeList(jsonData){
	 var formatlist=new FORMATlIST(jsonData);
	 formatlist.defaultList(formatlist.defaultListArray);//初始化默认播放列表
	formatlist.leftList();
 }
//---------------------------------------------------往列表里添加歌曲
 function FORMATlIST(jsonData){
	 this.jsonData=jsonData;
	 this.albumAmount=jsonData.musicData.length;//专辑数目
	 this.defaultListArray=new Array();
	 this.initialArray(this.defaultListArray);//初始化上面的默认列表数组
 }
//-------------------------初始化列表数组
 FORMATlIST.prototype.initialArray=function(array){
	 var start=0;
	 for(var i=0;i<parseInt(this.albumAmount);i++){
		 var curAmoSongs=parseInt(this.jsonData.musicData[i].albumSongs.length);//当前专辑的歌曲数
		 for(var j=0;j<curAmoSongs;j++){
			 var list=new LIST(i,j);//第i行，第i个专辑，第几首歌
			 array[start]=list;
			 start++;
		 }
	 }
 };
//-------------------------往默认列表里添加
 var PLAYLISTNUMBER=0;//播放当前列表的第几首歌
 FORMATlIST.prototype.defaultList=function(array){
	 jsonData=this.jsonData;
	 allSongs=array.length;//所有歌曲数，数组的长度
	 var allSongsList=document.getElementById("default_all_songs");
	 		var htmlScroll="<div class=\"from4_scroll_container\" id=\"yuyan4_container\"><div class=\"scroll_shower\" id=\"yuyan4_shower\"></div></div>";
	       htmlScroll +="<div class=\"from4_scroll_scorller\" id=\"yuyan4_scroller\">"
		   htmlScroll +="<div class=\"scroll_up\" id=\"yuyan4_scroll_up\"></div><div class=\"scroll_bar\" id=\"yuyan4_scroll_bar\"></div><div class=\"scroll_down\" id=\"yuyan4_scroll_down\"></div>"	
           htmlScroll +="</div>";
           allSongsList.innerHTML=htmlScroll;
     var songsContent=document.getElementById("yuyan4_shower");
	 var table=document.createElement("table");
	 table.id="table_default";
	 table.cellSpacing="0px";
	 table.cellPadding="0px";
	 for(var i=0;i<allSongs;i++){
		 var tr=document.createElement("tr");
		 tr.className="default_tr";
		 var td=document.createElement("td"),
		 td1=document.createElement("td");
		 td.className="default_list_member";
		 td1.className="default_list_delete";    
		 var songName=jsonData.musicData[array[i].albumIndex].albumSongs[array[i].songIndex].musicName.wipeQuotation();
		 var txt=document.createTextNode(songName);
		 var htmlDeleteSong="<img src='images/musicPicture/delete_song.png'>";	 
		 td.appendChild(txt);
		 td1.innerHTML=htmlDeleteSong;
		 tr.appendChild(td);
		 tr.appendChild(td1);
		 table.appendChild(tr); 
	 }
	 songsContent.appendChild(table);
	 var te = new scroller("yuyan4");

 };
//-------------------------初始化左边四个列表
 FORMATlIST.prototype.leftList=function(){
	 jsonData=this.jsonData;
	 albumAmount=parseInt(this.albumAmount);
	 
	var rightlists= document.getElementById("musicList_content").children;
	for(var i=0;i<rightlists.length;i++){
		var htmlScroll="<div class=\"scroll_container\" id=\"yuyan"+i+"_container\"><div class=\"scroll_shower\" id=\"yuyan"+i+"_shower\"></div></div>";
	       htmlScroll +="<div class=\"scroll_scorller\" id=\"yuyan"+i+"_scroller\">"
		   htmlScroll +="<div class=\"scroll_up\" id=\"yuyan"+i+"_scroll_up\"></div><div class=\"scroll_bar\" id=\"yuyan"+i+"_scroll_bar\"></div><div class=\"scroll_down\" id=\"yuyan"+i+"_scroll_down\"></div>"	
           htmlScroll +="</div>";
		rightlists[i].innerHTML=htmlScroll;
	}
	iniListContent(rightlists[0].children[0].children[0],2);//填充流行歌曲列表
	iniListContent(rightlists[1].children[0].children[0],3);//填充动漫歌曲列表
	iniListContent(rightlists[2].children[0].children[0],6);//填充动漫歌曲列表	
	//初始化专辑列表
	var table=document.createElement("table");
	table.cellSpacing="0";
	table.cellPadding="0";
	 for(var i=0;i<albumAmount;i+=3){
		 var tr=document.createElement("tr");
		 var tr0=document.createElement("tr");		 
		 if(i+3<albumAmount){
		  for(var j=i;j<(i+3);j++){//每排三个
			 var albumName=jsonData.musicData[j].albumName.wipeQuotation();
			 var td=document.createElement("td"),
			 td0=document.createElement("td");
			 var txt=document.createTextNode(albumName),
			 htmlAlbumPoster="<div class='posterRelative' ><img src='"+jsonData.musicData[j].albumPoster+"' width='172px' ><div class='posterShield'><img src='images/musicPicture/addAlbum.png' class='addAlbumSongs' albumIndex='"+j+"' style='cursor:pointer' /></div></div>";
			 td0.style.paddingLeft="5px";
			 td.align="center";
			 td0.innerHTML=htmlAlbumPoster;
			 tr0.appendChild(td0);
			 td.appendChild(txt);
			 tr.appendChild(td);
			 td0.onmouseover=function(){
				 this.children[0].children[1].style.display="block";
			 }
			 td0.onmouseout=function(){
				 this.children[0].children[1].style.display="none";
			 }
		  }
		 }else {
			 while(i<albumAmount){//最后一排不足三个的情况
				 var albumName=jsonData.musicData[i].albumName.wipeQuotation();
				 var td=document.createElement("td"),
				 td0=document.createElement("td");
				 var txt=document.createTextNode(albumName),
				 htmlAlbumPoster="<div class='posterRelative' ><img src='"+jsonData.musicData[j].albumPoster+"' width='172px' ><div class='posterShield'><img src='images/musicPicture/addAlbum.png' class='addAlbumSongs' albumIndex='"+j+"' style='cursor:pointer' /></div></div>";
				 td0.style.paddingLeft="5px";
				 td.align="center";
				 td0.innerHTML=htmlAlbumPoster;
				 tr0.appendChild(td0);
				 td.appendChild(txt);
				 tr.appendChild(td);
				 table.appendChild(tr0);
				 table.appendChild(tr);
				 i++;
				 td0.onmouseover=function(){
				 this.children[0].children[1].style.display="block";
			 }
			 td0.onmouseout=function(){
				 this.children[0].children[1].style.display="none";
			 }
			 }
			 break;
		 }
		 table.appendChild(tr0);
		 table.appendChild(tr);
	 }
	 rightlists[3].children[0].children[0].appendChild(table);
	 //添加滚动条
	 var scroll=new Array(4);
	 	for(var i=0;i<rightlists.length;i++){
	  scroll[i] = new scroller("yuyan"+i+"");
	  if(i!=0)rightlists[i].style.display="none";
	}

 }
//-------------------------公用函数，根据索引生成列表内容,除了专辑列表
 function iniListContent(element,albumIndex){
	 var table=document.createElement("table");
	 table.cellSpacing="0px";
	 table.cellPadding="5px";
	 table.width="543px";
	 table.border="0px";
	 var songAmount=jsonData.musicData[albumIndex].albumSongs.length;
	 for(var i=0;i<parseInt(songAmount);i++){
		 var tr=document.createElement("tr");
		 tr.className="ListTr";
		 tr.onmouseover=function(){
		 	this.style.backgroundColor="rgba(255,255,255,0.3)";
		 }
		 tr.onmouseout=function(){
		 	this.style.backgroundColor="";
		 }
		 var td1=document.createElement("td"),
		     singerPhoto=jsonData.musicData[albumIndex].albumSongs[i].singerPhoto,
		     img1=document.createElement("img");
		     img1.style.verticalAlign="bottom";
		     img1.src=singerPhoto;
		     img1.style.height=50+"px";
		     td1.appendChild(img1);
		 var td2=document.createElement("td"),
		     songName=jsonData.musicData[albumIndex].albumSongs[i].musicName.wipeQuotation(),
		     txt=document.createTextNode(songName);
		     td2.width="368px";
		     td2.setAttribute("albumIndex",albumIndex);
		     td2.setAttribute("songIndex",i);
		     td2.appendChild(txt);
		 var td3=document.createElement("td"),
		     htmlTryListen="<img src='images/musicPicture/tryListen.png' class='try_listen' height='25px' title='试听' style='cursor:pointer' />";
		     td3.width="50px";
		     td3.innerHTML=htmlTryListen;
		 var td4=document.createElement("td"),
		     htmlAddSong="<img src='images/musicPicture/addSong.png' class='add_song' height='25px' title='添加歌曲到我的音乐' style='cursor:pointer' />";
		     td4.innerHTML=htmlAddSong;
		     
		 tr.appendChild(td1);
		 tr.appendChild(td2);
		 tr.appendChild(td3);
		 tr.appendChild(td4);
		 table.appendChild(tr);
	 }
	 element.appendChild(table);
 }
function LIST(albumIndex,songIndex){//想当于定义一个行类
	//this.number=number;//当前歌曲处于该列表第几行
	this.albumIndex=albumIndex;
	this.songIndex=songIndex;
}
//---------------------------------------------------生成音乐播放器
var progressDargging=false;//是否拖拽，将在setTimeout中用到，必须全局
var playerEndTime;
function initializePlayer(jsonData){
	 var audioEngine=new AUDIOENGINE(jsonData);
	 
	 var voice=document.getElementById("sound_or_silence"),
	 playBtns=document.getElementById("major_major").children[0],
	 previous=document.getElementById("previous"),
	 mode=audioEngine.mode,
	 next=document.getElementById("next");
	 var mySongArray=audioEngine.mySongListArray;//声明我的音乐列表数组
	    //------------点击播放按钮实现播放或暂停
	 playBtns.onclick=function(){
		 if(this.id=="play"){
			 audioEngine.toPlay("play");
			 this.id="pause";
			 }else{
				 audioEngine.toPlay("pause");
				 this.id="play";
				 }
		 this.style.backgroundImage="url(images/musicPicture/"+this.id+".png)";
	 };
	 audioEngine.importLyrics(audioEngine.jsonData.musicData[audioEngine.albumIndex].albumSongs[audioEngine.songIndex].lyricsLink);//导入歌词
	 	 for(var i=0;i<mySongArray.length;i++){//若cookie中存有歌曲则往我的音乐列表添加歌曲
	 	var myMusicTable=document.getElementById("deposit_my_songs");
	 		//---------------往我的音乐列表添加歌名	 		
	 		var albumIndex=mySongArray[i].albumIndex;
	 		var songIndex=mySongArray[i].songIndex;
	 		//alert("数组里第"+i+"个的歌曲号="+albumIndex)
	 		var songName=jsonData.musicData[albumIndex].albumSongs[songIndex].musicName;
			 var tr=document.createElement("tr"),
			 td=document.createElement("td"),
			 td1=document.createElement("td"),
			 txt=document.createTextNode(songName),
			 htmlDeleteSong="<img src='images/musicPicture/delete_song.png' height='20px' >";
			 
			 tr.onmouseover=function(){
				 var trs=myMusicTable.children;
				 for(var j=0;j<trs.length;j++){
				 	if(j!=audioEngine.playerListNumber)trs[j].style.backgroundColor="";
				 }
				 this.style.backgroundColor="rgba(255,255,255,0.2)";
			 };
			 tr.onmouseout=function(){
				 this.style.backgroundColor="";
				  highlightSongName(audioEngine.playListName,audioEngine.playerListNumber);
			 };
			 td.className="my_songs_list_member";
			 td.setAttribute("albumIndex", albumIndex);
			 td.setAttribute("songIndex", songIndex);
			 td.ondblclick=function() {//双击播放，并切换播放列表
			     if(document.getElementById("major_major").children[0].id=="play"){
			      document.getElementById("major_major").children[0].click();//点击播放按钮
			      }	
				 var playNumber=getIndex(this.parentNode);//注意此处应为tr，不是td，所以为parentNode
				 audioEngine.playerList=audioEngine.mySongListArray;
				 audioEngine.playListName="我的音乐列表";
				 var list=audioEngine.playerList;
				 albumIndex=list[playNumber].albumIndex,//当不是默认播放列表时， 更改这里，上面list数组也要改
			     songIndex=list[playNumber].songIndex;
				 audioEngine.playerListNumber=playNumber;
				 audioEngine.playByindex(albumIndex, songIndex);
			 };
			 td1.setAttribute("albumIndex", albumIndex);
			 td1.setAttribute("songIndex", songIndex);
			 td1.className="my_songs_list_delete";
			 td1.onclick=function(){
				 var deleteIndex=getIndex(this.parentNode);
				 myMusicTable.removeChild(this.parentNode);
				 audioEngine.mySongListArray.splice(deleteIndex, 1);//删除数组中的1条记录
				 var album=this.getAttribute("albumIndex");
				 var song=this.getAttribute("songIndex");
				 deleteSongFromCookie(album,song);
			 };
			 
			 td.appendChild(txt);
			 td1.innerHTML=htmlDeleteSong;
			 tr.appendChild(td);
			 tr.appendChild(td1);
			 myMusicTable.appendChild(tr);
	 }
	 adjustScrollBar("yuyan5")//调节我的播放列表的滚动杆
	 if(audioEngine.playListName=="我的音乐列表"){//判断当前播放列表是那个是否直接播放	 
	 	document.getElementById("default_List").children[1].style.display="none";
	 	var mySongListMember=getElementByClassName("my_songs_list_member",document.getElementById("deposit_my_songs"));
	 	mySongListMember[audioEngine.playerListNumber].ondblclick();//播放url歌曲
	 }else {//否则隐藏我的音乐列表
	 	document.getElementById("my_musicList").children[1].style.display="none";
	 }
	 var voiceTds=document.getElementById("voice_control").getElementsByTagName("td");
	 voice.ondblclick=function(){//静音切换
		 if(this.className=="silence"){
			 audioEngine.voice="sound";
			 this.className="sound";
			  audioEngine.adjustVolumeByIndex(5);
		 }else {
			 audioEngine.voice="silence";
			 this.className="silence";
             audioEngine.adjustVolumeByIndex(-1);
		 }
	 };
     voice.onmouseover=function(){
    	 var voiceControl=document.getElementById("voice_control"),
    	 voiceControlBar=document.getElementById("voice_control_bar");
    	 voiceControl.style.display="block";
    	// voiceControlBar.style.display="block";
     };
     voice.onmouseout=function(event){
    	 var relEvent=event || window.event;
    	 if(!this.contains(relEvent.relatedTarget || relEvent.toElement)){
        	 var voiceControl=document.getElementById("voice_control"),
        	 voiceControlBar=document.getElementById("voice_control_bar");
        	 voiceControl.style.display="none";
        	// voiceControlBar.style.display="none";
    	 }
     };
     //-----------调节音量
     var voiceControlBar=document.getElementById("voice_control_bar");

     for(var i=0;i<voiceTds.length;i++){
     	voiceTds[i].onclick=function(){
     		var n=parseInt(getIndex(this));
            audioEngine.adjustVolumeByIndex(n);
     	}
     }


	//--------------------点击播放上一首
	 previous.onclick=function(){
		 mode=Mode;
		 var playBtns=document.getElementById("major_major").children[0];
		 if(playBtns.id=="play"){
			 playBtns.id="pause";
			 playBtns.style.backgroundImage="url(images/musicPicture/"+playBtns.id+".png)";
		 }
		 audioEngine.previousSong(mode);
	 };
	//--------------------点击播放下一首
	 next.onclick=function(){
		 mode=Mode;
		 var playBtns=document.getElementById("major_major").children[0];
		 if(playBtns.id=="play"){
			 playBtns.id="pause";
			 playBtns.style.backgroundImage="url(images/musicPicture/"+playBtns.id+".png)";
		 }
		 audioEngine.nextSong(mode);
	 };
	//--------------------实现拖拽控制杆控制进度
	 var progressContronl=document.getElementById("progress_contronl");
	 var moveStartX=0,
	     mouseStarX=0,
	     mouseStopX,
	     mouseTop,
	     progressContronlTop=parseInt(getClientY(progressContronl))+document.body.scrollTop;//控制杆到网页顶部的距离
	 var moveStopX=381;
	 
	 progressContronl.onmousedown=function(event){
		 relEvent= event || window.event;
		 moveStartX=this.offsetLeft;
		 mouseStarX=relEvent.clientX+document.body.scrollLeft;
		 progressDargging=true;
	 };
	 progressContronl.onmousemove=function(event){
		 relEvent= event || window.event;
		 if(progressDargging==true){
		 mouseStopX=relEvent.clientX+document.body.scrollLeft;
		 var nowX=moveStartX+mouseStopX-mouseStarX;//当前绝对X坐标等于，起始坐标+鼠标移动的X坐标距离
		 if(nowX<-11){
			 nowX=-11;
		 }else if(nowX>381){
			 nowX=381;
		 }else {
			 this.style.left=nowX+"px";
		 }
		 }
	 };
	 progressContronl.onmouseup=function(){//放开鼠标
		 if(progressDargging==true){
		 progressDargging=false;
		 var decimals=(parseInt(this.style.left)+11)/392;
		 audioEngine.controlProgress(decimals);//跳跃当前播放进度
		 }
	 };
	 progressContronl.onmouseout=function(){
		 if(progressDargging==true){
		 progressDargging=false;
		 var decimals=(parseInt(this.style.left)+11)/392;
		 audioEngine.controlProgress(decimals);//跳跃当前播放进度
		 }
	 };
	//-----------实现一首歌播放结束，跳转到下一首歌
	 playerEnd();
   //----------实现点击默认播放列表里的歌曲名播放歌曲
	 var defaultSongs=getElementByClassName("default_list_member",document.getElementById("default_all_songs"));
	for(var i=0;i<defaultSongs.length;i++){
		defaultSongs[i].ondblclick=function(){//双击播放歌曲
		 if(document.getElementById("major_major").children[0].id=="play"){
			 document.getElementById("major_major").children[0].click();//点击播放按钮
			 }	 
			playNumber=getIndex(this.parentNode);//注意此处应为tr，不是td，所以为parentNode
			audioEngine.playerList=audioEngine.defaultListArray;
			audioEngine.playListName="默认播放列表";
			 var list=audioEngine.playerList;
			 albumIndex=list[playNumber].albumIndex,
		     songIndex=list[playNumber].songIndex;
			 audioEngine.playerListNumber=playNumber;
			 audioEngine.playByindex(albumIndex, songIndex);
		};
	}
	var deleteSong=getElementByClassName("default_list_delete",document.getElementById("default_all_songs"));
	var defaultTable=document.getElementById("table_default");
	for(var i=0;i<deleteSong.length;i++){
		deleteSong[i].onclick=function(){//删除歌曲
			 var deleteIndex=getIndex(this.parentNode);//获得该行tr的序号
			 defaultTable.removeChild(defaultTable.children[deleteIndex]);
			 audioEngine.defaultListArray.splice(deleteIndex, 1);//删除数组中的记录
		};
	}
	highlightSongName(audioEngine.playListName,audioEngine.playerListNumber);//突出显示该行歌词
	//----------------------------点击三个列表旁边的试听按钮
	 var threeList=getElementByClassName("try_listen",document.getElementById("musicList_content"));
	 for(var i=0;i<threeList.length;i++){
		threeList[i].onclick=function(){
			var albumIndex=this.parentNode.previousSibling.getAttribute("albumIndex"),
			songIndex=this.parentNode.previousSibling.getAttribute("songIndex");
			audioEngine.playByindex(albumIndex, songIndex);
		};
	 }
	 //-----------------切换播放列表
	 var defaultList=document.getElementById("default_List");
	 var myMusicList=document.getElementById("my_musicList");
	 defaultList.children[0].onclick=audioEngine.tooglePlayerList;//点击实现切换播放列表
	 myMusicList.children[0].onclick=audioEngine.tooglePlayerList;
	 //--------------------------------------------------------------------------------实现默认播放列表鼠标经过显示背景色	 
		 var songs=getElementByClassName("default_list_member",document.getElementById("default_all_songs"));//取得所有的行
		 for(var i=0;i<songs.length;i++){
		 	songs[i].parentNode.onmouseover=function(){	
		 		for(var j=0;j<songs.length;j++){
		 			if(j!=audioEngine.playerListNumber)songs[j].parentNode.style.backgroundColor="";
		 		}
				  this.style.backgroundColor="rgba(255,255,255,0.2)";			
		 	}
		 	songs[i].parentNode.onmouseout=function(){
			 this.style.backgroundColor="";
			  highlightSongName(audioEngine.playListName,audioEngine.playerListNumber);
		 };
		 }

	 //---------------------------------------------------dia添加按钮添加歌曲
	 var addSongList=getElementByClassName("add_song",document.getElementById("musicList_content"));
	 
	 var addAlbumList=getElementByClassName("addAlbumSongs",document.getElementById("musicList_content"));
	 
	 var myMusicTable=document.getElementById("deposit_my_songs");//用于存放我的音乐的表格
	 for(var i=0;i<addSongList.length;i++){
		 addSongList[i].onclick=function (){//监控坐标三个列表的所有的添加歌曲事件
		 if(document.getElementById("default_List").children[1].style.display !="none"){
		     document.getElementById("my_musicList").children[0].click();
			 }
			 var length=mySongArray.length,
			 isExit=false,
			 albumIndex=this.parentNode.previousSibling.previousSibling.getAttribute("albumIndex"),
			 songIndex=this.parentNode.previousSibling.previousSibling.getAttribute("songIndex"),
			 songName=this.parentNode.previousSibling.previousSibling.innerHTML;
			 for(var i=0;i<length;i++){//判断是否已经存在
				 if(mySongArray[i].albumIndex==albumIndex&&mySongArray[i].songIndex==songIndex){isExit=true;}
			 }
			 if(!isExit){//当不存在当前要添加的歌曲时				 
			//-------往我的音乐列表添加歌名
			 var tr=document.createElement("tr"),
			 td=document.createElement("td"),
			 td1=document.createElement("td"),
			 txt=document.createTextNode(songName),
			 htmlDeleteSong="<img src='images/musicPicture/delete_song.png' height='20px' >";
			 
			 tr.onmouseover=function(){
				 var trs=myMusicTable.children;
				 for(var j=0;j<trs.length;j++){
					 if(j!=audioEngine.playerListNumber)trs[j].style.backgroundColor="";
				 }
				 this.style.backgroundColor="rgba(255,255,255,0.2)";
			 };
			 tr.onmouseout=function(){
				 this.style.backgroundColor="";
				  highlightSongName(audioEngine.playListName,audioEngine.playerListNumber);
			 };
			 td.className="my_songs_list_member";
			 td.setAttribute("albumIndex", albumIndex);
			 td.setAttribute("songIndex", songIndex);
			 //td.style.backgroundColor="red";
			 td.ondblclick=function() {//双击播放，并切换播放列表
			     if(document.getElementById("major_major").children[0].id=="play"){
			      document.getElementById("major_major").children[0].click();//点击播放按钮
			      }	
				 var playNumber=getIndex(this.parentNode);//注意此处应为tr，不是td，所以为parentNode
				 audioEngine.playerList=audioEngine.mySongListArray;
				 audioEngine.playListName="我的音乐列表";
				 var list=audioEngine.playerList;
				 albumIndex=list[playNumber].albumIndex,//当不是默认播放列表时， 更改这里，上面list数组也要改
			     songIndex=list[playNumber].songIndex;
				 audioEngine.playerListNumber=playNumber;
				 audioEngine.playByindex(albumIndex, songIndex);
			 };
			 td1.setAttribute("albumIndex", albumIndex);
			 td1.setAttribute("songIndex", songIndex);
			 td1.className="my_songs_list_delete";
			 td1.onclick=function(){//删除歌曲
				 var deleteIndex=getIndex(this.parentNode);
				 myMusicTable.removeChild(this.parentNode);
				 audioEngine.mySongListArray.splice(deleteIndex, 1);//删除数组中的记录
				 var album=this.getAttribute("albumIndex");
				 var song=this.getAttribute("songIndex");
				 deleteSongFromCookie(album,song);
			 };
			 
			 td.appendChild(txt);
			 td1.innerHTML=htmlDeleteSong;
			 tr.appendChild(td);
			 tr.appendChild(td1);
			 myMusicTable.appendChild(tr);
			 audioEngine.mySongListArray[length]=new LIST(albumIndex,songIndex);//往数组尾部添加list对象
			 audioEngine.addSongToCookie(albumIndex,songIndex);
			 }else {
				 alert("当前歌曲已存在");
			 }
			 adjustScrollBar("yuyan5");	
		 }

	 }
	 //-------------------------------------------添加专辑到我的音乐列表
	 	for(var i=0;i<addAlbumList.length;i++){
		 addAlbumList[i].onclick=function (){//监控坐标三个列表的所有的添加歌曲事件
		 	if(document.getElementById("default_List").children[1].style.display !="none"){
		     document.getElementById("my_musicList").children[0].click();
			 }
			 var length=mySongArray.length,
			 isExit=false,
			 albumIndex=this.getAttribute("albumIndex");
			
			 for(var k=0;k<length;k++){//判断是否已经存在
				 if(mySongArray[k].albumIndex==albumIndex){isExit=true;}
			 }
			 if(!isExit){//当不存在当前要添加的专辑时
			 var songsCount=parseInt(audioEngine.jsonData.musicData[albumIndex].albumSongs.length);//该专辑具有的歌曲数
			 for(m=0;m<songsCount;m++){ //循环该专辑的每个列表
			 var songIndex=m,
			 songName=audioEngine.jsonData.musicData[albumIndex].albumSongs[m].musicName.wipeQuotation();
				
			//-------往我的音乐列表添加歌名
			 var tr=document.createElement("tr"),
			 td=document.createElement("td"),
			 td1=document.createElement("td"),
			 txt=document.createTextNode(songName),
			 htmlDeleteSong="<img src='images/musicPicture/delete_song.png' height='20px' >";
			 tr.onmouseover=function(){
				 var trs=myMusicTable.children;
				 for(var j=0;j<trs.length;j++){
					 if(j!=audioEngine.playerListNumber)trs[j].style.backgroundColor="";				
				 }
				 this.style.backgroundColor="rgba(255,255,255,0.2)";
			 };
			 tr.onmouseout=function(){
				 this.style.backgroundColor="";
				  highlightSongName(audioEngine.playListName,audioEngine.playerListNumber);
			 };
			 td.className="my_songs_list_member";
			 td.setAttribute("albumIndex", albumIndex);
			 td.setAttribute("songIndex", songIndex);
			 //td.style.backgroundColor="red";
			 td.ondblclick=function() {//双击播放，并切换播放列表
				 var playNumber=getIndex(this.parentNode);//注意此处应为tr，不是td，所以为parentNode
				 audioEngine.playerList=audioEngine.mySongListArray;
				 audioEngine.playListName="我的音乐列表";
				 var list=audioEngine.playerList;
				 albumIndex=list[playNumber].albumIndex,//当不是默认播放列表时， 更改这里，上面list数组也要改
			     songIndex=list[playNumber].songIndex;
				 audioEngine.playerListNumber=playNumber;
				 audioEngine.playByindex(albumIndex, songIndex);

			 };
			 td1.setAttribute("albumIndex", albumIndex);
			 td1.setAttribute("songIndex", songIndex);
			 td1.className="my_songs_list_delete";
			 td1.onclick=function(){
				 var deleteIndex=getIndex(this.parentNode);
				 var thisTr=this.parentNode;
				 myMusicTable.removeChild(thisTr);
				 audioEngine.mySongListArray.splice(deleteIndex, 1);//删除数组中的记录
				 var album=this.getAttribute("albumIndex");
				 var song=this.getAttribute("songIndex");
				 deleteSongFromCookie(album,song);
			 };
			 
			 td.appendChild(txt);
			 td1.innerHTML=htmlDeleteSong;
			 tr.appendChild(td);
			 tr.appendChild(td1);
			 myMusicTable.appendChild(tr);
			  audioEngine.mySongListArray[length]=new LIST(albumIndex,songIndex);//往数组尾部添加list对象
			  audioEngine.addSongToCookie(albumIndex,songIndex);//往cookie中添加歌曲
			 length++;
			 }
			 }else {
				 alert("当前专辑已存在");
			 }
			 adjustScrollBar("yuyan5");
		 }

	 
		 }
	 	var te5 = new scroller("yuyan5");
	 //----------全屏功能
	 document.getElementById("full_screen_button").onclick=function(){
		 audioEngine.fullScreen(audioEngine.jsonData,audioEngine.albumIndex,audioEngine.songIndex);
	 };
}
//------------------------------------设为全局，监测当前歌曲是否播放结束
function playerEnd(){
	var musicPlayer=document.getElementById("musicEngine");
	if(musicPlayer.ended){
		clearInterval(playerEndTime);
		document.getElementById("next").click();
	}
	playerEndTime=setTimeout("playerEnd()",50);
}
//---------------------------------------------------创建播放器引擎
 function AUDIOENGINE(jsonData){
	 var musicEngine=document.createElement("audio");
	 var songNameDiv=document.getElementById("show_Song_Name");
	 musicEngine.id="musicEngine";
	 document.getElementById("musicPlayer_right").appendChild(musicEngine);
	 this.jsonData=jsonData;
	 
	 this.musicPlayer=document.getElementById("musicEngine");
	 this.voice="sound";
	 this.mode=Mode;
	 //应用列表相关信息
	 var formatlist=new FORMATlIST(jsonData);//
	 this.defaultListArray=formatlist.defaultListArray;
	 this.mySongListArray=new Array();
	 this.playerList=this.defaultListArray;//当前播放列表数组等于默认播放列表数组
	 this.playListName="默认播放列表";
	 this.playerListNumber=0;//当前歌曲位于当前列表的第几首
	 var Request =GetRequest();//获取超级链接后面的参数
     var albumIndex=Request['albumIndex'];
     var songIndex=Request['songIndex'];
     this.albumIndex=0;
	 this.songIndex=0;
     if(albumIndex==undefined||songIndex==undefined){
     	var songCount=getCookieFun("songCount");
     	if(songCount!=null){
     		for(var i=0;i<songCount;i++){//初始化我的播放列表数组
	         	var fakeCookList=getCookieFun(i).split(":");
	         	var cookAlbumIndex=fakeCookList[0];
	         	var cookSongIndex=fakeCookList[1];
	         	var cookList=new LIST(cookAlbumIndex,cookSongIndex);
	         	this.mySongListArray[i]=cookList;
	         }
     	}
	         //SetCookieFun("songCount",0);
     }else {//需要播放url传过来的歌曲时
     	 var songCount=0;	 
	         this.addSongToCookie(albumIndex,songIndex);
	         songCount=parseInt(getCookieFun("songCount"));
	         for(var i=0;i<songCount;i++){//初始化我的播放列表数组
	         	var fakeCookList=getCookieFun(i).split(":");
	         	var cookAlbumIndex=fakeCookList[0];
	         	var cookSongIndex=fakeCookList[1];
	         	var cookList=new LIST(cookAlbumIndex,cookSongIndex);
	         	this.mySongListArray[i]=cookList;
	         }
	         this.playListName="我的音乐列表";
	         this.albumIndex=albumIndex;
	         this.songIndex=songIndex;
	         this.playerListNumber=getSongIndexFromCookie(albumIndex,songIndex);        
     } 
	 //cookie处理完成
	//显示一些歌曲数据
	 this.singerPhotoDiv=document.getElementById("major_singer");//显示歌手图片
	 this.singerPhotoUrl=jsonData.musicData[this.albumIndex].albumSongs[this.songIndex].singerPhoto;
	 if(this.singerPhotoUrl!=""){//当前歌手照片不为空时
	 this.singerPhotoDiv.style.backgroundImage="url("+this.singerPhotoUrl+")";
	 }
	 this.songName=jsonData.musicData[this.albumIndex].albumSongs[this.songIndex].musicName;
	 songNameDiv.innerHTML=this.songName.wipeQuotation();//显示歌名
	 this.musicPlayer.src=jsonData.musicData[this.albumIndex].albumSongs[this.songIndex].musicLink;
	 this.musicPlayer.addEventListener("canplaythrough",function(){//监听是否播放流畅，流畅的话影藏载入歌词div
		 document.getElementById("load_lyrics").style.display="none";
	 });
 }
 //-----------------------往cookie中添加歌曲
  AUDIOENGINE.prototype.addSongToCookie=function(albumIndex,songIndex){
  	     	 var songCount=0;
     	if(getCookieFun("songCount")!=null){//检查Cookie之前是否有保存歌曲
     		songCount=parseInt(getCookieFun("songCount"));
     	}   	
	         var fakeList=albumIndex+":"+songIndex;
	         var judge=parseInt(getSongIndexFromCookie(albumIndex,songIndex));
	         if(-1==judge){//当cookie中未存当前歌曲时,保存当前歌曲	         	
	         SetCookieFun(songCount,fakeList);//保存歌曲专辑号和歌曲号到Cookie	         
	         songCount++;
	         SetCookieFun("songCount",songCount);//曾加歌曲总数到Cookie
	         }	        
  }
//------------------------实现引擎播放功能
 AUDIOENGINE.prototype.toPlay=function(playorpause){
	 if(this.musicPlayer.src===""){
		this.playByindex(this.albumIndex,this.songIndex);
	 }
	 if(playorpause==="play"){
		 this.musicPlayer.play();
		 this.playProgress(playorpause);//进度条开始增加
	 }
	 if(playorpause==="pause"){
		 this.musicPlayer.pause();
		 this.playProgress(playorpause);
	 }
 };
//------------------------根据索引播放歌曲
 AUDIOENGINE.prototype.playByindex=function(albumIndex,songIndex){
	 var jsonData=this.jsonData;
	 var songNameDiv=document.getElementById("show_Song_Name");
	 var loadLyricsDiv=document.getElementById("load_lyrics");
	 this.albumIndex=albumIndex;
	 this.songIndex=songIndex;
	 this.singerPhotoUrl=jsonData.musicData[this.albumIndex].albumSongs[this.songIndex].singerPhoto;
	 if(this.singerPhotoUrl!=""){
	 this.singerPhotoDiv.style.backgroundImage="url("+this.singerPhotoUrl+")";
	 }else {
		 this.singerPhotoDiv.style.backgroundImage="url('images/musicPicture/function_singer.png')";
	 }
	 this.songName=jsonData.musicData[this.albumIndex].albumSongs[this.songIndex].musicName;
	 songNameDiv.innerHTML="<span>"+this.songName.wipeQuotation()+"</span>";
	 var moveValue=songNameDiv.childNodes[0].offsetWidth-songNameDiv.offsetWidth//取得歌名需要移动的范围
	 clearTimeout(moveSongNameTimer);
	 moveSongName(songNameDiv,moveValue);//移动过长的歌名
	 this.musicPlayer.src=jsonData.musicData[this.albumIndex].albumSongs[this.songIndex].musicLink;//加入歌曲
	 loadLyricsDiv.style.display="block";//显示载入歌词
	 this.importLyrics(jsonData.musicData[this.albumIndex].albumSongs[this.songIndex].lyricsLink);//导入歌词
	//alert(this.albumIndex+"chulai"+this.songIndex+"src="+this.musicPlayer.src);
	 
	 highlightSongName(this.playListName,this.playerListNumber);
	 this.toPlay("play");
 }; 
 //根据索引调节音量 -1是静音，5是最大
AUDIOENGINE.prototype.adjustVolumeByIndex=function(index){
	var n=parseInt(index);
	var voiceTds=document.getElementById("voice_control").getElementsByTagName("td");
	if(n==5){
		this.musicPlayer.muted=false;
	}else if(n==-1){
		this.musicPlayer.muted=true;
	}else {
	     	var setVolume=(n+1)*0.2;
     		this.musicPlayer.volume=setVolume;
     		for(j=0;j<voiceTds.length;j++){
     			if(j<=n){voiceTds[j].style.backgroundColor="white";
     			}else {
     				voiceTds[j].style.backgroundColor="gray";
     			}
     		}
     	}
}
 //-------------------------移动过长的歌名
 var moveSongNameTimer,
 move=1;
function moveSongName(outDiv,moveValue){
	if(moveValue>10){		
	var moveValue=parseInt(moveValue);
	if(outDiv.scrollLeft<=0||outDiv.scrollLeft>=moveValue){
		move=-move;
	}
	outDiv.scrollLeft +=move;
	moveSongNameTimer=setTimeout(function(){moveSongName(outDiv,moveValue)},50);
	}
}

//------------------------显示播放进度
 var runTime;//控制进度条的全局变量，由于是要在setTimeout中使用，所以必须全局；
 AUDIOENGINE.prototype.playProgress=function(playorpause){
    if(playorpause==="play"){
    	startTime();
    }else {
    	clearTimeout(runTime);
    }
 };
 
 function startTime(){//设为全局，显示播放进度
	 var musicPlayer=document.getElementById("musicEngine");
	 var progressImg=document.getElementById("progress_bar").children[0];
	 var progressContronl=document.getElementById("progress_contronl");
	 var timeAll,currentTime,percentage;
	   	timeAll=musicPlayer.duration;
	   	currentTime=musicPlayer.currentTime;
	   	percentage=(currentTime/timeAll);
	   	
	   	progressImg.style.width=parseInt(percentage*100)+"%";
//	   	var div=document.getElementById("show_lyrics");
//	   	alert("------uuuuuuuuuuuuu---"+div.scrollTop);
	   	lyricsRolling(currentTime,timeAll);//歌词滚动
	   	
	   	if(progressDargging==false){
	       if(percentage*400<=3){//防止图标移动数度跟进度条之间出现断痕，与下面的-13接应
	       	progressContronl.style.left="-11px";//播放进去控制杆跟着播放进度移动
	       }else 
	    	   if(percentage*400>=400){//此次判断可不写
	       	progressContronl.style.left="381px";
	       }else {
	       	progressContronl.style.left=(percentage*392-13)+"px";//本来是减11的但是
	       }
	       }
		  runTime=setTimeout("startTime()",50);
	}
//------------------------播放进度调节
 AUDIOENGINE.prototype.controlProgress=function(percent){
			 var timeAll=this.musicPlayer.duration;
			 newTime=timeAll*percent;
			 this.musicPlayer.currentTime=newTime;//调整当前播放的时间
			 if(document.getElementById("major_major").children[0].id=="play"){
			 document.getElementById("major_major").children[0].click();//点击播放按钮
			 }
			 adjustLyricsByTime(newTime);//调节歌词进度
			 adjustScreenLyricsByTime(newTime);//调节全屏歌词
 };
//------------------------上一曲。参数为，播放模式
 AUDIOENGINE.prototype.previousSong=function(mode){
	 var playNumber=this.playerListNumber;
	 var list=this.playerList;//获取播放列表数组
	 var lstNumber=list.length-1;//当前列表最后一首歌的序列号
	 var albumIndex,
	     songIndex;
	 if(mode=="顺序播放"){
		 if(playNumber<=0){ //当前歌曲为当前列表的第一首时
            //什么都不用做
		 }else {
			 playNumber--;
		 }
	 }else if(mode=="列表循环"){
		 if(playNumber<=0){ //当前歌曲为当前列表的第一首时
			 playNumber=lstNumber;
		 }else {
			 playNumber--;
		 }
	 }else if(mode=="单曲循环"){
              //albumIndex不用变化
	 }else if(mode=="随机播放"){
	 	var n=Math.random()*lstNumber;
	 	if(parseInt(n+0.5)>parseInt(n)) playNumber=parseInt(n+0.5);
	 	else playNumber=parseInt(n);
	 }
	 albumIndex=list[playNumber].albumIndex,//当不是默认播放列表时， 更改这里，上面list数组也要改
     songIndex=list[playNumber].songIndex;
	 this.playerListNumber=playNumber;
	 this.playByindex(albumIndex, songIndex);
 };
//------------------------下一曲。参数为，模式
 AUDIOENGINE.prototype.nextSong=function(mode){
	 var playNumber=this.playerListNumber;
	 var list=this.playerList;//获取播放列表数组
	 var lstNumber=list.length-1;//当前列表最后一首歌的序列号
	 var albumIndex,
	     songIndex;
	 var playOrpause=false;
	 //播放器已经初始化时
	 if(mode=="顺序播放"){
		 if(playNumber>=lstNumber){ //当前歌曲为当前列表的最后一首时
			 //停止播放器
			 playNumber=0;
			 playOrpause=true;
		 }else {
			 playNumber++;
		 }
	 }else if(mode=="列表循环"){
		 if(playNumber>=lstNumber){ //当前歌曲为当前列表的第一首时
			 playNumber=0;
		 }else {
			 playNumber++;
		 }
	 }else if(mode=="单曲循环"){
		//albumIndex不用变化
		 //alert(mode+""+);
	 }else if(mode=="随机播放"){
	 	var n=Math.random()*lstNumber;
	 	if(parseInt(n+0.5)>parseInt(n)) playNumber=parseInt(n+0.5);
	 	else playNumber=parseInt(n);
	 	//playNumber=parseInt(Math.random()*lstNumber);
	 }
	 albumIndex=list[playNumber].albumIndex,
     songIndex=list[playNumber].songIndex;
	 this.playerListNumber=playNumber;//更新播放为第几行的歌
	 this.playByindex(albumIndex, songIndex);
	 if(playOrpause){
	 	document.getElementById("major_major").children[0].onclick();
	 }
 };
//---------------------------------------------------实现点击我的音乐与默认播放列表之间的切换
 AUDIOENGINE.prototype.tooglePlayerList= function() {
	 var defaultList=document.getElementById("default_List");
	 var myMusicList=document.getElementById("my_musicList");
		 if(defaultList.children[1].style.display=="none"){
			 defaultList.children[1].style.display="block";//默认播放列表内容显示
			 //document.getElementById("retract").innerHTML="";
			 document.getElementById("retract").style.backgroundImage="url(images/musicPicture/retract.png)";
			 myMusicList.children[1].style.display="none";//我的音乐列表内容隐藏
			// document.getElementById("expand").innerHTML="";
			 document.getElementById("expand").style.backgroundImage="url(images/musicPicture/expand.png)";
		 }else {  
			 defaultList.children[1].style.display="none";
			// document.getElementById("retract").innerHTML="";
			 document.getElementById("retract").style.backgroundImage="url(images/musicPicture/expand.png)";
			 myMusicList.children[1].style.display="block";//我的音乐列表内容显示
			// document.getElementById("expand").innerHTML="";
document.getElementById("expand").style.backgroundImage="url(images/musicPicture/retract.png)";
		 }
 };
//------------------------全屏显示
 AUDIOENGINE.prototype.fullScreen=function (jsonData,albumIndex,songIndex){//当前对象不是audio而是div
	 var shield=document.getElementById("shield");
	 var showLyrics=document.getElementById("full_screen_lyrics");
	 shield.style.width=document.documentElement.clientWidth+"px";
	 shield.style.height=document.documentElement.clientHeight+"px";
	 shield.style.lineHeight=shield.style.height+"px";
	 var shieldHeight=parseInt(shield.style.height);
	 showLyrics.style.marginTop=(shieldHeight-576)/2+"px";
	 shield.style.display="block";
	 showLyrics.style.display="block";
	 var fileName=jsonData.musicData[albumIndex].albumSongs[songIndex].lyricsBackImages,
	 bindex=1;    
	 amounts=jsonData.musicData[albumIndex].albumSongs[songIndex].BackgroundAmounts;
	   
	 changeLyricsBack(fileName,bindex,amounts);//更换背景图片
	 
	 document.getElementById("exit_full_screen_button").onclick=function(){//退出全屏
		  clearTimeout(fullTime);//不再换背景
	      shield.style.display="none";
	      showLyrics.style.display="none";
	      
	 };
 };
 var fullTime;
function changeLyricsBack(file,index,amounts){
	 var showLyrics=document.getElementById("full_screen_lyrics");
	 showLyrics.style.backgroundImage="url(images/musicPicture/lyricsImages/"+file+"/"+index+".jpg)";
	 if(index==amounts){
		 index=1;
	 }else {
		 index++;
	 } 
	 fullTime=setTimeout(function(){changeLyricsBack(file,index,amounts);},5000);
}
//------------------------导入歌词
 AUDIOENGINE.prototype.importLyrics=function(lrcUrl){
	 var showLyricsDiv=document.getElementById("show_lyrics");
	 var xmlhttp,
	 lrcVal,
	 lrcArray=[],//歌词数组
	 lrcTimeArray=[],//时间数组
	 htmlP="",
	 musicName,
	 singer;
	 if(showLyricsDiv.style.marginTop!=0){showLyricsDiv.style.marginTop=0;document.getElementById("full_show_lyrics").style.marginTop=0;}//解决点击下一曲歌词没有最初显示第一行
	 
	 loadLrc(lrcUrl);
	 
	 function loadLrc(url){
		 if(url===""){
			 showLyricsDiv.innerHTML="<div class=\"no_lrc\">没有搜素到歌词</div>";
		 }else {
			 xmlhttp=null;
			 if(window.XMLHttpRequest){
				 xmlhttp=new XMLHttpRequest();
			 }
			 else if(window.ActiveXObject){
				 xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
			 }
			 if(xmlhttp!=null){
				 xmlhttp.onreadystatechange=getXMLHttpData;
				 xmlhttp.open("get", url, true);
				 xmlhttp.send(null);
			 }else {
				 alert("xmlhttp,未获得");
			 }
		 }
	 }
	 function getXMLHttpData(){
		 if(xmlhttp.readyState===4){
			 if(xmlhttp.status===0 || xmlhttp.status===200){
				 lrcVal=xmlhttp.responseText.replace(/\[\d\d:\d\d.\d\d]/g, "");
//				 lrcVal=encodeURI(xmlhttp.responseText);
//				 alert(lrcVal);
//				 alert(decodeURI(lrcVal));
				 lrcArray=lrcVal.split("\n");//根据换行，将没行的歌词存入数组
				 lrcArray[0].replace(/\[\w\w\:(.*?)\]/g,function(){//ti,ar,al,offset
					 musicName=arguments[1] || "暂无";
				 });
				 lrcArray[1].replace(/\[\w\w:(.*?)\]/g,function(){
					 singer=arguments[1] || "暂无";
				 });
				 htmlP +="<p class=\"lrc_line\" data_timeLine=\"0\" ><span class=\"mr15\">歌曲："+musicName+"</span>&nbsp;歌手："+singer+"</p>";
			     lrcArray.splice(0,4);//将歌词上面的行去掉,从第0项开始，删除4个项
			     xmlhttp.responseText.replace(/\[(\d*):(\d*)([\.|\:]\d*)\]/g, function(){//将所有的分钟都化成秒，并放入时间数组lrcTimeArray
			    	 var min=arguments[1] | 0,
			    	     sec=arguments[2] | 0,
			    	     realMin=min*60+sec;
			    	 lrcTimeArray.push(realMin);//初始化时间数组，往数组末尾添加realMin
			     });
			     //开始放入歌词
			     for(var i=0;i<lrcTimeArray.length;i++){
			    	 htmlP +="<p class=\"lrc_line\" data_timeLine=\""+lrcTimeArray[i]+"\">"+lrcArray[i]+"</p>";
			     }
			     showLyricsDiv.innerHTML=htmlP;
			     document.getElementById("full_show_lyrics").innerHTML=htmlP;//往全屏窗口显示歌词
			 }else {
				 alert("获取歌词出错，可能路径问题");
			 }
		 }
	 }

 };
 //-----------------------让歌词滚动
 function lyricsRolling(currentTime,allTime){
	 currentTime=parseInt(currentTime);
	 var lrcDiv=document.getElementById("show_lyrics"),
	     allLinesP=lrcDiv.getElementsByTagName("p"),
	     allLinges=allLinesP.length;
	 //--------全屏显示的
	 var fullLrcDiv=document.getElementById("full_show_lyrics"),
     fullAllLinesP=fullLrcDiv.getElementsByTagName("p");
	 
	 var lrcRollTimer,
	     nowIndex,
	     preIndex,
	     fullpreIndex,
	     top = parseInt(lrcDiv.style.marginTop) || 0,
	     fullTop=parseInt(fullLrcDiv.style.marginTop) || 0;
	     
	 for(var i=0;i<allLinges;i++){//-----------遍历每一行的歌词
		 var dataTimeLine=parseInt(allLinesP[i].attributes["data_timeLine"].nodeValue);
		 if(currentTime>0&&currentTime===dataTimeLine){
			 nowIndex=i;
			 if(i!=0){
				 allLinesP[i-1].className="lrc_line";
				 fullAllLinesP[i-1].className="lrc_line";
			 }
			 allLinesP[i].className="pLrcColor";//变色
			 fullAllLinesP[i].className="pLrcColor";
			 //-----------开始滚动歌词
			 if(preIndex!=i&&i>3&&i<allLinges-3){//如果已经换行，并且已经达到第四行，开始滚动
				 preIndex=i;//现在该换行了，记录当前的行号
				 top -=40;//上移40
				 if(top<(-nowIndex+3)*40){//如果上边距大于当前行到顶部的边距，3代表有三行的歌词并不需要移动歌词
					 top=(-nowIndex+3)*40;
				 }
				 lrcDiv.style.marginTop =top + "px";
             }
			 if(fullpreIndex!=i&&i>6&&i<allLinges-6){//同样的方法对全屏的歌词显示
				 fullpreIndex=i;//
				 fullTop -=40;
				 if(fullTop<(-nowIndex+6)*40){//如果上边距大于当前行到顶部的边距，6代表有6行的歌词并不需要移动歌词
					 fullTop=(-nowIndex+6)*40;
				 }
				 fullLrcDiv.style.marginTop =fullTop + "px";
			 }
		 }
	 }
 }
 //-----------------------调整进度后自动跳转到相应的歌词
 function adjustLyricsByTime(currentTime){
	 var index,t,marginTop,locationIndex,
	 currentTime=parseInt(currentTime),//当前跳转的时间点不一定有歌词
	 lrcDiv=document.getElementById("show_lyrics"),
     allLinesP=lrcDiv.getElementsByTagName("p"),
     allLinges=allLinesP.length;
	 for(var i=0;i<allLinges;i++){//-----------遍历每一行的歌词
		 var dataTimeLine=parseInt(allLinesP[i].attributes["data_timeLine"].nodeValue);
		 if(currentTime<dataTimeLine){//找到最接近当前歌词的时间
			 currentTime=parseInt(allLinesP[i-1].attributes["data_timeLine"].nodeValue);
			 locationIndex=i-1;//定位歌曲到的行号为
			 break;
		 }
		 }
	 if(locationIndex>3&&locationIndex<allLinges-3){//当前定位到的序列号处于第四行到倒数第四行之间的行时
		 marginTop=(-locationIndex+3);
     }else if(locationIndex<=3){
    	 marginTop=0;
     }else if(locationIndex>=allLinges-3){
    	 marginTop=-allLinges+4;
     }
	 lrcDiv.style.marginTop =marginTop*40 + "px";
	 for(var i=0;i<allLinges;i++){//清除所有 有颜色的行
		 allLinesP[i].className="lrc_line";
	 }
	 allLinesP[locationIndex].className="pLrcColor";
	 //alert("调节完成")
 }
  //-----------------------调整进度后全屏歌词自动跳转到相应的歌词
 function adjustScreenLyricsByTime(currentTime){
	 var index,t,marginTop,locationIndex,
	 currentTime=parseInt(currentTime),//当前跳转的时间点不一定有歌词
	 lrcDiv=document.getElementById("full_show_lyrics"),
     allLinesP=lrcDiv.getElementsByTagName("p"),
     allLinges=allLinesP.length;
	 for(var i=0;i<allLinges;i++){//-----------遍历每一行的歌词
		 var dataTimeLine=parseInt(allLinesP[i].attributes["data_timeLine"].nodeValue);
		 if(currentTime<dataTimeLine){//找到最接近当前歌词的时间
			 currentTime=parseInt(allLinesP[i-1].attributes["data_timeLine"].nodeValue);
			 locationIndex=i-1;//定位歌曲到的行号为
			 break;
		 }
		 }
	 if(locationIndex>6&&locationIndex<allLinges-6){//当前定位到的序列号处于第六行到倒数第六行之间的行时
		 marginTop=(-locationIndex+6);
     }else if(locationIndex<=6){
    	 marginTop=0;
     }else if(locationIndex>=allLinges-6){
    	 marginTop=-allLinges+6;
     }
	 lrcDiv.style.marginTop =marginTop*40 + "px";
	 for(var i=0;i<allLinges;i++){//清除所有 有颜色的行
		 allLinesP[i].className="lrc_line";
	 }
	 allLinesP[locationIndex].className="pLrcColor";
 }
 function highlightSongName(listName,num){//更改歌曲名，与序号突出显示该歌名
	 var songs;
	 if(listName=="默认播放列表"){
		 songs=getElementByClassName("default_list_member",document.getElementById("default_all_songs"));//取得所有的行
	 }else if(listName=="我的音乐列表"){
		 songs=getElementByClassName("my_songs_list_member",document.getElementById("my_songs"));
	 }
	 for(var i=0;i<songs.length;i++){
		 songs[i].parentNode.style.backgroundColor="";
	 }
	
	 songs[num].parentNode.style.backgroundColor="rgba(255,255,255,0.5)";
 }
 /***********************************一些公用方法****************************************/
//----获得当前元素是同等级元素中的第几个-1,即序列号，从0开始
 function getIndex(telement){
	 var x=0;
	 var element=telement;
	 while(element.previousElementSibling!=null){
		 element=element.previousElementSibling;
		 x++;
	 }
	 return x;
 }
String.prototype.wipeQuotation=function(){//去除字符串前后的单引号
	return this.replace(/^[']?/, "").replace(/[']?$/, "");
};
//---在具有相同父元素的标签里面找具有相同className的子元素
function getElementByClassName(sameName,sameParentNode){
	var start=0;
	var elements=[];
	recursion(sameName,sameParentNode);
	
	function recursion(sameName,sameParentNode){
		var children=sameParentNode.children;
		for(var i=0;i<children.length;i++){
			if(children[i].className==sameName){
				elements[start]=children[i];
				start++;
			}
			if(children[i].children.length>0){//查看是否有孩子节点
				recursion(sameName,children[i]);//递归查询孩子节点
			};
		};
	}

	return elements;
}
//----------------------------------------------------------获得当前url参数值
/*使用方法：
 var Request = new Object();
Request = GetRequest();
var my=Request['yuyan'];
 * */
function GetRequest() {
   var url = location.search; //获取url中"?"符后的字串
   var theRequest = new Object();
   if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      strs = str.split("&");
      for(var i = 0; i < strs.length; i ++) {
         theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
      }
   }
   return theRequest;
}

//--------获得某元素到页面顶部的距离，即Y坐标
 function getClientY(element){
	 var y=0;
	 do{
		 y+=element.offsetTop;
		 element=element.offsetParent;
	 }while(element.tagName!="BODY");
	 return y;
 };
 //------------------------对Cookie的操作开始{
function SetCookieFun(name,value)//两个参数，一个是cookie的名子，一个是值 
{ 
    var Days = 30; //此 cookie 将被保存 30 天 
    var exp  = new Date();    //new Date("December 31, 9998"); 
    exp.setTime(exp.getTime() + Days*24*60*60*1000); 
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString(); 
} 
//取cookies函数   
function getCookieFun(name)     
{ 
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)")); 
     if(arr != null) return unescape(arr[2]); return null; 

} 
//删除cookie 
function delCookieFun(name)
{ 
    var exp = new Date(); 
    exp.setTime(exp.getTime() - 1); 
    var cval=getCookieFun(name); 
    if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString(); 
}
//根据专辑号和歌曲号找到当前歌曲序号
function getSongIndexFromCookie(albumIndex,songIndex){
	var count=parseInt(getCookieFun("songCount"));
	var index=-1;
	var searchValue=albumIndex+":"+songIndex;
	//alert("判断里面count="+count)
	for(var i=0;i<count;i++){
		//alert("判断i="+i+"时是否相等"+getCookieFun(i)+"=="+searchValue)
		if(getCookieFun(i)==searchValue){
			//alert("有个相等的值，应返回i="+i)
			index=i;
			break;
		}
	}
	//alert("马上返回数据")
	return index;
}
//根据专辑号与歌曲号删除cookie
function deleteSongFromCookie(albumIndex,songIndex){
	var index=getSongIndexFromCookie(albumIndex,songIndex);
	var songCount=parseInt(getCookieFun("songCount"));
	for(var i=index;i<songCount;i++){//将序号为index的cookie覆盖掉，从后向前覆盖
		var next=parseInt(i)+1;
		var value=getCookieFun(next);
		//alert("获取后一位next="+next+"的值="+value)
		SetCookieFun(i,value);
	}
	delCookieFun(songCount);//删除最后一个cookie
	songCount--;
	SetCookieFun("songCount",songCount);
	//alert("总数减1以后="+getCookieFun("songCount")+"删除第"+index+"个后弹出当前删除序列号里的歌曲为="+getCookieFun(index))
	//alert("在删除cookie里面="+getCookieFun("songCount"))
}
//-------------}对Cookie的操作结束
//----------------调节滚动条的滚动杆
function adjustScrollBar(name){
		var container = document.getElementById(name+"_container"); // 容器
	var shower = document.getElementById(name+"_shower"); // 显示的内容
	var scroller = document.getElementById(name+"_scroller"); // 滚动条容器
	var scroll_up = document.getElementById(name+"_scroll_up"); // 上翻按钮
	var scroll_down = document.getElementById(name+"_scroll_down"); // 下翻按钮
	var scroll_bar = document.getElementById(name+"_scroll_bar"); // 滑动块
	var m=container.offsetHeight;//容器高
	var ctotal=shower.offsetHeight;//内容总高
	if(ctotal<m)ctotal=m;//当内容高度比容器高度还低时
	var btotal=scroller.offsetHeight-scroll_up.offsetHeight-scroll_down.offsetHeight+parseInt(6);//滚动杆总长
	scroll_bar.style.height=m/ctotal*btotal+"px";
}
