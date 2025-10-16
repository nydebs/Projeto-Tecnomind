// backend/config/passport.js

const GoogleStrategy = require('passport-google-oauth20').Strategy;

// LINHA PARA IMPORTAR O CLIENTE PRISMA
const prisma = require('./db'); 

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value,
            email: profile.emails[0].value 
        }

        try {
            // 1. Procurar o usuário no seu Banco de Dados
            // CORREÇÃO: Substitui 'User.findOne' por 'prisma.user.findUnique'
            let user = await prisma.user.findUnique({ where: { googleId: profile.id } }); 

            if (user) {
                done(null, user);
            } else {
                // Usuário novo, cria e loga
                // CORREÇÃO: Substitui 'User.create' por 'prisma.user.create'
                user = await prisma.user.create({ data: newUser }); 
                done(null, user);
            }
        } catch (err) {
            console.error(err);
            done(err, null);
        }
    }));

    // Serialização/Desserialização para sessões
    passport.serializeUser((user, done) => {
        done(null, user.id); 
    });

    // 🚨 CORREÇÃO: Substitui 'User.findById(id).then(...)' por 'prisma.user.findUnique' com async/await
    passport.deserializeUser(async (id, done) => {
        try {
            // Recupera o usuário do DB pelo ID armazenado na sessão
            const user = await prisma.user.findUnique({
                // O ID da sua tabela 'User' é um número (Int)
                where: { id: parseInt(id) } 
            });
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
}