(function () {
  const messagesEl = document.getElementById('messages');
  const composerEl = document.getElementById('composer');
  const inputEl = document.getElementById('messageInput');

  const initialMessages = [
    {
      text: 'Hi! I am Giang. How can I help you today?',
      self: false,
      time: '09:41',
    },
    {
      text: 'Start askin for Products and then you can ask for Prices, in the URL you can type https://criptomty.github.io/cyberchat/?client=spa or https://criptomty.github.io/cyberchat/?client=phone-store.',
      self: true,
      time: '09:42',
    },
  ];

  let chatbot;

  function renderMessage(message) {
    const bubble = document.createElement('article');
    bubble.className = `message ${message.self ? 'me' : ''}`;
    bubble.innerHTML = `<p>${CyberChatUtils.escapeHtml(message.text)}</p><small>${message.time}</small>`;
    messagesEl.appendChild(bubble);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addMessage(text, self) {
    renderMessage({
      text,
      self,
      time: CyberChatUtils.formatTime(),
    });
  }

  function loadKnowledge() {
    return fetch('./data/knowledge.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load chatbot knowledge');
        }
        return response.json();
      })
      .then((data) => {
        chatbot = new Chatbot(data);
      })
      .catch(() => {
        chatbot = new Chatbot();
      });
  }

  function handleUserMessage(text) {
    addMessage(text, true);
    inputEl.value = '';

    window.setTimeout(() => {
      if (!chatbot) {
        addMessage('I am still learning. Could you ask me about our products, prices or availability?', false);
        return;
      }

      const response = chatbot.generateResponse(text);
      addMessage(response, false);
    }, 700);
  }

  function init() {
    initialMessages.forEach(renderMessage);

    composerEl.addEventListener('submit', (event) => {
      event.preventDefault();
      const text = inputEl.value.trim();
      if (!text) return;
      handleUserMessage(text);
    });

    loadKnowledge();
  }

  init();
})();
