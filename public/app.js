const input = document.querySelector("#message-input");
const btn = document.querySelector("#send-button");
const messagesDiv = document.querySelector("#messages");

async function sendChat() {
    const prompt = input.value.trim();
    if (!prompt) return;

    addMessage(prompt, 'user');

    input.value = '';

    btn.classList.add("loading");
    btn.disabled = true;
    btn.textContent = "Sending...";

    try {
        const response = await fetch("/api/test", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt })

        });
        const data = await response.json();
        console.log(data);

        if (!response.ok) {
            throw new Error(data?.error || 'Server error');
        }

        const aiText = data?.response?.messages ?? data?.messages ?? data?.response ?? '';
        const aiTokens = data?.response?.tokens;
        addMessage(aiText, 'ai', { tokens: aiTokens });
    } catch (error) {
        console.error(error);
        addMessage("Error: Unable to get response from server.", 'ai');
    }

    btn.classList.remove("loading");
    btn.disabled = false;
    btn.textContent = "Send";

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function addMessage(text, type, meta = {}) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    const safeText = text ?? '';

    if (type === 'ai') {
        // Render markdown for AI messages
        messageDiv.innerHTML = marked.parse(String(safeText));

        if (typeof meta.tokens === 'number') {
            const tokenDiv = document.createElement('div');
            tokenDiv.className = 'token-info';
            tokenDiv.textContent = `Tokens: ${meta.tokens}`;
            messageDiv.appendChild(tokenDiv);
        }
    } else {
        // Plain text for user messages
        messageDiv.textContent = safeText;
    }

    messagesDiv.appendChild(messageDiv);
}

btn.addEventListener("click", sendChat);

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendChat();
    }
});