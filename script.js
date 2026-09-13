// --- CARREGAR E RENDERIZAR CARTÕES (Sem opção de excluir) ---
function carregarCartoes() {
    let lista = document.getElementById('listaCartoes');
    if (!lista) return;
    let cartoes = JSON.parse(localStorage.getItem('cartoesAlice')) || [
        { id: 1, nome: "Dinda", mensagem: "Alice, que sua festa de 15 anos seja mágica e inesquecível! 💖✨" }
    ];
    lista.innerHTML = "";
    cartoes.forEach((c) => {
        lista.innerHTML += `
            <div class="cartao-item" style="position: relative;">
                <p class="mensagem-card">"${c.mensagem}"</p>
                <span class="autor-card">— ${c.nome}</span>
            </div>
        `;
    });
}

// --- FUNÇÃO PARA ENVIAR NOVO CARTÃO ---
function enviarCartao(event) {
    if (event) event.preventDefault();
    let nomeInput = document.getElementById('nomeCartao') || document.getElementById('nomeRemetente');
    let msgInput = document.getElementById('mensagemCartao');

    if (!nomeInput || !msgInput) return;

    let nome = nomeInput.value.trim();
    let mensagem = msgInput.value.trim();

    if (!nome || !mensagem) {
        alert("Por favor, preencha seu nome e a mensagem!");
        return;
    }

    let cartoes = JSON.parse(localStorage.getItem('cartoesAlice')) || [];
    cartoes.unshift({ id: Date.now(), nome, mensagem });
    localStorage.setItem('cartoesAlice', JSON.stringify(cartoes));

    nomeInput.value = "";
    msgInput.value = "";
    carregarCartoes();
    alert("Cartão enviado com sucesso! 💌✨");
}


// --- VARAL DE FOTOS COM ANIMAÇÃO E ZOOM (Sem opção de excluir) ---
function enviarFotoVaral() {
    let nomeElem = document.getElementById('nomeFotografo');
    let inputFoto = document.getElementById('inputFotoVaral');

    if (!nomeElem || !inputFoto) return;

    let nome = nomeElem.value.trim();

    if (!nome || !inputFoto.files || !inputFoto.files[0]) {
        alert("Por favor, digite seu nome e escolha uma foto!");
        return;
    }

    let reader = new FileReader();
    reader.onload = function(e) {
        let fotoUrl = e.target.result;
        let fotos = JSON.parse(localStorage.getItem('varalFotosAlice')) || [];
        fotos.unshift({ nome, foto: fotoUrl });
        localStorage.setItem('varalFotosAlice', JSON.stringify(fotos));

        nomeElem.value = "";
        inputFoto.value = "";
        carregarVaralFotos();
        alert("Foto pendurada no varal com sucesso! 📸✨");
    }
    reader.readAsDataURL(inputFoto.files[0]);
}

function carregarVaralFotos() {
    let gridVaral = document.getElementById('gridVaral');
    if (!gridVaral) return;
    let fotos = JSON.parse(localStorage.getItem('varalFotosAlice')) || [
        { nome: "Alice & Amigas", foto: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=500&q=80" },
        { nome: "Família", foto: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=500&q=80" }
    ];

    // Duplicamos o array de fotos para criar o efeito de loop infinito suave na animação
    let fotosDuplicadas = [...fotos, ...fotos];

    gridVaral.innerHTML = "";
    fotosDuplicadas.forEach((f) => {
        gridVaral.innerHTML += `
            <div class="polaroid-item">
                <img src="${f.foto}" alt="Foto de ${f.nome}" class="polaroid-img" onclick="ampliarFoto('${f.foto}')">
                <div class="polaroid-legenda">${f.nome}</div>
            </div>
        `;
    });
}


// --- CONFIGURAÇÃO DO PIX E QR CODE PELO ADMINISTRADOR ---
function salvarPixAdmin() {
    let inputKey = document.getElementById('adminPixKey');
    let inputQr = document.getElementById('adminPixQr');

    if (!inputKey && !inputQr) return;

    let chavePix = inputKey ? inputKey.value.trim() : "";
    let qrcodePix = inputQr ? inputQr.value.trim() : "";

    if (chavePix) localStorage.setItem('alice_pix_chave', chavePix);
    if (qrcodePix) localStorage.setItem('alice_pix_qrcode', qrcodePix);

    alert("Configurações do PIX salvas com sucesso! 💳");
    carregarPixNaTela();
}

function carregarPixNaTela() {
    let chaveSalva = localStorage.getItem('alice_pix_chave') || "Chave PIX não configurada";
    let qrcodeSalvo = localStorage.getItem('alice_pix_qrcode') || "";

    // Elementos na área visível para os convidados
    let displayChave = document.getElementById('displayPixChave');
    let displayQr = document.getElementById('displayPixQr');

    if (displayChave) displayChave.innerText = chaveSalva;
    if (displayQr && qrcodeSalvo) {
        displayQr.src = qrcodeSalvo;
        displayQr.style.display = "block";
    }
}


// --- FUNÇÕES DE ZOOM DA IMAGEM ---
function ampliarFoto(urlFoto) {
    let modalZoom = document.getElementById('modalZoomFoto');
    let imgZoom = document.getElementById('imgZoomExibicao');
    if (!modalZoom) {
        let divModal = document.createElement('div');
        divModal.id = 'modalZoomFoto';
        divModal.onclick = fecharZoom;
        divModal.innerHTML = `<span class="fechar" style="position:absolute; top:20px; right:30px; font-size:2.5rem; color:#fff; cursor:pointer;">&times;</span><img id="imgZoomExibicao" src="${urlFoto}" style="max-width:90%; max-height:90%; border-radius:8px;">`;
        divModal.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:flex; align-items:center; justify-content:center; z-index:9999;";
        document.body.appendChild(divModal);
    } else {
        if (imgZoom) imgZoom.src = urlFoto;
        modalZoom.style.display = 'flex';
    }
}

function fecharZoom() {
    let modalZoom = document.getElementById('modalZoomFoto');
    if (modalZoom) modalZoom.style.display = 'none';
}

// Inicializar tudo ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarCartoes();
    carregarVaralFotos();
    carregarPixNaTela();
});
