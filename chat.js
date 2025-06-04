(async () => {
  if (document.getElementById("chat-container")) return;

  const container = document.createElement("div");
  container.innerHTML = `
    <div id="chat-container" style="position:fixed;left:20px;bottom:20px;width:350px;height:500px;z-index:9999;background:white;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.2);display:flex;flex-direction:column;border:1px solid #ccc;overflow:hidden;">
      <div id="drag-bar" style="background:#333;color:white;padding:8px;cursor:move;display:flex;justify-content:space-between;align-items:center;">
        ✦ Drag <span id="close-btn" style="cursor:pointer;">✕</span>
      </div>
      <div style="flex:1;display:flex;flex-direction:column;">
        <div id="messages" style="flex:1;overflow-y:auto;padding:10px;background:#f9f9f9;"></div>
        <form id="form" style="display:flex;padding:10px;border-top:1px solid #ccc;background:white;">
          <input type="text" id="input" placeholder="Ask something..." style="flex:1;padding:10px;font-size:14px;" />
          <button type="submit" id="send" style="margin-left:5px;padding:10px;">Send</button>
          <button type="button" id="scan" style="margin-left:5px;padding:10px;">Scan</button>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(container);

  let history = [{ role: "system", content: "You are a helpful assistant." }];
  const input = document.getElementById("input");
  const messages = document.getElementById("messages");
  const form = document.getElementById("form");
  const scan = document.getElementById("scan");
  const closeBtn = document.getElementById("close-btn");
  const chatContainer = document.getElementById("chat-container");
  const dragBar = document.getElementById("drag-bar");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    messages.innerHTML += `<div style="margin-bottom:10px;color:#1a73e8;">${text}</div>`;
    history.push({ role: "user", content: text });
    input.value = "";
    input.disabled = true;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer YOUR-KEY-HERE",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: history
      })
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "No reply.";
    history.push({ role: "assistant", content: reply });
    messages.innerHTML += `<div style="margin-bottom:10px;color:#111;">${reply}</div>`;
    messages.scrollTop = messages.scrollHeight;

    input.disabled = false;
  });

  scan.addEventListener("click", () => {
    const text = document.body.innerText.slice(0, 1000);
    input.value = `What does this page say: ${text}...`;
  });

  closeBtn.addEventListener("click", () => chatContainer.remove());

  // Dragging
  let isDragging = false, offsetX, offsetY;
  dragBar.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - chatContainer.offsetLeft;
    offsetY = e.clientY - chatContainer.offsetTop;
    document.body.style.userSelect = "none";
  });
  document.addEventListener("mouseup", () => {
    isDragging = false;
    document.body.style.userSelect = "auto";
  });
  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      chatContainer.style.left = `${e.clientX - offsetX}px`;
      chatContainer.style.top = `${e.clientY - offsetY}px`;
    }
  });
})();
