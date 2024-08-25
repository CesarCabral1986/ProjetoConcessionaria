const logarBtn = document.querySelector("#submitbtn");
const Cadastrar_btn = document.querySelector("#Cadastrar_btn");
const inputUsuario = document.querySelector("#username");
const inputSenha = document.querySelector("#password");
const labelFeedback = document.querySelector("#feedback");
const novoCadastrobtn = document.querySelector("#novoCadastrobtn");
const cadastre_se_Container = document.querySelector("#cadastre-se_Container");
const logincontainer = document.querySelector("#logincontainer");
const Input_novoLogin = document.querySelector("#Input_novoLogin");
const input_Novopassword = document.querySelector("#input_Novopassword");
const input_ConfirmaNovopassword = document.querySelector("#input_ConfirmaNovopassword");
const Input_novoNome = document.querySelector("#Input_novoNome");
const Cadastre_se_feedback = document.querySelector("#Cadastre-se_feedback");

logarBtn.addEventListener('click', buscaLogin);
novoCadastrobtn.addEventListener('click', MostraCadastraUsuario);
Cadastrar_btn.addEventListener('click', CadastraUsuario);

let usuarioValidado;
let grupoUsuario;
const chaveSecreta = "xXxXxXxXxXxXxXx";

function buscaLogin(){

    let usuario = inputUsuario.value

    let senha = CryptoJS.AES.encrypt(inputSenha.value, chaveSecreta).toString();
    senha = btoa(senha);    
    
    fetch(`http://localhost:3000/buscalogin/${usuario}?param2=${senha}`)

    

    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {

            usuarioValidado = data[0].nome;
            grupoUsuario = data[0].grupousuario;
            companyid = data[0].companyid;

            localStorage.setItem('Nome', usuarioValidado);
            localStorage.setItem('Grupo', grupoUsuario);
            localStorage.setItem('CompanyId', companyid);

            const newPageUrl = 'main.html';
            window.location.href = newPageUrl;

        } else {

            console.log('Login e/ou senha invalida');
            labelFeedback.textContent = 'Login e/ou senha invalida';
        }

    })
    .catch(error => console.error('Login e/ou senha invalida', error));
    labelFeedback.textContent = 'Login e/ou senha invalida';
    
}

function MostraCadastraUsuario(){
    

    cadastre_se_Container.style.display = "block";
    logincontainer.style.display = "none";
    
}

function MostraLogin(){
    

    cadastre_se_Container.style.display = "none";
    logincontainer.style.display = "block";
    
}

function CadastraUsuario (){

    if (input_Novopassword.value == input_ConfirmaNovopassword.value)  {

        let novoNome = Input_novoNome.value;
        let novoUsuario = Input_novoLogin.value;
        let novaSenha = input_Novopassword.value;

        const dados = {

            NovoNome : novoNome,
            NovoUsuario : novoUsuario,
            NovaSenha : novaSenha

        };
    
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        };
    
        fetch('http://localhost:3000/cadastrausuario', options)
                .then(response => {
                if (!response.ok) {
                    labelFeedback.textContent = "Usuario ja existente";
                }
                return response.json();
                })
                .then(data => {
                    console.log('Dados inseridos com sucesso:', data);
                })
                .catch(error => {
                    console.error('Erro:', error);
                });
        
                MostraLogin();
                labelFeedback.textContent = "Usuario criado com sucesso";
                

    } else {

        Cadastre_se_feedback.textContent = "Senha e confirmação não conferem";
        
    }
    
}


