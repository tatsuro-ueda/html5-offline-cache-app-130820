var sp=false;
var touchdev=false;
var rx=60;
var ry=150;
var card_fix=18; //カードが並んだ場合の補正値
var width=8;
var height=4;
var card_width=Math.floor(73*0.9);
var card_height=Math.floor(97*0.9);
var dest_sc=0.85;
var prev_op_card=0;
var this_op_card=0;
var cards=new Array();
var card_place=new Array();
var prev=-1;
var canvas_width=640;
var canvas_height=400;
var teban=true;
var op_x=50;
var op_y=ry-Math.floor(card_height*dest_sc)-15;
var pl_x=50;
var pl_y=ry+20+card_height*height;
var pl_getcards=new Array();
var op_getcards=new Array();
var memory=new Array();
var difficulty=0;
var endflag=false;


function atFirst() {

	if(navigator.userAgent.indexOf('iPhone')>0
		|| navigator.userAgent.indexOf('iPod')>0
		|| navigator.userAgent.indexOf('iPad')>0
		|| navigator.userAgent.indexOf('Android')>0) {
 		 touchdev=true;
	}
	if(touchdev==false) {
 	    touchcanvas.addEventListener('mousedown',mdfunc,false);
 	    touchcanvas.addEventListener('mouseup',mufunc,false);
 	    touchcanvas.addEventListener('mousemove',mvfunc,false);
	} else {
 	    touchcanvas.addEventListener("touchstart", touchstart, false);
 	    touchcanvas.addEventListener("touchmove", touchmove, false);
  	    touchcanvas.addEventListener("touchend", touchend, false);
	}

	if(navigator.userAgent.indexOf('iPhone')>0
		|| navigator.userAgent.indexOf('iPod')>0
		|| navigator.userAgent.indexOf('Android')>0) {
 		 sp=true;
	}
	else sp=false;

	if(sp==true) {
		canvas_width=320;
		canvas_height=480;
	}

	if(!localStorage.shinkeigamesa) {
		localStorage.shinkeigamesa=0;
		localStorage.shinkeiwinsa=0;
		localStorage.shinkeigamesb=0;
		localStorage.shinkeiwinsb=0;
		localStorage.shinkeigamesc=0;
		localStorage.shinkeiwinsc=0;
		localStorage.shinkeipt=0;
		localStorage.shinkeidifficulty=difficulty;
	}
	else {
		difficulty=localStorage.shinkeidifficulty;
	}

	newGame();
}

function mdfunc(event) {
 	var rect=event.target.getBoundingClientRect();
	var x=event.clientX-rect.left;
	var y=event.clientY-rect.top;
 	execlick(x,y,"md");
}

function touchstart(event) {
 	var rect=event.target.getBoundingClientRect();
 	var x=event.touches[0].pageX-rect.left;
 	var y=event.touches[0].pageY-rect.top;
 	lasttouchx=x;
 	lasttouchy=y;
 	var scr_x=document.body.scrollLeft;//横方向のスクロール値
	var scr_y=document.body.scrollTop;//縦方向のスクロール値
	if(touchdev==false) {
		scr_x=0;
		scr_y=0;
	}
	var tx=x-scr_x;
	var ty=y-scr_y;
	var wy=Math.floor((ty-ry)/card_height);
	var wx=Math.floor((tx-rx)/card_width);
	if(wy>=0 && wy<height && wx>=0 && wx<width) event.preventDefault();
 	execlick(lasttouchx,lasttouchy,"md");
}

function touchmove(event) {
	var rect=event.target.getBoundingClientRect();
 	var x=event.touches[0].pageX-rect.left;
 	var y=event.touches[0].pageY-rect.top;
 	lasttouchx=x;
 	lasttouchy=y;
}

function touchend(event) {
}

function mufunc(event) {
	/*if(ctrl_mode==1) {
		var ctx=document.getElementById("movecanvas").getContext("2d");
		ctx.clearRect(0, 0, canvas_width, canvas_height);
		if(pressed!=-1) {
			displayEach(pressed);
			displayConnect(pressed);
		}
		pressed=-1;
		var rect=event.target.getBoundingClientRect();
		var x=event.clientX-rect.left;
		var y=event.clientY-rect.top;
	 	execlick(x,y,"mu");
	}*/
}

function reset() {
	newGame();
}

function execlick(thisX,thisY,mode) {
	var scr_x=document.body.scrollLeft;//横方向のスクロール値
	var scr_y=document.body.scrollTop;//縦方向のスクロール値
	if(touchdev==false) {
		scr_x=0;
		scr_y=0;
	}
	var x=thisX-scr_x;
	var y=thisY-scr_y;
	var wy=Math.floor((y-ry)/card_height);
	var wx=Math.floor((x-rx)/card_width);
	var disp_x=rx+card_width*(width-3)-30;
	if(sp==true) disp_x-=50;

	if(y<50) {
		if(x<150) {
			reset();
		}
		else if(x<230) {
			if(difficulty==0) {
				difficulty=1;
				alert("難易度は中級です。");
			}
			else if(difficulty==1) {
				difficulty=2;
				alert("難易度は上級です。");
			}
			else if(difficulty==2) {
				difficulty=0;
				alert("難易度は初級です。");
			}
			localStorage.shinkeidifficulty=difficulty;
			//if(window.confirm("リセットしますか?")) {
			reset();
		}
		else if(x<320) {
			location.href="http://www.afsgames.com/html5/";
		}
	}
	else if(y<ry && y>=ry-50 && x>disp_x-10 && x<disp_x<20) {
		if(window.confirm("データを消しますか?")) {
			localStorage.shinkeigamesa=0;
			localStorage.shinkeiwinsa=0;
			localStorage.shinkeigamesb=0;
			localStorage.shinkeiwinsb=0;
			localStorage.shinkeigamesc=0;
			localStorage.shinkeiwinsc=0;
			localStorage.shinkeipt=0;
		}
	}
	else if(teban==true && card_place[wy*width+wx][0]==-1 && wx>=0 && wx<width && wy>=0 && wy<height) {
		var this_card=wy*width+wx;
		memorize(this_card);
		if(prev==-1) {
			var ctx=document.getElementById("displaycanvas").getContext("2d");
			//ctx.clearRect(rx+card_width, ry+card_height, card_width, card_height);
			if(sp==false) anim_fr[this_card]=0;
			else {
				ctx.drawImage(images[cards[this_card]], rx+wx*card_width, ry+wy*card_height, card_width, card_height);
			}
			prev=this_card;
		}
		else if(prev!=this_card) {
			if(sp==false) anim_fr[this_card]=0;
			else {
				var ctx=document.getElementById("displaycanvas").getContext("2d");
				ctx.drawImage(images[cards[this_card]], rx+wx*card_width, ry+wy*card_height, card_width, card_height);
			}
			var prev_x=prev%width;
			var prev_y=Math.floor(prev/width);

			if(Math.floor(cards[prev]/4)==Math.floor(cards[this_card]/4)) {
				if(sp==false) {
					card_place[prev][0]=pl_getcards.length;
					card_place[prev][1]=1000*(ry+prev_y*card_height)+(rx+prev_x*card_width);
					card_place[prev][2]=1000*pl_y+rx+10+pl_getcards.length*card_fix;
					pl_getcards.push(prev);
					card_place[this_card][0]=pl_getcards.length;
					card_place[this_card][1]=1000*(ry+wy*card_height)+(rx+wx*card_width);
					card_place[this_card][2]=1000*pl_y+rx+10+pl_getcards.length*card_fix;
					pl_getcards.push(this_card);
				}
				if(sp==true) {
					pl_getcards.push(prev);
					card_place[prev][0]=pl_getcards.length;
					pl_getcards.push(this_card);
					card_place[this_card][0]=pl_getcards.length;
					//setTimeout("card_to_pl('"+prev+"')", 600);
					//if(sp==true) setTimeout("card_to_pl('"+this_card+"')", 700);
					//else setTimeout("card_to_pl('"+this_card+"')", 630);
					ctx=document.getElementById("displaycanvas").getContext("2d");
					ctx.clearRect(rx+prev_x*card_width, ry+prev_y*card_height, card_width, card_height);
					ctx.clearRect(rx+wx*card_width, ry+wy*card_height, card_width, card_height);
					for(var j=pl_getcards.length-2; j<pl_getcards.length; j++) {
						ctx.drawImage(images[cards[pl_getcards[j]]], rx+10+j*card_fix, pl_y, Math.floor(card_width*dest_sc), Math.floor(card_height*dest_sc));
					}
				}
			//	}
		//		else {

		//		}
			}
			else {
				var ct=prev_y*width+prev_x;
				setTimeout("card_back_draw('"+ct+"')", 600);
				ct=wy*width+wx;
				if(sp==true) setTimeout("card_back_draw('"+ct+"')", 700);
				else setTimeout("card_back_draw('"+ct+"')", 630);
				//card_draw(wy, wx, -1);
				//card_draw(prev_y, prev_x, -1);
				teban=false;
				opcount=0;
				drawTeban(1);
			}
			prev=-1;
		}
	}
}

function card_to_pl(card) {
	var card_x=card%width;
	var card_y=Math.floor(card/width);
	card_place[card][0]=pl_getcards.length;
	card_place[card][1]=1000*(ry+card_y*card_height)+(rx+card_x*card_width);
	card_place[card][2]=1000*pl_y+rx+10+pl_getcards.length*card_fix;
	pl_getcards.push(card);
}

function mvfunc(event) {
	var rect=event.target.getBoundingClientRect();
	var thisX=event.clientX-rect.left;
	var thisY=event.clientY-rect.top;
	var scr_x=document.body.scrollLeft;//横方向のスクロール値
	var scr_y=document.body.scrollTop;//縦方向のスクロール値
	if(touchdev==false) {
		scr_x=0;
		scr_y=0;
	}
	var x=thisX-scr_x;
	var y=thisY-scr_y;
}

function drawSquare() {
	var ctx=document.getElementById("basecanvas").getContext("2d");
	ctx.beginPath();
	ctx.rect(rx, ry, card_width*width, card_height*height);
	ctx.stroke();
	ctx.fillStyle="#F7F0F3";
    ctx.fill();
    ctx.lineWidth=3;
    ctx.strokeStyle="#F279B6";
    ctx.stroke();

    var ctx=document.getElementById("basecanvas").getContext("2d");
	if(sp==false) ctx.font="bold 30pt MS明朝";
	else ctx.font="bold 15pt MS明朝";
	ctx.fillStyle = "#F4DCE8";
	if(sp==false) ctx.fillText("神経衰弱", rx+card_width*3-20, ry+card_height*2-20);
	else ctx.fillText("神経衰弱", rx+card_width*2, ry+card_height*2-20);
			//ctx.drawImage(others[1], rx+card_width*2-20, ry+card_height*2-50);

    /*ctx=document.getElementById("basecanvas").getContext("2d");
	ctx.beginPath();
    ctx.rect(rx+10, op_y, Math.floor(card_width*width*dest_sc), Math.floor(card_height*dest_sc));
	ctx.stroke();
	ctx.fillStyle="#F7F0F3";
    ctx.fill();
    ctx.lineWidth=2;
    ctx.strokeStyle="#F4BED4";
    ctx.stroke();*/
}

var opteban=false;

function newGame() {
	endflag=false;
	opteban=false;
	var ctx=document.getElementById("fontcanvas").getContext("2d");
	ctx.clearRect(0, 0, canvas_width, canvas_height);
	ctx=document.getElementById("displaycanvas").getContext("2d");
	ctx.clearRect(0, 0, canvas_width, canvas_height);
	ctx=document.getElementById("drawcanvas0").getContext("2d");
	ctx.clearRect(0, 0, canvas_width, canvas_height);
	ctx=document.getElementById("drawcanvas1").getContext("2d");
	ctx.clearRect(0, 0, canvas_width, canvas_height);
	ctx=document.getElementById("displaycanvas2").getContext("2d");
	ctx.clearRect(0, 0, canvas_width, canvas_height);

	if(difficulty==0) {
		localStorage.shinkeigamesa++;
	}
	else if(difficulty==1) {
		localStorage.shinkeigamesb++;
	}
	else if(difficulty==2) {
		localStorage.shinkeigamesc++;
	}
	memory=new Array();
	pl_getcards=new Array();
	op_getcards=new Array();
	dest_sc=0.85
	op_x=50;
	op_y=ry-Math.floor(card_height*dest_sc)-15;
	pl_x=50;
	pl_y=ry+20+card_height*height;

	prev=-1;
	opcount=1000;

	if(sp==true) {
		width=6;
		card_fix=14;
	}

	if(sp==true) {
		rx=10;
		ry=135;
		width=6;
		card_width=Math.floor((320-rx*2)/width);
		card_height=Math.floor(card_width*97/73);
		pl_y=ry+20+card_height*height;
	}

	drawTeban(0);

	teban=true;
	anim_fr=new Array();
	var card_array=new Array();

	for(var i=0; i<26; i++) {
		card_array[i]=i;
	}
	for(i=25; i>=0; i--) {
		var rand=Math.floor(Math.random()*i);
		var ex=card_array[rand];
		card_array[rand]=card_array[i];
		card_array[i]=ex;
	}

	cards=new Array();
	for(i=0; i<width*height; i++) {
		cards[i]=card_array[Math.floor(i/2)]*2+(i%2);
		anim_fr[i]=-1;
		card_place[i]=new Array();
		card_place[i][0]=-1;
		card_place[i][3]=1;
	}

	for(i=width*height-1; i>=0; i--) {
		var rand=Math.floor(Math.random()*i);
		var ex=cards[rand];
		cards[rand]=cards[i];
		cards[i]=ex;
	}


	drawSquare();

	for(i=0; i<height; i++) {
		for(var j=0; j<width; j++) {
			card_draw(i, j, anim_fr[i*width+j]);
			//ctx.drawImage(images[cards[i*width+j]], rx+j*card_width, ry+i*card_height, card_width, card_height);
		}
	}

	drawFont();
}

function drawTeban(player) {

	var ctx=document.getElementById("fontcanvas").getContext("2d");
	ctx.font="bold 13pt MS明朝";
	ctx.fillStyle="#F279B9"//"#F97E2B";//"#F94343";//"#F277BA";
	ctx.clearRect(rx+card_width*(width-3)-20, ry-65, 350, 35);

	var disp_x=rx+card_width*(width-3)+88;
	var disp_y=ry-40;

	if(player==0) {
		if(sp==true) disp_x-=50;
		ctx.fillText("YOUR TURN", disp_x, ry-40);
	}
	else if(player==1) {
		disp_x=rx+card_width*(width-3)+145;
		if(sp==true) disp_x-=50;
		ctx.fillText("COM", disp_x, ry-40);
	}
}

function drawFont() {
	var ctx=document.getElementById("fontcanvas").getContext("2d");
	ctx.font="bold 10pt MS明朝";
	ctx.fillStyle="#7FC634";
	var disp_x=rx+card_width*(width-3)-20;
	if(sp==true) disp_x-=30;

	if(difficulty==0) {
		ctx.fillText("初級 / "+localStorage.shinkeigamesa+"ゲーム中"+localStorage.shinkeiwinsa+"勝 / "+localStorage.shinkeipt+"pt獲得", disp_x, ry-18);
	}
	else if(difficulty==1) {
		ctx.fillText("中級 / "+localStorage.shinkeigamesb+"ゲーム中"+localStorage.shinkeiwinsb+"勝 / "+localStorage.shinkeipt+"pt獲得", disp_x, ry-18);
	}
	else if(difficulty==2) {
		ctx.fillText("上級 / "+localStorage.shinkeigamesc+"ゲーム中"+localStorage.shinkeiwinsc+"勝 / "+localStorage.shinkeipt+"pt獲得", disp_x, ry-18);
	}
}

function card_back_draw(place) {
	var i=Math.floor(place/width);
	var j=place%width;
	var ctx=document.getElementById("displaycanvas").getContext("2d");
	var sc=1;
	ctx.drawImage(others[0], rx+j*card_width+Math.floor((card_width-card_width*sc)/2), ry+i*card_height, Math.floor(card_width*sc), card_height);
}

function card_draw(i, j, fr) {
	var ctx=document.getElementById("displaycanvas").getContext("2d");
	ctx.clearRect(rx+j*card_width, ry+i*card_height, card_width, card_height);
	var sc=1;
	if(fr<4) {
		switch(fr) {
			case 0:
				sc=0.8;
				break;
			case 1:
				sc=0.5;
				break;
			case 2:
				sc=0.2;
				break;
			case 3:
				sc=0.1;
				break;
		}
		ctx.drawImage(others[0], rx+j*card_width+Math.floor((card_width-card_width*sc)/2), ry+i*card_height, Math.floor(card_width*sc), card_height);
	}
	else if(fr<9) {
		switch(fr) {
			case 4:
				sc=0.1;
				break;
			case 5:
				sc=0.2;
				break;
			case 6:
				sc=0.5;
				break;
			case 7:
				sc=0.8;
				break;
			case 8:
				sc=1;
				break;
		}
		ctx.drawImage(images[cards[i*width+j]], rx+j*card_width+Math.floor((card_width-card_width*sc)/2) , ry+i*card_height, Math.floor(card_width*sc), card_height);
	}
}

function memorize(place) {
	memory.push(place);

	if(difficulty==0) { //初級
		rate=0.4;
		for(var i=0; i<memory.length; i++) {
			if(i<=memory.length-3) {
				if(Math.random()<rate) memory[i]=-1;
				rate-=0.03;
			}
			//else {
				//if(Math.random()<0rate) memory[i]=-1;
			//}
		}
	}
	else if(difficulty==1) { //中級
		rate=0.35;
		for(i=0; i<memory.length; i++) {
			if(i<memory.length-6) {
				if(Math.random()<rate) memory[i]=-1;
				rate-=0.05;
			}
			else if(i<memory.length-3) {
				if(Math.random()<rate) memory[i]=-1;
				rate-=0.05;
			}
			else {
				//if(Math.random()<0.05) memory[i]=-1;
			}
		}
	}
	else { //上級
		var rate=0.05
		for(i=0; i<memory.length; i++) {
			if(i<memory.length-6) {
				if(Math.random()<rate) memory[i]=-1;
				rate-=0.01;
			}
			else if(i<memory.length-3) {
				//if(Math.random()<0.02) memory[i]=-1;
			}
		}
	}
}

var selected_a=0;
var selected_b=0;

function framemg() {
	if(opteban==false) animation();
}

function animation() {
	opteban=true;
	if(endflag==false) {
		opcount++;
		if(opcount==60) {
			selected_a=-1;
			selected_b=-1;
			var flag=false;
			if(memory.length>1) {
				for(var i=0; i<memory.length-1; i++) {
					var first=memory[i];
					for(var j=i+1; j<memory.length; j++) {
						if(memory[i]!=memory[j] && Math.floor(cards[first]/4)==Math.floor(cards[memory[j]]/4) && card_place[first][0]==-1 && card_place[memory[j]][0]==-1) {
							flag=true;
							selected_a=first;
							selected_b=memory[j];
							break;
						}
					}
					if(flag==true) break;
				}
			}
			if(flag==true) {
				if(sp==false) anim_fr[selected_a]=0;
				else {
					var ctx=document.getElementById("displaycanvas").getContext("2d");
					ctx.drawImage(images[cards[selected_a]], rx+(selected_a%width)*card_width, ry+Math.floor(selected_a/width)*card_height, card_width, card_height);
				}
				prev_op_card=selected_a;
			}
			while(flag==false) {
				var rand=Math.floor(Math.random()*height*width);
				if(card_place[rand][0]==-1) { //まだ場にある時
					flag=true;
					if(sp==false) anim_fr[rand]=0;
					else {
						ctx=document.getElementById("displaycanvas").getContext("2d");
						ctx.drawImage(images[cards[rand]], rx+(rand%width)*card_width, ry+Math.floor(rand/width)*card_height, card_width, card_height);
					}
					prev_op_card=rand;
				}
			}
			memorize(prev_op_card);
		}
		if(opcount==80) {
			flag=false;
			if(selected_b>=0) {
				flag=true;
				if(sp==false) anim_fr[selected_b]=0;
				else {
					var ctx=document.getElementById("displaycanvas").getContext("2d");
					ctx.drawImage(images[cards[selected_b]], rx+(selected_b%width)*card_width, ry+Math.floor(selected_b/width)*card_height, card_width, card_height);
				}
				this_op_card=selected_b;
			}

			if(flag==false) {
				for(i=0; i<memory.length; i++) {
					if(Math.floor(cards[memory[i]]/4)==Math.floor(cards[prev_op_card]/4) && memory[i]!=prev_op_card && card_place[memory[i]][0]==-1) {
						flag=true;
						this_op_card=memory[i];

						if(sp==false) anim_fr[memory[i]]=0;
						else {
							ctx=document.getElementById("displaycanvas").getContext("2d");
							ctx.drawImage(images[cards[this_op_card]], rx+(this_op_card%width)*card_width, ry+Math.floor(this_op_card/width)*card_height, card_width, card_height);
						}
						break;
					}
				}
			}

			while(flag==false) {
				rand=Math.floor(Math.random()*height*width);
				if(card_place[rand][0]==-1 && rand!=prev_op_card) { //まだ場にある時
					flag=true;
					for(i=0; i<memory.length; i++) {
						if(memory[i]==rand && Math.floor(cards[prev_op_card]/4)!=Math.floor(rand/4)) flag=false;
					}
					if(flag==true) {
						if(sp==false) anim_fr[rand]=0;
						else {
							ctx=document.getElementById("displaycanvas").getContext("2d");
							ctx.drawImage(images[cards[rand]], rx+(rand%width)*card_width, ry+Math.floor(rand/width)*card_height, card_width, card_height);
						}
						this_op_card=rand;
					}
				}
			}

			memorize(this_op_card);
		}
		if(opcount==100) {
			var prev_x=prev_op_card%width;
			var prev_y=Math.floor(prev_op_card/width);
			var this_x=this_op_card%width;
			var this_y=Math.floor(this_op_card/width);

			if(Math.floor(cards[prev_op_card]/4)==Math.floor(cards[this_op_card]/4)) {
				if(sp==true) {
					ctx=document.getElementById("displaycanvas").getContext("2d");
					ctx.clearRect(rx+prev_x*card_width, ry+prev_y*card_height, card_width, card_height);
					ctx.clearRect(rx+this_x*card_width, ry+this_y*card_height, card_width, card_height);
					op_getcards.push(prev_op_card);
					card_place[prev_op_card][0]=100+op_getcards.length;
					op_getcards.push(this_op_card);
					card_place[this_op_card][0]=100+op_getcards.length;
					ctx=document.getElementById("displaycanvas").getContext("2d");
					for(var j=op_getcards.length-2; j<op_getcards.length; j++) {
						ctx.drawImage(images[cards[op_getcards[j]]], rx+10+j*card_fix, op_y, Math.floor(card_width*dest_sc), Math.floor(card_height*dest_sc));
					}
					opcount=0;
				}
				if(sp==false) {
					card_place[prev_op_card][0]=100+op_getcards.length;
					card_place[prev_op_card][1]=1000*(ry+prev_y*card_height)+(rx+prev_x*card_width);
					card_place[prev_op_card][2]=1000*op_y+rx+10+op_getcards.length*card_fix;
					op_getcards.push(prev_op_card);
					card_place[this_op_card][0]=100+op_getcards.length;
					card_place[this_op_card][1]=1000*(ry+this_y*card_height)+(rx+this_x*card_width);
					card_place[this_op_card][2]=1000*op_y+rx+10+op_getcards.length*card_fix;
					op_getcards.push(this_op_card);
					opcount=0;
				}
			}
			else {
				var ct=prev_y*width+prev_x;
				setTimeout("card_back_draw('"+ct+"')", 600);
				ct=this_y*width+this_x;
				if(sp==true) setTimeout("card_back_draw('"+ct+"')", 700);
				else setTimeout("card_back_draw('"+ct+"')", 630);
				//card_draw(wy, wx, -1);
				//card_draw(prev_y, prev_x, -1);
				teban=true;
				drawTeban(0);
				//var ctx=document.getElementById("displaycanvas2").getContext("2d");
				//ctx.font="bold 20pt MS明朝";
				//ctx.fillStyle = "#222222";
				//ctx.fillText("あなたの番です", rx+card_width*2, ry+card_height*2);
				//ctx.drawImage(others[1], rx+card_width*2-20, ry+card_height*2-50);
			}
		}


		for(var i=0; i<width*height; i++) {
			if(card_place[i][0]<1000) {
				if(anim_fr[i]>=0 && anim_fr[i]<9) {
					card_draw(Math.floor(i/width), i%width, anim_fr[i]);
					anim_fr[i]++;
				}
				else if(anim_fr[i]==9) {
					if(card_place[i][0]>-1) {
						var ctx=document.getElementById("displaycanvas").getContext("2d");
						ctx.clearRect(rx+(i%width)*card_width, ry+Math.floor(i/width)*card_height, card_width, card_height);
						anim_fr[i]=10;
					}
				}
				else {
					if(card_place[i][0]>-1 && card_place[i][0]<1000) {
						var cur_y=Math.floor(card_place[i][1]/1000);
						var cur_x=card_place[i][1]%1000;
						var dest_y=Math.floor(card_place[i][2]/1000);
						var dest_x=card_place[i][2]%1000;
						var old_scale=card_place[i][3];
						card_place[i][3]+=(dest_sc-card_place[i][3])/3;
						var num=card_place[i][0]%100;

						if(Math.abs(cur_x-dest_x)<3 && Math.abs(cur_y-dest_y)<3 || sp==true) {
							if(Math.floor(card_place[i][0]/100)==0) {
								card_place[i][0]+=1000;

								if(card_place[pl_getcards[pl_getcards.length-1]][0]>=1000 && card_place[pl_getcards[pl_getcards.length-2]][0]>=1000) {
									if(sp==false) {
										ctx=document.getElementById("drawcanvas0").getContext("2d");
										ctx.clearRect(rx+(pl_getcards.length-2)*card_fix, pl_y-20, Math.floor(card_width*dest_sc)+40, Math.floor(card_height*dest_sc)+40);
										ctx=document.getElementById("drawcanvas1").getContext("2d");
										ctx.clearRect(rx+(pl_getcards.length-1)*card_fix, pl_y-20, Math.floor(card_width*dest_sc)+40, Math.floor(card_height*dest_sc)+40);
										ctx=document.getElementById("displaycanvas").getContext("2d");
										//ctx.clearRect(rx, pl_y-20, 10+card_width+pl_getcards.length*card_fix, card_height+20);
									}
									ctx=document.getElementById("displaycanvas").getContext("2d");
									for(var j=pl_getcards.length-2; j<pl_getcards.length; j++) {
										ctx.drawImage(images[cards[pl_getcards[j]]], rx+10+j*card_fix, pl_y, Math.floor(card_width*dest_sc), Math.floor(card_height*dest_sc));
									}
								}
							}
							else if(Math.floor(card_place[i][0]/100)==1) {
								card_place[i][0]+=1000;
								//ctx=document.getElementById("drawcanvas"+(num%2)).getContext("2d");
								//ctx.clearRect(cur_x, cur_y, card_width*old_scale, card_height*old_scale);
								if(card_place[op_getcards[op_getcards.length-1]][0]>=1000 && card_place[op_getcards[op_getcards.length-2]][0]>=1000) {
									if(sp==false) {
										ctx=document.getElementById("drawcanvas0").getContext("2d");
										ctx.clearRect(rx+(op_getcards.length-2)*card_fix, op_y-20, Math.floor(card_width*dest_sc)+40, Math.floor(card_height*dest_sc)+40);
										ctx=document.getElementById("drawcanvas1").getContext("2d");
										ctx.clearRect(rx+(op_getcards.length-1)*card_fix, op_y-20, Math.floor(card_width*dest_sc)+40, Math.floor(card_height*dest_sc)+40);
										ctx=document.getElementById("displaycanvas").getContext("2d");
										//ctx.clearRect(rx, op_y-20, 10+card_width+op_getcards.length*card_fix, card_height+20);
									}
									ctx=document.getElementById("displaycanvas").getContext("2d");
									for(var j=op_getcards.length-2; j<op_getcards.length; j++) {
										ctx.drawImage(images[cards[op_getcards[j]]], rx+10+j*card_fix, op_y, Math.floor(card_width*dest_sc), Math.floor(card_height*dest_sc));
									}
								}
							}
							if(i==pl_getcards[pl_getcards.length-1] || i==op_getcards[op_getcards.length-1]) clearCheck();
						}
						else {
							var tent_x=cur_x+Math.floor((dest_x-cur_x)/3);
							var tent_y=cur_y+Math.floor((dest_y-cur_y)/3);
							card_place[i][1]=tent_y*1000+tent_x;
							ctx=document.getElementById("drawcanvas"+(num%2)).getContext("2d");
							ctx.clearRect(cur_x, cur_y, card_width*old_scale, card_height*old_scale);
							ctx.drawImage(images[cards[i]], tent_x, tent_y, Math.floor(card_width*card_place[i][3]), Math.floor(card_height*card_place[i][3]));
						}
					}
				}
	/*		}
			else {
				var cur_y=Math.floor(card_place[i][1]/1000);
				var cur_x=card_place[i][1]%1000;
				var dest_y=Math.floor(card_place[i][2]/1000);
				var dest_x=card_place[i][2]%1000;

				var tent_x=cur_x+((dest_x-cur_x)/2);
				var tent_y=cur_y+((dest_y-cur_y)/2);

				var ctx=document.getElementById("drawcanvas").getContext("2d");
				ctx.drawImage(images[cards[i]], tent_x, tent_y, card_width, card_height);*/
			}
		}
	}
	opteban=false;
}

function clearCheck() {
	var flag=true;
	for(var i=0; i<width*height; i++) {
		if(card_place[i][0]==-1) {
			flag=false;
		}
	}
	if(flag==true) {
		var plcards=0;
		var opcards=0;
		for(i=0; i<width*height; i++) {
			if((card_place[i][0]%1000)>=100) opcards++;
			else plcards++;
		}
		if(opcards>plcards) {
			alert(plcards+"対"+opcards+"で、あなたの負けです。");
		}
		else if(opcards==plcards) {
			alert(plcards+"対"+opcards+"引き分けです。");
		}
		else {
			alert(plcards+"対"+opcards+"あなたの勝ちです。");
			if(difficulty==0) {
				localStorage.shinkeiwinsa++;
				for(i=0; i<3; i++) localStorage.shinkeipt++;
			}
			else if(difficulty==1) {
				localStorage.shinkeiwinsb++;
				for(i=0; i<6+(plcards-opcards); i++) localStorage.shinkeipt++;
			}
			else if(difficulty==2) {
				localStorage.shinkeiwinsc++;
				for(i=0; i<9+(plcards-opcards)*2; i++) localStorage.shinkeipt++;
			}
		}
		endflag=true;
	}
}

var images={};
var others={};
var loaded=0;
var load_max=54;
var anim_fr=new Array();
var opcount=1000;

window.onload = function(){
	setInterval("framemg()", 20);
    for(var i=0; i<52; i++) {
  		images[i]=new Image();
	    images[i].onload = function(){
	        loaded++;
	       	if(loaded==load_max) {
	       		atFirst();
	       		loaded++;
	       	}
	    };
	    images[i].src = "./images/"+(i+1)+".gif";
	}
	for(i=0; i<2; i++) {
  		others[i]=new Image();
	    others[i].onload = function(){
	        loaded++;
	      	if(loaded==load_max) {
	      		atFirst();
	      		loaded++;
	      	}
	    };
	    if(i==0) others[i].src = "images/cardback_shinkei.png";
	    if(i==1) others[i].src = "images/anatano.png";
	    //if(i==1) others[i].src = "./cardimg/daifuda.png";
	   // if(i==2) others[i].src = "./cardimg/bafuda.png";
	    //if(i==3) others[i].src = "./cardimg/carddisplay.png";
	    //if(i==4) others[i].src = "./cardimg/cardback.png";
	}
};

