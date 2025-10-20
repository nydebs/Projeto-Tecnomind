const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const prisma = require('../config/db');

const LLM_API_URL = 'http://localhost:5001/api/chat';

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

        await prisma.chatMessage.create({
            data: {
                content: pergunta,
                role: 'human',
                userId: userId
            }
        });
        
        const llmResponse = await fetch(LLM_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                history: pastMessages,
                query: pergunta
            }),
        });

        if (!llmResponse.ok) {
            throw new Error('Erro ao contatar o servidor LLM');
        }

        const data = await llmResponse.json();

        if (data.resposta) {
            await prisma.chatMessage.create({
                data: {
                    content: data.resposta,
                    role: 'ai',
                    userId: userId
                }
            });
        }
        
        res.json(data);

    } catch (err) {
        console.error("Erro na rota /api/chat:", err.message);
        res.status(500).json({ error: 'Erro interno do servidor Node.js' });
    }
});

module.exports = router;    