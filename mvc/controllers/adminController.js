const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const flash = require('connect-flash');

const app = express();
const port = 3000;

// Configuração do MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bdgp',
});

// Conectar ao MySQL
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL: ' + err.message);
  } else {
    console.log('Conectado ao MySQL');
  }
});

// Configuração do connect-flash
app.use(flash());

// Configuração do Body Parser
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração de sessão
app.use(session({
  secret: 'sua_chave_secreta',
  resave: true,
  saveUninitialized: true
}));

// Configurando o diretório para servir arquivos estáticos
app.use(express.static(path.resolve(__dirname, '../views/ctrldev')));

// Middleware para verificar se o usuário está autenticado
const verificaAutenticacao = (req, res, next) => {
  // Se a sessão do usuário não estiver definida, redirecione para a página de erro
  if (!req.session || !req.session.user) {
    return res.redirect('/error');
  }
  // Caso contrário, continue com a próxima rota
  next();
};

// Rota para a página inicial
app.get('/admin', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../views/ctrldev', 'index.html'));
});

// Rota para processar o formulário de login
app.post('/login', (req, res) => {
  const email = req.body.txtctrllogin;
  const senha = req.body.txtctrlpass;

  // Consulta SQL para verificar o login
  const sql = 'SELECT * FROM gamers WHERE email_gamer = ? AND senha_gamer = ?';
  db.query(sql, [email, senha], (err, result) => {
    if (err) {
      console.error('Erro ao executar a consulta SQL: ' + err.message);
      return res.redirect('/error');
    }

    // Verifique se há algum resultado
    if (result && result.length > 0) {
      // Armazena a informação do usuário na sessão
      req.session.user = result[0].email_gamer;

      // Adiciona uma mensagem flash
      req.flash('success', 'Login bem-sucedido!');

      // Se o login for bem-sucedido, redirecione para home.html
      res.redirect('/home');
    } else {
      // Adiciona uma mensagem flash
      req.flash('error', 'Email ou senha incorretos.');

      // Se o login falhar, redirecione para error.html
      res.redirect('/error');
    }
  });
});

// Rota para a página home (protegida por autenticação)
app.get('/home', verificaAutenticacao, (req, res) => {
  // Recupere a mensagem flash da sessão (se houver)
  const successMessage = req.flash('success');
  const errorMessage = req.flash('error');

  res.sendFile(path.resolve(__dirname, '../views/ctrldev', 'home.html'));
});

// Rota para a página de erro
app.get('/error', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../views/ctrldev', 'error.html'));
});

// Inicializar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
