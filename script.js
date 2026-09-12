// --- CARregar E RENDERIZAR CARTÕES COM OPÇÃO DE EXCLUIR ---
function carregarCartoes() {
    let lista = document.getElementById('listaCartoes');
    if (!lista) return;
    let cartoes = JSON.parse(localStorage.getItem('cartoesAlice')) || [
        { id: 1, nome: "Dinda", mensagem: "Alice, que sua festa de 15 anos seja mágica e inesquecível! 💖✨" }
    ];
    lista.innerHTML = "";
    cartoes.forEach((c, index) => {
        lista.innerHTML += `
            <div class="cartao-item" style="position: relative;">
                <button class="btn-excluir" onclick="removerCartao(${index})" title="Excluir cartão">✕</button>
                <p class="mensagem-card">"${c.mensagem}"</p>
                <span class="autor-card">— ${c.nome}</span>
            </div>
        `;
    });
}

function removerCartao(index) {
    if (confirm("Deseja realmente apagar este cartão?")) {
        let cartoes = JSON.parse(localStorage.getItem('cartoesAlice')) || [];
        cartoes.splice(index, 1);
        localStorage.setItem('cartoesAlice', JSON.stringify(cartoes));
        carregarCartoes();
    }
}

// --- VARAL DE FOTOS COM ANIMAÇÃO, ZOOM E EXCLUSÃO ---
function enviarFotoVaral() {
    let nome = document.getElementById('nomeFotografo').value.trim();
    let inputFoto = document.getElementById('inputFotoVaral');

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

        document.getElementById('nomeFotografo').value = "";
        document.getElementById('inputFotoVaral').value = "";
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
    fotosDuplicadas.forEach((f, index) => {
        // Usamos o índice original baseado no tamanho do array real para exclusão correta
        let realIndex = index % fotos.length;
        gridVaral.innerHTML += `
            <div class="polaroid-item">
                <button class="btn-excluir" onclick="removerFotoVaral(${realIndex}); event.stopPropagation();" title="Excluir foto">✕</button>
                <img src="${f.foto}" alt="Foto de ${f.nome}" class="polaroid-img" onclick="ampliarFoto('${f.foto}')">
                <div class="polaroid-legenda">${f.nome}</div>
            </div>
        `;
    });
}

function removerFotoVaral(index) {
    if (confirm("Deseja realmente remover esta foto do varal?")) {
        let fotos = JSON.parse(localStorage.getItem('varalFotosAlice')) || [];
        fotos.splice(index, 1);
        localStorage.setItem('varalFotosAlice', JSON.stringify(fotos));
        carregarVaralFotos();
    }
}

// Funções de Zoom da Imagem
function ampliarFoto(urlFoto) {
    let modalZoom = document.getElementById('modalZoomFoto');
    let imgZoom = document.getElementById('imgZoomExibicao');
    if (!modalZoom) {
        // Cria o modal de zoom dinamicamente se não existir no HTML
        let divModal = document.createElement('div');
        divModal.id = 'modalZoomFoto';
        divModal.onclick = fecharZoom;
        divModal.innerHTML = `<span class="fechar" style="top:20px; right:30px; font-size:2rem;">&times;</span><img id="imgZoomExibicao" src="${urlFoto}">`;
        document.body.appendChild(divModal);
        divModal.style.display = 'flex';
    } else {
        imgZoom.src = urlFoto;
        modalZoom.style.display = 'flex';
    }
}

function fecharZoom() {
    let modalZoom = document.getElementById('modalZoomFoto');
    if (modalZoom) modalZoom.style.display = 'none';
}
