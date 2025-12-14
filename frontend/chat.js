// Handle Enter key press
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("userInput");
  if (input) {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMsg();
      }
    });
    
    // Auto-resize textarea
    if (input.tagName === "TEXTAREA") {
      input.addEventListener("input", function() {
        this.style.height = "auto";
        this.style.height = Math.min(this.scrollHeight, 120) + "px";
      });
    }
  }
});

async function sendMsg() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  // Disable input while processing
  input.disabled = true;
  const sendButton = document.querySelector(".send-button");
  if (sendButton) sendButton.disabled = true;

  // Add user message
  addMessage("user", message);
  input.value = "";
  
  // Reset textarea height if it's a textarea
  if (input.tagName === "TEXTAREA") {
    input.style.height = "auto";
  }

  // Show typing indicator
  showTypingIndicator();

  try {
    const res = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    if (!res.ok) {
      throw new Error("Failed to get response");
    }

    const data = await res.json();
    hideTypingIndicator();
    addMessage("ai", data.reply);
  } catch (error) {
    hideTypingIndicator();
    addMessage("ai", "Sorry, I'm having trouble connecting. Please try again later.");
    console.error("Error:", error);
  } finally {
    // Re-enable input
    input.disabled = false;
    if (sendButton) sendButton.disabled = false;
    input.focus();
  }
}

function addMessage(sender, text) {
  const box = document.getElementById("chatBox");
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}-message`;
  
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const avatarIcon = sender === 'user' 
    ? '<i class="fas fa-user"></i>' 
    : '<i class="fas fa-robot"></i>';
  
  messageDiv.innerHTML = `
    <div class="message-content">
      <div class="message-avatar">${avatarIcon}</div>
      <div class="message-bubble">
        <div class="message-text">${escapeHtml(text)}</div>
        <div class="message-time">${timestamp}</div>
      </div>
    </div>
  `;
  
  box.appendChild(messageDiv);
  box.scrollTop = box.scrollHeight;
  
  // Add fade-in animation
  setTimeout(() => {
    messageDiv.style.opacity = "1";
    messageDiv.style.transform = "translateY(0)";
  }, 10);
}

function showTypingIndicator() {
  const box = document.getElementById("chatBox");
  const typingDiv = document.createElement("div");
  typingDiv.id = "typingIndicator";
  typingDiv.className = "message ai-message typing-indicator";
  typingDiv.innerHTML = `
    <div class="message-content">
      <div class="message-avatar"><i class="fas fa-robot"></i></div>
      <div class="message-bubble">
        <div class="message-text">
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  `;
  box.appendChild(typingDiv);
  box.scrollTop = box.scrollHeight;
  
  // Add fade-in animation
  setTimeout(() => {
    typingDiv.style.opacity = "1";
    typingDiv.style.transform = "translateY(0)";
  }, 10);
}

function hideTypingIndicator() {
  const typingIndicator = document.getElementById("typingIndicator");
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
