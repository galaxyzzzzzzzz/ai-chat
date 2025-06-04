
(async () => {
  const passkey = prompt("Enter passkey");
  if (passkey !== "2012") return;

  if (document.getElementById("chat-container")) {
    document.getElementById("chat-container").classList.remove("chat-hidden");
    return;
  }

  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = "style.css";
  document.head.appendChild(css);

  const html = await fetch("index.html").then(res => res.text());
  const div = document.createElement("div");
  div.innerHTML = html;
  document.body.appendChild(div.querySelector("#chat-container"));

  const log = document.getElementById("chat-log");
  const input = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");
  const scanBtn = document.getElementById("scan-btn");
  const closeBtn = document.getElementById("close-chat");

  closeBtn.onclick = () => {
    document.getElementById("chat-container").classList.add("chat-hidden");
  };

  const sendMessage = async () => {
    const userInput = input.value.trim();
    if (!userInput) return;

    log.innerHTML += `<div><b>You:</b> ${userInput}</div>`;
    input.value = "";

    log.innerHTML += `<div><i>Thinking...</i></div>`;
    log.scrollTop = log.scrollHeight;

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer sk-openrouter-...REPLACE..."
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.1-8b-instruct:free",
          messages: [{ role: "user", content: userInput }]
        })
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "No response.";
      log.innerHTML += `<div><b>AI:</b> ${reply}</div>`;
      log.scrollTop = log.scrollHeight;
    } catch (e) {
      log.innerHTML += `<div><b>Error:</b> ${e.message}</div>`;
    }
  };

  sendBtn.onclick = sendMessage;
  scanBtn.onclick = () => {
    input.value = document.body.innerText.slice(0, 5000);
  };
})();
