const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
require('dotenv').config(); 
// 1. Importa o módulo do PostgreSQL Session Store
const pgSession = require('connect-pg-simple')(session); 
const chatRoutes = require('./routes/chat');

const app = express();
app.set('trust proxy', 1);
// 2. CORREÇÃO DA PORTA: Usa a porta do ambiente (Render) ou 3000 como fallback
const PORT = process.env.PORT || 3000; 

// --- MÓDULOS CONDICIONAIS DE SESSÃO ---
let sessionStore;

// 3. Lógica para alternar entre MemoryStore (Local) e PgStore (Render)
if (process.env.NODE_ENV === 'production') {
    sessionStore = new pgSession({
        // Usa a DATABASE_URL configurada no Render
        conString: process.env.DATABASE_URL, 
        tableName: 'session' // Nome da tabela criada manualmente
    });
} else {
    // Para Desenvolvimento (Local)
    sessionStore = new session.MemoryStore();
}
// ---------------------------------------

app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

// ----------------------------------------------------------------------
// Configuração da Sessão (Atualizada)
app.use(session({
    store: sessionStore, // Usa o store definido acima
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false, 
    cookie: { 
        maxAge: 30 * 24 * 60 * 60 * 1000, 
        // ⚠️ CORREÇÃO: Força o secure: true para o Render
        secure: true // ANTES ERA: process.env.NODE_ENV === 'production' 
    }
}));

// Inicializa o Passport DEPOIS da sessão
app.use(passport.initialize());
app.use(passport.session());

// Importa e configura a estratégia do Google 
require('./config/passport')(passport); 

app.use(chatRoutes);

// 4. CORREÇÃO: Remova a Duplicação do express.static
app.use(express.static(path.join(__dirname, '..', 'front-end')));

// Rota Principal
app.get('/', (req, res) => {
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
        // req.user só estará disponível aqui se o login for bem-sucedido.
        if (req.user && req.user.image) {
            const profileImage = req.user.image; 

            // Redireciona para o chatbot, passando a URL da imagem como parâmetro.
            const redirectUrl = `/chatbot.html?profileImage=${encodeURIComponent(profileImage)}`;
            
            return res.redirect(redirectUrl); 
        }
        
        // Se por algum motivo o req.user não existir ou não tiver imagem, 
        // apenas redireciona para a página padrão.
        res.redirect('/chatbot.html');
    }
);

// Rota de Logout
app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/'); 
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


