function request(url, a, num, path) {
  var requestURL = url + ".json";
  var request = new XMLHttpRequest();
  request.open("GET", requestURL);
  request.responseType = "json";
  request.send();
  request.onload = function () {
    var content = request.response;
    if (a == 0) {
      bannershow(content);
    }
    else if (a == 1) {
      메인 = num.split('_');
      var numm = '';
      if (메인[0] == 'main') {
        numm = 'obt/'+메인[0] + '/' + 메인[1]+ '/';
      }
      else {
        numm = 'activities/'+메인[0]+'/';
      }
      makebutton(content, numm, num);
    } //초기 버튼 생성
    else if (a == 2) {
      showstory(content, num, path);
    } //버튼 눌렀을 때
    else if (a == 3) {
      var bgm1 = document.getElementById("music");
      var bgm2 = document.getElementById("musicloop");
      bgm1.muted = false;
      bgm2.muted = false;
      buttoncolor(content, num);
    } //버튼색리셋
    else if (a == 4) {
      readname(content, num, url, path);
    }//버튼 제목 주기
    else if (a == 5) {
      
      startbgm(content, num)
    } //bgm

     
  };
}


var image_fexli = "https://raw.githubusercontent.com/fexli/ArknightsResource/main/avgs/";
var music = "https://raw.githubusercontent.com/akgcc/arkdata/main/assets/torappu/dynamicassets/audio/sound_beta_2/music/"
var char_url = "https://cdn.jsdelivr.net/gh/akgcc/arkdata@main/thumbs/"
var optlist = [];
var optmove = [];
var firstopt = [];
var nowbgm = [];
var bgmlist = [];
var nowplay;
const bgm = ["reawakeningpiano","reawakeningpiano"]
request("resource/bgmsource", 5, bgm)

//request("resource/bgmsource", 5, bgm)
request("story", 0)

var d = [];
function startbgm(jsonObj, bgm) {
  var bgm1 = document.getElementById("music");
  var bgm2 = document.getElementById("musicloop");
  console.log("a:"+bgm)
  d = [];
  let a = -1
  for (let i = 0; i < bgm.length; i++) {
    a = jsonObj.findIndex(element => {
      let b = Object.values(element)[0]
      return b.find(e=> {
        return e.includes("avg_" + bgm[i])
      })
    })
    if (a == -1) {
      a = jsonObj.findIndex(element => {
        let b = Object.values(element)[0]
        return b.find(e=> {
          return e.includes("bat_" + bgm[i])
        })
      })
    }
    if (a == -1) {
      a = jsonObj.findIndex(element => {
        let b = Object.values(element)[0]
        return b.find(e=> {
          return e.includes(bgm[i])
        })
      })
    }
    let c = Object.values(jsonObj[a])[0].findIndex(e=>{
      return e.includes(bgm[i])
    })
    d.push(Object.keys(jsonObj[a])[0] + '/' + Object.values(jsonObj[a])[0][c])
  }
  console.log("b:"+d[0])
  console.log(music + d[0])
  bgm1.src = music + d[0];
  bgm1.loop = false;
  //bgm1.controls = true;
  bgm1.volume = 0.3;
  
  bgm1.load();
  bgm1.play();
  nowbgm = bgmlist;
  bgm2.src = music + d[1];
  //bgm2.autoplay = true;
  //bgm2.loop = true;
  //bgm2.controls = true;
  bgm2.volume = 0.3;
  bgm2.load();
  bgm1.addEventListener('timeupdate', () => {
      if (!bgm1.duration) return;

      // 전체 길이 - 현재 시간 = 남은 시간
      const timeLeft = bgm1.duration - bgm1.currentTime;

      // 남은 시간이 0.3초 이하이고, 다음 곡으로 넘어가기 전일 때
      if (timeLeft <= 0.345 && !bgm1.isChanging) {
          bgm1.isChanging = true; // 중복 실행 방지
          bgm2.play();
          // 다음 곡 재생 시 다시 false로 설정해주어야 함
          bgm1.oncanplaythrough = () => {
              bgm1.isChanging = false;
          };
      }
  });
  bgm2.addEventListener('timeupdate', () => {
      if (!bgm2.duration) return;

      // 전체 길이 - 현재 시간 = 남은 시간
      const timeLeft = bgm2.duration - bgm2.currentTime;

      // 남은 시간이 0.3초 이하이고, 다음 곡으로 넘어가기 전일 때
      if (timeLeft <= 0.345 && !bgm2.isChanging) {
          bgm2.isChanging = true; // 중복 실행 방지
          bgm2.currentTime=0;
          bgm2.play();
          // 다음 곡 재생 시 다시 false로 설정해주어야 함
          bgm2.oncanplaythrough = () => {
              bgm2.isChanging = false;
          };
      }
  });
  
}

//배너 한 칸
function bannershow(jsonObj) {
  var bgm1 = document.getElementById("music");
  var bgm2 = document.getElementById("musicloop");
  //var bgm1 = document.createElement("audio");
  //bgm1.src = music + "act14d0d0/m_avg_towerfierce_loop.mp3";
  //bgm1.autoplay = true;
  //bgm1.loop = true;
  //bgm1.controls = true;
  //bgm1.volume = 0.3;
  //document.body.appendChild(bgm1);
  for (var i = 0; i < jsonObj.length; i++) {
    const bigbanner = document.createElement('div');
    if (jsonObj[i].스포 == true) {
      bigbanner.innerHTML += '<h4 class="배너제목" onclick="showdetail(' + i + ')">' + jsonObj[i].제목+
        '<span style="color: red;">&ensp;&ensp;스포 주의!!</span>';
    }
    else {
       bigbanner.innerHTML += '<h4 class="배너제목" onclick="showdetail(' + i + ')">' + jsonObj[i].제목;
    }
    bigbanner.innerHTML += '</h4>';
    bigbanner.classList.add(...jsonObj[i].클래스);
    const br = document.createElement('br')
    const hr = document.createElement('hr')
    const 디테일 = document.createElement('div');
    디테일.classList.add('디테일');
    const 디테일이미지 = document.createElement('div');
    디테일이미지.classList.add('디테일이미지');
    const 이미지 = document.createElement('img');
    이미지.src = 'story_banner/' + jsonObj[i].코드 + '.jpg';
    이미지.alt = jsonObj[i].코드;
    이미지.style.height = '15vh';
    이미지.style.display = "block";
    디테일이미지.appendChild(br)
    디테일이미지.appendChild(이미지);
    const 디테일설명 = document.createElement('div');
    디테일설명.classList.add('디테일설명')
    const 줄글div = document.createElement('div');
    const 줄글 = document.createElement('span');
    줄글.classList.add(jsonObj[i].글종류);
    줄글.textContent = jsonObj[i].글;
    const 진입div = document.createElement('div');    
    진입div.appendChild(br);
    //진입div.insertAdjacentHTML('beforeend', '<button class="진입하기" onclick="location.href=\'storypage/' + jsonObj[i].코드 + '/' + jsonObj[i].코드 +'.html\'">진입하기</button>');
    const 진입button = document.createElement('button');
    진입button.classList.add('진입하기');
    진입button.textContent = '진입하기';
    //const clickfunc = function() {storypage(jsonObj[i].코드)};
    //진입button.addEventListener('click', ()=>{storypage(jsonObj[i].코드)});
    진입button.onclick = storypage.bind(null, jsonObj[i]);
    진입div.appendChild(진입button);
    //진입div.insertAdjacentHTML('beforeend', '<button class="진입하기" onClick='+storypage.bind(null, jsonObj[i].코드)+'>진입하기</button>');
    줄글div.appendChild(줄글);
    디테일설명.appendChild(br)
    디테일설명.appendChild(줄글div);
    디테일설명.appendChild(진입div);
    디테일.appendChild(디테일이미지);
    디테일.appendChild(디테일설명);
    bigbanner.appendChild(디테일);
    bigbanner.appendChild(hr);
    document.getElementById('class-banner').appendChild(bigbanner);
  }

}


function show(로도스, 번호) {
   let 배너 = document.getElementsByClassName('배너');
   let 국가 = document.getElementsByClassName('nation-box');
   //국가하이라이트설정
   for (let i = 0; i < 국가.length; i++) {
     국가[i].style.borderColor = 'black';
   }
   국가[번호].style.borderColor = 'gray';
   //배너초기화설정
    let 스토리 = document.getElementsByClassName('디테일');
   for (let i = 0; i < 배너.length; i++) {
     배너[i].style.transform = 'scaleY(0)';
     배너[i].style.display = 'none';
     스토리[i].style.display = 'none';
   }
   let 로도 = document.getElementsByClassName(로도스);
   let 여백 = '1%';
   let 스케일 = '38em';
   if (로도.length == 0) {
     여백 = '0%';
     스케일 = '0em';
   }
   document.getElementById('class-banner').style.paddingBottom = 여백;
   document.getElementById('class-banner').style.paddingTop = 여백;
   document.getElementById('class-banner').style.height = 스케일;

   //보이는배너설정
   for (let i = 0; i < 로도.length; i++) {
     로도[i].style.transform = 'scaleY(1)';
     로도[i].style.display = 'block';

   }
 }

function showdetail(스토리번호) {
  let 스토리 = document.getElementsByClassName('디테일');
  let 배너 = document.getElementsByClassName('배너');
  if (스토리[스토리번호].style.display == 'none') {
    //스토리[스토리번호].style.transform = 'scaleY(1)';
    //스토리[스토리번호].style.overflowY = 'visible';
    //배너[스토리번호].style.height = '100%';
    스토리[스토리번호].style.display = 'flex';

  }
  else {
    //스토리[스토리번호].style.transform = 'scaleY(0)';
    //배너[스토리번호].style.height = '5em';
    //스토리[스토리번호].style.overflowY = 'hidden';
    스토리[스토리번호].style.display = 'none';
  }

}
function storypage(챕터) {
  document.body.style.backgroundColor = "#292929";
  document.getElementById("메인페이지").style.display = 'none';
  document.getElementById("스토리페이지").style.display = 'block';
  //location.href = 'storypage/' + 코드 + '/' + 코드 + '.html';
  document.getElementById("챕터제목").textContent = 챕터.제목;
  document.getElementById("본문선").style.display = "block";
  제목div = document.getElementById("제목");
  제목div.replaceChildren();
  document.getElementById("차례제목").replaceChildren(제목div);
  document.getElementById("스토리").replaceChildren();
  document.getElementById("제목").insertAdjacentHTML('beforeend','<img id="챕터이미지" src="story_banner/'+챕터.코드+'.jpg" alt='+챕터.코드+' width="98%" height="98%">');
  request("storypage/"+챕터.코드+"/main_index", 1, 챕터.코드);
}



function returnpage() {
  var bgm1 = document.getElementById("music");
  var bgm2 = document.getElementById("musicloop");
  bgm1.pause()
  bgm2.pause()
  document.body.style.backgroundColor = "black";
  document.getElementById("메인페이지").style.display = 'block';
  document.getElementById("스토리페이지").style.display = 'none';
  document.getElementById("챕터제목").textContent = '';
  document.getElementById("본문선").style.display = "none"
}


//버튼 생성
var s = 0;
function makebutton(jsonObj, route, route2) {
  for (var i = 0; i < jsonObj.length; i++) {
    a = jsonObj[i].replace('level_main_', "");
    a = a.replace('_beg', "작전 전");
    a = a.replace('_end', "작전 후");
    let path = 'resource/storyjson/'+ route + jsonObj[i];
    document.getElementById("차례제목").insertAdjacentHTML("beforeend",'<div class="버튼" id="자리'+i+'"></div>');
    request(path, 4, i, route2);
  }

}

//버튼색 리셋
function buttoncolor(jsonObj, num) {
  var bgm1 = document.getElementById("music");
  var bgm2 = document.getElementById("musicloop");
  bgm1.muted = false;
  bgm2.muted = false;
  bgm1.pause()
  bgm2.pause()
  for (var i = 0; i < jsonObj.length; i++) {
    document.getElementById("버튼" + i).style.backgroundColor = "#545454";
  }
  document.getElementById("버튼" + num).style.backgroundColor = "white";
}


//스토리 보여주기
function showstory(jsonObj, num, path) {
  var bgm1 = document.getElementById("music");
  var bgm2 = document.getElementById("musicloop");
  bgm1.pause()
  bgm2.pause()
  bgmlist = []; //그 파트 음악 전부
  optlist = []; //한 선택지 묶음의 텍스트
  optmove = []; //한 선택지 묶음의 보여줄 라인 위치 1번~2번, 2번~3번 ......
  firstopt = []; // 선택지가 존재하는 라인 모음 (마지막 값은 스토리 맨 마지막 라인)
  path = "storypage/"+path+"/main_index"
  
  request(path, 3, num);
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
    var videodiv = document.createElement("div");
    videodiv.classList.add("컷신");
    var playmusic = document.createElement("div");
    playmusic.classList.add("음악시작");
    var stopmusic = document.createElement("div");
    stopmusic.classList.add("음악정지");
    var character = document.createElement("div");
    character.classList.add("캐릭터");
    
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
    } 
    else if (jsonObj["storyList"][i]["prop"] == "Background") {
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
    } 
    else if (jsonObj["storyList"][i]["prop"] == "ImageTween") {
      continue;
    } //null

    else if (jsonObj["storyList"][i]["prop"] == "Decision") {
      firstopt.push(i);
      //선택지 -->비질로 파트2 확인, 론트레일 st-3
      optlist = jsonObj["storyList"][i]["attributes"]["options"].split(";");
      for (let j = 0; j < optlist.length; j++) {
        var linenum = jsonObj["storyList"][i]["targetLine"]["option" + (j + 1)];
        if (linenum == "") {
          optmove.push(i+1);
          document.getElementById("스토리").insertAdjacentHTML("beforeend", '<div class="선택지" id="line'+i+'"><button class="선택지버튼" onclick="showopt('+ (i+1) + "," + (i+1) + ',' + (i+1) +',' + (i+1) + ','+ len+')">' + optlist[0] + "</button></div>");

        }
        else if (linenum == null) {
          optmove.push(i+1);
        }
        else {
          let lnum = Number(linenum.replace('line', ""));
          optmove.push(lnum);
        }
      }
      let j = i+1;
      let t = 1;
      let options = [];
      while (t==1) {
        if (optmove.length == 1) {
          document.getElementById("스토리").insertAdjacentHTML("beforeend", '<div class="선택지" id="line'+i+'"><button class="선택지버튼" onclick="showopt('+ (i+1) + "," + (i+1) + ',' + (i+1) +',' + (i+1) + ','+ len+')">' + optlist[0] + "</button></div>");
          break;
        }
        else if (jsonObj["storyList"][j]["endOfOpt"] == false && jsonObj["storyList"][j]["targetLine"] == null) {
          let k = '<div id="line'+(i)+'">';
          for (let j = 0; j < optlist.length; j++) {
            k += '<div class="선택지"><button class="선택지버튼" onclick="showopt('+ (i+1) + "," + (i+1) + ',' + (i+1) +',' + (i+1) + ','+ len+')">' + optlist[j] + "</button></div>";

          }
          k += '</div>';
          document.getElementById("스토리").insertAdjacentHTML("beforeend", k);
          break;
        }
        
        if (jsonObj["storyList"][j]["prop"] == "Predicate") {
          if (jsonObj["storyList"][j]["endOfOpt"] == false) {
            let end = jsonObj["storyList"][j]["targetLine"]
            var endopt = Number(end.replace('line', ""));
            let optionlist = jsonObj["storyList"][j]["attributes"]["references"].split(";");
            for (let k = 0; k < options.length; k++) {
              if (options[k].length == 1) {
                let temp = options[k];
                temp.push(j);
                options[k] = temp;
              }
            }
            for (let k = 0; k < optionlist.length; k++) {
              let templist = [j];
              options.push(templist);
              
            }
          }
          else if (jsonObj["storyList"][j]["endOfOpt"] == null) {
            t=0;
            let l = '<div id="line'+i+'">';
            for (let k = 0; k < optlist.length; k++) {
              l += '<div class="선택지"><button class="선택지버튼" onclick="showopt('+ (i+1) + "," + (i+1) + ',' + (i+1) +',' + (i+1) + ','+ len+')">' + optlist[k] + "</button></div>";
            }
            l += '</div>';
            document.getElementById("스토리").insertAdjacentHTML("beforeend",l);
          }
          else if (jsonObj["storyList"][j]["endOfOpt"] == true) { // endofopt가 true
            t=0;
            
            let l = '<div id="line'+i+'">';
            for (let k = 0; k < options.length; k++) {
              if (options[k][1] == null) {
                options[k][1] = endopt;
              }
              
              l += '<div class="선택지"><button class="선택지버튼" onclick="showopt('+ options[k][0] + "," + options[k][1] + "," + (i+1) + ','+ endopt +','+ len+')">' + optlist[k] + "</button></div>";
              
              
              
            }
            l += '</div>';
            document.getElementById("스토리").insertAdjacentHTML("beforeend",l);
          }
        }
        
        j++;
      }
      optmove = [];
      optlist = [];
    }
    else if (jsonObj["storyList"][i]["prop"] == "Video") {
      videodiv.id = "line" + i;
      var video = document.createElement("video");
      video.src = "resource/cutscene/"+jsonObj["storyList"][i]["attributes"]["res"];
      video.style.width = "75%";
      video.controls = true;
      video.volume = 0.5;
      video.addEventListener('play', () => {
        bgm1.pause();
        bgm2.pause();
        video.removeAttribute('controls');
      })
      video.addEventListener('ended', () => {
        video.setAttribute('controls', 'true');
      })
      videodiv.append(video, blank);
      document.getElementById("스토리").append(videodiv);
    }
    else if (jsonObj["storyList"][i]["prop"] == "playMusic" || jsonObj["storyList"][i]["prop"] == "PlayMusic") {
      try {
        bgmlist.push([jsonObj["storyList"][i]["attributes"]["intro"].replace('$',''),jsonObj["storyList"][i]["attributes"]["key"].replace('$','')]);
      }
      catch {
        bgmlist.push([jsonObj["storyList"][i]["attributes"]["key"].replace('$',''),jsonObj["storyList"][i]["attributes"]["key"].replace('$','')]);
      }
      
      div.id = "line" + i;
      div.append(playmusic, blank);
      document.getElementById("스토리").append(div);
      
    }
    else if (jsonObj["storyList"][i]["prop"] == "Sticker" && jsonObj["storyList"][i]["attributes"]["text"]) {
      div.id = "line" + i;
      var name = document.createElement("span");
      name.classList.add("이름");
      var dialogue = document.createElement("span");
      dialogue.classList.add("스티커");
      dialogue.insertAdjacentHTML("beforeend",jsonObj["storyList"][i]["attributes"]["text"]);
      namediv.append(name);
      dialoguediv.append(dialogue);
      div.append(blank, namediv, dialoguediv, blank);
      document.getElementById("스토리").append(div);
    }
    else if (jsonObj["storyList"][i]["prop"] == "Subtitle" && jsonObj["storyList"][i]["attributes"]["text"]) {
      div.id = "line" + i;
      var dialogue = document.createElement("span");
      dialogue.classList.add("Subtitle");
      l = jsonObj["storyList"][i]["attributes"]["text"];
      s=l.replace(/\\n\\n/g, "")
      dialogue.insertAdjacentHTML("beforeend",s);
      dialoguediv.append(dialogue);
      div.append(blank, namediv, dialoguediv, blank);
      document.getElementById("스토리").append(div);
    }
      
    else if (jsonObj["storyList"][i]["prop"] == "name") {
      
      //대사창
      div.id = "line" + i;
      var name = document.createElement("span");
      name.classList.add("이름");
      var dialogue = document.createElement("span");
      dialogue.classList.add("대사");
      name.textContent = jsonObj["storyList"][i]["attributes"]["name"];
      dialogue.textContent = jsonObj["storyList"][i]["attributes"]["content"];
      if (jsonObj["storyList"][i]["figure_art"] != null) {
        char_img = document.createElement("img");
        temp0 = jsonObj["storyList"][i]["figure_art"];
        temp0 = temp0.toLowerCase();
        temp0 = temp0.replace(/\s/g,'');
        temp = temp0.replace("#", "%23");
        if (temp0 == temp) {
          temp = temp + "%231";
        }
        temp2 = temp.replace("$","%24");
        if (temp == temp2) {
          temp2 = temp2 + "%241";
        }
        char_img.src = char_url + temp2 + ".webp";
        char_img.style.width = "70%"
        character.append(char_img);
      }
      
      
      namediv.append(name);
      dialoguediv.append(dialogue);
      div.append(character, namediv, dialoguediv, blank);

      document.getElementById("스토리").append(div);
    }
  }

  for (let i = firstopt[0]+1; i < len; i++) {
    if (document.getElementById("line" + i) != null){
      document.getElementById("line" + i).style.display = "none";
    }


  }
  firstopt.push(jsonObj["storyList"].length);
  const options = {
    root: null, // 뷰포트 기준
    // 화면 상단/하단에서 50%씩 줄여 중앙에 배치
    rootMargin: '0% 0px 0% 0px', 
    threshold: 0 // 1px이라도 걸치면 실행
  };
  const playobserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const index = entry.target.dataset.index;
          if (entry.isIntersecting) {
              // dataset에서 index 가져오기
            if (nowbgm[nowplay] != bgmlist[index]) {
                nowplay = index;
                request("resource/bgmsource", 5, bgmlist[nowplay])
              }
            
              console.log(`${index}번째 play 요소가 보입니다.`);
              console.log(bgmlist[index][0]);
              
            
          }
         
      }, options);
  });
  /*const offobserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const index = entry.target.dataset.index;
        if (entry.isIntersecting) {
              // dataset에서 index 가져오기
              if (index!=0) {
                if (bgm1.paused && bgm2.paused) {
                  request("resource/bgmsource", 5, bgmlist[index-1])
                }
                else {
                  bgm1.pause();
                  bgm2.pause();
                }
              }
              console.log(`${index}번째 off 요소가 보입니다.`);
          }
          
      }, options);
  });*/

  
  const musicon = document.querySelectorAll('.음악시작');
  //const musicoff = document.querySelectorAll('.음악정지');

  musicon.forEach((box, index) => {
      box.dataset.index = index; // 데이터 인덱스 설정
      playobserver.observe(box);
  });
  

  
  
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

function readname(jsonObj, i, path, code) {
  if (jsonObj["storyCode"] == '') {
    jsonObj["avgTag"] = jsonObj["storyName"]
  }
  document.getElementById("자리"+i).insertAdjacentHTML("beforeend",'<button class="차례버튼" id="버튼' + i + '" onclick="request(\''+ path + "'," + 2 + "," + i + ',\''+code+'\')">' + jsonObj["storyCode"]+" "+jsonObj["avgTag"] + "</button>");
}