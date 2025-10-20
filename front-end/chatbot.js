document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatBox = document.querySelector('.caixa-resposta');
    const historicoList = document.getElementById('historico-list');
    const suggestionsBox = document.querySelector('.caixa-resposta > div');

    const addMessageToChat = (sender, message) => {
        const messageElement = document.createElement('div');
        messageElement.style.padding = '10px';
        
        if (sender === 'user') {
            messageElement.style.textAlign = 'right';
            messageElement.innerHTML = `<p><strong>Você:</strong> ${message}</p>`;
        } else {
            messageElement.style.backgroundColor = '#f1f1f1';
            messageElement.innerHTML = `<p><strong>Tecnomind:</strong> ${message}</p>`;
        }
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    const loadChatHistory = async () => {
        try {
            const response = await fetch('/api/chat/history');
            if (!response.ok) {
                if (response.status === 401) {
                    console.log('Usuário não logado, mostrando sugestões.');
                }
                return; 
            }
            
            const history = await response.json();
            
            if (history.length > 0) {
                chatBox.innerHTML = '';
                history.forEach(msg => {
                    addMessageToChat(msg.role === 'human' ? 'user' : 'bot', msg.content);
                });
                
                const lastQuestion = history.filter(msg => msg.role === 'human').pop();
                if (lastQuestion) {
                    updateHistoricoList(lastQuestion.content);
                }
            }
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
        }
    };

    const updateHistoricoList = (pergunta) => {
        const li = document.createElement('li');
        li.innerHTML = `<img src="./img/chat.png" alt="chat" width="20" height="20" class="me-2">${pergunta}`;
        historicoList.querySelector('ul').prepend(li);
    };

    const handleSendChat = async () => {
        const pergunta = userInput.value.trim();
        if (!pergunta) return;

        if (suggestionsBox && chatBox.contains(suggestionsBox)) {
            chatBox.innerHTML = '';
        }
        
        addMessageToChat('user', pergunta);
        updateHistoricoList(pergunta);
        userInput.value = '';

        addMessageToChat('bot', 'Pensando...');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pergunta: pergunta }),
            });

            chatBox.removeChild(chatBox.lastChild);

            if (!response.ok) {
                 if (response.status === 401) {
                    alert('Sua sessão expirou. Faça login novamente.');
                    window.location.href = '/';
                }
                throw new Error('Erro na resposta do servidor');
            }

            const data = await response.json();
            
            if (data.resposta) {
                addMessageToChat('bot', data.resposta);
            } else {
                addMessageToChat('bot', 'Desculpe, não entendi.');
            }

        } catch (error) {
            console.error('Erro:', error);
            addMessageToChat('bot', 'Desculpe, ocorreu um erro. Tente novamente.');
        }
    };

    sendBtn.addEventListener('click', handleSendChat);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendChat();
        }
    });

    chatBox.addEventListener('click', (e) => {
        if (e.target && e.target.tagName === 'P' && e.target.id) {
            const perguntaSugerida = e.target.innerText.replace('->', '').trim();
            userInput.value = perguntaSugerida;
            handleSendChat();
        }
    });

    loadChatHistory();
});