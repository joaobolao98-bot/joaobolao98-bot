// --- 15 PRESENTES INICIAIS DA LISTA ---
const presentesPadrao = [
    { id: 1, nome: "Cota Lua de Mel", preco: 150.00, img: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=500&q=80" },
    { id: 2, nome: "Vestido da Festa", preco: 300.00, img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=500&q=80" },
    { id: 3, nome: "Ingresso Parque de Diversões", preco: 120.00, img: "https://images.unsplash.com/photo-1513883637004-3ac22981fddc?auto=format&fit=crop&w=500&q=80" },
    { id: 4, nome: "Patrocínio para o DJ", preco: 200.00, img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=500&q=80" },
    { id: 5, nome: "Make e Penteado", preco: 180.00, img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=500&q=80" },
    { id: 6, nome: "Sapato de Princesa", preco: 160.00, img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=500&q=80" },
    { id: 7, nome: "Sessão de Fotos Externas", preco: 250.00, img: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=500&q=80" },
    { id: 8, nome: "Coquetel sem Álcool", preco: 90.00, img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=500&q=80" },
    { id: 9, nome: "Bolo de Aniversário", preco: 220.00, img: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=500&q=80" },
    { id: 10, nome: "Lembrancinhas dos Convidados", preco: 110.00, img: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=500&q=80" },
    { id: 11, nome: "Acessórios e Tiara", preco: 80.00, img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80" },
    { id: 12, nome: "Kit Skincare Pré-Festa", preco: 70.00, img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80" },
    { id: 13, nome: "Chuva de Prata (Brinde)", preco: 130.00, img: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=500&q=80" },
    { id: 14, nome: "Vale Sorvete com as Amigas", preco: 60.00, img: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=500&q=80" },
    { id: 15, nome: "Abraço Apertado & Presença", preco: 50.00, img: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=500&q=80" }
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
    let adminGridPres = document.getElementById('adminListaPresentes');
    if (!grid) return;
    
    let presentes = JSON.parse(localStorage.getItem('presentesAlice')) || presentesPadrao;

    grid.innerHTML = "";
    presentes.forEach(p => {
        grid.innerHTML += `
            <div class="card-presente">
                <img src="${p.img}" alt="${p.nome}">
                <div class="card-info">
                    <h3>${p.nome}</h3>
                    <p class="preco-presente">R$ ${Number(p.preco).toFixed(2).replace('.', ',')}</p>
                    <button onclick="comprarPresente('${p.nome}', ${p.preco})" class="btn-ouro" style="width:100%;">Contribuir PIX</button>
                </div>
            </div>
        `;
    });

    if (adminGridPres) {
        adminGridPres.innerHTML = "";
        presentes.forEach((p, index) => {
            adminGridPres.innerHTML += `
                <div class="admin-item-linha">
                    <span><strong>${p.nome}</strong> - R$ ${Number(p.preco).toFixed(2)}</span>
                    <button class="btn-excluir-admin" onclick="excluirPresente(${index})">Excluir</button>
                </div>
            `;
        });
    }
}

function adicionarPresenteAdmin() {
    let nome = document.getElementById('novoNomePresente').value.trim();
    let preco = parseFloat(document.getElementById('novoPrecoPresente').value);
    let foto = document.getElementById('novaFotoPresente').value.trim();

    if (!nome || isNaN(preco)) {
        alert("Por favor, preencha o nome e um valor válido.");
        return;
    }

    let imagemPadrao = foto || "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=500&q=80";

    let presentes = JSON.parse(localStorage.getItem('presentesAlice')) || presentesPadrao;
    presentes.push({ id: Date.now(), nome, preco, img: imagemPadrao });
    localStorage.setItem('presentesAlice', JSON.stringify(presentes));

    document.getElementById('novoNomePresente').value = "";
    document.getElementById('novoPrecoPresente').value = "";
    document.getElementById('novaFotoPresente').value = "";

    carregarPresentes();
    alert("Presente adicionado com sucesso! ✨");
}

function excluirPresente(index) {
    if (confirm("Deseja remover este item da lista de presentes?")) {
        let presentes = JSON.parse(localStorage.getItem('presentesAlice')) || presentesPadrao;
        presentes.splice(index, 1);
        localStorage.setItem('presentesAlice', JSON.stringify(presentes));
        carregarPresentes();
    }
}

function comprarPresente(nome, preco) {
    let chavePix = localStorage.getItem('alice_pix_chave') || "Chave PIX não configurada";
    alert(`Obrigado pelo carinho! Para presentear com "${nome}" (R$ ${Number(preco).toFixed(2)}), faça um PIX para a chave:\n\n${chavePix}\n\nAbra o aplicativo do seu banco, cole a chave e confirme o presente para a Alice! 💖`);
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

    lista.innerHTML = "";
    cartoes.forEach((c) => {
        lista.innerHTML += `
            <div class="cartao-item">
                <p class="mensagem-card">"${c.mensagem}"</p>
                <span class="autor-card">— ${c.nome}</span>
            </div>
        `;
    });

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

// --- VARAL DE FOTOS ---
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

    let fotosDuplicadas = [...fotos, ...fotos];

    gridVaral.innerHTML = "";
    fotosDuplicadas.forEach((f, i) => {
        let randomRot = (i % 5) * 0.2;
        gridVaral.innerHTML += `
            <div class="polaroid-item" style="--r: ${randomRot};">
                <img src="${f.foto}" alt="${f.nome}" class="polaroid-img" onclick="ampliarFoto('${f.foto}')">
                <div class="polaroid-legenda">${f.nome}</div>
            </div>
        `;
    });

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

// --- GESTÃO DO PIX COM UPLOAD DE QR CODE ---
function salvarPixAdmin() {
    let chave = document.getElementById('adminPixChaveInput').value.trim();
    let inputFile = document.getElementById('adminPixQrFile');

    if (chave) {
        localStorage.setItem('alice_pix_chave', chave);
    }

    if (inputFile.files && inputFile.files[0]) {
        let reader = new FileReader();
        reader.onload = function(e) {
            let qrCodeUrl = e.target.result;
            localStorage.setItem('alice_pix_qrcode', qrCodeUrl);
            carregarPixPublico();
            alert("Chave PIX e QR Code salvos com sucesso! 💳✨");
        };
        reader.readAsDataURL(inputFile.files[0]);
    } else {
        carregarPixPublico();
        alert("Chave PIX salva com sucesso! 💳");
    }
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

    if (usuario === "alice" && senha === "561564") {
        document.getElementById('loginBox').style.display = 'none';
        document.getElementById('painelConteudo').style.display = 'block';
        alert("Bem-vinda ao seu painel, Alice! 👑");
        carregarPresentes();
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
