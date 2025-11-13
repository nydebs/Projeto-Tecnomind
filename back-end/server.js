const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
require('dotenv').config(); // Carrega as variáveis de ambiente
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = 3000;

// ----------------------------------------------------------------------
// PASSO CRUCIAL 1: Servir Arquivos Estáticos (Frontend)
// ----------------------------------------------------------------------
// O 'express.static' diz ao Express para procurar arquivos estáticos
// (HTML, CSS, Imagens) na pasta que especificar.
// 'path.join(__dirname, '..', 'frontend')' cria o caminho absoluto para a pasta 'frontend'
// que está um nível acima (..) da pasta 'backend'.
app.use(express.static(path.join(__dirname, '..', 'front-end')));

// ----------------------------------------------------------------------
// PASSO CRUCIAL 2: Definir a Rota Principal (Onde o index.html será acessado)
// ----------------------------------------------------------------------
// Esta rota (/) é opcional, mas garante que a requisição raiz
// direcione o navegador para o seu 'index.html'.
// O Express é inteligente e, se você configurou o express.static corretamente,
// ele já pode servir o index.html por padrão, mas essa rota garante o controle.
app.get('/', (req, res) => {
  // Envia o arquivo index.html
  res.sendFile(path.join(__dirname, '..', 'front-end', 'index.html'));
});
// ----------------------------------------------------------------------
// Configuração da Sessão
app.use(session({
    secret: process.env.SESSION_SECRET, // string secreta
    resave: false,
    saveUninitialized: true
}));

// Inicializa o Passport
app.use(passport.initialize());
app.use(passport.session());

// Importa e configura a estratégia do Google 
require('./config/passport')(passport); 

app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));
app.use(chatRoutes);

// Servir arquivos estáticos (Frontend)
app.use(express.static(path.join(__dirname, '..', 'front-end')));

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

// Rota de Logout (para a imagem de Logout no chatbot.html)
app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/'); // Redireciona para index.html (rota /)
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});