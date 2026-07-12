const messagesEl = document.getElementById('messages');
const composerEl = document.getElementById('composer');
const inputEl = document.getElementById('messageInput');

const initialMessages = [
  {
    text: 'Hi! I am Alicia. How can I help you today?',
    self: false,
    time: '09:41',
  },
  {
    text: 'I want a full-window chat experience that feels insane.',
    self: true,
    time: '09:42',
  },
];

function renderMessage(message) {
  const bubble = document.createElement('article');
  bubble.className = `message ${message.self ? 'me' : ''}`;
  bubble.innerHTML = `<p>${message.text}</p><small>${message.time}</small>`;
  messagesEl.appendChild(bubble);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addMessage(text, self) {
  renderMessage({
    text,
    self,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });
}

initialMessages.forEach(renderMessage);

composerEl.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = inputEl.value.trim();
  if (!text) return;

  addMessage(text, true);
  inputEl.value = '';

  window.setTimeout(() => {
    addMessage('That sounds great! I can help you shape this interface further.', false);
  }, 700);
});
