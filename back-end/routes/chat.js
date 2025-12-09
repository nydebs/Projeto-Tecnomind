const express = require('express');
const router = express.Router();
const prisma = require('../config/db');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPromptStr = `Você é o 'Tecnomind', um assistente de IA especialista em explicar termos de tecnologia.

Quando a pergunta do usuário for sobre a definição de um termo (ex: 'O que é API?', 'defina blockchain', 'o que significa REST'), 
sua resposta DEVE seguir esta estrutura de 4 partes, usando Markdown:

**1. O que é [Termo]:**
[Explicação clara e direta do conceito.]

**2. Como usar:**
[Um ou dois exemplos práticos de como o termo é aplicado.]

**3. Por que usar:**
[Os principais benefícios ou razões para sua utilização.]

**4. Mapa de aprendizado:**
[Um pequeno roteiro (3-5 passos) de o que estudar para dominar o assunto.]

Ao final da resposta, recomende obrigatoriamente 3 conteúdos extras no formato JSON abaixo, em uma lista única, escolhendo uma dessas CATEGORIAS: [FRONT-END, BACK-END, DADOS, SEGURANÇA, UX-UI, INFRA].
Certifique-se de que o resumo tenha cerca de 20 palavras.
**DIRETRIZ DE RECOMENDAÇÃO (JSON):**
Para os links no campo "link", você deve atuar como um validador de referências. 
1. NÃO INVENTE URLs baseadas em nomes.
2. PRIORIZE documentações oficiais (ex: react.dev, docs.microsoft.com, developer.mozilla.org).
3. Se não tiver certeza de um link específico para o termo, forneça um link de busca qualificada no MDN ou Stack Overflow focado na área tecnologia do usuário.
4. O resumo DEVE descrever o que o link contém especificamente, facilitando a internalização do conhecimento conforme o ciclo SECI[cite: 46].

JSON_RECOMENDACAO:
[
  { "categoria": "ESCOLHA_DA_LISTA", "titulo": "Título Real", "resumo": "R1", "link": "URL_VALIDADA" },
  { "categoria": "ESCOLHA_DA_LISTA", "titulo": "Título Real", "resumo": "R2", "link": "URL_VALIDADA" },
  { "categoria": "ESCOLHA_DA_LISTA", "titulo": "Título Real", "resumo": "R3", "link": "URL_VALIDADA" }
]

Se a pergunta for uma saudação, uma continuação de conversa ou qualquer outra coisa que não seja uma definição de termo, 
responda de forma natural e prestativa, sem usar o formato de 4 pontos.

`;

function ensureAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Não autorizado. Faça login primeiro.' });
}

router.get('/api/chat/history', ensureAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const messages = await prisma.chatMessage.findMany({
            where: { userId: userId },
            orderBy: { createdAt: 'asc' }
        });
        res.json(messages);
    } catch (err) {
        console.error("Erro ao buscar histórico:", err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.post('/api/chat', ensureAuth, async (req, res) => {
    try {
        const { pergunta, areaTexto } = req.body;
        const userId = req.user.id;

        if (!pergunta) {
            return res.status(400).json({ error: 'Nenhuma pergunta fornecida' });
        }

        // 1. LÓGICA DO FILTRO: Cria uma instrução de filtro
        let filtroInstruction = '';
        // Verifica se 'areaTexto' foi enviado e NÃO é "Sem Filtro" (case insensitive)
        if (areaTexto && areaTexto.toLowerCase() !== 'sem filtro') {
            filtroInstruction = `
                Sua resposta DEVE ter foco e profundidade na área de **${areaTexto}**. 
                Use exemplos e terminologias específicos dessa área.
            `;
        }

        // 2. CONSTRUÇÃO DO PROMPT FINAL
        // Concatena a instrução padrão com a instrução do filtro (se houver)
        const finalSystemPrompt = systemPromptStr + filtroInstruction;

        const pastMessages = await prisma.chatMessage.findMany({
            where: { userId: userId },
            orderBy: { createdAt: 'asc' },
            select: { role: true, content: true }
        });

        const formattedHistory = pastMessages.map(msg => ({
            role: msg.role === 'human' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        await prisma.chatMessage.create({
            data: {
                content: pergunta,
                role: 'human',
                userId: userId
            }
        });

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash", 
            systemInstruction: finalSystemPrompt, 
        });

        const chat = model.startChat({
            history: formattedHistory
        });

        const result = await chat.sendMessage(pergunta);
        const response = result.response;
        const text = response.text();
        await prisma.chatMessage.create({
            data: {
                content: text,
                role: 'ai',
                userId: userId
            }
        });

        res.json({ resposta: text });

    } catch (err) {
        console.error("Erro na rota /api/chat (Gemini):", err.message);
        res.status(500).json({ error: 'Erro interno ao processar com Gemini' });
    }
});

router.delete('/api/chat/history', ensureAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        await prisma.chatMessage.deleteMany({
            where: { userId: userId },
        });
        res.status(200).json({ message: 'Histórico limpo com sucesso.' });

    } catch (err) {
        console.error("Erro ao limpar histórico:", err.message);
        res.status(500).json({ error: 'Erro interno ao limpar histórico' });
    }
});

module.exports = router;