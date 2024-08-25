const botoes = document.querySelectorAll('button')
const caixas = document.querySelectorAll('input')
const selects = document.querySelectorAll('select')
const labels = document.querySelectorAll('label')
const divs = document.querySelectorAll('div')


let VeiculosRetornados;
let idveiculo;
let ModoAlterar = false;
let ModoCadastrar = false;

selects[1].addEventListener('change', (event) => { 
 
    const opcaoSelecionada = event.target.options[event.target.selectedIndex]; 
    let textoSelecionado = opcaoSelecionada.text;
    textoSelecionado = textoSelecionado.replace(/\D/g, ''); 
    idveiculo = textoSelecionado; 
    PreencheCadVeiculo();
    
});

botoes[4].addEventListener('click', (event) => {

    if (idveiculo){

        AlteraCadVeiculo();

    }

    else {

        labels[4].textContent = "Selecione um veiculo";

    }     
}); 

botoes[3].addEventListener('click', (event) => {    

    CadastraVeiculo();
       
}); 

export async function AbreCadVeiculo (grupoUsuario, companyId) {
     
    if(grupoUsuario == 1){        

            divs[3].style.display = 'block';
            selects[1].innerHTML = '';
            VeiculosRetornados = await RetornaTodosVeiculos(companyId);
            VeiculosRetornados.forEach(item => { 
            const option = document.createElement('option');
            option.textContent = item.idveiculo + " - " + item.marca + " " + item.modelo;             
            selects[1].appendChild(option);

        });              
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

export async function PreencheCadVeiculo (){

    idveiculo = Number(idveiculo);

    for (let i = 0; i <= VeiculosRetornados.length - 1; i ++){

        if (VeiculosRetornados[i].idveiculo === idveiculo) {            

            caixas[5].value = VeiculosRetornados[i].marca;
            caixas[6].value = VeiculosRetornados[i].modelo;

            let dataSaida = new Date (VeiculosRetornados[i].ano);
            let dataFormatada = dataSaida.toISOString().split('T')[0]; 
            caixas[7].value = dataFormatada; 

            caixas[8].value = VeiculosRetornados[i].kilometragem;
            caixas[9].value = VeiculosRetornados[i].cor;
            caixas[10].value =VeiculosRetornados[i].diaria;                       
        }         
    }
}

function AlteraCadVeiculo (){

    if (ModoAlterar === false){

        labels[4].textContent = "";
        ModoAlterar = true;
        botoes[4].textContent = "Gravar"
        botoes[3].style.backgroundColor = "Gray";
        selects[1].disabled = true;
        caixas[5].readOnly = false;
        caixas[6].readOnly = false;
        caixas[7].readOnly = false;
        caixas[8].readOnly = false;
        caixas[9].readOnly = false;
        caixas[10].readOnly = false;
    } else {

        if(caixas[5].value == "" || caixas[6].value == "" || caixas[7].value == ""|| caixas[8].value == "" || caixas[9].value == ""|| caixas[10].value == "" ) {

            labels[4].textContent = "Preencha todos os campos para continuar";

            } else {

                ModoAlterar = false;
                botoes[4].textContent = "Alterar"
                botoes[3].style.backgroundColor = "#4CAF50";
                selects[1].disabled = false;
                caixas[5].readOnly = true;
                caixas[6].readOnly = true;
                caixas[7].readOnly = true;
                caixas[8].readOnly = true;
                caixas[9].readOnly = true;
                caixas[10].readOnly = true;

                const dados = { 
                 
                    id: idveiculo, 
                    marca: caixas[5].value, 
                    diaria: caixas[10].value, 
                    modelo: caixas[6].value, 
                    ano: caixas[7].value, 
                    KM: caixas[8].value, 
                    cor: caixas[9].value
                };                

                const options = { 
                    method: 'PUT', 
                    headers: { 
                        'Content-Type': 'application/json' 
                    }, 
                    body: JSON.stringify(dados) 
                };                  

                fetch('http://localhost:3000/atualizaveiculo', options) 
                .then(response => { 
                if (!response.ok) { 
                    throw new Error('Erro ao enviar os dados'); 
                } 
                return response.json(); 
                }) 
                .then(data => { 
                console.log('Dados alterados com sucesso:', data); 
                }) 
                .catch(error => { 
                console.error('Erro:', error);  
                });
                
                labels[4].textContent = "";
            } 
    }
}

function CadastraVeiculo (){

    if (ModoCadastrar === false){

    ModoCadastrar = true;

    botoes[4].disabled = true; 
    botoes[4].style.backgroundColor = "Gray" 
    selects[1].disabled = true;
    botoes[3].textContent = 'Gravar';

    caixas[5].readOnly = false; 
    caixas[6].readOnly = false; 
    caixas[7].readOnly = false; 
    caixas[8].readOnly = false; 
    caixas[9].readOnly = false; 
    caixas[10].readOnly = false; 
    
    caixas[5].value = ''; 
    caixas[6].value = ''; 
    caixas[7].value = ''; 
    caixas[8].value = ''; 
    caixas[9].value = ''; 
    caixas[10].value = ''; 

    labels[4].textContent = "";

    } else {

        if(caixas[5].value == "" || caixas[6].value == "" || caixas[7].value == ""|| caixas[8].value == "" || caixas[9].value == ""|| caixas[10].value == "" ) {

            labels[4].textContent = "Preencha todos os campos para continuar";            

        } else {

            ModoCadastrar = false;
            
            botoes[4].disabled = false;
            botoes[4].style.backgroundColor = "#4CAF50"; 
            selects[1].disabled = false;

            let marca = caixas[5].value;
            let diaria = caixas[10].value;
            let modelo = caixas[6].value;
            let ano = caixas[7].value;
            let KM = caixas[8].value;
            let cor = caixas[9].value;
            let companyId = localStorage.getItem('CompanyId');

            const dados = { 
                 
                marca: marca, 
                diaria: diaria, 
                modelo: modelo, 
                ano: ano, 
                KM: KM, 
                cor: cor, 
                companyId:companyId 
            };   

            const options = { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json' 
                }, 
                body: JSON.stringify(dados) 
            };

            fetch('http://localhost:3000/cadastraveiculo', options) 
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
 
            botoes[3].textContent = 'Cadastrar';
            labels[4].textContent = "";
        } 
    }
}