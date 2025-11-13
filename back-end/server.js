const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
require('dotenv').config(); // Carrega as variáveis de ambiente

// Importa as rotas de chat
const chatRoutes = require('./routes/chat');

const app = express();

// ----------------------------------------------------------------------
// 🚨 CORREÇÃO CRUCIAL PARA RENDER: DEFINIR A PORTA
// Usa a porta fornecida pelo Render (process.env.PORT) ou 3000 localmente.
// ----------------------------------------------------------------------
const PORT = process.env.PORT || 3000; 

// Middlewares para processar dados JSON e URL-encoded
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

// ----------------------------------------------------------------------
// Configuração da Sessão
// ----------------------------------------------------------------------
// Nota: MemoryStore (padrão) não é recomendado para produção.
app.use(session({
    secret: process.env.SESSION_SECRET, // string secreta
    resave: false,
    saveUninitialized: true
    // Para produção no Render, considere usar connect-pg-simple para armazenar sessões no BD
}));

// Inicializa o Passport
app.use(passport.initialize());
app.use(passport.session());

// Importa e configura a estratégia do Google 
require('./config/passport')(passport); 

// ----------------------------------------------------------------------
// PASSO 1: Servir Arquivos Estáticos (Frontend) e Rota Raiz
// ----------------------------------------------------------------------
// Usa a pasta 'front-end' que está um nível acima (..)
app.use(express.static(path.join(__dirname, '..', 'front-end')));

// Rota Principal: Garantir que o acesso à raiz carregue o index.html
app.get('/', (req, res) => {
    // Envia o arquivo index.html. O Express fará isso automaticamente com express.static, 
    // mas esta rota garante que a URL / funcione explicitamente.
    res.sendFile(path.join(__dirname, '..', 'front-end', 'index.html'));
});

// ----------------------------------------------------------------------
// Rotas de Autenticação 
// ----------------------------------------------------------------------
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Redirecionamento em caso de sucesso
        res.redirect('/chatbot.html'); 
    }
);

// Rota de Logout
app.get('/logout', (req, res, next) => {
    // req.logout agora requer um callback
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/'); // Redireciona para index.html (rota /)
    });
});

// Rotas da API de Chat
app.use(chatRoutes);


app.listen(PORT, () => {
    // ✅ CORREÇÃO: Loga a porta real (3000 localmente ou porta do Render em produção)
    console.log(`Servidor rodando na porta ${PORT}`); 
    // Ou para ser mais informativo:
    // console.log(`Servidor rodando na porta ${PORT} no ambiente ${process.env.NODE_ENV || 'local'}`);
});