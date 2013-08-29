var sp=false;
var touchdev=false;
var rx=60;
var ry=165;
var card_fix=35; //カードが並んだ場合の補正値
var card_fix_op=13;
var width=13;
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
var passed_op=0;

var opct=1000;
var selected=-1;
var select_x=0;
var select_y=0;


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

  if(!localStorage.sevengames) {
    localStorage.sevengames=0;
    localStorage.sevenone=0;
    localStorage.seventwo=0;
    localStorage.seventhree=0;
    localStorage.sevenfour=0;
    localStorage.sevenfailure=0;
    localStorage.sevenpt=0;
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
  execlick(lasttouchx,lasttouchy,"md");
  if(y>coord[0][1]-10 && y<coord[0][1]+card_height) event.preventDefault();
}

function touchmove(event) {
  var rect=event.target.getBoundingClientRect();
  var x=event.touches[0].pageX-rect.left;
  var y=event.touches[0].pageY-rect.top;
  lasttouchx=x;
  lasttouchy=y;
}

var pressed=false;

function mvfunc(event) {
  /*var rect=event.target.getBoundingClientRect();
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

  var button1_x=coord[0][0]+Math.floor((plcards[0].length+1.5)*card_fix);
  var button1_y=coord[0][1];

  if(x>=button1_x && x<=button1_x+button1_width && y>=button1_y && y<=button1_y+button1_height) {
    drawButton(1);
    pressed=true;
  }
  else {
    if(pressed==true) {
      drawButton(0);
      pressed=false;
    }
  }*/
}


var button1_width=78;
var button1_height=24;

function drawButton(atb) {
  var button1_x=coord[0][0]+Math.floor((plcards[0].length+1.5)*card_fix);
  var button1_y=coord[0][1];
  var ctx=document.getElementById("displaycanvas").getContext("2d");
  var grd=ctx.createLinearGradient(button1_x+button1_width/2, button1_y, button1_x+button1_width/2, button1_y+button1_height);

  if(atb==1) {
    grd.addColorStop(0, "#f7893e");
      grd.addColorStop(1, "#f46c0f");
  }
  else {
    grd.addColorStop(0, "#e5e5e5");
      grd.addColorStop(1, "#bfbfbf");
  }
    ctx.fillStyle=grd;
  ctx.beginPath();
  ctx.fillRect(button1_x, button1_y, button1_width, button1_height);
  ctx.rect(button1_x, button1_y, button1_width, button1_height);
  ctx.lineWidth=2;
    ctx.strokeStyle="#000000";
    ctx.stroke();
    var ctx=document.getElementById("displaycanvas").getContext("2d");
    ctx.font="bold 16px MSゴシック";
  ctx.fillStyle="#000000";
  ctx.fillText("PASS", button1_x+18, button1_y+18);
}

function touchend(event) {
    var rect=event.target.getBoundingClientRect();
    var x=event.changedTouches[0].pageX-rect.left;
    var y=event.changedTouches[0].pageY-rect.top;
    execlick(x,y,"mu");
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

  var rect=event.target.getBoundingClientRect();
  var x=event.clientX-rect.left;
  var y=event.clientY-rect.top;
  execlick(x,y,"mu");
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

/*  if(y<50) {
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
  } */

  if(y<40 && mode=="md") {
    if(x<120) {
      /*var ctx=document.getElementById("displaycanvas").getContext("2d");
      ctx.clearRect(0, 0, 800, 800);
      newGame();*/
      location.reload();
    }
    else if(x>=140 && x<220) {
      if(window.confirm("記録を消去しますか？")){
        var ctx=document.getElementById("displaycanvas").getContext("2d");

        localStorage.sevengames=1;
        localStorage.sevenone=0;
        localStorage.seventwo=0;
        localStorage.seventhree=0;
        localStorage.sevenfour=0;
        localStorage.sevenfailure=0;
        localStorage.sevenpt=0;

        ctx.font="bold 11pt MS明朝";
        ctx.clearRect(coord[0][0]+500, coord[0][1]+40, 300, 300);
        ctx.fillStyle="#000000";
        ctx.fillText((localStorage.sevengames)+"ゲーム中"+(localStorage.sevenone)+"勝！", coord[0][0]+520, coord[0][1]+70);
        ctx.fillText((localStorage.sevenpt)+"ポイント獲得！", coord[0][0]+520, coord[0][1]+90);
        //ctx.fillStyle="#ED1C24";
        //ctx.fillText("消去？", coord[0][0]+640, coord[0][1]+90);

      }

    }
    else {
      location.href="http://www.afsgames.com/html5/";

    }
  }
  else if(teban==true && endflag==false) {
    if(mode=="md" && x>coord[0][0]+card_width+card_fix*plcards[0].length && y>coord[0][1] && y<coord[0][1]+40) {
      //alert("パスしますか？");
      passed[0]++;
      drawPass(0);
      pass(0);
    }
    else if(mode=="md") {
      selected=-1;

      for(var i=0; i<plcards[0].length; i++) {
        var ltx=coord[0][0]+i*card_fix;
        var lty=coord[0][1];
        if(x>=ltx && x<ltx+card_width && y>=lty && y<lty+card_height) {
          selected=i;
        }
      }

      if(selected>-1) {
        display_selected(selected);
        select_x=x;
        select_y=y;
        var pls=plcards[0][selected];

        if((Math.floor(pls/4)>6 && stage[Math.floor(pls/4)-1][pls%4]>0) || (Math.floor(pls/4)<6 && stage[Math.floor(pls/4)+1][pls%4]>0)) {
          ltx=coord[0][0]+selected*card_fix+14;
          lty=coord[0][1]-54;
          var ctx=document.getElementById("arrowcanvas").getContext("2d");
          ctx.drawImage(others[7], ltx, lty, 34, 48);
        }
      }
    }
    else if(mode=="mu") {
      if(selected>-1) {
        var ctx=document.getElementById("arrowcanvas").getContext("2d");
        ltx=coord[0][0]+selected*card_fix;
        lty=coord[0][1];
        ctx.clearRect(ltx-100, lty-100, 200, 200);

        var ctx=document.getElementById("displaycanvas2").getContext("2d");
        ctx.clearRect(coord[0][0]-10, coord[0][1]-30, card_width+card_fix*plcards[0].length+20, card_height+60);
        var pls=plcards[0][selected];
        if(y<select_y-10 && ((Math.floor(pls/4)>6 && stage[Math.floor(pls/4)-1][pls%4]>0) || (Math.floor(pls/4)<6 && stage[Math.floor(pls/4)+1][pls%4]>0))) { //カードを出す
          stage[Math.floor(plcards[0][selected]/4)][plcards[0][selected]%4]=1
          card_place[pls][0]=0;
          card_place[pls][1]=(coord[0][0]+card_fix*selected)+coord[0][1]*1000;
          card_place[pls][2]=(rx+Math.floor(pls/4)*Math.floor(card_width*dest_sc))+(ry+Math.floor(card_height*dest_sc)*(pls%4))*1000;
          card_place[pls][3]=dest_sc;

          check_for_displayed(pls);

          plcards[0].splice(selected, 1);

          if(plcards[0].length==0) {
            card_display(0);
            endProcess(0);

          }
          else {
            card_display(0);
            teban=false;
            selected=-1;
            drawPass(0);
            opct=0;
          }
        }
      }
    }
  }
}

function pass(pl) {
  if(pl==0) {
    if(passed[pl]==4) {
      alert("パス4回で失格です！-16ポイント");
      localStorage.sevenfailure++;
      for(var i=0; i<16; i++) localStorage.sevenpt--;
      //endProcess(pl);
      endflag=true;
    }
    else {
      teban=false;
      selected=-1;
      opct=0;
    }
  }
}

function endProcess(pl) {
  setTimeout("endProcess_pl()", 500);
}

function endProcess_pl() {

  endflag=true;
  var clear_message=(cleared.length+1)+"位で終了！"
  if(cleared.length==0) {
    clear_message+="16ポイント獲得！";
    localStorage.sevenone++;
    for(var i=0; i<16; i++) localStorage.sevenpt++;
  }
  else if(cleared.length==1) {
    clear_message+="4ポイント獲得！";
    localStorage.seventwo++;
    for(var i=0; i<4; i++) localStorage.sevenpt++;

  }
  else if(cleared.length==2) {
    clear_message+="-4ポイント。";
    localStorage.seventhree++;
    for(var i=0; i<4; i++) localStorage.sevenpt--;
  }
  alert(clear_message);

}

function card_to_pl(card) {
  var card_x=card%width;
  var card_y=Math.floor(card/width);
  card_place[card][0]=pl_getcards.length;
  card_place[card][1]=1000*(ry+card_y*card_height)+(rx+card_x*card_width);
  card_place[card][2]=1000*pl_y+rx+10+pl_getcards.length*card_fix;
  pl_getcards.push(card);
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
}

var opteban=false;

var stage=new Array();
var plcards=new Array();
var coord=new Array();
var cardpt=new Array();
var cleared=new Array();
var passed=new Array();

function newGame() {
  endflag=false;
  opteban=false;
  passed_op++;

  cleared=new Array();
  passed=new Array();
  cards=new Array();
  for(i=0; i<52; i++) {
    cards[i]=i;
    //anim_fr[i]=-1;
    card_place[i]=new Array();
    card_place[i][0]=-1;
    card_place[i][3]=1;
  }

  for(i=51; i>=0; i--) {
    var rand=Math.floor(Math.random()*i);
    var ex=cards[rand];
    cards[rand]=cards[i];
    cards[i]=ex;
  }

  stage=new Array();
  plcards=new Array();

  for(i=0; i<13; i++) {
    stage[i]=new Array();
    for(j=0; j<4; j++) {
      stage[i][j]=0;
      if(i==6) stage[i][j]=1;
    }
  }

  cardpt=new Array();
  for(i=0; i<4; i++) {
    passed[i]=0;
    plcards[i]=new Array();
    cardpt[i]=new Array();
  }

  for(i=0; i<52; i++) {
    if(Math.floor(cards[i]/4)!=6) plcards[i%4].push(cards[i]);
  }

  coord=new Array();
  coord[0]=[rx+8, 484];
  coord[1]=[rx+8, ry-90];
  coord[2]=[rx+20+17*card_fix_op, ry-90];
  coord[3]=[rx+20+34*card_fix_op, ry-90];


  localStorage.sevengames++;

  display();
  drawyourturn();
}

function drawyourturn() {
  var ctx=document.getElementById("yourturncanvas").getContext("2d");
  ctx.drawImage(others[8], rx+Math.floor(card_width*2)+30, ry+75, 420, 60);
  setTimeout("deleteyourturn()", 600);
}

function deleteyourturn() {
  var ctx=document.getElementById("yourturncanvas").getContext("2d");
  ctx.clearRect(rx+Math.floor(card_width*2)+30, ry+75, 420, 60);
}

function display() {
  var ctx=document.getElementById("displaycanvas").getContext("2d");
  drawSquare(ctx);

  for(var i=0; i<13; i++) {
    for(var j=0; j<4; j++) {
      if(stage[i][j]==1) ctx.drawImage(images[i*4+j], rx+Math.floor(card_width*dest_sc)*i, ry+Math.floor(card_height*dest_sc)*j, Math.floor(card_width*dest_sc), Math.floor(card_height*dest_sc));
      else {
        ctx.drawImage(others[0], rx+Math.floor(card_width*dest_sc)*i, ry+Math.floor(card_height*dest_sc)*j, Math.floor(card_width*dest_sc), Math.floor(card_height*dest_sc));
      }
    }
  }
  for(i=0; i<4; i++) {
    card_display(i);
    drawPass(i);
  }

  ctx.font="bold 11pt MS明朝";
  ctx.fillStyle="#000000";
  ctx.fillText((localStorage.sevengames)+"ゲーム中！"+(localStorage.sevenone)+"勝！", coord[0][0]+520, coord[0][1]+70);
  ctx.fillText((localStorage.sevenpt)+"ポイント獲得！", coord[0][0]+520, coord[0][1]+90);
  //ctx.fillStyle="#ED1C24";
  //ctx.fillText("消去？", coord[0][0]+640, coord[0][1]+90);
}


function drawFont(pl) {
  var ctx=document.getElementById("displaycanvas").getContext("2d");
  var this_scale=0.9;
  if(pl==1) ctx.drawImage(others[2], coord[pl][0]+5, coord[pl][1]-20, Math.floor(64*this_scale), Math.floor(16*this_scale));
  else if(pl==2) ctx.drawImage(others[3], coord[pl][0]+5, coord[pl][1]-20, Math.floor(64*this_scale), Math.floor(16*this_scale));
  else if(pl==3) ctx.drawImage(others[4], coord[pl][0]+5, coord[pl][1]-20, Math.floor(64*this_scale), Math.floor(16*this_scale));



  if(pl>9) {
    //var draw_x=coord[pl%3][0]+25;
    //var draw_y=coord[pl%3][1]+45;
    //ctx.drawImage(others[6+cleared.length], coord[pl-9][0]+5, coord[pl-9][1]-20, Math.floor(40*this_scale), Math.floor(16*this_scale));
    ctx.font="bold 12pt MS明朝";
    ctx.fillStyle="#70BE73";
    ctx.fillText((cleared.length)+"位通過！", coord[pl-9][0]+70, coord[pl-9][1]+30);
  }
  else if(pl>6) {
    ctx.drawImage(others[6], coord[pl-6][0]+5, coord[pl-6][1]-20, Math.floor(56*this_scale), Math.floor(16*this_scale));
  }
  else if(pl>3) {
  //  var this_pl=pl-3;
  //  var this_flag=false;
  //  if(cleared.length>0) {
    //  for(var i=0; i<cleared.length; i++) if(cleared[i]==this_pl) this_flag=true;
  //  }
  //  if(this_flag==false)
    ctx.clearRect(coord[pl-3][0]+5, coord[pl-3][1]-20, Math.floor(64*this_scale), Math.floor(16*this_scale));
  }

}


function drawPass(pl) {
  var ctx=document.getElementById("fontcanvas").getContext("2d");
  ctx.font="bold 15pt MS明朝";
  ctx.fillStyle="#F95A5A";
  var button1_x=coord[0][0]+Math.floor((plcards[0].length+1.5)*card_fix);
  var button1_y=coord[0][1];
  if(pl==0) {
    ctx.clearRect(button1_x, button1_y, 250, 100);
    ctx.fillText("x"+passed[pl], button1_x+button1_width+8, button1_y+22);
  }
  else {
    ctx.font="bold 10pt MS明朝";
    draw_x=coord[pl][0]+75;
    draw_y=coord[pl][1]-5;
    ctx.clearRect(draw_x-50, draw_y-50, 250, 150);
    ctx.fillText("Passx"+passed[pl], draw_x, draw_y);

    if(passed[pl]==4) {
      ctx.font="bold 12pt MS明朝";
      ctx.fillStyle="#70BE73";
      ctx.fillText("パス4回で失格！", draw_x-30, draw_y+35);
      passed_op++;
      //localStorage.sevefailure++;
      //for(var i=0; i<16; i++) localStorage.sevenpt--;
    }
  }
}

function drawSquare(cvs) {
  cvs.beginPath();
  cvs.lineWidth=4;
  cvs.strokeStyle="#F95A5A";//"#ff0000";
  cvs.moveTo(rx, ry);
  cvs.lineTo(rx+Math.floor(card_width*dest_sc)*13, ry);
  cvs.lineTo(rx+Math.floor(card_width*dest_sc)*13, ry+Math.floor(card_height*dest_sc)*4);
  cvs.lineTo(rx, ry+Math.floor(card_height*dest_sc)*4);//alert(start_x+","+start_y+","+hi_width+","+hi_height);
  cvs.closePath();
  cvs.stroke();
}

function display_selected(card) {
  /*var ctx=document.getElementById("displaycanvas").getContext("2d");
  ctx.clearRect(coord[0][0]-5, coord[0][1]-5, plcards[0].length*card_fix+card_width+10, card_height+10);
  for(var i=0; i<plcards[pl].length; i++) {
    if(i!=card) {
      dest=1;
      ctx.drawImage(images[plcards[pl][i]], coord[pl][0]+i*card_fix, coord[pl][1], Math.floor(card_width*dest), Math.floor(card_height*dest));
    }
  }*/


  var start_x=coord[0][0]+card*card_fix;
  var start_y=coord[0][1];

  var ctx=document.getElementById("displaycanvas2").getContext("2d");
  ctx.globalAlpha=0.5;
  ctx.beginPath();
    ctx.rect(coord[0][0], start_y, card_width+(plcards[0].length-1)*card_fix, card_height);
    ctx.fillStyle="#999999";
    ctx.fill();
    //ctx.lineWidth=5;
    //ctx.strokeStyle="black";
    //ctx.stroke();

  ctx.globalAlpha=1;

  var sc=1;
  var this_width=Math.floor(card_width*sc);
  var this_height=Math.floor(card_height*sc);
  ctx.drawImage(images[plcards[0][card]], start_x, start_y, this_width, this_height);

  var ctx=document.getElementById("displaycanvas2").getContext("2d");
  ctx.beginPath();
  ctx.lineWidth=4;
  ctx.strokeStyle="#4DB043";//"#2482D2";//"#ff0000";
  ctx.moveTo(start_x, start_y);
  ctx.lineTo(start_x+this_width, start_y);
  ctx.lineTo(start_x+this_width, start_y+this_height);
  ctx.lineTo(start_x, start_y+this_height);
  ctx.closePath();
  ctx.stroke();
}

function card_display(pl) {
  var ctx=document.getElementById("displaycanvas").getContext("2d");
  if(pl==0) {
    ctx.clearRect(coord[0][0]-10, coord[0][1]-2, card_width+card_fix*13, card_height+20);
    ctx.clearRect(coord[0][0]-10, coord[0][1]-2, card_width*13, 40);
  }
  else {
    ctx.clearRect(coord[pl][0]-10, coord[pl][1]-2, Math.floor(card_width*0.75)+card_fix_op*(plcards[pl].length)+15, Math.floor(card_height*0.75)+12);
  }

  for(var i=0; i<plcards[pl].length; i++) {
    var dest=0.75;
    if(pl==0) {
      dest=1;
      ctx.drawImage(images[plcards[pl][i]], coord[pl][0]+i*card_fix, coord[pl][1], Math.floor(card_width*dest), Math.floor(card_height*dest));
    }
    else {
      dest=0.75;
      ctx.drawImage(others[1], coord[pl][0]+i*Math.floor(card_fix_op), coord[pl][1], Math.floor(card_width*dest), Math.floor(card_height*dest));
    }
  }

  if(pl==0) {
    drawButton();
    //ctx.drawImage(others[5], coord[0][0]+(plcards[0].length+3)*card_fix, coord[0][1], 96, 24);
  }
}

/*
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
}*/

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


function card_draw_trans(i, j) {
  var ctx=document.getElementById("drawcanvastrans").getContext("2d");
  ctx.globalAlpha=0.35;
  //ctx.clearRect(rx+j*card_width, ry+i*card_height, card_width, card_height);
  var sc=dest_sc;
  ctx.drawImage(images[j*4+i], rx+j*Math.floor(card_width*sc), ry+i*Math.floor(card_height*sc), Math.floor(card_width*sc), Math.floor(card_height*sc));
  stage[j][i]=-1;
}

selected_op=0;

function card_draw_trans_act() {
  var op=selected_op;
  var pol=plcards[op].length;
  for(i=0; i<pol; i++) {
    var this_x=Math.floor(plcards[op][0]/4);
    var this_y=plcards[op][0]%4;
    card_draw_trans(this_y, this_x);
    plcards[op].shift();
  }
}

function check_for_displayed(card_num) {
  var this_x=Math.floor(card_num/4);
  var this_y=card_num%4;
  if(this_x>0 && stage[this_x-1][this_y]==-1) {
    stage[this_x-1][this_y]=1;
    var ctx=document.getElementById("displaycanvast").getContext("2d");
    ctx.drawImage(images[(this_x-1)*4+this_y], rx+(this_x-1)*Math.floor(card_width*dest_sc), ry+Math.floor(card_height*dest_sc)*this_y, Math.floor(card_width*dest_sc), Math.floor(card_height*dest_sc));
    check_for_displayed(card_num-4);
  }
  if(this_x<width-1 && stage[this_x+1][this_y]==-1) {
    stage[this_x+1][this_y]=1;
    var ctx=document.getElementById("displaycanvast").getContext("2d");
    ctx.drawImage(images[(this_x+1)*4+this_y], rx+(this_x+1)*Math.floor(card_width*dest_sc), ry+Math.floor(card_height*dest_sc)*this_y, Math.floor(card_width*dest_sc), Math.floor(card_height*dest_sc));
    check_for_displayed(card_num+4);
  }
}


var selected_a=0;
var selected_b=0;

function framemg() {
  if(opteban==false) animation();
}

function yourturn() {
  drawyourturn();
  if(plcards[1].length>=0) drawFont(4);
  if(plcards[2].length>=0) drawFont(5);
  if(plcards[3].length>=0) drawFont(6);
}

function opthink(pl) {
  cardpt[pl]=new Array();
  for(var i=0; i<plcards[pl].length; i++) {
    cardpt[pl][i]=0;
  }
  var card_num=new Array();
  for(i=0; i<4; i++) {
    card_num[i]=new Array();
    for(var j=0; j<13; j++) {
      card_num[i][j]=0;
    }
  }

  for(i=0; i<plcards[pl].length; i++) {
    card_num[plcards[pl][i]%4][Math.floor(plcards[pl][i]/4)]=1;
  }

  var ct=0;
  var this_cards=new Array();
  for(i=0; i<4; i++) {
    ct=0;
    this_cards=new Array();
    for(j=5; j>=0; j--) {
      if(card_num[i][j]==1) {
        ct++;
        this_cards.push(j*4+i);
      }
    }
    if(ct>1) {
      for(var k=0; k<plcards[pl].length; k++) {
        if(plcards[pl][k]==this_cards[0]) cardpt[pl][k]+=(5*ct);
      }
    }
    if(ct==1) {
      for(k=0; k<plcards[pl].length; k++) {
        if(plcards[pl][k]==this_cards[0]) cardpt[pl][k]-=(2*Math.floor(this_cards[0]/4));
      }
    }
    ct=0;
    this_cards=new Array();
    for(j=7; j<13; j++) {
      if(card_num[i][j]==1) {
        ct++;
        this_cards.push(j*4+i);
      }
    }
    if(ct>1) {
      for(var k=0; k<plcards[pl].length; k++) {
        if(plcards[pl][k]==this_cards[0]) cardpt[pl][k]+=(5*ct);
      }
    }
    if(ct==1) {
      for(k=0; k<plcards[pl].length; k++) {
        if(plcards[pl][k]==this_cards[0]) cardpt[pl][k]-=(2*(13-Math.floor(this_cards[0]/4)));
      }
    }
  }
}

function animation() {
  opteban=true;
  if(endflag==false) {

    opct++;
    if((opct/15)==1 || (opct/15)==3 || (opct/15)==5) {
      var op=Math.floor(opct/30)+1;
      if(plcards[op].length>0) drawFont(op);

    }
    else if((opct/15)==2 || (opct/15)==4 || (opct/15)==6) {
      var op=opct/30;
      if(plcards[op].length>0) {
        var opflag=false;
        var sl=-1;
        var candidate=new Array();
        for(var i=0; i<plcards[op].length; i++) {
          if((Math.floor(plcards[op][i]/4)>6) && stage[Math.floor(plcards[op][i]/4)-1][plcards[op][i]%4]>0 || (Math.floor(plcards[op][i]/4)<6) && stage[Math.floor(plcards[op][i]/4)+1][plcards[op][i]%4]>0) {
            opflag=true;
            candidate.push(i);
          }
        }

        opthink(op);

        if(candidate.length>0) {
          var max=-100;
          for(i=0; i<candidate.length; i++) {
            if(cardpt[op][candidate[i]]>max) {
              max=cardpt[op][candidate[i]];
              sl=candidate[i];
            }
          }
        }

        if(opflag==false) { //comがパスした場合
          passed[op]++;
          drawPass(op);
          drawFont(op+3);
          drawFont(op+6);
          if(passed[op]==4) {
            var ctx=document.getElementById("displaycanvas").getContext("2d");
            ctx.clearRect(coord[op][0]-10, coord[op][1]-2, Math.floor(card_width*0.75)+card_fix_op*(plcards[op].length)+15, Math.floor(card_height*0.75)+12);
            //setTimeOut("card_draw_trans_act("+op+")", 50);
            selected_op=op;
            setTimeout("card_draw_trans_act()", 10);
            passed_op++;
          }
        }
        else {
          stage[Math.floor(plcards[op][sl]/4)][plcards[op][sl]%4]=1;
          card_place[plcards[op][sl]][0]=0;
          card_place[plcards[op][sl]][1]=(coord[op][0]+card_fix_op*sl)+coord[op][1]*1000;
          card_place[plcards[op][sl]][2]=(rx+Math.floor(plcards[op][sl]/4)*Math.floor(card_width*dest_sc))+(ry+Math.floor(card_height*dest_sc)*(plcards[op][sl]%4))*1000;
          card_place[plcards[op][sl]][3]=dest_sc;

          check_for_displayed(plcards[op][sl]);

          plcards[op].splice(sl, 1);
          card_display(op);

          if(plcards[op]==0) { //クリア時
            cleared.push(op);
            drawFont(op+3);
            drawFont(op+9);
            if(cleared.length+passed_op==4) {
              //endProcess(0);
            }
          }
        }
      }
      if(op==1) {
        if(plcards[2].length==0 && plcards[3].length==0) {
          teban=true;
          yourturn();
          opct+=100;
        }
        else if(plcards[2].length==0) {
          opct+=12;
        }
      }
      if(op==2) {
        if(plcards[3].length==0) {
          teban=true;
          yourturn();
          opct+=100;
        }
      }
      if(op==3) {
        teban=true;
        yourturn();
      }
    }


    for(var i=0; i<width*height; i++) {
      if(card_place[i][0]<1000) {
        if(card_place[i][0]>-1 && card_place[i][0]<1000) {
          var cur_y=Math.floor(card_place[i][1]/1000);
          var cur_x=card_place[i][1]%1000;
          var dest_y=Math.floor(card_place[i][2]/1000);
          var dest_x=card_place[i][2]%1000;
          var old_scale=card_place[i][3];
          card_place[i][3]+=(dest_sc-card_place[i][3])/3;
          var num=card_place[i][0]%100;

          if(Math.abs(cur_x-dest_x)<5 && Math.abs(cur_y-dest_y)<3 || sp==true) {
            card_place[i][0]+=1000;
            if(sp==false) {
              /*ctx=document.getElementById("drawcanvas0").getContext("2d");
              ctx.clearRect(rx+(pl_getcards.length-2)*card_fix, pl_y-20, Math.floor(card_width*dest_sc)+40, Math.floor(card_height*dest_sc)+40);
              ctx=document.getElementById("drawcanvas1").getContext("2d");
              ctx.clearRect(rx+(pl_getcards.length-1)*card_fix, pl_y-20, Math.floor(card_width*dest_sc)+40, Math.floor(card_height*dest_sc)+40);
              ctx=document.getElementById("displaycanvas").getContext("2d");*/


              ctx=document.getElementById("drawcanvas0").getContext("2d");
              ctx.clearRect(cur_x-5, cur_y-5, card_width*old_scale+10, card_height*old_scale+10)
            }
                //ctx.clearRect(rx, pl_y-20, 10+card_width+pl_getcards.length*card_fix, card_height+20);
            ctx=document.getElementById("displaycanvas").getContext("2d");
            ctx.drawImage(images[i], rx+Math.floor(i/4)*Math.floor(card_width*dest_sc), ry+Math.floor(card_height*dest_sc)*(i%4), Math.floor(card_width*dest_sc), Math.floor(card_height*dest_sc));

          }
          else {
            var tent_x=cur_x+Math.floor((dest_x-cur_x)/3);
            var tent_y=cur_y+Math.floor((dest_y-cur_y)/3);
            card_place[i][1]=tent_y*1000+tent_x;
            ctx=document.getElementById("drawcanvas0").getContext("2d");
            ctx.clearRect(cur_x-5, cur_y-5, card_width*old_scale+10, card_height*old_scale+10);
            ctx.drawImage(images[i], tent_x, tent_y, Math.floor(card_width*card_place[i][3]), Math.floor(card_height*card_place[i][3]));
          }
        }
      }
    }
  /*    }
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
  opteban=false;
}


var images={};
var others={};
var loaded=0;
var load_max=61;
var anim_fr=new Array();
var opcount=1000;

window.onload=function(){
  setInterval("animation()", 20);
    for(var i=0; i<52; i++) {
      images[i]=new Image();
      images[i].onload=function(){
          loaded++;
          if(loaded==load_max) {
            atFirst();
            loaded++;
          }
      };
      images[i].src="images/"+(i+1)+".gif";
  }
  for(i=0; i<9; i++) {
      others[i]=new Image();
      others[i].onload=function(){
          loaded++;
          if(loaded==load_max) {
            atFirst();
            loaded++;
          }
      };
      if(i==0) others[i].src="images/sevenback.png";
      if(i==1) others[i].src="images/cardback_seven.png";
      if(i==2) others[i].src="images/com1b.png";
      if(i==3) others[i].src="images/com2b.png";
      if(i==4) others[i].src="images/com3b.png";

      if(i==5) others[i].src="images/sevenpass.png";
      if(i==6) others[i].src="images/oppass.png";
      if(i==7) others[i].src="images/arrow.png";
      if(i==8) others[i].src="images/yourturn.png";
      //if(i==1) others[i].src = "./cardimg/daifuda.png";
     // if(i==2) others[i].src = "./cardimg/bafuda.png";
      //if(i==3) others[i].src = "./cardimg/carddisplay.png";
      //if(i==4) others[i].src = "./cardimg/cardback.png";
  }
};