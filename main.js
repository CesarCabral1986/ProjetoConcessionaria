import {AbreCadPessoa } from './pessoas.js';
import {AbreCadVeiculo } from './veiculos.js';
import {AbreRelatorios } from './relatorios.js';
import {AbreCadContratos } from './contratos.js';

const botoes = document.querySelectorAll('button')
const menus = document.querySelectorAll('li')
const caixas = document.querySelectorAll('input')
const divs = document.querySelectorAll('div')
const labels = document.querySelectorAll('label')
const UsuarioLogado = document.querySelector("#UsuarioLogado");

const grupoUsuario = localStorage.getItem('Grupo');
const companyId = localStorage.getItem('CompanyId');
const NomeUsuario = localStorage.getItem('Nome');

document.addEventListener("DOMContentLoaded", function() {
    
    UsuarioLogado.textContent = "Usuario: " +  NomeUsuario;    
         
});

menus.forEach(menu => {
    menu.addEventListener('click', () => {
        
                
        switch(menu.id){
            
            case "CadPessoaMenu":
            
            FechaTodosContainers();
            AbreCadPessoa(grupoUsuario, companyId);                       
        }

        switch(menu.id){

            case "CadVeiculoMenu":

            FechaTodosContainers();
            AbreCadVeiculo(grupoUsuario, companyId);
        }

        switch(menu.id){

            case "CadContratoMenu":

            FechaTodosContainers();
            AbreCadContratos(grupoUsuario, companyId);
        }

        switch(menu.id){

            case "RelatoriosMenu":

            FechaTodosContainers();
            AbreRelatorios(grupoUsuario, companyId);

            console.log("ok");
        }

        switch(menu.id){

            case "SairMenu":

            Sair();
                
        }
    });
});

botoes.forEach(botao => {
    botao.addEventListener('click', () => {

        if (botao.id === "saircadPessoa" || botao.id === "saircadVeiculo" || botao.id === "saircadContrato"){

            FechaTodosContainers();
        }                
        
    });
});

async function FechaTodosContainers(){

    divs.forEach(div => {        
            
        if(div.id != "menulateral"){

           div.style.display = 'none';
               
        }   
             
    });    
}

function Sair (){ 

    localStorage.clear(); 
    const newPageUrl = 'login.html'; 
    window.location.href = newPageUrl; 

}







