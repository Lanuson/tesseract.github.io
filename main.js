const fileInput = document.getElementById('fileInput');
const imageElement = document.getElementById('image');
const startBtn = document.getElementById('startBtn');
const resultLeftDiv = document.getElementById('resultleft');
const resultRightDiv = document.getElementById('resultright');
const downloadBtn = document.getElementById('download-btn');
const copyBtn = document.getElementById('copy-btn');
const copyBtn2 = document.getElementById('copy2-btn');



document.addEventListener("DOMContentLoaded", () => {
  // 隐藏文本框和方格
  document.querySelector(".text-left-box").style.display = "none";
  document.querySelector(".text-right-box").style.display = "none";
  document.querySelector(".container").style.display = "none";
 
});

let imageSrc = '';

fileInput.addEventListener('change', (event) => {
    const image = event.target.files[0];
    if (!image) return;
  
    const reader = new FileReader();
    reader.onload = (event) => {
      imageSrc = event.target.result;
      imageElement.src = imageSrc;
      
      
    };
    reader.readAsDataURL(image);
  });

startBtn.addEventListener('click', async () => {
    const image = fileInput.files[0];
    if (!image) return;
    
    const { createWorker } = Tesseract;
    const worker = createWorker({
      workerPath: 'node_modules\tesseract.js\dist\tesseract.min.js',
      langPath: '../lang-data',
      corePath: 'node_modules/tesseract.js-core/tesseract-core.wasm.js',
      logger: m => console.log(m),
    });
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(image);
    
    // 显示文本框和方格
    document.querySelector(".text-left-box").style.display = "block";
    document.querySelector(".container").style.display = "flex";
    
    resultLeftDiv.innerText = text;
    await worker.terminate();
  });

  
  downloadBtn.addEventListener('click', () => {
    if (!resultRightDiv.textContent) return;
  
    const filename = 'ocr_result.txt';
    const text = resultRightDiv.textContent;
    const blob = new Blob([text], { type: 'text/plain' });
  
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, filename);
    } else {
      const elem = window.document.createElement('a');
      elem.href = window.URL.createObjectURL(blob);
      elem.download = filename;
      document.body.appendChild(elem);
      elem.click();
      document.body.removeChild(elem);
    }
  });
  
  
  copyBtn.addEventListener('click', () => {
    if (!resultLeftDiv.textContent) return;
    
    // 创建一个新的 textarea 元素并将其隐藏
    const textarea = document.createElement('textarea');
    textarea.style.opacity = 0;
    document.body.appendChild(textarea);
    
    // 将偵測結果中的文字复制到 textarea 中
    textarea.value = resultLeftDiv.textContent.trim();
    
    // 选中 textarea 中的内容
    textarea.select();
    
    // 复制选中的内容
    document.execCommand('copy');
    
    // 移除 textarea 元素
    document.body.removeChild(textarea);
  });
  copyBtn2.addEventListener('click', () => {
    if (!resultRightDiv.textContent) return;
    
    // 创建一个新的 textarea 元素并将其隐藏
    const textarea = document.createElement('textarea');
    textarea.style.opacity = 0;
    document.body.appendChild(textarea);
    
    // 将偵測結果中的文字复制到 textarea 中
    textarea.value = resultRightDiv.textContent.trim();
    
    // 选中 textarea 中的内容
    textarea.select();
    
    // 复制选中的内容
    document.execCommand('copy');
    
    // 移除 textarea 元素
    document.body.removeChild(textarea);
  });



  const apiKey = process.env.apiKey;
  const apiUrl = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
  
  const sourceLangSelect = document.querySelector('#source-lang-select');
  const targetLangSelect = document.querySelector('#target-lang-select');
  const translateBtn = document.querySelector('#translate-btn');
  const resultLeft = document.querySelector('#resultleft');
  const resultRight = document.querySelector('#resultright');
  
  const translate = async (text, target) => {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: target,
      }),
    });
    const result = await response.json();
    return result.data.translations[0].translatedText;
  };
  
  translateBtn.addEventListener('click', async () => {
    const sourceLang = sourceLangSelect.value;
    const targetLang = targetLangSelect.value;
    const text = resultLeft.innerText;
  
    const translatedText = await translate(text, targetLang);
    resultRight.innerText = translatedText;
    console.log(translatedText); // 測試用 
    document.querySelector(".text-right-box").style.display = "block";
    document.querySelector(".container").style.display = "flex";
  });
  

//側邊頁
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebarClose = document.getElementById('close-btn');
  const sidebar = document.getElementById('sidebar');
  
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.add('active');
    sidebar.style.transform = "translateX(0)";

  });
  
  sidebarClose.addEventListener('click', () => {
    sidebar.classList.remove('active');
    sidebar.style.transform = "translateX(-3000px)";
  });


  const qaQuestions = document.querySelectorAll(".qa-question");
  qaQuestions.forEach(question => {
    question.addEventListener("click", () => {
      const answer = question.nextElementSibling;
      if (answer.style.display === "none") {
        answer.style.display = "block";
      } else {
        answer.style.display = "none";
      }
    });
  });


  const chatBtn = document.getElementById('chatgpt');
  const chatWindow = document.getElementById('chat-window');
  const closeBtn = document.getElementById('close-btn2');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const chatContainer = document.querySelector('.chat-container');
  
   
  const API_KEY = process.env.API_KEY;

  
  chatBtn.addEventListener('click', () => {
    chatWindow.classList.add('show');
  });
  
  closeBtn.addEventListener('click', () => {
    chatWindow.classList.remove('show');
  });
  
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = chatInput.value;
    if (message) {
      const chatMessage = document.createElement('div');
      chatMessage.classList.add('chat-message', 'sent');
      chatMessage.innerHTML = `
        <p>${message}</p>
        <span class="loader"></span>
      `;
      chatContainer.appendChild(chatMessage);
      chatInput.value = '';
      sendMessage(message);
    }
  });
  
  
  function sendMessage(message) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        const chatMessage = document.createElement('div');
        chatMessage.classList.add('chat-message', 'received');
        chatMessage.innerHTML = `
          <p>${response.choices[0].text}</p>
        `;
        chatContainer.appendChild(chatMessage);
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    };
    xhr.open('POST', `https://api.openai.com/v1/engines/text-davinci-003/completions`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${API_KEY}`);
    xhr.send(JSON.stringify({
      prompt: `User: ${message}\nChatGPT:`,
      max_tokens: 150,
      temperature: 0.7,
      top_p: 1,
      n: 1,
      stream: false,
    }));
  }
  // async function openai_test() {
  //   const apiKey = "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";
  //   const prompt = "YOUR_TEXT_HERE";
  //   const model = "text-davinci-003";
  //   const maxTokens = 256;
  //   const temperature = 0.7;
  
  //   const response = await fetch("https://api.openai.com/v1/engines/" + model + "/completions", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + apiKey,
  //     },
  //     body: JSON.stringify({
  //       prompt: prompt,
  //       max_tokens: maxTokens,
  //       temperature: temperature,
  //     }),
  //   });
  
  //   const data = await response.json();
  //   console.log(data.choices[0].text);
  // }
  
  // openai_test();
  