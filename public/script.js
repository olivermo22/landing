
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("chat-form");
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");

  let threadId = null;

  async function sendMessage(message) {
    const userMessage = document.createElement("div");
    userMessage.className = "user-message";
    userMessage.innerText = message;
    chatBox.appendChild(userMessage);

    input.value = "";
    const loadingMsg = document.createElement("div");
    loadingMsg.className = "bot-message";
    loadingMsg.innerText = "Escribiendo...";
    chatBox.appendChild(loadingMsg);

    try {
      if (!threadId) {
        const resThread = await fetch("/api/thread", { method: "POST" });
        const dataThread = await resThread.json();
        threadId = dataThread.threadId;
      }

      const res = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, threadId }),
      });
      const data = await res.json();
      loadingMsg.remove();

      const botMessage = document.createElement("div");
      botMessage.className = "bot-message";
      botMessage.innerText = data.response;
      chatBox.appendChild(botMessage);
      chatBox.scrollTop = chatBox.scrollHeight;
    } catch (err) {
      loadingMsg.remove();
      const errorMessage = document.createElement("div");
      errorMessage.className = "bot-message";
      errorMessage.innerText = "Ocurrió un error al enviar el mensaje.";
      chatBox.appendChild(errorMessage);
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (message) sendMessage(message);
  });
});
