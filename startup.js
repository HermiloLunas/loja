const path = require('path');
const bodyParser = require('body-parser');
const express = require("express");
const session = require('express-session');
const database = require('./repository/database');
const crypto = require('crypto');

const app = express();
const db = new database();

// Configuração do middleware de sessão
const generateRandomSecret = () => {
    return crypto.randomBytes(64).toString('hex');
};

app.use(session({
    secret: generateRandomSecret(),
    resave: false,
    saveUninitialized: true
}));

// Configurações do Express
app.set('view engine', 'ejs');
app.set('views', 'mvc/views/ctrldev');
app.use(express.static('mvc/views/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/admin", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.sendFile(path.resolve(__dirname, './mvc/views/ctrldev', 'index.html'));
});

// Middleware de Verificação de Sessão
// Configuração do middleware de sessão
app.use(session({
    secret: generateRandomSecret(),
    resave: false,
    saveUninitialized: true
}));

// Rota de Login
app.post('/login', async (req, res) => {
    const email = req.body.txtctrllogin;
    const senha = req.body.txtctrlpass;

    try {
        const result = await db.verificarLogin(email, senha);
        if (result.length > 0) {
            req.session.email = email;
            console.log('Criou session com email:', email);
            res.redirect('/home');
        } else {
            console.log('Login falhou. Redirecionando para /error');
            res.redirect('/error');
        }
    } catch (error) {
        console.error('Erro ao verificar o login:', error);
        res.status(500).send('Erro interno ao verificar o login');
    }
});

// Middleware de Verificação de Sessão
// Middleware de Verificação de Sessão
app.use((req, res, next) => {
    console.log('Middleware de Verificação de Sessão');
    console.log('Session:', req.session);

    if (req.url === '/admin') {
        console.log('Entrou em /admin');
        next();
    } else if (req.session && req.session.email) {
        console.log('Fez login:', req.session.email);
        next();
    } else {
        console.log('Erro, redirecionando para /admin');
        res.redirect('/admin');
    }
});

app.get("/home", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const email = req.session.email;
    // res.sendFile(path.resolve(__dirname, "./mvc/views/ctrldev", "home.html"));
    res.render('home', { email: req.session.email });
});

app.get("/error", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.sendFile(path.resolve(__dirname, "./mvc/views/ctrldev", "error.html"));
});
app.get("/logout", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.sendFile(path.resolve(__dirname, "./mvc/views/ctrldev", "logout.html"));
});
// Rota de Logout
app.get('/destroi', (req, res) => {
    // Destrua a sessão
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao destruir a sessão:', err);
            res.status(500).send('Erro interno ao fazer logout');
        } else {
            // Em caso de sucesso, redirecione para a página de admin
            // res.redirect('/admin');
            res.json({ message: 'Sessão destruída com sucesso.' });
        }
    });
});

const consign = require("consign");
consign().include("mvc/controllers").into(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Online Server at port ${PORT}`));

module.exports = app;
