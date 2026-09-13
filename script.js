// ================================================
// INICIALIZAÇÃO E CARREGAMENTO
// ================================================
document.addEventListener('DOMContentLoaded', () => {
    carregarPresentes();
    carregarCartoes();
    carregarVaral();
    carregarPix();
});

// ================================================
// 1. GERENCIAMENTO DE PRESENTES
// ================================================
async function carregarPresentes() {
    const grid = document.getElementById('gridPresentes');
    const adminLista = document.getElementById('adminListaPresentes');
    if (!grid) return;

    const { data: presentes, error } = await _supabase.from('presentes').select('*');

    if (error) {
        console.error('Erro ao carregar presentes:', error);
        return;
    }

    grid.innerHTML = '';
    if (adminLista) adminLista.innerHTML = '';

    presentes.forEach(p => {
        // Exibição pública
        grid.innerHTML += `
            <div class="card-presente">
                <img src="${p.img || 'https://via.placeholder.com/150'}" alt="${p.nome}">
                <h3>${p.nome}</h3>
                <p class="preco">R$ ${parseFloat(p.preco).toFixed(2)}</p>
                <button class="btn-ouro" onclick="presentear('${p.nome}', ${p.preco})">Presentear 🎁</button>
            </div>
        `;

        // Exibição no Painel da Alice
        if (adminLista) {
            adminLista.innerHTML += `
                <div class="item-admin">
                    <span>${p.nome} - R$ ${parseFloat(p.preco).toFixed(2)}</span>
                    <button onclick="deletarPresente(${p.id})" class="btn-excluir">Deletar</button>
                </div>
            `;
        }
    });
}

async function adicionarPresenteAdmin() {
    const nome = document.getElementById('novoNomePresente').value;
    const preco = document.getElementById('novoPrecoPresente').value;
    const fileInput = document.getElementById('novoFotoPresenteFile');

    if (!nome || !preco) return alert('Preencha nome e valor!');

    let imgUrl = '';
    if (fileInput.files.length > 0) {
        imgUrl = await converterParaBase64(fileInput.files[0]);
    }

    const { error } = await _supabase.from('presentes').insert([{ nome, preco: parseFloat(preco), img: imgUrl }]);

    if (error) alert('Erro ao salvar presente!');
    else {
        alert('Presente adicionado!');
        document.getElementById('novoNomePresente').value = '';
        document.getElementById('novoPrecoPresente').value = '';
        document.getElementById('novoFotoPresenteFile').value = '';
        carregarPresentes();
    }
}

async function deletarPresente(id) {
    const { error } = await _supabase.from('presentes').delete().eq('id', id);
    if (!error) carregarPresentes();
}

function presentear(nome, valor) {
    alert(`Obrigado pelo carinho! Você escolheu: ${nome} (R$ ${valor}). Utilize a chave PIX abaixo para concluir a contribuição!`);
    window.location.href = "#pix";
}

// ================================================
// 2. MURAL DE RECADOS
// ================================================
async function carregarCartoes() {
    const lista = document.getElementById('listaCartoes');
    const adminLista = document.getElementById('adminListaCartoes');
    if (!lista) return;

    const { data: cartoes, error } = await _supabase.from('cartoes').select('*').order('id', { ascending: false });

    if (error) return console.error('Erro ao carregar recados:', error);

    lista.innerHTML = '';
    if (adminLista) adminLista.innerHTML = '';

    cartoes.forEach(c => {
        lista.innerHTML += `
            <div class="cartao-recado">
                <h4>${escapeHtml(c.nome)}</h4>
                <p>"${escapeHtml(c.mensagem)}"</p>
            </div>
        `;

        if (adminLista) {
            adminLista.innerHTML += `
                <div class="item-admin">
                    <span><b>${escapeHtml(c.nome)}:</b> ${escapeHtml(c.mensagem)}</span>
                    <button onclick="deletarCartao(${c.id})" class="btn-excluir">Excluir</button>
                </div>
            `;
        }
    });
}

async function enviarCartao(event) {
    event.preventDefault();
    const nome = document.getElementById('nomeCartao').value;
    const mensagem = document.getElementById('mensagemCartao').value;

    const { error } = await _supabase.from('cartoes').insert([{ nome, mensagem }]);

    if (error) {
        alert('Erro ao enviar recado. Tente novamente!');
    } else {
        alert('Recado enviado com sucesso! 💖');
        document.getElementById('formCartao').reset();
        carregarCartoes();
    }
}

async function deletarCartao(id) {
    const { error } = await _supabase.from('cartoes').delete().eq('id', id);
    if (!error) carregarCartoes();
}

// ================================================
// 3. VARAL DE MEMÓRIAS
// ================================================
async function carregarVaral() {
    const grid = document.getElementById('gridVaral');
    const adminLista = document.getElementById('adminListaFotos');
    if (!grid) return;

    const { data: fotos, error } = await _supabase.from('varal_fotos').select('*').order('id', { ascending: false });

    if (error) return console.error('Erro ao carregar fotos:', error);

    grid.innerHTML = '';
    if (adminLista) adminLista.innerHTML = '';

    fotos.forEach(f => {
        grid.innerHTML += `
            <div class="item-varal" onclick="ampliarFoto('${f.foto}')">
                <img src="${f.foto}" alt="${escapeHtml(f.nome)}">
                <p>${escapeHtml(f.nome)}</p>
            </div>
        `;

        if (adminLista) {
            adminLista.innerHTML += `
                <div class="item-admin">
                    <span>${escapeHtml(f.nome)}</span>
                    <button onclick="deletarFotoVaral(${f.id})" class="btn-excluir">Excluir</button>
                </div>
            `;
        }
    });
}

async function enviarFotoVaral() {
    const nome = document.getElementById('nomeFotografo').value || 'Convidado Especial';
    const inputFoto = document.getElementById('inputFotoVaral');

    if (!inputFoto.files.length) return alert('Selecione uma foto primeiro!');

    const fotoBase64 = await converterParaBase64(inputFoto.files[0]);

    const { error } = await _supabase.from('varal_fotos').insert([{ nome, foto: fotoBase64 }]);

    if (error) {
        alert('Erro ao enviar foto!');
    } else {
        alert('Foto pendurada no varal! 📸');
        document.getElementById('nomeFotografo').value = '';
        inputFoto.value = '';
        carregarVaral();
    }
}

async function deletarFotoVaral(id) {
    const { error } = await _supabase.from('varal_fotos').delete().eq('id', id);
    if (!error) carregarVaral();
}

// ================================================
// 4. CONFIGURAÇÃO PIX
// ================================================
async function carregarPix() {
    const { data, error } = await _supabase.from('config_pix').select('*').limit(1);

    if (error || !data || data.length === 0) return;

    const pixData = data[0];
    const displayChave = document.getElementById('displayPixChave');
    const containerQr = document.getElementById('containerQrCodePublico');
    const displayQr = document.getElementById('displayPixQr');

    if (pixData.chave) {
        displayChave.innerText = pixData.chave;
    }

    if (pixData.qr_code) {
        displayQr.src = pixData.qr_code;
        containerQr.style.display = 'block';
    }
}

async function salvarPixAdmin() {
    const chave = document.getElementById('adminPixChaveInput').value;
    const fileInput = document.getElementById('adminPixQrFile');

    let qrCodeBase64 = '';
    if (fileInput.files.length > 0) {
        qrCodeBase64 = await converterParaBase64(fileInput.files[0]);
    }

    // Limpa a config antiga para manter apenas 1
    await _supabase.from('config_pix').delete().neq('id', 0);

    const { error } = await _supabase.from('config_pix').insert([{ chave, qr_code: qrCodeBase64 }]);

    if (error) {
        alert('Erro ao salvar dados do PIX!');
    } else {
        alert('Dados do PIX salvos com sucesso!');
        carregarPix();
    }
}

function copiarChavePix() {
    const chave = document.getElementById('displayPixChave').innerText;
    if (chave.includes("Nenhuma chave")) return alert("Chave ainda não cadastrada!");
    
    navigator.clipboard.writeText(chave);
    alert('Chave PIX copiada para a área de transferência! 📋');
}

// ================================================
// 5. PAINEL E MODAIS
// ================================================
function abrirModalAdmin(e) {
    e.preventDefault();
    document.getElementById('modalAdmin').style.display = 'flex';
}

function fecharModalAdmin() {
    document.getElementById('modalAdmin').style.display = 'none';
}

function fazerLogin() {
    const user = document.getElementById('inputUsuario').value;
    const pass = document.getElementById('inputSenha').value;

    if (user === 'alice' && pass === '15anos') { // Defina a senha desejada aqui
        document.getElementById('loginBox').style.display = 'none';
        document.getElementById('painelConteudo').style.display = 'block';
    } else {
        alert('Usuário ou senha incorretos!');
    }
}

function fazerLogout() {
    document.getElementById('painelConteudo').style.display = 'none';
    document.getElementById('loginBox').style.display = 'block';
    fecharModalAdmin();
}

function ampliarFoto(src) {
    document.getElementById('imgZoomAmpliada').src = src;
    document.getElementById('modalZoom').style.display = 'flex';
}

function fecharZoom() {
    document.getElementById('modalZoom').style.display = 'none';
}

// ================================================
// FUNÇÕES AUXILIARES
// ================================================
function converterParaBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function escapeHtml(texto) {
    if (!texto) return '';
    return texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
