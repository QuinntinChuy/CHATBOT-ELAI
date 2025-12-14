async function sendMsg() {
  const input = document.getElementById("userInput");
  const message = input.value;
  if (!message) return;

  addMessage("You", message);
  input.value = "";

  const res = await fetch("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const data = await res.json();
  addMessage("AI", data.reply);
}

function addMessage(sender, text) {
  const box = document.getElementById("chatBox");
  box.innerHTML += `<p><b>${sender}:</b> ${text}</p>`;
  box.scrollTop = box.scrollHeight;
}
