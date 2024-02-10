var bord = [[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,0,0,0,0,0,0,0,0,-1],[-1,0,0,0,0,0,0,0,0,-1],[-1,0,0,0,0,0,0,0,0,-1],[-1,0,0,0,2,1,0,0,0,-1],[-1,0,0,0,1,2,0,0,0,-1],[-1,0,0,0,0,0,0,0,0,-1],[-1,0,0,0,0,0,0,0,0,-1],[-1,0,0,0,0,0,0,0,0,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]];
var image = ["","img/black.png","img/white.png"];
var now = 1;
var tagList,blindmode,speed,TimeID,color,d ='',color;
//ノーマル,早指し,目隠し

function setup(){
    blindmode = document.getElementById("blind").checked;
    speed = document.getElementById("time").value;
    document.body.innerHTML = "<table id='table'></table><p id='color'>黒の手番</p>";
    var table = document.getElementById("table");
    color = document.getElementById("color").innerHTML;
    var x,y;
    for(y = 1; y <= 8; y++){
        d += "<tr>";
        for(x = 1; x <= 8; x++){
            d += "<td onclick='put(this.parentNode.rowIndex + 1,this.cellIndex + 1)'><div><img></div></td>";
        }
        d += "</tr>";
    }
    table.innerHTML = d;
    
    tagList = document.getElementsByTagName("img");
    var f = 0;
    for(var i = 1;i <= 8;i++){
        for(var j = 1;j <= 8;j++){
            tagList[f].src = image[bord[i][j]];
            f++;
        }
    }
    if(blindmode) image = ["","",""];
}

function put(row,cell){
    tagList[27].src = image[bord[4][4]];
    tagList[28].src = image[bord[4][5]];
    tagList[35].src = image[bord[5][4]];
    tagList[36].src = image[bord[5][5]];
    if(check(row,cell) === 1){
        clearTimeout(TimeID);
        reverse(row,cell);
        if(speed != -1) TimeID = setTimeout(end,speed,"time");
    }
    if(now == 2){
        color = color.replace("黒","白");
    }else{
        color = color.replace("白","黒");
    }
    document.getElementById("color").innerHTML = color;
}

function reverse(row,cell){//反転
    var count,d,e,i;

    for (d = -1; d <= 1; d++){
        for (e = -1; e <= 1; e++){
            if (d === 0 && e === 0) continue; 
            count = revcnt(row,cell,d,e);
            for (i = 1; i <= count; i++) {
                bord[row + i * d][cell + i * e] = now;
                tagList[(row - 1 + i * d) * 8 + (cell - 1 + i * e)].src = image[now];
            }
        }
    }
    bord[row][cell] = now;
    tagList[(row - 1) * 8 + (cell - 1)].src = image[now];

    now = 3 -now;
    if(nextcheck() === 0){
        now = 3 - now;
        if(nextcheck() === 0){
            end("stone");
        }
    }
}

function revcnt(row,cell,d,e){//反転カウント
    var i;
    for (i = 1;bord[row + i * d][cell + i * e] === 3 - now;i++) {};        
    
    if (bord[row + i * d][cell + i * e] === now) {                             
        return i-1;   
    } else {
        return 0;   
    }
}

function check(row,cell){//置けるか判定
    for (var d = -1; d <= 1; d++) {
        for (var e = -1; e <= 1; e++){
            if(bord[row][cell] != 0) return 0;
            if(revcnt(row,cell,d,e) >= 1) return 1;
        }
    }
    return 0;
}

function nextcheck(){//置く場所があるか
    for (i = 1; i <= 8; i++) {
        for (j = 1; j <= 8; j++) {
            if (check(i,j) === 1) return 1;
        }
    }
    return 0;
}

function end(cause){
    var black = 0,white = 0,text = "置けるところがなくなった!";
    document.getElementById("color").remove();
    if(blindmode){
        var image = ["","img/black.png","img/white.png"];
        var f = 0;
        for(var i = 1;i <= 8;i++){
            for(var j = 1;j <= 8;j++){
                tagList[f].src = image[bord[i][j]];
                f++;
            }
        }
    }
    for(var i = 1;i <= 8;i++){
        for(var j = 1;j <= 8;j++){
            if(bord[i][j] === 1){
                black++;
            }else if(bord[i][j] === 2){
                white++;
            }
        }
    }
    if(cause == "time"){
        text = "タイムアップ!";
        if(now === 1){
            text += "<h1>白の勝利!!</h1>";
        }else{
            text += "<h1>黒の勝利!!</h1>";
        }
    }else{
        if(black > white){
            text += "<h1>黒の勝利!!</h1>";
        }else if(black < white){
            text += "<h1>白の勝利!!</h1>";
        }else{
            text += "<h1>引き分け!!</h1>";
        }
    }
    document.body.innerHTML += text + "<h2>黒:" + black + " VS 白:" + white + "</h2>";
    now =  -4;
}