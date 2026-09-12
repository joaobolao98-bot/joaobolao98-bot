// Lista exata de presentes
let listaPresentes = [
    { nome: "Leitor de livro digital", valor: "194,17", img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80" },
    { nome: "Ingresso para festival de música com as amigas", valor: "624,22", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=500&q=80" },
    { nome: "Notebook para focar nos estudos", valor: "260,09", img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80" },
    { nome: "Celular novo", valor: "260,09", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80" },
    { nome: "Seção de fotos", valor: "208,07", img: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=500&q=80" },
    { nome: "Bicicleta para passear por aí", valor: "208,07", img: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=500&q=80" },
    { nome: "Kit de cuidados para o cabelo", valor: "208,07", img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=500&q=80" },
    { nome: "Vale presente", valor: "156,06", img: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=500&q=80" },
    { nome: "Um dia de beleza", valor: "156,06", img: "https://images.unsplash.com/photo-1560750588-73607bbf5f07?auto=format&fit=crop&w=500&q=80" },
    { nome: "Acessórios para completar o look", valor: "156,06", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=500&q=80" },
    { nome: "Vale para renovar o guarda roupa", valor: "156,06", img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=500&q=80" },
    { nome: "Ida ao parque de diversões", valor: "156,05", img: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=500&q=80" },
    { nome: "Patrocínio para fazer um lanche", valor: "156,05", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80" },
    { nome: "Ingresso para rodeio", valor: "156,05", img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=500&q=80" },
    { nome: "Um ano de Spotify", valor: "145,65", img: "https://images.unsplash.com/photo-1614680376593-902f749f7ffc?auto=format&fit=crop&w=500&q=80" },
    { nome: "Sessão de cinema completa", valor: "104,04", img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80" }
];

function renderizarPresentes() {
    const grid = document.getElementById('gridPresentes');
    if (!grid) return;
    grid.innerHTML = "";

    let salvos = JSON.parse(localStorage.getItem('meusPresentesAlice')) || [];
    let todos = [...listaPresentes, ...salvos];

    todos.forEach((p) => {
        const nomeSeguro = String(p.nome).replace(/'/g, "\\'");
        const valorSeguro = String(p.valor).replace(/'/g, "\\'");

        grid.innerHTML += `
            <div class="card">
                <img src="${p.img}" alt="${p.nome}" class="img-presente">
                <h3>${p.nome}</h3>
                <p class="valor">R$ ${p.valor}</p>
                <button class="btn-comprar" onclick="abrirModalPresente('${nomeSeguro}', '${valorSeguro}')">COMPRAR</button>
            </div>
        `;
    });
}

function abrirModalPresente(nome, valor) {
    document.getElementById('tituloModalPresente').innerText = nome;
    document.getElementById('textoModalPresente').innerText = `Você selecionou o presente "${nome}" no valor de R$ ${valor}.`;
    document.getElementById('modalPresente').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modalPresente').style.display = 'none';
}

function irParaPix() {
    fecharModal();
    const secaoPix = document.getElementById('pix-section');
    if (secaoPix) {
        secaoPix.scrollIntoView({ behavior: 'smooth' });
    }
}

// Login Admin
function abrirLogin() { document.getElementById('modalLogin').style.display = 'flex'; }
function fecharLogin() { document.getElementById('modalLogin').style.display = 'none'; }
function fazerLogin() {
    let user = document.getElementById('loginUsuario').value;
    let pass = document.getElementById('loginSenha').value;

    if (user === "alc15anos" && pass === "561564") {
        fecharLogin();
        document.getElementById('painelAdmin').style.display = 'flex';
        let chaveSalva = localStorage.getItem('chavePixAlice');
        if (chaveSalva) {
            document.getElementById('adminNovaChavePix').value = chaveSalva;
        }
        alert("Login efetuado com sucesso! Bem-vinda, Alice 👑");
    } else {
        alert("Usuário ou senha incorretos!");
    }
}
function fecharPainelAdmin() { document.getElementById('painelAdmin').style.display = 'none'; }
function fazerLogout() { fecharPainelAdmin(); alert("Você saiu do painel."); }

function salvarConfigPix() {
    let novaChave = document.getElementById('adminNovaChavePix').value.trim();
    let inputQrCode = document.getElementById('adminNovoQrCode');

    if (novaChave) {
        localStorage.setItem('chavePixAlice', novaChave);
        document.getElementById('chavePix').value = novaChave;
    }

    if (inputQrCode.files && inputQrCode.files[0]) {
        let reader = new FileReader();
        reader.onload = function(e) {
            localStorage.setItem('qrCodeAlice', e.target.result);
            document.getElementById('imagemQrCodeExibicao').src = e.target.result;
            alert("Dados do PIX atualizados com sucesso!");
            fecharPainelAdmin();
        }
        reader.readAsDataURL(inputQrCode.files[0]);
    } else {
        alert("Chave PIX atualizada com sucesso!");
        fecharPainelAdmin();
    }
}

function carregarConfigPixSalvo() {
    let chaveSalva = localStorage.getItem('chavePixAlice');
    if (chaveSalva) {
        document.getElementById('chavePix').value = chaveSalva;
    }
    let qrSalvo = localStorage.getItem('qrCodeAlice');
    if (qrSalvo) {
        document.getElementById('imagemQrCodeExibicao').src = qrSalvo;
    }
}

function adicionarNovoPresente() {
    let nome = document.getElementById('novoNomePresente').value.trim();
    let valor = document.getElementById('novoValorPresente').value.trim();
    let inputFoto = document.getElementById('novaFotoPresente');

    if (!nome || !valor) { alert("Preencha o nome e o valor!"); return; }

    if (inputFoto.files && inputFoto.files[0]) {
        let reader = new FileReader();
        reader.onload = function(e) {
            salvarNovoPresenteNaLista(nome, valor, e.target.result);
        }
        reader.readAsDataURL(inputFoto.files[0]);
    } else {
        salvarNovoPresenteNaLista(nome, valor, "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=500&q=80");
    }
}

function salvarNovoPresenteNaLista(nome, valor, img) {
    let salvos = JSON.parse(localStorage.getItem('meusPresentesAlice')) || [];
    salvos.push({ nome, valor, img });
    localStorage.setItem('meusPresentesAlice', JSON.stringify(salvos));
    alert("Presente cadastrado!");
    document.getElementById('novoNomePresente').value = "";
    document.getElementById('novoValorPresente').value = "";
    document.getElementById('novaFotoPresente').value = "";
    fecharPainelAdmin();
    renderizarPresentes();
}

function enviarCartao() {
    let nome = document.getElementById('nomeRemetente').value.trim();
    let mensagem = document.getElementById('textoMensagem').value.trim();
    if (!nome || !mensagem) { alert("Preencha seu nome e a mensagem!"); return; }

    let cartoes = JSON.parse(localStorage.getItem('cartoesAlice')) || [];
    cartoes.unshift({ nome, mensagem });
    localStorage.setItem('cartoesAlice', JSON.stringify(cartoes));
    document.getElementById('nomeRemetente').value = "";
    document.getElementById('textoMensagem').value = "";
    carregarCartoes();
    alert("Cartão enviado com sucesso! 💖");
}

function carregarCartoes() {
    let lista = document.getElementById('listaCartoes');
    if (!lista) return;
    let cartoes = JSON.parse(localStorage.getItem('cartoesAlice')) || [
        { nome: "Dinda", mensagem: "Alice, que sua festa de 15 anos seja mágica e inesquecível!" }
    ];
    lista.innerHTML = "";
    cartoes.forEach(c => {
        lista.innerHTML += `
            <div class="cartao-item">
                <p class="mensagem-card">"${c.mensagem}"</p>
                <span class="autor-card">— ${c.nome}</span>
            </div>
        `;
    });
}

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

    gridVaral.innerHTML = "";
    fotos.forEach(f => {
        gridVaral.innerHTML += `
            <div class="polaroid-item">
                <img src="${f.foto}" alt="Foto de ${f.nome}" class="polaroid-img">
                <div class="polaroid-legenda">${f.nome}</div>
            </div>
        `;
    });
}

function copiarChave() {
    let inputPix = document.getElementById('chavePix');
    let msg = document.getElementById('msgCopiado');
    if (!inputPix || !msg) return;

    navigator.clipboard.writeText(inputPix.value).then(() => {
        msg.style.display = 'block';
        setTimeout(() => msg.style.display = 'none', 3000);
    }).catch(() => {
        inputPix.select();
        document.execCommand('copy');
        msg.style.display = 'block';
        setTimeout(() => msg.style.display = 'none', 3000);
    });
}

window.onload = function() {
    renderizarPresentes();
    carregarCartoes();
    carregarVaralFotos();
    carregarConfigPixSalvo();
};
