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

// enviar feedback email 
const nodemailer = require('nodemailer'); // 💡 Adicionar no topo com os outros 'requires'

// ----------------------------------------------------------------------
// Configuração do Nodemailer
// ----------------------------------------------------------------------
const transporter = nodemailer.createTransport({
    // Use o serviço/host que você configurou (ex: GMail, SendGrid, etc.)
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER, // Variável do Render
        pass: process.env.EMAIL_PASS  // Variável do Render
    }
});

// ----------------------------------------------------------------------
// Rota de Envio de Feedback
// ----------------------------------------------------------------------
app.post('/api/feedback', async (req, res) => {
    // Apenas a mensagem é obrigatória
    const { feedback, nome = 'Não Informado', email_contato = 'Não Informado' } = req.body; 

    if (!feedback || feedback.trim().length < 5) {
        return res.status(400).json({ message: 'A mensagem de feedback é muito curta.' });
    }

    const mailOptions = {
        from: `"${nome} (Plataforma)" <${process.env.EMAIL_USER}>`, 
        to: process.env.EMAIL_RECEBIMENTO, // Variável do Render para quem recebe
        subject: `Novo Feedback Recebido da Tecnomind`, 
        html: `<p><b>Mensagem:</b></p><p>${feedback}</p><p>---</p><p>Nome: ${nome}, Email: ${email_contato}</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Feedback enviado com sucesso.' });
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        res.status(500).json({ message: 'Erro interno ao processar o envio de e-mail.' });
    }
});


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


