const botoes = document.querySelectorAll('button')
const caixas = document.querySelectorAll('input')
const selects = document.querySelectorAll('select')
const labels = document.querySelectorAll('label')
const divs = document.querySelectorAll('div')

let PessoasRetornadas;
let idpessoa;
let ModoAlterar = false;
let ModoCadastrar = false;

selects[0].addEventListener('change', (event) => { 
 
    const opcaoSelecionada = event.target.options[event.target.selectedIndex]; 
    let textoSelecionado = opcaoSelecionada.text;
    textoSelecionado = textoSelecionado.replace(/\D/g, ''); 
    idpessoa = textoSelecionado; 
    PreencheCadPessoa();
    
}); 

botoes[1].addEventListener('click', (event) => {

    if (idpessoa){

        AlteraCadPessoa(idpessoa);

    }

    else {

        labels[2].textContent = "Selecione um cliente";

    }     
}); 

botoes[0].addEventListener('click', (event) => {

    CadastraPessoa();
        
});

export async function AbreCadPessoa (grupoUsuario, companyId) {
     
    if(grupoUsuario == 1){        

            divs[1].style.display = 'block';
            selects[0].innerHTML = '';
            PessoasRetornadas = await RetornaTodasPessoas(companyId);            
            PessoasRetornadas.forEach(item => { 
            const option = document.createElement('option');
            option.textContent = item.idcliente + " - " + item.nome;             
            selects[0].appendChild(option);

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

export async function PreencheCadPessoa (){

    idpessoa = Number(idpessoa);

    for (let i = 0; i <= PessoasRetornadas.length - 1; i ++){

        if (PessoasRetornadas[i].idcliente === idpessoa) {

            caixas[1].value = PessoasRetornadas[i].nome;            
            caixas[3].value = PessoasRetornadas[i].profissao;
            caixas[4].value = PessoasRetornadas[i].renda;

            let dataSaida = new Date (PessoasRetornadas[i].datanascimento);
            let dataFormatada = dataSaida.toISOString().split('T')[0]; 
            caixas[2].value = dataFormatada;            
        }         
    }
}

function AlteraCadPessoa (){

    if (ModoAlterar === false){

        labels[2].textContent = "";
        ModoAlterar = true;
        botoes[1].textContent = "Gravar"
        botoes[0].style.backgroundColor = "Gray";
        selects[0].disabled = true;
        caixas[1].readOnly = false;
        caixas[2].readOnly = false;
        caixas[3].readOnly = false;
        caixas[4].readOnly = false;
    } else {

        if(caixas[1].value == "" || caixas[2].value == "" || caixas[3].value == ""|| caixas[4].value == "" ) {

            labels[2].textContent = "Preencha todos os campos para continuar";

            } else {

                ModoAlterar = false;
                botoes[1].textContent = "Alterar"
                botoes[0].style.backgroundColor = "#4CAF50";
                selects[0].disabled = false;
                caixas[1].readOnly = true;
                caixas[2].readOnly = true;
                caixas[3].readOnly = true;
                caixas[4].readOnly = true;

                const dados = { 
                        
                    id: idpessoa, 
                    nome: caixas[1].value, 
                    data: caixas[2].value, 
                    profissao: caixas[3].value, 
                    renda: caixas[4].value 
                }; 

                const options = { 
                    method: 'PUT', 
                    headers: { 
                        'Content-Type': 'application/json' 
                    }, 
                    body: JSON.stringify(dados) 
                }; 

                fetch('http://localhost:3000/atualizapessoa', options) 
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
                
                labels[2].textContent = "";

            } 
    }
}

function CadastraPessoa (){

    if (ModoCadastrar === false){

    ModoCadastrar = true;

    botoes[1].disabled = true; 
    botoes[1].style.backgroundColor = "Gray" 
    selects[0].disabled = true;
    botoes[0].textContent = 'Gravar';

    caixas[1].readOnly = false; 
    caixas[2].readOnly = false; 
    caixas[3].readOnly = false; 
    caixas[4].readOnly = false; 
    
    caixas[1].value = ''; 
    caixas[2].value = ''; 
    caixas[3].value = ''; 
    caixas[4].value = ''; 

    labels[2].textContent = "";

    } else {

        if(caixas[1].value == "" || caixas[2].value == "" || caixas[3].value == ""|| caixas[4].value == "" ) {

            labels[2].textContent = "Preencha todos os campos para continuar";

            

        } else {

            ModoCadastrar = false;
            
            botoes[1].disabled = false;
            botoes[1].style.backgroundColor = "#4CAF50"; 
            selects[0].disabled = false;

            let nome = caixas[1].value; 
            let data = caixas[2].value; 
            let profissao = caixas[3].value; 
            let renda = caixas[4].value; 
            let companyId = localStorage.getItem('CompanyId');

            const dados = { 
                 
                nome: nome, 
                data: data, 
                profissao: profissao, 
                renda: renda, 
                companyId : companyId 
 
            }; 

            const options = { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json' 
                }, 
                body: JSON.stringify(dados) 
            };

            fetch('http://localhost:3000/cadastrapessoa', options) 
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
 
            botoes[0].textContent = 'Cadastrar';
            labels[2].textContent = "";

        } 
    }
}


 


