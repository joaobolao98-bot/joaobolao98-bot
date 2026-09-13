// --- DADOS DA LISTA DE PRESENTES PADRÃO ---
const presentesIniciais = [
    { id: 1, nome: "Cota Lua de Mel", preco: 150.00, img: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=500&q=80" },
    { id: 2, nome: "Vestido da Festa", preco: 250.00, img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=500&q=80" },
    { id: 3, nome: "Ingresso Parque de Diversões", preco: 120.00, img: "https://images.unsplash.com/photo-1513883637004-3ac22981fddc?auto=format&fit=crop&w=500&q=80" },
    { id: 4, nome: "Patrocínio para o DJ", preco: 100.00, img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=500&q=80" }
];

document.addEventListener('DOMContentLoaded', () => {
    carregarPresentes();
    carregarCartoes();
    carregarVaralFotos();
    carregarPixPublico();
});

// --- RENDERIZAR LISTA DE PRESENTES ---
function carregarPresentes() {
    let grid = document.getElementById('gridPresentes');
    if (!grid) return;
    
    grid.innerHTML = "";
    presentesIniciais.forEach(p => {
        grid.innerHTML += `
            <div class="card-presente">
                <img src="${p.img}" alt="${p.nome}">
                <div class="card-info">
                    <h3>${p.nome}</h3>
                    <p class="preco-presente">R$ ${p.preco.toFixed(2).replace('.', ',')}</p>
                    <button onclick="comprarPresente('${p.nome}', ${p.preco})" class="btn-ouro" style="width:100%;">Contribuir PIX</button>
                </div>
            </div>
        `;
    });
}

function comprarPresente(nome, preco) {
    let chavePix = localStorage.getItem('alice_pix_chave') || "Chave PIX não configurada";
    alert(`Obrigado pelo carinho! Para presentear com "${nome}" (R$ ${preco.toFixed(2)}), faça um PIX para a chave:\n\n${chavePix}\n\nAbra o aplicativo do seu banco, cole a chave e confirme o presente para a Alice! 💖`);
    window.location.href = "#pix";
}

// --- MURAL DE RECADOS (CARTÕES) ---
function enviarCartao(event) {
    event.preventDefault();
    let nome = document.getElementById('nomeCartao').value.trim();
    let mensagem = document.getElementById('mensagemCartao').value.trim();

    if (!nome || !mensagem) return;

    let cartoes = JSON.parse(localStorage.getItem('cartoesAlice')) || [];
    cartoes.unshift({ id: Date.now(), nome, mensagem });
    localStorage.setItem('cartoesAlice', JSON.stringify(cartoes));

    document.getElementById('formCartao').reset();
    carregarCartoes();
    alert("Recado enviado com sucesso! 💌");
}

function carregarCartoes() {
    let lista = document.getElementById('listaCartoes');
    let adminLista = document.getElementById('adminListaCartoes');
    if (!lista) return;

    let cartoes = JSON.parse(localStorage.getItem('cartoesAlice')) || [
        { id: 1, nome: "Dinda", mensagem: "Alice, que sua festa de 15 anos seja mágica e inesquecível! 💖✨" }
    ];

    // Renderiza no site público
    lista.innerHTML = "";
    cartoes.forEach((c) => {
        lista.innerHTML += `
            <div class="cartao-item">
                <p class="mensagem-card">"${c.mensagem}"</p>
                <span class="autor-card">— ${c.nome}</span>
            </div>
        `;
    });

    // Renderiza no painel da admin (com opção de exclusão)
    if (adminLista) {
        adminLista.innerHTML = "";
        cartoes.forEach((c, index) => {
            adminLista.innerHTML += `
                <div class="admin-item-linha">
                    <span><strong>${c.nome}:</strong> ${c.mensagem.substring(0, 30)}...</span>
                    <button class="btn-excluir-admin" onclick="excluirCartao(${index})">Excluir</button>
                </div>
            `;
        });
    }
}

function excluirCartao(index) {
    if (confirm("Deseja realmente apagar este cartão?")) {
        let cartoes = JSON.parse(localStorage.getItem('cartoesAlice')) || [];
        cartoes.splice(index, 1);
        localStorage.setItem('cartoesAlice', JSON.stringify(cartoes));
        carregarCartoes();
    }
}

// --- VARAL DE FOTOS COM ANIMAÇÃO E ZOOM ---
function enviarFotoVaral() {
    let nome = document.getElementById('nomeFotografo').value.trim();
    let inputFoto = document.getElementById('inputFotoVaral');

    if (!nome || !inputFoto.files || !inputFoto.files[0]) {
        alert("Por favor, digite seu nome e selecione uma foto.");
        return;
    }

    let reader = new FileReader();
    reader.onload = function(e) {
        let fotoUrl = e.target.result;
        let fotos = JSON.parse(localStorage.getItem('varalFotosAlice')) || [];
        fotos.unshift({ id: Date.now(), nome, foto: fotoUrl });
        localStorage.setItem('varalFotosAlice', JSON.stringify(fotos));

        document.getElementById('nomeFotografo').value = "";
        inputFoto.value = "";
        carregarVaralFotos();
        alert("Foto pendurada no varal com sucesso! 📸✨");
    };
    reader.readAsDataURL(inputFoto.files[0]);
}

function carregarVaralFotos() {
    let gridVaral = document.getElementById('gridVaral');
    let adminListaFotos = document.getElementById('adminListaFotos');
    if (!gridVaral) return;

    let fotos = JSON.parse(localStorage.getItem('varalFotosAlice')) || [
        { id: 1, nome: "Alice & Amigas", foto: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=500&q=80" },
        { id: 2, nome: "Família", foto: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=500&q=80" }
    ];

    // Duplicamos o array para criar o efeito de rotação infinita suave
    let fotosDuplicadas = [...fotos, ...fotos];

    gridVaral.innerHTML = "";
    fotosDuplicadas.forEach((f, i) => {
        let randomRot = (i % 5) * 0.2; // Rotação aleatória leve para efeito polaroid
        gridVaral.innerHTML += `
            <div class="polaroid-item" style="--r: ${randomRot};">
                <img src="${f.foto}" alt="${f.nome}" class="polaroid-img" onclick="ampliarFoto('${f.foto}')">
                <div class="polaroid-legenda">${f.nome}</div>
            </div>
        `;
    });

    // Renderiza no painel da admin com opção de exclusão
    if (adminListaFotos) {
        adminListaFotos.innerHTML = "";
        fotos.forEach((f, index) => {
            adminListaFotos.innerHTML += `
                <div class="admin-item-linha">
                    <span><img src="${f.foto}" style="width:30px; height:30px; object-fit:cover; vertical-align:middle; border-radius:4px; margin-right:8px;"> ${f.nome}</span>
                    <button class="btn-excluir-admin" onclick="excluirFotoVaral(${index})">Excluir</button>
                </div>
            `;
        });
    }
}

function excluirFotoVaral(index) {
    if (confirm("Deseja realmente remover esta foto do varal?")) {
        let fotos = JSON.parse(localStorage.getItem('varalFotosAlice')) || [];
        fotos.splice(index, 1);
        localStorage.setItem('varalFotosAlice', JSON.stringify(fotos));
        carregarVaralFotos();
    }
}

function ampliarFoto(url) {
    let modal = document.getElementById('modalZoom');
    let img = document.getElementById('imgZoomAmpliada');
    if (modal && img) {
        img.src = url;
        modal.style.display = 'flex';
    }
}

function fecharZoom() {
    let modal = document.getElementById('modalZoom');
    if (modal) modal.style.display = 'none';
}

// --- GESTÃO DO PIX ---
function salvarPixAdmin() {
    let chave = document.getElementById('adminPixChaveInput').value.trim();
    let qrcode = document.getElementById('adminPixQrInput').value.trim();

    if (chave) localStorage.setItem('alice_pix_chave', chave);
    if (qrcode) localStorage.setItem('alice_pix_qrcode', qrcode);

    alert("Dados do PIX atualizados com sucesso! 💳");
    carregarPixPublico();
}

function carregarPixPublico() {
    let chaveSalva = localStorage.getItem('alice_pix_chave') || "Chave PIX ainda não cadastrada pela Alice.";
    let qrcodeSalvo = localStorage.getItem('alice_pix_qrcode') || "";

    let displayChave = document.getElementById('displayPixChave');
    let displayQr = document.getElementById('displayPixQr');
    let boxQr = document.getElementById('containerQrCodePublico');

    if (displayChave) displayChave.innerText = chaveSalva;

    if (displayQr && boxQr) {
        if (qrcodeSalvo) {
            displayQr.src = qrcodeSalvo;
            boxQr.style.display = "block";
        } else {
            boxQr.style.display = "none";
        }
    }
}

function copiarChavePix() {
    let chave = localStorage.getItem('alice_pix_chave');
    if (!chave) {
        alert("Nenhuma chave PIX cadastrada.");
        return;
    }
    navigator.clipboard.writeText(chave).then(() => {
        alert("Chave PIX copiada com sucesso! 📋");
    });
}

// --- LOGIN DA ADMINISTRADORA (ALICE) ---
function abrirModalAdmin(event) {
    event.preventDefault();
    let modal = document.getElementById('modalAdmin');
    if (modal) modal.style.display = 'flex';
}

function fecharModalAdmin() {
    let modal = document.getElementById('modalAdmin');
    if (modal) modal.style.display = 'none';
}

function fazerLogin() {
    let usuario = document.getElementById('inputUsuario').value.trim();
    let senha = document.getElementById('inputSenha').value.trim();

    // Login solicitado: usuário alice, senha 561564
    if (usuario === "alice" && senha === "561564") {
        document.getElementById('loginBox').style.display = 'none';
        document.getElementById('painelConteudo').style.display = 'block';
        alert("Bem-vinda ao seu painel, Alice! 👑");
        carregarCartoes();
        carregarVaralFotos();
    } else {
        alert("Usuário ou senha incorretos!");
    }
}

function fazerLogout() {
    document.getElementById('loginBox').style.display = 'block';
    document.getElementById('painelConteudo').style.display = 'none';
    document.getElementById('inputUsuario').value = "";
    document.getElementById('inputSenha').value = "";
    fecharModalAdmin();
}
