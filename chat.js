// chat.js

const API_KEY = "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"; // make sure it's valid
const MODEL = "meta-llama/llama-3.1-8b-instruct";

window.addEventListener("DOMContentLoaded", () => {
  const chatContainer = document.getElementById("chat-container");
  const dragBar = document.getElementById("drag-bar");
  const closeBtn = document.getElementById("close-btn");
  const messagesDiv = document.getElementById("messages");
  const input = document.getElementById("input");
  const form = document.getElementById("form");
  const scanBtn = document.getElementById("scan");

  if (!chatContainer || !dragBar || !closeBtn || !form || !messagesDiv || !scanBtn || !input) {
    console.error("One or more elements not found in DOM.");
    return;
  }

  closeBtn.onclick = () => {
    chatContainer.style.display = "none";
  };

  let offsetX, offsetY, isDragging = false;

  dragBar.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - chatContainer.offsetLeft;
    offsetY = e.clientY - chatContainer.offsetTop;
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      chatContainer.style.left = `${e.clientX - offsetX}px`;
      chatContainer.style.top = `${e.clientY - offsetY}px`;
      chatContainer.style.bottom = "auto";
      chatContainer.style.right = "auto";
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  const appendMessage = (text, className) => {
    const div = document.createElement("div");
    div.className = `msg ${className}`;
    div.textContent = text;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  };

  async function sendToAI(prompt) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt }
          ]
        })
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`HTTP ${res.status}: ${err}`);
      }

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content?.trim() || "(No reply)";
      appendMessage("Bot: " + reply, "bot");

    } catch (err) {
      appendMessage("Bot: [Error: " + err.message + "]", "bot");
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const userMsg = input.value.trim();
    if (!userMsg) return;
    appendMessage("You: " + userMsg, "user");
    input.value = "";
    sendToAI(userMsg);
  });

  scanBtn.addEventListener("click", () => {
    const elements = [...document.body.querySelectorAll("*")];
    const visibleText = elements
      .filter(el => el.offsetParent !== null && el.innerText)
      .map(el => el.innerText.trim())
      .join(" ")
      .replace(/\s+/g, " ")
      .slice(0, 1000);

    appendMessage("You: [Scan Page]", "user");
    sendToAI("Summarize this webpage text:\n" + visibleText);
  });
});
