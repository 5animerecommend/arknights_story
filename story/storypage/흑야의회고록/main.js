var image_fexli = "https://raw.githubusercontent.com/fexli/ArknightsResource/main/avgs/";
var optlist = [];
var optmove = [];
var firstopt = [];


function request(url, a, num) {
  var requestURL = url + ".json";
  var request = new XMLHttpRequest();
  request.open("GET", requestURL);
  request.responseType = "json";
  request.send();
  request.onload = function () {
    var content = request.response;
    if (a == 1) {
      makebutton(content);
    } //초기 버튼 생성
    else if (a == 2) {
      showstory(content, num);
    } //버튼 눌렀을 때
    else if (a == 3) {
      buttoncolor(content, num);
    } //버튼색리셋
    else if (a == 4) {
      readname(content, num, url);
    
    } //버튼 제목 주기
  };
}

request("main_index", 1);
//버튼 생성
var s = 0;
function makebutton(jsonObj) {
  for (var i = 0; i < jsonObj.length; i++) {
    a = jsonObj[i].replace('level_main_', "");
    a = a.replace('level_st_05-01', "05-11");
    a = a.replace('_beg', "작전 전");
    a = a.replace('_end', "작전 후");
    let path = '../../resource/storyjson/activities/흑야의회고록/' + jsonObj[i];
    document.getElementById("차례제목").insertAdjacentHTML("beforeend",'<div class="버튼" id="자리'+i+'"></div>');
    request(path, 4, i);
  }

}

//버튼색 리셋
function buttoncolor(jsonObj, num) {
  for (var i = 0; i < jsonObj.length; i++) {
    document.getElementById("버튼" + i).style.backgroundColor = "#545454";
    
  }
  document.getElementById("버튼" + num).style.backgroundColor = "white";
}


//스토리 보여주기
function showstory(jsonObj, num) {
  optlist = [];
  optmove = [];
  firstopt = [];
  request("main_index", 3, num);
  document.getElementById("스토리").innerHTML = "";
  var len = jsonObj["storyList"].length;
  for (var i = 0; i < jsonObj["storyList"].length; i++) {
    var div = document.createElement("div");
    div.classList.add("한줄");
    var namediv = document.createElement("div");
    namediv.classList.add("이름칸");
    var dialoguediv = document.createElement("div");
    dialoguediv.classList.add("대사칸");
    var blank = document.createElement("br");
    var imgdiv = document.createElement("div");
    imgdiv.classList.add("이미지");
    if (jsonObj["storyList"][i]["prop"] == "Image") {
      //이미지, 배경(추후개발)
      imgdiv.id = "line" + i;
      var img = document.createElement("img");
      if (jsonObj["storyList"][i]["attributes"]["image"] == null) {
        continue;
      }
      img.src = image_fexli + jsonObj["storyList"][i]["attributes"]["image"] + ".png";
      img.style.width = "50%";
      imgdiv.append(img, blank);
      //document.body.append(imgdiv, blank);
      document.getElementById("스토리").append(imgdiv);
    } else if (jsonObj["storyList"][i]["prop"] == "Background") {
      //이미지, 배경(추후개발)
      imgdiv.id = "line" + i;
      var img = document.createElement("img");
      if (jsonObj["storyList"][i]["attributes"]["image"] == null) {
        continue;
      }
      img.src =
        image_fexli + "bg/" + jsonObj["storyList"][i]["attributes"]["image"] + ".png";
      img.style.width = "30%";
      imgdiv.append(img, blank);
      //document.body.append(imgdiv, blank);
      document.getElementById("스토리").append(imgdiv);
    } else if (jsonObj["storyList"][i]["prop"] == "ImageTween") {
      continue;
    } //null
      
    else if (jsonObj["storyList"][i]["prop"] == "Decision") {
      firstopt.push(i);
      //선택지
      optlist = jsonObj["storyList"][i]["attributes"]["options"].split(";");
      for (let j = 0; j < optlist.length; j++) {
        var linenum = jsonObj["storyList"][i]["targetLine"]["option" + (j + 1)];
        if (linenum == "") {
          optmove.push(i+1);
          document.getElementById("스토리").insertAdjacentHTML("beforeend", '<div class="선택지" id="line'+i+'"><button class="선택지버튼" onclick="showopt('+ (i+1) + "," + (i+1) + ',' + (i+1) +',' + (i+1) + ','+ len+')">' + optlist[0] + "</button></div>");
          
        }
        else {
          let lnum = Number(linenum.replace('line', ""));
          optmove.push(lnum);
        }
      }
    } else if (jsonObj["storyList"][i]["prop"] == "Predicate" && jsonObj["storyList"][i]["endOfOpt"] == false) {
        if (optmove.length == 1) {
          document.getElementById("스토리").insertAdjacentHTML("beforeend", '<div class="선택지" id="line'+(i-1)+'"><button class="선택지버튼" onclick="showopt('+ (i) + "," + i + ',' + i +',' + i + ','+ len+')">' + optlist[0] + "</button></div>");
        }
        else if (jsonObj["storyList"][i]["targetLine"] == null) {
          let k = '<div id="line'+(i-1)+'">';
          for (let j = 0; j < optlist.length; j++) {
            k += '<div class="선택지"><button class="선택지버튼" onclick="showopt('+ i + "," + i + ',' + i +',' + i + ','+ len+')">' + optlist[j] + "</button></div>";

          }
          k += '</div>';
          document.getElementById("스토리").insertAdjacentHTML("beforeend", k);
        }
        else {
          //선택지 이후 대사길이, 버튼
          let end = jsonObj["storyList"][i]["targetLine"]
          let endopt = Number(end.replace('line', ""));
          optmove.push(endopt);
          let k = '<div id="line'+(i-1)+'">';
          for (let j = 0; j < optlist.length; j++) {
            k += '<div class="선택지"><button class="선택지버튼" onclick="showopt('+ optmove[j] + "," + optmove[j+1] + "," + i + ','+ endopt +','+ len+')">' + optlist[j] + "</button></div>";

            }
          k += '</div>';
          document.getElementById("스토리").insertAdjacentHTML("beforeend", k);
        }
       
          //showopt('보여줄라인시작점, 보여줄라인끝점, 선택지1시작점, 선택지끝점)

      optmove = [];
      optlist = [];
    } 
      /*
      else if (jsonObj["0_welcome_to_guide"][i]["name"] == "--background--") { //배경 전환
        var background = document.createElement("div");
        var bkgobd = document.createElement("div");
        bkgobd.classList.add("배경감지");
        document.body.append(bkgobd);
        background.classList.add("배경");
        background.style.backgroundImage = "url(" + jsonObj["0_welcome_to_guide"][i]["dialogue"] + ")";
        background.style.position = "fixed";
        background.style.zIndex = "-1";
        document.body.append(background); */
    else if (jsonObj["storyList"][i]["prop"] == "name") {

      //대사창
      div.id = "line" + i;
      var name = document.createElement("span");
      name.classList.add("이름");
      var dialogue = document.createElement("span");
      dialogue.classList.add("대사");
      name.textContent = jsonObj["storyList"][i]["attributes"]["name"];
      dialogue.textContent = jsonObj["storyList"][i]["attributes"]["content"];
      namediv.append(name);
      dialoguediv.append(dialogue);
      div.append(namediv, dialoguediv, blank);

      document.getElementById("스토리").append(div);
    }
  }

  for (let i = firstopt[0]+1; i < len; i++) {
    if (document.getElementById("line" + i) != null){
      document.getElementById("line" + i).style.display = "none";
    }
    
    
  }
  firstopt.push(jsonObj["storyList"].length);
  document.getElementById("스토리").scrollTo({ top: 0, behavior: "smooth" });
}


function showopt(보여줄라인시작점, 보여줄라인끝점, 선택지1시작점, 선택지끝점, 총길이) {

  if (선택지1시작점 == 선택지끝점) {
    if (선택지1시작점-1 == firstopt[0]) {
      firstopt.shift();
      for (let i = 선택지1시작점; i < firstopt[0]+1; i++) {
          if (document.getElementById("line" + i) != null) {
            if (document.getElementById("line" + i).classList.contains('이미지')==true) {
              document.getElementById("line" + i).style.display = "block";
            }
            else if (document.getElementById("line" + i).classList.contains('한줄')==true) {
              document.getElementById("line" + i).style.display = "flex";
            }
            else {
              document.getElementById("line" + i).style.display = "flex";
              document.getElementById("line" + i).style.flexDirection = 'column';

            } 
          }

      }
    }
    
  }
  else {

    if (선택지1시작점-1 == firstopt[0]) {
      firstopt.shift();}
    for (let i = 선택지1시작점; i < 선택지끝점; i++) {
      if (document.getElementById("line" + i) != null) {
        document.getElementById("line" + i).style.display = "none";
      }
 
    }
    for (let i = 보여줄라인시작점; i < 보여줄라인끝점; i++) {
      if (document.getElementById("line" + i) != null) {
        if (document.getElementById("line" + i).classList.contains('이미지')==true) {
          document.getElementById("line" + i).style.display = "block";
        }
        else if (document.getElementById("line" + i).classList.contains('한줄')==true) {
          document.getElementById("line" + i).style.display = "flex";
        }
        else {
          document.getElementById("line" + i).style.display = "flex";
          document.getElementById("line" + i).style.flexDirection = 'column';
      }
    }
      for (let i = 선택지끝점; i < firstopt[0]+1; i++) {
        if (document.getElementById("line" + i) != null){
          if (document.getElementById("line" + i).classList.contains('이미지')==true) {
            document.getElementById("line" + i).style.display = "block";
          }
          else if (document.getElementById("line" + i).classList.contains('한줄')==true) {
            document.getElementById("line" + i).style.display = "flex";
          }
          else {
            document.getElementById("line" + i).style.display = "flex";
            document.getElementById("line" + i).style.flexDirection = 'column';
          }
        }
      }
  }
  
  }
}

function readname(jsonObj, i, path) {
  document.getElementById("자리"+i).insertAdjacentHTML("beforeend",'<button class="차례버튼" id="버튼' + i + '" onclick="request(\''+ path + "'," + 2 + "," + i + ')">' + jsonObj["storyCode"]+" "+jsonObj["avgTag"] + "</button>");

}