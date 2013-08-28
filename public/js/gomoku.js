var row=11;
var col=11;
var grp=new Array(); //0:マスが無い 1:カラ 2:黒 3:白
var stage=new Array();
var liv=new Array(); //評価用
var rev=new Array();
var can_place=new Array();
var sp=false;
var touchdev=false;
var bl_width=28;
var fx=4;
var fy=75;
var difficulty=1;
var teban=1;
var plflag=true;
var goflag=true;
var size=0;


function mvfunc(event) {
  var rect=event.target.getBoundingClientRect();
  var x=event.clientX-rect.left;
  var y=event.clientY-rect.top;
}

function clickfunc(event) {
  var rect=event.target.getBoundingClientRect();
  var x=event.clientX-rect.left;
  var y=event.clientY-rect.top;
  execlick(x,y,"md");
}

function upfunc(event) {
  if(ctrl_mode==0) {
    var rect=event.target.getBoundingClientRect();
    var x=event.clientX-rect.left;
    var y=event.clientY-rect.top;
    execlick(x,y,"mu");
  }
}

function touchstart(event) {
  var rect=event.target.getBoundingClientRect();
  var x=event.touches[0].pageX-rect.left;
  var y=event.touches[0].pageY-rect.top;
  var scr_x=document.body.scrollLeft;//横方向のスクロール値
  var scr_y=document.body.scrollTop;//縦方向のスクロール値
  if(touchdev==false) {
    scr_x=0;
    scr_y=0;
  }
  var tx=x-scr_x;
  var ty=y-scr_y;
  var wx=Math.floor((tx-fx)/bl_width);
  var wy=Math.floor((ty-fy)/bl_width);
  if(x>=0 && wx<col+1 && wy<row+1) event.preventDefault();
  execlick(x,y,"md");
}

function touchmove(event) {
  var touch=event.touches[0];
  var x=touch.screenX;
  var y=touch.screenY;
}

function touchend(event) {
  if(ctrl_mode==0) {
  //  var touch=event.changedTouches[0];
  //  var x=touch.screenX;
  //  var y=touch.screenY;
  //  execlick(x,y,"mu");
  }
}

function execlick(this_x, this_y, mode) {

  var scr_x=document.body.scrollLeft;//横方向のスクロール値
  var scr_y=document.body.scrollTop;//縦方向のスクロール値
  if(touchdev==false) {
    scr_x=0;
    scr_y=0;
  }
  var x=this_x-scr_x;
  var y=this_y-scr_y;
  var wx=Math.floor((x-fx)/bl_width);
  var wy=Math.floor((y-fy)/bl_width);

  if(wx>=0 && wx<col && wy>=0 && wy<row && plflag==true && goflag==true && stage[wy*col+wx]==0) {
    stage[wy*col+wx]=2;
    drawStone(wy, wx, 0);
  }
  else if(y<50 && x>=80 && x<=155) {
    /*if(size==0) {
      size=1;
    }
    else if(size==1) {
      size=2;
    }
    else if(size==2) {
      size=0;
    }
    alert("サイズを変更しました。");*/
  }
  else if(y<50 && x>155 && x<=215) {
    var ctx=document.getElementById("displaycanvas").getContext("2d");
    ctx.clearRect(0, 0, 1200, 1200);
    ctx=document.getElementById("drawcanvas").getContext("2d");
    ctx.clearRect(0, 0, 1200, 1200);
    ctx=document.getElementById("touchcanvas").getContext("2d");
    ctx.clearRect(0, 0, 1200, 1200);
    atFirst();
  }
  else if(y<50 && x>215) {
    location.href = "http://offline-app-test-130820.herokuapp.com/index.html";
  }
  else if(y>=button1_y && y<=button1_y+button_height && x>=button1_x && x<button1_x+button_width) {
    if(teban==1) {
      teban=2;
    }
    else if(teban==2) {
      teban=1;
    }
    alert("手番を変更しました。");
  }
  else if(y>=button2_y && y<=button2_y+button_height && x>=button2_x && x<button2_x+button_width) {
    if(difficulty==0) {
      difficulty=1;
      alert("難易度は上級です。");
    }
    else if(difficulty==1) {
      difficulty=0;
      alert("難易度は初級です。");
    }
  }
}

function drawStone(wy, wx, cl) {
  var centerX=fx+wx*bl_width;
  var centerY=fy+wy*bl_width;
  var radius=bl_width*0.88/2;
  var ctx=document.getElementById("drawcanvas").getContext("2d");

  if((cl==0 && teban==1) || (cl==1 && teban==2)) {
    var context=document.getElementById("displaycanvas").getContext("2d");
    /*context.beginPath();
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      context.fillStyle = "#303030";
      context.fill();
      context.lineWidth=1;
      context.strokeStyle="black";
      context.stroke();*/
    context.drawImage(images[0], centerX, centerY, radius*2, radius*2);

      if(cl==1) {
      ctx.beginPath();
        ctx.arc(centerX+bl_width/2-1.2, centerY+bl_width/2-1.2, radius+0.5, 0, 2 * Math.PI, false);
        ctx.lineWidth=3;
        ctx.strokeStyle="#E85252";
        ctx.stroke();
    }
  }
  else {
    ctx.clearRect(0, 0, 1500, 1500);

    var context=document.getElementById("displaycanvas").getContext("2d");
      context.drawImage(images[1], centerX, centerY, radius*2, radius*2);

      if(cl==1) {
      ctx.beginPath();
        ctx.arc(centerX+bl_width/2-1.2, centerY+bl_width/2-1.2, radius+0.5, 0, 2 * Math.PI, false);
        ctx.lineWidth=3;
        ctx.strokeStyle="#E85252";
        ctx.stroke();
    }
  }

  clearCheck();
}

function clearCheck() {
  for(var i=0; i<grp.length; i++) {
    var ret=checkForThreat(i, 1);
    if(ret.length>0) {
      if(ret[0][0][0]==-1) {
        alert("あなたの負けです!");
        goflag=false;
        dswincl=1;
        for(var j=0; j<ret[0][1].length; j++) {
          //setTimeOut(new Function('drawStoneIfWin("'+ret[0][1][j]+'")'), 100*j);
        }
        break;
      }
    }
    ret=checkForThreat(i, 2);
    if(ret.length>0) {
      if(ret[0][0][0]==-1) {
        alert("あなたの勝ちです!");
        goflag=false;
        break;
      }
    }
  }

  if(goflag==true) {
    if(plflag==true) {
      plflag=false;
      setTimeout("think()", 500);
    }
    else {
      plflag=true;
    }
  }
}

var dswinwy=0;
var dswinwx=0;
var dswincl=0;

function drawStoneIfWin(place) {
  var wx=place%col;
  var wy=Math.floor(place/row);
  var centerX=fx+wx*bl_width;
  var centerY=fy+wy*bl_width;
  var radius=bl_width*0.88/2;

  var ctx=document.getElementById("drawcanvas").getContext("2d");

  if(dswincl==0) {
    var context=document.getElementById("displaycanvas").getContext("2d");
    /*context.beginPath();
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      context.fillStyle = "#303030";
      context.fill();
      context.lineWidth=1;
      context.strokeStyle="black";
      context.stroke();*/

    context.drawImage(images[0], centerX, centerY, radius*2, radius*2);
  }
  else if(dswincl==1) {
    ctx.beginPath();
      ctx.arc(centerX+bl_width/2-1.2, centerY+bl_width/2-1.2, radius+0.5, 0, 2 * Math.PI, false);
      ctx.lineWidth=3;
      ctx.strokeStyle="#E85252";
      ctx.stroke();
  }
}

function drawDisplay() {
  for(var i=0; i<row-1; i++) {
    for(var j=0; j<col-1; j++) {
      var this_x=fx+j*bl_width;
      var this_y=fy+i*bl_width;
      var ctx=document.getElementById("displaycanvas").getContext("2d");
      ctx.beginPath();
        ctx.rect(this_x+bl_width/2, this_y+bl_width/2, bl_width, bl_width);
        ctx.lineWidth=2;
        ctx.strokeStyle="#76ADE5";
        ctx.stroke();
    }
  }

  var ctx=document.getElementById("displaycanvas").getContext("2d");
    ctx.font="bold 16px 明朝";
  ctx.fillStyle="#000000";
  if(difficulty==0) {
    ctx.fillText("初級", button2_x+120, button2_y+18);
  }
  else {
    ctx.fillText("上級", button2_x+120, button2_y+18);
  }

  var ctx=document.getElementById("displaycanvas").getContext("2d");
  var grd=ctx.createLinearGradient(button1_x+button_width/2, button1_y, button1_x+button_width/2, button1_y+button_height);

  grd.addColorStop(0, "#e5e5e5");
    grd.addColorStop(1, "#bfbfbf");
    ctx.fillStyle=grd;
  ctx.beginPath();
  ctx.fillRect(button1_x, button1_y, button_width, button_height);
  ctx.rect(button1_x, button1_y, button_width, button_height);
  ctx.lineWidth=2;
    ctx.strokeStyle="#000000";
    ctx.stroke();
    var ctx=document.getElementById("displaycanvas").getContext("2d");
  ctx.font="bold 16px 明朝";
  ctx.fillStyle="#000000";
  ctx.fillText("手番変更", button1_x+14, button1_y+19);

  var ctx=document.getElementById("displaycanvas").getContext("2d");
  var grd=ctx.createLinearGradient(button2_x+button_width/2, button2_y, button2_x+button_width/2, button2_y+button_height);

  grd.addColorStop(0, "#e5e5e5");
    grd.addColorStop(1, "#bfbfbf");
    ctx.fillStyle=grd;
  ctx.beginPath();
  ctx.fillRect(button2_x, button2_y, button_width, button_height);
  ctx.rect(button2_x, button2_y, button_width, button_height);
  ctx.lineWidth=2;
    ctx.strokeStyle="#000000";
    ctx.stroke();
    var ctx=document.getElementById("displaycanvas").getContext("2d");
  ctx.font="bold 16px 明朝";
  ctx.fillStyle="#000000";
  ctx.fillText("難易度", button2_x+23, button2_y+19);
}


var button1_x=30;
var button1_y=fy+row*bl_width+5;
var button_width=96;
var button_height=25;
var button2_x=136;
var button2_y=fy+row*bl_width+5;

function atFirst() {
  plflag=true;
  goflag=true;

  if(navigator.userAgent.indexOf('iPhone') > 0
    || navigator.userAgent.indexOf('iPad') > 0
    || navigator.userAgent.indexOf('Android') > 0) {
     sp=true;
  }
  else sp=false;


    var cvs=document.getElementById("touchcanvas");
  if(navigator.userAgent.indexOf('iPhone') > 0
    || navigator.userAgent.indexOf('iPod') > 0
    || navigator.userAgent.indexOf('iPad') > 0
    || navigator.userAgent.indexOf('Android') > 0) {
     touchdev=true;
  }
  if(touchdev==false) {
    touchcanvas.addEventListener('mousedown',clickfunc,false);
      touchcanvas.addEventListener('mouseup',upfunc,false);
  } else {
     touchcanvas.addEventListener("touchstart", touchstart, false);
     if(sp==false) touchcanvas.addEventListener("touchmove", touchmove, false);
       touchcanvas.addEventListener("touchend", touchend, false);
  }

  if(navigator.userAgent.indexOf('iPhone')>0
    || navigator.userAgent.indexOf('iPod')>0) {
      //ctrl_mode=1;
  }


  if(sp==true) {
    if(size==0) {
      row=11;
      col=11;
    }
    else if(size==1) {
      row=15;
      col=15;
    }
    else if(size==2) {
      row=19;
      col=19;
    }
    bl_width=28;
    fx=4;
    fy=65;
    button1_x=fx+26;
    button1_y=fy+row*bl_width+5;
    button_width=96;
    button_height=25;
    button2_x=fx+132;
    button2_y=fy+row*bl_width+5;
  }
  else {
    if(size==0) {
      row=14;
      col=14;
    }
    else if(size==1) {
      row=18;
      col=18;
    }
    else if(size==2) {
      row=21;
      col=21;
    }
    bl_width=25;
    fx=100;
    fy=65;
    button1_x=fx+36;
    button1_y=fy+row*bl_width+15;
    button_width=96;
    button_height=25;
    button2_x=fx+142;
    button2_y=fy+row*bl_width+15;
  }


  drawDisplay();

  if(teban==2) {
    plflag=false;
    stage[col*(Math.floor(row/2)-1)+Math.floor(col/2)]=1;
    drawStone(Math.floor(row/2)-1, Math.floor(col/2), 1);
  }

  for(var i=0; i<row; i++) {
    grp[grp.length]=new Array();
    for(var j=0; j<col; j++) {
      grp[grp.length-1].push(i*col+j);
    }
  }

  for(j=0; j<col; j++) {
    grp[grp.length]=new Array();
    for(i=0; i<row; i++) {
      grp[grp.length-1].push(i*col+j);
    }
  }

  for(i=row-5; i>=0; i--) {
    grp[grp.length]=new Array();
    for(j=0; j<row-i; j++) {
      grp[grp.length-1].push((i+j)*col+j);
    }
  }

  for(j=1; j<col-4; j++) {
    grp[grp.length]=new Array();
    for(i=0; i<col-j; i++) {
      grp[grp.length-1].push(i*col+(j+i));
    }
  }

  for(j=4; j<col; j++) {
    grp[grp.length]=new Array();
    for(i=0; i<=j; i++) {
      grp[grp.length-1].push(i*col+j-i);
    }
  }

  for(i=1; i<row-4; i++) {
    grp[grp.length]=new Array();
    for(j=col-1; j>=i; j--) {
      grp[grp.length-1].push((i+col-1-j)*col+j);
    }
  }

  liv[0]=new Array();
  liv[1]=new Array();

  for(i=0; i<col*row; i++) {
    rev[i]=new Array();
    can_place[i]=false;
    liv[0][i]=0;
    liv[1][i]=0;
  }

  for(i=0; i<grp.length; i++) {
    for(j=0; j<grp[i].length; j++) {
      rev[grp[i][j]].push(i);
    }
  };
  newgame();
}

function placeArrange() {
  for(var i=0; i<row*col; i++) can_place[i]=false;
  for(var i=0; i<row*col; i++) {
    if(stage[i]!=0) {
      if((i-col*3)>=0 && stage[i-col*3]==0) can_place[i-col*3]=true;
      if((i-col*2)>=0 && stage[i-col*2]==0) can_place[i-col*2]=true;
      if((i-col)>=0 && stage[i-col]==0) can_place[i-col]=true;
      if((i+col*3)>=0 && stage[i+col*3]==0) can_place[i+col*3]=true;
      if((i+col*2)>=0 && stage[i+col*2]==0) can_place[i+col*2]=true;
      if((i+col)>=0 && stage[i+col]==0) can_place[i+col]=true;
      if((i-3)>=0 && stage[i-3]==0) can_place[i-3]=true;
      if((i-2)>=0 && stage[i-2]==0) can_place[i-2]=true;
      if((i-1)>=0 && stage[i-1]==0) can_place[i-1]=true;
      if((i+3)>=0 && stage[i+3]==0) can_place[i+3]=true;
      if((i+2)>=0 && stage[i+2]==0) can_place[i+2]=true;
      if((i+1)>=0 && stage[i+1]==0) can_place[i+1]=true;
      if((i-col*2-1)>=0 && stage[i-col*2-1]==0) can_place[i-col*2-1]=true;
      if((i-col*2+1)>=0 && stage[i-col*2+1]==0) can_place[i-col*2+1]=true;
      if((i-col-1)>=0 && stage[i-col-1]==0) can_place[i-col-1]=true;
      if((i-col-2)>=0 && stage[i-col-2]==0) can_place[i-col-2]=true;
      if((i-col+1)>=0 && stage[i-col+1]==0) can_place[i-col+1]=true;
      if((i-col+2)>=0 && stage[i-col+2]==0) can_place[i-col+2]=true;
      if((i+col*2-1)>=0 && stage[i+col*2-1]==0) can_place[i+col*2-1]=true;
      if((i+col*2+1)>=0 && stage[i+col*2+1]==0) can_place[i+col*2+1]=true;
      if((i+col-1)>=0 && stage[i+col-1]==0) can_place[i+col-1]=true;
      if((i+col-2)>=0 && stage[i+col-2]==0) can_place[i+col-2]=true;
      if((i+col+1)>=0 && stage[i+col+1]==0) can_place[i+col+1]=true;
      if((i+col+2)>=0 && stage[i+col+2]==0) can_place[i+col+2]=true;
    }
  }
}


function think() {
  placeArrange();
  var op_cand=new Array();
  for(var i=0; i<5; i++) op_cand[i]=new Array();

//if five exists;
  for(var i=0; i<row; i++) {
    for(var j=0; j<col; j++) {
      var num=i*row+j;
      if(stage[num]==0) {
        stage[num]=1;
        for(var k=0; k<rev[num].length; k++) {
          var this_threat=checkForThreat(rev[num][k], 1);
          if(this_threat.length>0) {
            if(this_threat[0][0][0]==-1) {
              op_cand[0].push(num);
            }
            if(this_threat[0][0][0]==0) {
              op_cand[1].push(num);
            }
            else {
              for(var l=0; l<this_threat[0][1].length; l++) {
                if(this_threat[0][1][l]==num) {
                  threat_made=true;
                  op_cand[this_threat[0][0][0]+1].push(num);
                  break;
                }
              }
            }
          }
        }
        stage[num]=0;
      }
    }
  }



  var pl_cand=new Array();
  for(var i=0; i<5; i++) pl_cand[i]=new Array();

  for(var k=0; k<grp.length; k++) {
    this_threat=checkForThreat(k, 2);
    if(this_threat.length>0) {
      if(this_threat[0][0][0]==-1) {
        pl_cand[0].push(this_threat[0][2]);
      }
      if(this_threat[0][0][0]==0) {
        pl_cand[1].push(this_threat[0][2]);
      }
      else {
        pl_cand[this_threat[0][0][0]+1].push(this_threat[0][2]);
      }
    }
  }


  var cand=new Array();

  if(op_cand[0].length>0) {
    for(i=0; i<op_cand[0].length; i++) cand.push(op_cand[0][i]);
  }
  else if(pl_cand[2].length>0) {
    for(i=0; i<pl_cand[2].length; i++) {
      for(j=0; j<pl_cand[2][i].length; j++) cand.push(pl_cand[2][i][j]);
    }
  }
  else if(op_cand[1].length>0) {
    for(i=0; i<op_cand[1].length; i++) cand.push(op_cand[1][i]);
  }
  else if(pl_cand[3].length>0) {
    for(i=0; i<pl_cand[3].length; i++) {
      for(j=0; j<pl_cand[3][i].length; j++) cand.push(pl_cand[3][i][j]);
    }
  }

  //alert(cand);

//serach for winning sequence
  if(difficulty==1) {
    db_tree=new Array();
    db_array=new Array();
    var this_col=1;
    for(var i=0; i<row; i++) {
      for(var j=0; j<col; j++) {
        var num=i*row+j;
        if(stage[num]==0) {
          stage[num]=this_col;
          var threat=new Array();
          var win=false;
          var threat_made=false;
          var is_threat=false;
          for(var k=0; k<rev[num].length; k++) {
            var this_threat=checkForThreat(rev[num][k], this_col);
            if(this_threat.length>0) {
              if(this_threat[0][0][0]==-1) {

              }
              if(this_threat[0][0][0]==0) {
                win=true;
              }
              else if(this_threat.length==1) {
                for(var l=0; l<this_threat[0][1].length; l++) {
                  if(this_threat[0][1][l]==num) threat_made=true;
                }
                //threat=this_threat[0];alert("こ"+num+"+"this_threat);
                //for(l=1; l<this_threat[0].length; l++) alert(num+","+this_threat[0][l]);
              }
            }
            if(threat_made==true) break;
          }
          if(win==true) { //straightfourが見つかった場合
            //var send_array=new Array();
            //send_array.push(num);
            //db_array=new Array();
            //db_array[0]=new Array();
            //for(k=0; k<send_array.length; k++) db_array[0][k]=send_array[k];
          }
          else if(threat_made==true) {
            var send_array=new Array();
            send_array.push(num);
            for(k=0; k<this_threat[0][2].length; k++) {
              send_array.push(this_threat[0][2][k]);
            }
            db_array=new Array();
            db_array[0]=new Array();
            for(k=0; k<send_array.length; k++) db_array[0][k]=send_array[k];
            dbSearch(db_array, send_array, num, 0, 1);
          }
          stage[num]=0;
        }
      }
    }

    if(db_tree.length>0) {
      for(i=0; i<db_tree.length; i++) {
        if(db_tree[i][db_tree[i].length-1][db_tree[i][db_tree[i].length-1].length-1]==-1) {
          if(cand.length==0) cand.push(db_tree[i][0][0]);
        }
      }
    }
  }

//evaluate
  var this_col=1;

  placeArrange();

  if(cand.length==0) {
    for(var i=0; i<row; i++) {
      for(var j=0; j<col; j++) {
        var num=i*row+j;
        if(stage[num]==0 && can_place[num]==true) {
          var flag=false;
          cand.push(num);
        }
      }
    }
  }

  var clpt=0;
  var oppt=0;
  for(i=0; i<col*row; i++) {
    liv[1][i]=0;
    liv[0][i]=0;
  }
  for(i=0; i<grp.length; i++) {
    checkForEvaluate(i, 1);
  }

  for(i=0; i<col*row; i++) {
    clpt+=liv[0][i];
    oppt+=liv[1][i];
  }
  var prevpt=clpt-oppt;
  var this_pt=0;
  var max_pt=-10000;
  var ct=0;
  for(i=0; i<cand.length; i++) {
    if(can_place[cand[i]]==true) {
      stage[cand[i]]=this_col;
      for(j=0; j<col*row; j++) {
        liv[1][j]=0;
        liv[0][j]=0;
      }
      for(j=0; j<grp.length; j++) {
        checkForEvaluate(j, 1);
      }
      clpt=0;
      oppt=0;
      for(j=0; j<col*row; j++) {
        clpt+=liv[0][j];
        oppt+=liv[1][j];
      }
      var ct_pt=0;
      //for(j=0; j<col*row; j++) {
        var cl=cand[i]%col;
        var rw=Math.floor(cand[i]/col);
        if(cl>4 && cl<col-4 && rw>4 && rw<row-4)  {
          this_pt+=4;
        }
      //}
      this_pt=clpt-oppt;//if(cand[i]>140 && cand[i]<180) alert(cand[i]+","+clpt+"<"+oppt);
      if(this_pt>max_pt) {
        max_pt=this_pt;
        ct=cand[i];
      }
      stage[cand[i]]=0;
    }
  }
  stage[ct]=1;
  drawStone(Math.floor(ct/col), ct%col, 1);
}

function alertfor(array) {
  var alt=new Array();
  for(j=0; j<row; j++) {
    for(i=0; i<col; i++) {
      alt.push(array[j*col+i]);
    }
    alt.push("+");
  }
  alert(alt);
}

function lineEvaluate(place, cl) {

  for(var i=0; i<1; i++) { //i<rev[place].length; i++) {
    checkForEvaluate(rev[place][i], cl);
  }
}




function newgame() {

     /*stage=[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,2,1,0,0,0,0,0,0,
      0,0,0,0,0,0,2,1,1,0,0,0,0,0,0,
      0,0,0,0,0,0,1,2,1,0,0,0,2,0,0,
      0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];*/

/*  stage=[0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
      0,0,0,0,0,0,1,2,1,0,0,0,2,0,0,
      0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];*/


   stage=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

  /*var this_threat=checkForThreat(0);
  for(var i=0; i<3; i++) {
    for(var j=0; j<this_threat[i].length; j++) {
      alert(this_threat[i][j]);
    }
  }*/

}


function checkForEvaluate(this_num, col) {
  var st_inf=new Array();
  var ret=new Array();
  var this_array=new Array();
  this_array.push(128);
  for(var j=0; j<grp[this_num].length; j++) {
    cl=stage[grp[this_num][j]];
    var ct=1;
    while(stage[grp[this_num][j+ct]]==cl) {
      ct++;
    }
    this_array.push(cl*32+ct);
    j+=(ct-1);
  }
  this_array.push(128);
  return(evaluate(this_array, col, this_num));

}

function evaluate(this_array, col, grp_num) {

//  else if(grp_num<

  /*var ret=new Array();
  for(var i=0; i<2; i++) {
    ret[i]=new Array();
    for(var j=0; j<5; j++) ret[i][j]=0;
  }*/
  var ret=0;
  var array_length=new Array();
  var array_col=new Array();
  for(var i=0; i<this_array.length; i++) {
    array_length.push(this_array[i]%32);
  }
  for(var i=0; i<this_array.length; i++) {
    array_col.push(Math.floor(this_array[i]/32));
  }
  var cl=col; //調査する色
  var op=2;
  if(cl==1) op=2;
  else if(cl==2) op=1;
  var clpt=0;
  var oppt=0;
  var num=0;
  var ct=0;
  var cost=new Array();
  for(var i=1; i<this_array.length-1; i++) {
    var inc=1;
    var tcl=array_col[i];
    if(tcl==cl || tcl==op) {
      num=this_array[i]%32;
      if(num>=5) {
        if(tcl==cl) liv[cl-1][grp[grp_num][ct]]+=10000;
        else if(tcl==op) liv[op-1][grp[grp_num][ct]]+=10000;
      }
      else if(num==4) {
        if(this_array[i-1]<32 && this_array[i+1]<32) { //straight four
          if(tcl==cl) {
            liv[cl-1][grp[grp_num][ct-1]]+=3000;
            liv[cl-1][grp[grp_num][ct+4]]+=3000;
          }
          else if(tcl==op) {
            liv[op-1][grp[grp_num][ct-1]]+=3000;
            liv[op-1][grp[grp_num][ct+4]]+=3000;
          }
        }
        else if((this_array[i-1]<32)^(this_array[i+1]<32)) { //four
          if(this_array[i-1]<32) {
            if(tcl==cl) liv[cl-1][grp[grp_num][ct-1]]+=20;
            else if(tcl==op) liv[op-1][grp[grp_num][ct-1]]+=300;
          }
          else {
            if(tcl==cl) liv[cl-1][grp[grp_num][ct+4]]+=20;
            else if(tcl==op) liv[op-1][grp[grp_num][ct+4]]+=300;
          }
        }
      }
      if(num==3) {
        if((this_array[i-1]<32 && this_array[i+1]<32) && (array_length[i-1]+array_length[i+1])>2) { //three
          if(tcl==cl) {
            if(array_length[i-1]>1) liv[cl-1][grp[grp_num][ct-1]]+=30;
            if(array_length[i+1]>1) liv[cl-1][grp[grp_num][ct+3]]+=300;
          }
          else if(tcl==op) {
            if(array_length[i-1]>1) liv[op-1][grp[grp_num][ct-1]]+=30;
            if(array_length[i+1]>1) liv[op-1][grp[grp_num][ct+3]]+=300;
          }
        }
        else if((this_array[i-1]<32 && array_length[i-1]==1 && this_array[i-2]<128 && array_col[i-2]==tcl)) { //four
          if(tcl==cl) liv[cl-1][grp[grp_num][ct-1]]+=20;
          else if(tcl==op) liv[op-1][grp[grp_num][ct-1]]+=300;
        }
        else if((this_array[i+1]<32 && array_length[i+1]==1 && this_array[i+2]<128 && array_col[i+2]==tcl)) { //four
          if(tcl==cl) liv[cl-1][grp[grp_num][ct+3]]+=20;
          else if(tcl==op) liv[op-1][grp[grp_num][ct+3]]+=300;
        }
        if(array_col[i-1]!=cl && this_array[i-1]>=32 && this_array[i+1]<32 && array_length[i+1]>1) {
          if(tcl==cl) {
            liv[cl-1][grp[grp_num][ct+4]]++;
            liv[cl-1][grp[grp_num][ct+5]]++;
          }
          else if(tcl==op) {
            liv[op-1][grp[grp_num][ct+4]]++;
            liv[op-1][grp[grp_num][ct+5]]++;
          }
        }
        else if(array_length[i-1]>1 && this_array[i-1]<32 && array_col[i+1]!=cl && this_array[i+1]>=32) {
          if(tcl==cl) {
            liv[cl-1][grp[grp_num][ct-1]]++;
            liv[cl-1][grp[grp_num][ct-2]]++;
          }
          else if(tcl==op) {
            liv[op-1][grp[grp_num][ct-1]]++;
            liv[op-1][grp[grp_num][ct-2]]++;
          }
        }
      }
      if(num==2) {
        if(this_array[i+1]<32 && array_length[i+1]==1 && this_array[i+2]<128 && array_col[i+2]==tcl && array_length[i+2]==2) { //four
          if(tcl==cl) liv[cl-1][grp[grp_num][ct+2]]+=30;
          else if(tcl==op) liv[op-1][grp[grp_num][ct+2]]+=300;
        }
        else if(this_array[i-1]<32 && array_length[i-1]==1 && this_array[i-2]<128 && array_col[i-2]==tcl && array_length[i-2]==1 && this_array[i-3]<32 && this_array[i+1]<32) {
          if(tcl==cl) liv[cl-1][grp[grp_num][ct-1]]+=100;
          else if(tcl==op) liv[op-1][grp[grp_num][ct-1]]+=100;
        }
        else if(this_array[i+1]<32 && array_length[i+1]==1 && this_array[i+2]<128 && array_col[i+2]==tcl && array_length[i+2]==1 && this_array[i+3]<32 && this_array[i-1]<32) {
          if(tcl==cl) liv[cl-1][grp[grp_num][ct+2]]+=100;
          else if(tcl==op) liv[op-1][grp[grp_num][ct+2]]+=100;
        }
        else if(this_array[i-1]<32 && this_array[i+1]<32) {
          var al=0;
          if(this_array[i-1]<32) {
            al+=array_length[i-1];
          }
          if(this_array[i+1]<32) {
            al+=array_length[i+1];
          }
          if(al>3 && array_length[i-1]>1 && array_length[i+1]>1) { //to straight three
            ret+=2;
            if(tcl==cl) {
              liv[cl-1][grp[grp_num][ct-1]]+=3;
              liv[cl-1][grp[grp_num][ct+2]]+=3;
            }
            else if(tcl==op) {
              liv[op-1][grp[grp_num][ct-1]]+=3;
              liv[op-1][grp[grp_num][ct+2]]+=3;
            }
          }
          if((array_length[i-1]>2 && array_length[i+1]>0) || (array_length[i-1]>0 && array_length[i+1]>2)) { // to broken three
            ret+=2;
            if(tcl==cl) {
              if(array_length[i-1]>2) liv[cl-1][grp[grp_num][ct-2]]+=3;
              if(array_length[i+1]>2) liv[cl-1][grp[grp_num][ct+3]]+=3;
            }
            else if(tcl==op) {
              if(array_length[i-1]>2) liv[op-1][grp[grp_num][ct-2]]+=3;
              if(array_length[i+1]>2) liv[op-1][grp[grp_num][ct+3]]+=3;
            }
          }
        }
      }
      if(num==1) {

        if(this_array[i-1]<32 && array_length[i+1]==1 && this_array[i+1]<32 && array_col[i+2]==tcl && array_length[i+2]==1 && array_length[i+3]<32) { //010100
          al=array_length[i-1]+array_length[i+3];
          if(al>2) {
            ret++;
            if(tcl==cl) {
              liv[cl-1][grp[grp_num][ct+1]]++;
              if(array_length[i-1]>1) liv[cl-1][grp[grp_num][ct-1]]++;
              if(array_length[i+3]>1) liv[cl-1][grp[grp_num][ct+3]]++;
            }
            else if(tcl==op) {
              liv[op-1][grp[grp_num][ct+1]]++;
              if(array_length[i-1]>1) liv[op-1][grp[grp_num][ct-1]]++;
              if(array_length[i+3]>1) liv[op-1][grp[grp_num][ct+3]]++;
            }
          }
        }
        else if(this_array[i-1]<32 && array_length[i+1]==2 && this_array[i+1]<32 && array_col[i+2]==tcl && array_length[i+2]==1 && array_length[i+3]<32) {
          al=array_length[i-1]+array_length[i+3];
          if(al>2) {
            ret++;
            if(tcl==cl) {
              liv[cl-1][grp[grp_num][ct+1]]++;
              liv[cl-1][grp[grp_num][ct+2]]++;
              if(array_length[i-1]>1) liv[cl-1][grp[grp_num][ct-1]]++;
              if(array_length[i+3]>1) liv[cl-1][grp[grp_num][ct+4]]++;
            }
            else if(tcl==op) {
              liv[op-1][grp[grp_num][ct+1]]++;
              liv[op-1][grp[grp_num][ct+2]]++;
              if(array_length[i-1]>1) liv[op-1][grp[grp_num][ct-1]]++;
              if(array_length[i+3]>1) liv[op-1][grp[grp_num][ct+4]]++;
            }
          }
        }
        else if(this_array[i-1]<32 || this_array[i+1]<32) {
          var al=0;
          if(this_array[i-1]<32) {
            al+=array_length[i-1];
          }
          if(this_array[i+1]<32) {
            al+=array_length[i+1];
          }
          if(al>4 && array_length[i-1]>1 && array_length[i+1]>1) {
            ret+=2;
            if(tcl==cl) {
              if(array_length[i-1]>3) liv[cl-1][grp[grp_num][ct-3]]++;
              else if(array_length[i-1]>2) liv[cl-1][grp[grp_num][ct-2]]++;
              else if(array_length[i-1]>1) liv[cl-1][grp[grp_num][ct-1]]++;
              if(array_length[i+1]>3) liv[cl-1][grp[grp_num][ct+3]]++;
              else if(array_length[i+1]>2) liv[cl-1][grp[grp_num][ct+2]]++;
              else if(array_length[i+1]>1) liv[cl-1][grp[grp_num][ct+1]]++;
            }
            else if(tcl==op) {
              if(array_length[i-1]>3) liv[op-1][grp[grp_num][ct-3]]++;
              else if(array_length[i-1]>2) liv[op-1][grp[grp_num][ct-2]]++;
              else if(array_length[i-1]>1) liv[op-1][grp[grp_num][ct-1]]++;
              if(array_length[i+1]>3) liv[op-1][grp[grp_num][ct+3]]++;
              else if(array_length[i+1]>2) liv[op-1][grp[grp_num][ct+2]]++;
              else if(array_length[i+1]>1) liv[op-1][grp[grp_num][ct+1]]++;
            }
          }
        }
      }
    }
    ct+=array_length[i];

  }
  return(ret);
}

var depth=2;

function dbSearch(db_array, node_array, place, this_depth, this_col) {
  if(this_depth>=8) return;
  else {
    var cl=this_col;
    var op=2;
    if(cl==1) op=2;
    else if(cl==2) op=1;
    var isThreat=false;
    stage[place]=cl;
    for(var i=1; i<node_array.length; i++) {
      stage[node_array[i]]=op;
    }

    for(i=0; i<rev[place].length; i++) {
      for(var j=0; j<grp[rev[place][i]].length; j++) {
        if(stage[grp[rev[place][i]][j]]==0) {
          stage[grp[rev[place][i]][j]]=cl;
          var win=false;
          var threat_made=false;
          var threat_array=new Array();
          for(var k=0; k<rev[grp[rev[place][i]][j]].length; k++) {

            var this_threat_made=false;
            var this_threat=checkForThreat(rev[grp[rev[place][i]][j]][k], cl);
            if(this_threat.length>0) {
              isThreat=true;
              if(this_threat[0][0][0]==-1) {
                win=true;
              }
              if(this_threat[0][0][0]==0) {
                win=true;
              }
              else {
                for(var l=0; l<this_threat[0][1].length; l++) {
                  if(this_threat[0][1][l]==grp[rev[place][i]][j]) {
                    this_threat_made=true;
                    threat_array[threat_array.length]=new Array();
                    for(var m=0; m<3; m++) {
                      threat_array[threat_array.length-1][m]=new Array();
                      for(var n=0; n<this_threat[0][m].length; n++) {
                        threat_array[threat_array.length-1][m][n]=this_threat[0][m][n];
                      }
                    }
                    threat_made=true;
                  }
                  if(this_threat_made==true) break;
                }
              }
            }
          }

          var this_threat=new Array();
          if(threat_array.length==1) {
            this_threat[0]=new Array();
            for(var m=0; m<3; m++) {
              this_threat[0][m]=new Array();
              for(var n=0; n<threat_array[0][m].length; n++) {
                this_threat[0][m][n]=threat_array[0][m][n];
              }
            }
          }
          else if(threat_array.length>1) {
            this_threat[0]=new Array();
            var decied=false;
            var ct_num=0;
            for(var m=0; m<threat_array.length; m++) {
              if(threat_array[m][0]==1) ct_num=m;
            }
            for(var m=0; m<3; m++) {
              this_threat[0][m]=new Array();
              for(var n=0; n<threat_array[ct_num][m].length; n++) {
                this_threat[0][m][n]=threat_array[ct_num][m][n];
              }
            }
          }

          if(win==true) { //straightfourが見つかった場合
            db_array[db_array.length]=new Array();
            db_array[db_array.length-1][0]=grp[rev[place][i]][j];
            db_array[db_array.length-1][1]=-1;
            addToDbTree(db_array);
          }
          else if(threat_made==true) {
            var send_array=new Array();
            send_array.push(grp[rev[place][i]][j]);
            for(k=0; k<this_threat[0][2].length; k++) {
              send_array.push(this_threat[0][2][k]);
            }
            var this_db_array=new Array();
            for(k=0; k<db_array.length; k++) {
              this_db_array[k]=new Array();
              for(var l=0; l<db_array[k].length; l++) {
                this_db_array[k][l]=db_array[k][l];
              }
            }
            this_db_array[this_db_array.length]=new Array();
            for(k=0; k<send_array.length; k++) this_db_array[this_db_array.length-1][k]=send_array[k];
            dbSearch(this_db_array, send_array, send_array[0], ++this_depth, this_col);
          }
          stage[grp[rev[place][i]][j]]=0;
        }
      }
    }

    stage[place]=0;
    for(var i=1; i<node_array.length; i++) {
      stage[node_array[i]]=0;
    }

    if(isThreat==false) {
      addToDbTree(db_array);
    }
  }
}


var db_tree=new Array();

function addToDbTree(this_db_array) {
  db_tree[db_tree.length]=new Array();
  for(var i=0; i<this_db_array.length; i++) {
    db_tree[db_tree.length-1][i]=new Array();
    for(var j=0; j<this_db_array[i].length; j++) {
      db_tree[db_tree.length-1][i][j]=this_db_array[i][j];
    }
  }
}

function checkForThreat(this_num, col) {
  var st_inf=new Array();
  var ret=new Array();
  var this_array=new Array();
  this_array.push(128);
  for(var j=0; j<grp[this_num].length; j++) {
    cl=stage[grp[this_num][j]];
    var ct=1;
    while(stage[grp[this_num][j+ct]]==cl) {
      ct++;
    }
    this_array.push(cl*32+ct);
    j+=(ct-1);
  }
  this_array.push(128);
  return(analyze(this_array, this_num, col));

}


function analyze(this_array, grp_num, color) {
  var ret=new Array();
  var array_length=new Array();
  var array_col=new Array();
  for(var i=0; i<this_array.length; i++) {
    array_length.push(this_array[i]%32);
  }
  for(var i=0; i<this_array.length; i++) {
    array_col.push(Math.floor(this_array[i]/32));
  }
  var cl=color; //調査する色
  var op=2;
  if(cl==1) op=2;
  else if(cl==2) op=1;
  var num=0;
  var ct=0;
  var cost=new Array();
  for(var i=1; i<this_array.length-1; i++) {
    if(Math.floor(this_array[i]/32)==cl) {
      num=this_array[i]%32;
      if(num>=5) {
        ret[ret.length]=new Array();
        for(var j=0; j<3; j++) ret[ret.length-1][j]=new Array();
        ret[ret.length-1][0].push(-1);
        for(j=0; j<num; j++) {
          ret[ret.length-1][1].push(grp[grp_num][ct+j]);
        }
      }
      else if(num==4) {
        if(this_array[i-1]<32 && this_array[i+1]<32) { //straight four
          ret[ret.length]=new Array();
          for(var j=0; j<3; j++) ret[ret.length-1][j]=new Array();
          ret[ret.length-1][0].push(0);
          for(j=0; j<num; j++) {
            ret[ret.length-1][1].push(grp[grp_num][ct+j]);
          }
        }
        else if((this_array[i-1]<32)^(this_array[i+1]<32)) { //four
          if(this_array[i-1]<32) {
            ret[ret.length]=new Array();
            for(j=0; j<3; j++) ret[ret.length-1][j]=new Array();
            ret[ret.length-1][0].push(1);
            for(j=0; j<num; j++) {
              ret[ret.length-1][1].push(grp[grp_num][ct+j]);
            }
            ret[ret.length-1][2].push(grp[grp_num][ct-1]);
          }
          else {
            ret[ret.length]=new Array();
            for(j=0; j<3; j++) ret[ret.length-1][j]=new Array();
            ret[ret.length-1][0].push(1);
            for(j=0; j<num; j++) {
              ret[ret.length-1][1].push(grp[grp_num][ct+j]);
            }
            ret[ret.length-1][2].push(grp[grp_num][ct+4]);
          }
        }
      }
      if(num==3) {
        if((this_array[i-1]<32 && array_length[i-1]==1 && this_array[i-2]<128 && array_col[i-2]==cl)) { //four
          ret[ret.length]=new Array();
          for(j=0; j<3; j++) ret[ret.length-1][j]=new Array();
          ret[ret.length-1][0].push(1);
          for(j=0; j<num; j++) {
            ret[ret.length-1][1].push(grp[grp_num][ct+j]);
          }
          ret[ret.length-1][1].push(grp[grp_num][ct-2]);
          ret[ret.length-1][2].push(grp[grp_num][ct-1]);
        }
        else if((this_array[i+1]<32 && array_length[i+1]==1 && this_array[i+2]<128 && array_col[i+2]==cl)) { //four
          ret[ret.length]=new Array();
          for(j=0; j<3; j++) ret[ret.length-1][j]=new Array();
          ret[ret.length-1][0].push(1);
          for(j=0; j<num; j++) {
            ret[ret.length-1][1].push(grp[grp_num][ct+j]);
          }
          ret[ret.length-1][1].push(grp[grp_num][ct+4]);
          ret[ret.length-1][2].push(grp[grp_num][ct+3]);
        }
        else if((this_array[i-1]<32 && this_array[i+1]<32) && (array_length[i-1]+array_length[i+1])>2) { //three
          ret[ret.length]=new Array();
          for(j=0; j<3; j++) ret[ret.length-1][j]=new Array();
          ret[ret.length-1][0].push(2);
          for(j=0; j<num; j++) {
            ret[ret.length-1][1].push(grp[grp_num][ct+j]);
          }

          if(array_length[i-1]==1 && array_length[i+1]>1) {
            ret[ret.length-1][2].push(grp[grp_num][ct-1]);
            ret[ret.length-1][2].push(grp[grp_num][ct+3]);
            ret[ret.length-1][2].push(grp[grp_num][ct+4]);
          }
          else if(array_length[i+2]==1 && array_length[i-1]>1) {
            ret[ret.length-1][2].push(grp[grp_num][ct-1]);
            ret[ret.length-1][2].push(grp[grp_num][ct-2]);
            ret[ret.length-1][2].push(grp[grp_num][ct+3]);
          }
          else {
            ret[ret.length-1][2].push(grp[grp_num][ct-1]);
            ret[ret.length-1][2].push(grp[grp_num][ct+3]);
          }
        }
      }
      if(num==2) {
        if(this_array[i+1]<32 && array_length[i+1]==1 && this_array[i+2]<128 && array_col[i+2]==cl && array_length[i+2]==2) { //four
          ret[ret.length]=new Array();
          for(j=0; j<3; j++) ret[ret.length-1][j]=new Array();
          ret[ret.length-1][0].push(1);
          for(j=0; j<num; j++) {
            ret[ret.length-1][1].push(grp[grp_num][ct+j]);
          }
          ret[ret.length-1][1].push(grp[grp_num][ct+3]);
          ret[ret.length-1][1].push(grp[grp_num][ct+4]);
          ret[ret.length-1][2].push(grp[grp_num][ct+2]);
        }
        else if(this_array[i-1]<32 && array_length[i-1]==1 && this_array[i-2]<128 && array_col[i-2]==cl && array_length[i-2]==1 && this_array[i-3]<32 && this_array[i+1]<32) {
          ret[ret.length]=new Array();
          for(j=0; j<3; j++) ret[ret.length-1][j]=new Array();
          ret[ret.length-1][0].push(2);
          for(j=0; j<num; j++) {
            ret[ret.length-1][1].push(grp[grp_num][ct+j]);
          }
          ret[ret.length-1][1].push(grp[grp_num][ct-2]);

          ret[ret.length-1][2].push(grp[grp_num][ct-3]);
          ret[ret.length-1][2].push(grp[grp_num][ct-1]);
          ret[ret.length-1][2].push(grp[grp_num][ct+2]);
        }
        else if(this_array[i+1]<32 && array_length[i+1]==1 && this_array[i+2]<128 && array_col[i+2]==cl && array_length[i+2]==1 && this_array[i+3]<32 && this_array[i-1]<32) {
          ret[ret.length]=new Array();
          for(j=0; j<3; j++) ret[ret.length-1][j]=new Array();
          ret[ret.length-1][0].push(2);
          for(j=0; j<num; j++) {
            ret[ret.length-1][1].push(grp[grp_num][ct+j]);
          }
          ret[ret.length-1][1].push(grp[grp_num][ct+3]);

          ret[ret.length-1][2].push(grp[grp_num][ct-1]);
          ret[ret.length-1][2].push(grp[grp_num][ct+2]);
          ret[ret.length-1][2].push(grp[grp_num][ct+4]);
        }
      }
    }
    ct+=array_length[i];
  }
  return(ret);
}

var load_max=5;
var loaded=0;
var images=new Array();
window.onload = function(){

    for(var i=0; i<5; i++) {
      images[i]=new Image();
      images[i].onload=function(){
          loaded++;
          if(loaded==load_max) atFirst();
      }
      if(i==0) images[i].src="images/black.png";
      if(i==1) images[i].src="images/white.png";
      if(i==2) images[i].src="images/white2.png";
      if(i==3) images[i].src="images/difficulty.png";
      if(i==4) images[i].src="images/teban.png";
  }
}

















