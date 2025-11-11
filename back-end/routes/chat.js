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
        const { pergunta } = req.body;
        const userId = req.user.id;

        if (!pergunta) {
            return res.status(400).json({ error: 'Nenhuma pergunta fornecida' });
        }
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
            systemInstruction: systemPromptStr, 
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