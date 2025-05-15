
const button = document.getElementById("button");
const form = document.getElementById("formLei");
const titulo = document.getElementById("titulo");
const capitulo = document.getElementById("capitulo");
const artigo = document.getElementById("artigo");
const textoArtigo = document.getElementById("textoArtigo");
const numeroLei = document.getElementById("numeroLei");
const dataLei = document.getElementById("dataLei");
const descricaoLei = document.getElementById("descricaoLei");

button.addEventListener("click", acionarFuncao);

async function acionarFuncao(e) {
    e.preventDefault(); 

    if (titulo.value.trim() === '') {
        alert("Preencha o Título");
        titulo.focus();
        return;
    } else if (capitulo.value.trim() === '') {
        alert("Preencha o Capítulo");
        capitulo.focus();
        return;
    } else if (artigo.value.trim() === '') {
        alert("Preencha o Artigo");
        artigo.focus();
        return;
    } else if (textoArtigo.value.trim() === '') {
        alert("Preencha o Texto do Artigo");
        textoArtigo.focus();
        return;
    } else if (numeroLei.value.trim() === '') {
        alert("Preencha o Número da Lei");
        numeroLei.focus();
        return;
    } else if (dataLei.value.trim() === '') {
        alert("Preencha a Data da Lei");
        dataLei.focus();
        return;
    } else if (descricaoLei.value.trim() === '') {
        alert("Preencha a Descrição da Lei");
        descricaoLei.focus();
        return;
    }

    // Criar o objeto com os dados do formulário
    const dados = {
        titulo: titulo.value,
        capitulo: capitulo.value,
        artigo: artigo.value,
        textoArtigo: textoArtigo.value,
        numeroLei: numeroLei.value,
        dataLei: dataLei.value,
        descricaoLei: descricaoLei.value
    };

    try {
        const resposta = await fetch('http://localhost:3000/enviar-formulario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            alert(resultado.mensagem);
            form.reset();
        } else {
            alert('Erro ao enviar dados: ' + resultado.erro);
        }
    } catch (erro) {
        alert('Erro na conexão com o servidor: ' + erro.message);
    }
}