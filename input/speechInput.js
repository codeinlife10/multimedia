/*
Web Speech API 
Use in Chrome, Edge almost 
*/

// *** Speech Input

// Cung cấp các đối tượng phù hợp cho Chrome hoặc các cài đặt hỗ trợ nhận diện giọng nói
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

let directions = ["up", "down", "left", "right"];
// JSpeech Grammer Format - Cho biết những từ nên được nhận diện
// version 'Những từ muốn nhận diện'  (public <recognize name> + 1 danh sách các giá trị phù hợp)
let grammar =
  "#JSGF V1.0; grammar directions; public <direction> = " +
  directions.join(" | ") +
  " ;";

// Định nghĩa các đối tượng nhận diện từ ngữ
let recognition = new SpeechRecognition();
// Chứa grammer
let speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);

// 1 số các setting tùy chọn

// Ngôn ngữ
recognition.lang = "vi-VN";

// Khai báo biến DOM html và gán sự kiện
let speechActive = document.getElementById("speech");
let gestureActive = document.getElementById("gesture");
let inputScreen = document.getElementById("input-screen");

// Khởi động khi bấm nút
speechActive.onclick = function () {
  recognition.start();
};

// Nhận speech và in ra màn hình
// Sử dụng guard để kết thúc chương trình hoặc tiếp tục lắng nghe
let guard = true
recognition.onresult = function (event) {
  let moving = {};
  let direction = event.results[0][0].transcript.toUpperCase();
  inputScreen.innerHTML += `<li>${direction}</li>`;

  if (direction == "XONG RỒI") {
    guard = false;
    inputScreen.innerHTML += `<li class="red">Thank you for playing</li>`;
  }

  direction = direction.trim().split(" ");
  console.log(direction);
  let step = 0;

  for (let e of direction) {
    if (Number(e)) {
      step = Number(e);
    }
  }

  if (step == 0) {
    guard= false
    inputScreen.innerHTML += `<li class="red">Step is invalid</li>`;
  }

  const dict = {
    TRÊN: "TRÊN",
    DƯỚI:"DƯỚI",
    TRÁI:"TRÁI",
    PHẢI:"PHẢI"
  }
  for (let e of direction) {
    console.log(e.toUpperCase() in dict)
    if(e.toUpperCase() in dict) {
      moving[e] = step
      break
    }else {
      guard = false
      inputScreen.innerHTML += `<li class="red">Cannot find direction</li>`;
    }
  }


  console.log(moving)
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

recognition.onspeechend = async function () {
  // Tạm dừng để nhận nhiều lệnh khác nhau tránh bị xung đột và kết thúc chương trình
  await sleep(0);
  recognition.stop();
  inputScreen.innerHTML += `<li class="red">Wait for a while</li>`;
  await sleep(1500);
  if(guard == true) {
    inputScreen.innerHTML += `<li class="red">Next command</li>`;
    recognition.start();
  }
  
};

// recognition.onnomatch = function (event) {
//   inputScreen.innerHTML += "<li>I didnt recognize that direction.</li>";
// };

// recognition.onerror = function (event) {
//   inputScreen.innerHTML += `Error occurred in recognition: ' + ${event.error}`;
// };

// *** Text Input
let inputText = document.getElementById("input-text");

function handleInputText() {
  let rawInputText = inputText.value;
  let processedInputText = rawInputText.split("\n");
  let moving = {};
  for (let e of processedInputText) {
    let directionAndStep = e.trim().split(" ");
    console.log(directionAndStep);

    if (directionAndStep.length != 2) {
      inputScreen.innerHTML += `<li class="red">Command not found</li>`;
      return;
    } else {
      let direction = directionAndStep[0].toUpperCase();
      let step = directionAndStep[1];
      if (Number(step) && (direction == "TRÊN") | "PHẢI" | "DƯỚI" | "TRÁI") {
        inputScreen.innerHTML += `<li>${direction} ${step}</li>`;
        moving[direction] = Number(step);
      } else {
        inputScreen.innerHTML += `<li class="red">Command not found</li>`;
      }
    }
  }

  // here is input for text
  inputText.value = "";
  console.log(moving);
}
