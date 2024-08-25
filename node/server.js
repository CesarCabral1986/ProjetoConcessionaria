const express = require('express');
const { Pool } = require('pg');
const cors = require('cors'); 
const app = express();
const port = 3000;
const CryptoJS = require("crypto-js");
const chaveSecreta = "xXxXxXxXxXxXxXx";

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Concessionaria',
  password: 'Metal1965917',
  port: 5432,
});

app.get('/relatorioclientes/:dataNascInicial', async (req, res) => {
  try {
    const { dataNascInicial } = req.params; 
    const { param2, param3, param4, param5} = req.query;


    const query = 'SELECT nome as "Nome", datanascimento as "Data_de_Nascimento", profissao as "Profissão", renda as "Renda" FROM cliente WHERE datanascimento BETWEEN $1 AND $2 AND renda BETWEEN $3 AND $4 AND COMPANYID = $5'; 
    const { rows } = await pool.query(query, [dataNascInicial, param2, param3, param4, param5]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao acessar o banco de dados');
  }
});

app.get('/buscalogin/:login', async (req, res) => {
  try {
    const { login } = req.params; 
    const { param2 } = req.query;     
    

    const senhaDecoded = atob(param2);
    const bytesSenha = CryptoJS.AES.decrypt(senhaDecoded, chaveSecreta);
    const senhaDescriptografada = bytesSenha.toString(CryptoJS.enc.Utf8);
    
    const query = 'SELECT nome, grupousuario, companyid FROM usuarios WHERE login = $1 and senha = $2';
    const { rows } = await pool.query(query, [login, senhaDescriptografada]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao acessar o banco de dados');
  }
});


app.get('/retornapessoas/:idcliente', async (req, res) => {
  try {
    const { idcliente } = req.params; 
    const query = 'SELECT * FROM cliente WHERE idcliente = $1 and inativo = 0'; 
    const { rows } = await pool.query(query, [idcliente]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao acessar o banco de dados');
  }
});

app.get('/retornatodaspessoas/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params; 
    const query = 'SELECT * FROM cliente WHERE companyid = $1 order by idcliente'; 
    const { rows } = await pool.query(query, [companyId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao acessar o banco de dados');
  }
});

app.get('/retornacontratos/:idcliente', async (req, res) => {
  try {
    const { idcliente } = req.params; 
    const query = 'select id_contrato, cl.nome as nomeCliente, c.data_saida as dataSaida, v.modelo as nomeVeiculo from contrato c join cliente cl on c.id_cliente = cl.idcliente join veiculo v on c.id_veiculo = v.idveiculo where id_contrato = $1'; 
    const { rows } = await pool.query(query, [idcliente]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao acessar o banco de dados');
  }
});

app.get('/retornatodoscontratos/:companyID', async (req, res) => {
  try {
    const { companyID } = req.params; 
    const query = 'select * from contrato c join cliente cl on c.id_cliente = cl.idcliente join veiculo v on c.id_veiculo = v.idveiculo where c.companyid = $1'; 
    const { rows } = await pool.query(query, [companyID]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao acessar o banco de dados');
  }
});

app.get('/retornaveiculos/:idveiculo', async (req, res) => {
  try {
    const { idveiculo } = req.params; 
    const query = 'SELECT * FROM veiculo WHERE idveiculo = $1'; 
    const { rows } = await pool.query(query, [idveiculo]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao acessar o banco de dados');
  }
});

app.get('/retornatodosveiculos/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params; 
    const query = 'SELECT * FROM veiculo WHERE companyid = $1 order by idveiculo'; 
    const { rows } = await pool.query(query, [companyId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao acessar o banco de dados');
  }
});


app.post('/cadastrapessoa', async (req, res) => {
  try {
    const {nome, data, profissao, renda, companyId } = req.body;

    
    const query = `INSERT INTO cliente (idcliente, nome, datanascimento, tipopessoa, profissao, renda, companyid, inativo)
    VALUES ((SELECT COALESCE(MAX(idcliente), 0) + 1 FROM cliente), $1, $2, 1, $3, $4, $5, 0)
    RETURNING *`;
    
    
    const { rows } = await pool.query(query, [nome, data, profissao, renda, companyId]);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao acessar o banco de dados');
  }
});

app.post('/cadastrausuario', async (req, res) => {
  try {
    const {NovoNome, NovoUsuario, NovaSenha } = req.body;
    
    const query = `INSERT INTO usuarios (idusuario, nome, login, senha, grupousuario, companyid)
    VALUES ((SELECT COALESCE(MAX(idusuario), 0) + 1 FROM usuarios), $1, $2, $3, 1, (SELECT COALESCE(MAX(companyid), 0) + 1 FROM usuarios))    
    RETURNING *`;
    
    const { rows } = await pool.query(query, [NovoNome, NovoUsuario, NovaSenha,]);

    res.status(201).json(rows[0]);    
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao acessar o banco de dados');
  }
});

app.post('/cadastraveiculo', async (req, res) => {
  try {
    const {marca, diaria, modelo, ano, KM, cor, companyId} = req.body;

    
    const query = `INSERT INTO veiculo (idveiculo, marca, diaria, modelo, ano, kilometragem, cor, companyid)
    VALUES ((SELECT COALESCE(MAX(idveiculo), 0) + 1 FROM veiculo), $1, $2, $3, $4, $5, $6, $7)
    RETURNING *`;    
    
    const { rows } = await pool.query(query, [marca, diaria, modelo, ano, KM, cor, companyId]);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao acessar o banco de dados');
  }
});

app.post('/cadastracontrato', async (req, res) => {
  try {
    const { idcliente, idveiculo, saida, companyId } = req.body;

    
    const query = `INSERT INTO contrato (id_contrato, id_cliente, id_veiculo, data_saida, pago, companyid)
    VALUES ((SELECT COALESCE(MAX(id_contrato), 0) + 1 FROM contrato), $1, $2, $3, 0, $4)
    RETURNING *`;    
    
    const { rows } = await pool.query(query, [ idcliente, idveiculo, saida, companyId ]);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao acessar o banco de dados');
  }
});

app.put('/atualizapessoa', async (req, res) => {
  try {
    const {id, nome, data, profissao, renda } = req.body;
    
    const query = 'update cliente set nome = $2, datanascimento = $3, tipopessoa = 1, profissao = $4, renda = $5 where idcliente = $1';    
    
    const { rows } = await pool.query(query, [id, nome, data, profissao, renda]);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao acessar o banco de dados');
  }
});

app.put('/atualizaveiculo', async (req, res) => {
  try {
    const {id, marca, diaria, modelo, ano, KM, cor} = req.body;
    
    const query = 'update veiculo set marca = $2, diaria = $3, modelo = $4, ano = $5, kilometragem = $6, cor = $7 where idveiculo = $1';    
    
    const { rows } = await pool.query(query, [id, marca, diaria, modelo, ano, KM, cor]);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao acessar o banco de dados');
  }
});

app.put('/atualizacontrato', async (req, res) => {
  try {
    const {idcliente, idveiculo, saida, companyId, idcontrato} = req.body;
    
    const query = 'update contrato set id_veiculo = $2, id_cliente = $1, data_saida = $3, pago = 0, companyid = $4 where id_contrato = $5';    
    
    const { rows } = await pool.query(query, [idcliente, idveiculo, saida, companyId, idcontrato]);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao acessar o banco de dados');
  }
});



app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
 
