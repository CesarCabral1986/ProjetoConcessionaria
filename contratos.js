const botoes = document.querySelectorAll('button')
const caixas = document.querySelectorAll('input')
const selects = document.querySelectorAll('select')
const labels = document.querySelectorAll('label')
const divs = document.querySelectorAll('div')

let ContratosRetornados;
let PessoasRetornadas;
let VeiculosRetornados;
let idcontrato;
let idpessoa;
let idveiculo;
let ModoCadastrar = false
let ModoAlterar = false
let CompanyId;

selects[2].addEventListener('change', (event) => { 
 
    const opcaoSelecionada = event.target.options[event.target.selectedIndex]; 
    let textoSelecionado = opcaoSelecionada.text;
    textoSelecionado = textoSelecionado.replace(/\D/g, '');
    idcontrato = textoSelecionado; 
    PreencheCadContrato();
    
});

selects[3].addEventListener('change', (event) => { 
 
    const opcaoSelecionada = event.target.options[event.target.selectedIndex]; 
    let textoSelecionado = opcaoSelecionada.text;
    textoSelecionado = textoSelecionado.replace(/\D/g, '');
    idpessoa = textoSelecionado; 
        
});

selects[4].addEventListener('change', (event) => { 
 
    const opcaoSelecionada = event.target.options[event.target.selectedIndex]; 
    let textoSelecionado = opcaoSelecionada.text;
    textoSelecionado = textoSelecionado.replace(/\D/g, '');
    idveiculo = textoSelecionado; 
        
});

botoes[7].addEventListener('click', (event) => {

    CadastraContrato();
        
});

botoes[8].addEventListener('click', (event) => {

    AlteraContrato();
        
});

export async function AbreCadContratos (grupoUsuario, companyId) {

    CompanyId = companyId;
     
    if(grupoUsuario == 1){

            divs[4].style.display = 'block';
            selects[2].innerHTML = '';            

            caixas[11].readOnly = true;
            caixas[12].readOnly = true;
            caixas[13].readOnly = true;
            caixas[14].readOnly = true;
            caixas[15].readOnly = true;

            ContratosRetornados = await RetornaTodosContratos(companyId);
            ContratosRetornados.forEach(item => { 
            const option = document.createElement('option');
            option.textContent = item.id_contrato + " - " + item.marca + " " + item.modelo + " - " + item.nome;
            selects[2].appendChild(option);

        });   
        
    } 
}

async function RetornaTodosContratos(companyId) {
    try {
        const response = await fetch(`http://localhost:3000/retornatodoscontratos/${companyId}`);
        const data = await response.json();
        if (data.length > 0) {

            return data;

        }
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

export async function PreencheCadContrato (){

    idcontrato = Number(idcontrato);    

    for (let i = 0; i <= ContratosRetornados.length - 1; i ++){

        if (ContratosRetornados[i].id_contrato === idcontrato) {
            
            caixas[12].value = ContratosRetornados[i].nome;
            caixas[13].value = ContratosRetornados[i].marca + " " + ContratosRetornados[i].modelo;
            const dataSaida = new Date (ContratosRetornados[i].data_saida);
            const dataFormatada = dataSaida.toISOString().split('T')[0]; 
            caixas[14].value = dataFormatada;

            const dataAtual = new Date();

            const diferencaMilisegundos = dataAtual - dataSaida;
            const milisegundosDia = 24 * 60 * 60 * 1000;
            const diferencaDias = Math.floor(diferencaMilisegundos / milisegundosDia);

            let diariaConvertida = ContratosRetornados[i].diaria.replace("R$", "").replace(".", "").replace(",", ".");
            diariaConvertida = parseFloat(diariaConvertida);

            labels[6].textContent = 'A Pagar: R$ ' + (diferencaDias + 1) * diariaConvertida;
        }         
    }
}

async function CadastraContrato(){

    if (ModoCadastrar === false) { 
 
        ModoCadastrar = true; 
 
        botoes[7].textContent = 'Gravar'; 
        botoes[6].disabled = true; 
        botoes[8].disabled = true;
        botoes[6].style.backgroundColor = "Gray";
        botoes[8].style.backgroundColor = "Gray";         
        
        selects[2].disabled = true;
        
        caixas[11].value = '';
        caixas[12].value = '';
        caixas[13].value = '';
        caixas[14].value = '';
        caixas[15].value = '';

        PessoasRetornadas = await RetornaTodasPessoas(CompanyId);
        console.log(PessoasRetornadas);
        PessoasRetornadas.forEach(item => { 
        const option = document.createElement('option');
        option.textContent = item.idcliente + " - " + item.nome;  
        selects[3].appendChild(option);
        })

        VeiculosRetornados = await RetornaTodosVeiculos(CompanyId);
        VeiculosRetornados.forEach(item => { 
        const option2 = document.createElement('option');
        option2.textContent = item.idveiculo + " - " + item.marca + " " + item.modelo;  
        selects[4].appendChild(option2);
        })        
 
    } else {        

        ModoCadastrar = false;

        botoes[7].textContent = 'Cadastrar'; 
        botoes[6].disabled = false; 
        botoes[8].disabled = false;
        botoes[6].style.backgroundColor = "#4CAF50"; 
        botoes[8].style.backgroundColor = "#4CAF50";   
            
        selects[2].disabled = false;

        const dados = { 

            idcliente: idpessoa, 
            idveiculo: idveiculo, 
            saida: new Date(),
            companyId: CompanyId,
        };

        const options = { 
            method: 'POST', 
            headers: { 
                'Content-Type': 'application/json' 
            }, 
            body: JSON.stringify(dados) 
        }; 
 
        fetch('http://localhost:3000/cadastracontrato', options) 
        .then(response => { 
            if (!response.ok) { 
            throw new Error('Erro ao enviar os dados'); 
            } 
            return response.json(); 
        }) 
        .then(data => { 
            console.log('Dados inseridos com sucesso:', data); 
        }) 
        .catch(error => { 
            console.error('Erro:', error); 
        });        
    }
}

async function RetornaTodasPessoas(companyId) {
    try {
        const response = await fetch(`http://localhost:3000/retornatodaspessoas/${companyId}`);
        const data = await response.json();
        if (data.length > 0) {

            return data;

        }
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

async function RetornaTodosVeiculos(companyId) {
    try {
        const response = await fetch(`http://localhost:3000/retornatodosveiculos/${companyId}`);
        const data = await response.json();
        if (data.length > 0) {

            return data;

        }
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

async function AlteraContrato(){

    if (ModoAlterar === false) { 
 
        ModoAlterar = true; 
 
        botoes[8].textContent = 'Gravar';
        botoes[6].disabled = true; 
        botoes[7].disabled = true;
        botoes[6].style.backgroundColor = "Gray";
        botoes[7].style.backgroundColor = "Gray";         
        
        selects[2].disabled = true;
        
        caixas[11].value = '';
        caixas[12].value = '';
        caixas[13].value = '';
        caixas[14].value = '';
        caixas[15].value = '';

        PessoasRetornadas = await RetornaTodasPessoas(CompanyId);
        console.log(PessoasRetornadas);
        PessoasRetornadas.forEach(item => { 
        const option = document.createElement('option');
        option.textContent = item.idcliente + " - " + item.nome;  
        selects[3].appendChild(option);
        })

        VeiculosRetornados = await RetornaTodosVeiculos(CompanyId);
        VeiculosRetornados.forEach(item => { 
        const option2 = document.createElement('option');
        option2.textContent = item.idveiculo + " - " + item.marca + " " + item.modelo;  
        selects[4].appendChild(option2);
        })        
 
    } else {

        ModoAlterar = false;

        botoes[8].textContent = 'Alterar'; 
        botoes[6].disabled = false; 
        botoes[7].disabled = false;
        botoes[6].style.backgroundColor = "#4CAF50"; 
        botoes[8].style.backgroundColor = "#4CAF50";   
            
        selects[2].disabled = false;

        const dados = { 

            idcliente: idpessoa, 
            idveiculo: idveiculo, 
            saida: new Date(),
            companyId: CompanyId,
            idcontrato: idcontrato
        };

        const options = { 
            method: 'PUT', 
            headers: { 
                'Content-Type': 'application/json' 
            }, 
            body: JSON.stringify(dados) 
        }; 
 
        fetch('http://localhost:3000/atualizacontrato', options) 
        .then(response => { 
            if (!response.ok) { 
            throw new Error('Erro ao enviar os dados'); 
            } 
            return response.json(); 
        }) 
        .then(data => { 
            console.log('Dados inseridos com sucesso:', data); 
        }) 
        .catch(error => { 
            console.error('Erro:', error); 
        }); 
    }

}