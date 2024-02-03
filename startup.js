
const path = require('path');
const bodyParser = require('body-parser');
const express = require("express");
const banco = require('./repository/database');


const app = express()


const consign = require("consign")

app.set('view engine', 'ejs')
app.set('views','mvc/views/ctrldev')
app.use(express.static('mvc/views/public'))


const db = new banco();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, "./mvc/views/ctrldev")));

app.get("/admin", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.sendFile(path.resolve(__dirname, "./mvc/views/ctrldev", "index.html"));
});

app.post('/login', async (req, res) => {
    const email = req.body.txtctrllogin;
    const senha = req.body.txtctrlpass;
  
    try {
        const result = await db.verificarLogin(email, senha);
        if (result.length > 0) {
            res.redirect('/home');
        } else {
            res.redirect('/error');
        }
    } catch (error) {
        console.error('Erro ao verificar o login:', error);
        res.redirect('/error');
    }
});

app.get("/home", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.sendFile(path.resolve(__dirname, "./mvc/views/ctrldev", "home.html"));
});

app.get("/error", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.sendFile(path.resolve(__dirname, "./mvc/views/ctrldev", "error.html"));
});

app.use(express.json())

app.use(express.urlencoded({extended: true}))


consign()
        .include("mvc/controllers")
        .into(app)

app.listen(3000, () => console.log("Online Server at port 3000"))

module.exports = app