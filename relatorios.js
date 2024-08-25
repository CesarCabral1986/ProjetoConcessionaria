const botoes = document.querySelectorAll('button')
const caixas = document.querySelectorAll('input')
const selects = document.querySelectorAll('select')
const labels = document.querySelectorAll('label')
const divs = document.querySelectorAll('div')


let CompanyId;

botoes[10].addEventListener('click', (event) => {

    RelatorioPessoas();
        
});

export async function AbreRelatorios (grupoUsuario, companyId){
        
    if(grupoUsuario == 1){        

        divs[5].style.display = 'block';        
        CompanyId = companyId;
    };
}

function RelatorioPessoas(){

    if (caixas[16].value == "" || caixas[17].value == "" || caixas[18].value == "" || caixas[19].value == ""){

        labels[9].textContent = "Preencha todos os dados";

    } else {

        labels[9].textContent = "";

        const dataNascInicial = caixas[16].value;
        const dataNascFinal = caixas[17].value;
        const rendaInicial = caixas[18].value;
        const rendaFinal = caixas[19].value;
        
        console.log(rendaInicial, rendaFinal);

        const url = `http://localhost:3000/relatorioclientes/${dataNascInicial}?param2=${dataNascFinal}&param3=${rendaInicial}&param4=${rendaFinal}&param5=${CompanyId}`; 
    
        fetch(url) 
            .then(response => response.json())
            .then(data => {             
                BaixaRelatorioCLiente(data); 
            }) 
            .catch(error => { 
                console.error('Erro:', error); 
            }); 
    }
}

function BaixaRelatorioCLiente(data) { 
 
    const { jsPDF } = window.jspdf; 
    const doc = new jsPDF(); 
     
    let yOffset = 10; 
 
    doc.text(`Relatorio de Clientes`, 10, yOffset); 
    yOffset += 10; 
     
    data.forEach((data, index) => { 
         
        const dataNascimento = new 
            Date(data.Data_de_Nascimento).toLocaleDateString('pt-BR', { 
            year: 'numeric',  
            month: '2-digit',  
            day: '2-digit' 
        }); 
 
         
        doc.text(`Registro ${index + 1}`, 10, yOffset); 
        yOffset += 10; 
        doc.text(`Nome: ${data.Nome}`, 10, yOffset); 
        yOffset += 10; 
        doc.text(`Data de Nascimento: ${dataNascimento}`, 10, yOffset); 
        yOffset += 10; 
        doc.text(`Profissão: ${data.Profissão}`, 10, yOffset); 
        yOffset += 10; 
        doc.text(`Renda: ${data.Renda}`, 10, yOffset); 
        yOffset += 20; 
 
        doc.line(10, yOffset, 200, yOffset); 
        yOffset += 10; 
         
        if (yOffset > 280) { 
            doc.addPage(); 
            yOffset = 10;  
        } 
    }); 
     
    doc.save('relatorio.pdf');      
} 

