// Variável para armazenar o HTML inicial da caixa de chat (sugestões)
let initialChatBoxHTML = '';
// Novo: Cache global para armazenar perguntas e respostas completas, indexadas pelo ID da pergunta do usuário (role 'human').
let conversationCache = {}; 

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
    const resetarBtn = document.getElementById('resetar-filtro-btn');
    const resetarH3Btn = document.getElementById('resetar-filtro');

    // --- Funções de Filtro (Mantidas) ---
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

    // Salva a estrutura inicial da caixa de chat (sugestões)
    initialChatBoxHTML = chatBox.innerHTML;

    // Função auxiliar para renderizar mensagens no chat principal
    const addMessageToChat = (sender, message) => {
        const messageElement = document.createElement('div');
        messageElement.style.padding = '10px';
        messageElement.style.width = '100%';

        if (sender === 'user') {
            messageElement.style.textAlign = 'right';
            messageElement.innerHTML = `<p style="display: inline-block; padding: 10px; background-color: #e1f5fe; border-radius: 10px;"><strong>Você:</strong> ${message}</p>`;
        
        } else {
            messageElement.style.textAlign = 'left';
            // Usa marked.js para renderizar Markdown (negrito, listas, etc.)
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

    // Função que limpa as sugestões iniciais
    const clearSuggestions = () => {
        const suggestions = chatBox.querySelectorAll('.oque-e, .como-usar-porque, .por-que, .roadmap-aprendizado');
        if (suggestions.length > 0) {
            suggestions.forEach(el => el.remove());
        }
    };
    
    // NOVO: Função para exibir a conversa a partir do cache
    const displayCachedConversation = (conversation) => {
        chatBox.innerHTML = ''; // Limpa a área de chat (remove sugestões)
        addMessageToChat('user', conversation.user);
        addMessageToChat('bot', conversation.bot);
    };


    // MODIFICADO: Função para atualizar a lista do histórico, agora recebendo o ID da mensagem
    const updateHistoricoList = (pergunta, messageId, addToTop = true) => {
        const li = document.createElement('li');
        // NOVO: Armazena o ID da mensagem do banco de dados
        li.setAttribute('data-message-id', messageId); 
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

    // MODIFICADO: Função para carregar histórico e popular o cache e o sidebar
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
            
            // Limpa o cache e o histórico visual antes de recarregar
            conversationCache = {}; 
            const ul = historicoList.querySelector('ul');
            if (ul) ul.innerHTML = '';
            
            if (history.length > 0) {
                // Itera sobre o histórico para parear a pergunta (human) com a resposta (ai)
                for (let i = 0; i < history.length; i++) {
                    const currentMsg = history[i];
                    
                    if (currentMsg.role === 'human') {
                        const userMsg = currentMsg;
                        const nextMsg = history[i + 1];
                        
                        // Garante que a próxima mensagem é a resposta e pertence à mesma conversação
                        if (nextMsg && nextMsg.role === 'ai') {
                            const botMsg = nextMsg;

                            // 1. Armazena o par completo no cache
                            conversationCache[userMsg.id] = {
                                user: userMsg.content,
                                bot: botMsg.content
                            };
                            
                            // 2. Adiciona a pergunta ao histórico do sidebar com o ID
                            updateHistoricoList(userMsg.content, userMsg.id, false); 
                            
                            i++; // Pula a mensagem 'ai' pois já foi processada como parte do par
                        } else {
                            // Adiciona a pergunta mesmo sem resposta, mas não será clicável para ver o conteúdo
                            // updateHistoricoList(userMsg.content, userMsg.id, false); 
                            console.warn(`Mensagem de usuário ID ${userMsg.id} sem resposta de bot pareada.`);
                        }
                    }
                }
                
                // NOTA: Removemos a exibição automática da última conversa no chat principal.
                // A tela principal deve manter o initialChatBoxHTML (sugestões) ou o último chat se for um 'Novo Chat'
                // ou o chat selecionado pelo clique.
            }
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
        }
    };

    // --- Tratamento de Envio de Nova Mensagem (handleSendChat Mantido) ---
    const handleSendChat = async () => {
        const pergunta = userInput.value.trim();
        if (!pergunta) return;

        clearSuggestions(); 
        
        addMessageToChat('user', pergunta);
        // NOVO: Chamada para updateHistoricoList com um ID temporário (0) por enquanto,
        // até que o ID real seja retornado pelo backend (se for o caso)
        // Por hora, apenas exibe a pergunta no topo do histórico
        updateHistoricoList(pergunta, 0, true); 
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
                // Separa a explicação didática do JSON de recomendação
                const partes = data.resposta.split('JSON_RECOMENDACAO:');
                const respostaDidatica = partes[0].trim();
                
                // Exibe a resposta didática no chat principal 
                addMessageToChat('bot', respostaDidatica);

                // Processa a recomendação dinâmica para os cards 
                if (partes[1]) {
                    try {
                        const recomendacao = JSON.parse(partes[1].trim());
                        atualizarCardsDinamicos(recomendacao);
                    } catch (e) {
                        console.error("Erro ao processar JSON de recomendação:", e);
                    }
                }
            } else {
                 throw new Error(data.erro || 'Não recebi uma resposta válida.');
            }

        } catch (error) {
            console.error('Erro:', error);
            if (chatBox.contains(thinkingMessage)) {
                chatBox.removeChild(thinkingMessage);
            }
            addMessageToChat('bot', `Desculpe, ocorreu um erro: ${error.message}.`);
        }
    };


    // --- Event Listeners (Mantidos e Adicionados) ---
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

    // Listener para as sugestões iniciais
    chatBox.addEventListener('click', (e) => {
        const suggestionElement = e.target.closest('p[id]');
        
        if (suggestionElement) {
            const perguntaSugerida = suggestionElement.innerText.replace('->', '').trim();
            userInput.value = perguntaSugerida;
            handleSendChat();
        }
    });
    
    // NOVO: Listener para clicar em um item do histórico
    historicoList.addEventListener('click', (e) => {
        const listItem = e.target.closest('li');
        
        if (listItem) {
            const messageId = listItem.getAttribute('data-message-id');
            const conversation = conversationCache[messageId];
            
            if (conversation) {
                displayCachedConversation(conversation);
            } else if (messageId !== '0') {
                console.warn(`Conversa com ID ${messageId} não encontrada no cache.`);
                alert('Esta conversa não está completa no cache local.');
            }
        }
    });


    // --- Limpar Histórico e Novo Chat (Mantidos) ---
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', async () => {
            if (confirm('Tem certeza que deseja limpar todo o histórico de chat?')) {
                try {
                    // ... (código DELETE no backend) ...
                    const response = await fetch('/api/chat/history', { method: 'DELETE' });

                    if (!response.ok) {
                         if (response.status === 401) {
                            alert('Sua sessão expirou. Faça login novamente.');
                            window.location.href = '/';
                         }
                         throw new Error('Erro ao limpar histórico no servidor.');
                    }
                    // Limpa o cache e a UI
                    conversationCache = {};
                    chatBox.innerHTML = initialChatBoxHTML; 
                    const ul = historicoList.querySelector('ul');
                    if (ul) ul.innerHTML = '';
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
// Mapeamento de imagens estáticas por categoria
const imagensEstaticas = {
    'FRONT-END': './img/frontend.png',
    'BACK-END': './img/backend.png',
    'DADOS': './img/dados.png',
    'SEGURANÇA': './img/security.png',
    'UX-UI': './img/uxui.png',
    'INFRA': './img/infra.png'
};

function atualizarCardsDinamicos(listaDados) {
    // Seleciona todos os cards pela classe (deve haver 3 no seu HTML)
    const cards = document.querySelectorAll('.card_recomendado'); 

    listaDados.forEach((dadosItem, index) => {
        // Verifica se o card correspondente ao índice existe no DOM
        if (cards[index]) {
            const currentCard = cards[index];
            
            // 1. Define a imagem estática baseada na categoria 
            const rotaImagem = imagensEstaticas[dadosItem.categoria] || './img/imgpadrao.png';
            
            // 2. Atualiza o conteúdo visual dentro do card atual [cite: 181]
            currentCard.querySelector('.card-img').src = rotaImagem;
            currentCard.querySelector('.card-title').innerText = dadosItem.titulo;
            currentCard.querySelector('.card-text').innerText = dadosItem.resumo;

            // 3. Configura o link de redirecionamento no stretched-link [cite: 187, 190]
            const linkBtn = currentCard.querySelector('.card-link');
            if (linkBtn) {
                linkBtn.href = dadosItem.link;
                // Como você usa stretched-link, clicar no card já acionará este link
            }

            // 4. Feedback visual de interatividade (UX) [cite: 164, 204]
            currentCard.style.cursor = 'pointer';
        }
    });
}
    // Carrega histórico ao iniciar a página
    loadChatHistory();
});