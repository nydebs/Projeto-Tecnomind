let initialChatBoxHTML = '';
let filtroAtivo = 'sem-filtro'; 
let filtroAtivoTexto = 'Sem Filtro';
document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatBox = document.querySelector('.caixa-resposta');
    const historicoList = document.getElementById('historico-list');
    const clearHistoryBtn = document.getElementById('limpar-historico');
    const newChatBtn = document.getElementById('new-chat'); 
    const filtroSelect = document.getElementById('filtro-area');
    const aplicarBtn = document.getElementById('aplicar-filtros-btn');
    const resetarBtn = document.getElementById('resetar-filtro-btn'); // O botão de resetar de baixo
    const resetarH3Btn = document.getElementById('resetar-filtro'); // O botão de resetar do título

    // --- Funções de Filtro ---
    const resetarFiltro = () => {
        filtroSelect.value = 'sem-filtro';
        filtroAtivo = 'sem-filtro';
        filtroAtivoTexto = 'Sem Filtro';
        console.log('Filtro resetado para: Sem Filtro');
        alert('Filtro de área resetado. O assistente responderá sem foco em área específica.');
    };

    const aplicarFiltro = () => {
        filtroAtivo = filtroSelect.value;
        filtroAtivoTexto = filtroSelect.options[filtroSelect.selectedIndex].text;
        console.log(`Filtro aplicado: ${filtroAtivoTexto} (${filtroAtivo})`);
        alert(`O filtro de área foi definido para: ${filtroAtivoTexto}.`);
    };

    // Listeners do Filtro
    aplicarBtn.addEventListener('click', aplicarFiltro);
    resetarBtn.addEventListener('click', resetarFiltro);
    resetarH3Btn.addEventListener('click', resetarFiltro);



    initialChatBoxHTML = chatBox.innerHTML;

    const addMessageToChat = (sender, message) => {
        const messageElement = document.createElement('div');
        messageElement.style.padding = '10px';
        messageElement.style.width = '100%';

        if (sender === 'user') {
            messageElement.style.textAlign = 'right';
            messageElement.innerHTML = `<p style="display: inline-block; padding: 10px; background-color: #e1f5fe; border-radius: 10px;"><strong>Você:</strong> ${message}</p>`;
        
        } else {
            messageElement.style.textAlign = 'left';
            const htmlMessage = marked.parse(message, { sanitize: true }); 
            messageElement.innerHTML = `
                <div style="display: inline-block; padding: 10px; background-color: #f1f1f1; border-radius: 10px; text-align: left;">
                    <strong>Tecnomind:</strong>
                    <div class="bot-message-content" style="margin-top: 5px;">
                        ${htmlMessage}
                    </div>
                </div>`;
        }
        
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    const clearSuggestions = () => {
        const suggestions = chatBox.querySelectorAll('.oque-e, .como-usar-porque, .por-que, .roadmap-aprendizado');
        if (suggestions.length > 0) {
            suggestions.forEach(el => el.remove());
        }
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
                clearSuggestions(); 
                history.forEach(msg => {
                    addMessageToChat(msg.role === 'human' ? 'user' : 'bot', msg.content);
                });
                
                history.filter(msg => msg.role === 'human').forEach(msg => {
                    updateHistoricoList(msg.content, false); 
                });
            }
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
        }
    };

    const updateHistoricoList = (pergunta, addToTop = true) => {
        const li = document.createElement('li');
        li.innerHTML = `<img src="./img/chat.png" alt="chat" width="20" height="20" class="me-2">${pergunta}`;
        
        const ul = historicoList.querySelector('ul');
        if (ul) {
             if (addToTop) {
                ul.prepend(li);
            } else {
                ul.appendChild(li);
            }
        }
    };

    const handleSendChat = async () => {
        const pergunta = userInput.value.trim();
        if (!pergunta) return;

        clearSuggestions(); 
        
        addMessageToChat('user', pergunta);
        updateHistoricoList(pergunta, true); 
        userInput.value = '';

        const thinkingMessage = document.createElement('div');
        thinkingMessage.style.padding = '10px';
        thinkingMessage.style.textAlign = 'left';
        thinkingMessage.innerHTML = `<p style="display: inline-block; padding: 10px; background-color: #f1f1f1; border-radius: 10px;"><strong>Tecnomind:</strong> Pensando...</p>`;
        chatBox.appendChild(thinkingMessage);
        chatBox.scrollTop = chatBox.scrollHeight;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // 🚨 NOVO: INCLUIR O FILTRO ATIVO NO BODY
                body: JSON.stringify({ 
                    pergunta: pergunta,
                    areaTexto: filtroAtivoTexto 
                }),
            });

            if (chatBox.contains(thinkingMessage)) {
               chatBox.removeChild(thinkingMessage);
            }

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
                throw new Error(data.erro || 'Não recebi uma resposta válida.');
            }

        } catch (error) {
            console.error('Erro:', error);
            if (chatBox.contains(thinkingMessage)) {
                chatBox.removeChild(thinkingMessage);
            }
            // Mudei a mensagem de erro aqui para ser mais genérica
            addMessageToChat('bot', `Desculpe, ocorreu um erro: ${error.message}. Verifique o console do navegador e o log do servidor Node.js.`);
        }
    };

    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', async () => {
            if (confirm('Tem certeza que deseja limpar todo o histórico de chat?')) {
                try {
                    const response = await fetch('/api/chat/history', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        if (response.status === 401) {
                            alert('Sua sessão expirou. Faça login novamente.');
                            window.location.href = '/';
                        }
                        throw new Error('Erro ao limpar histórico no servidor.');
                    }

                    chatBox.innerHTML = initialChatBoxHTML; 

                    const ul = historicoList.querySelector('ul');
                    if (ul) {
                        ul.innerHTML = '';
                    }

                    alert('Histórico limpo com sucesso!');

                } catch (error) {
                    console.error('Erro ao limpar histórico:', error);
                    alert(`Não foi possível limpar o histórico: ${error.message}`);
                }
            }
        });
    }

    if (newChatBtn) {
        newChatBtn.addEventListener('click', () => {
            chatBox.innerHTML = initialChatBoxHTML; 
            console.log('Novo chat iniciado.');
        });
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', handleSendChat);
    }

    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSendChat();
            }
        });
    }

    chatBox.addEventListener('click', (e) => {
        const suggestionElement = e.target.closest('p[id]');
        
        if (suggestionElement) {
            const perguntaSugerida = suggestionElement.innerText.replace('->', '').trim();
            userInput.value = perguntaSugerida;
            handleSendChat();
        }
    });

    loadChatHistory();
});