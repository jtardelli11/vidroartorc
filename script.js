// === 🟢 BARRA DE PROGRESSO DE ROLAGEM ===
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  document.getElementById("progressBar").style.width = scrollPercent + "%";
});

// === 🟩 FUNÇÃO PARA MOSTRAR ABAS ===
function mostrarAba(id) {
  // Esconde todas as abas
  document.querySelectorAll(".aba").forEach(aba => aba.classList.add("hidden"));

  // Remove estado ativo dos botões
  document.querySelectorAll(".linha-btn").forEach(btn => btn.classList.remove("ativa"));

  // Mostra a aba correspondente
  const abaSelecionada = document.getElementById("aba-" + id);
  if (abaSelecionada) abaSelecionada.classList.remove("hidden");

  // Marca o botão ativo
  const botaoAtivo = Array.from(document.querySelectorAll(".linha-btn"))
    .find(btn => btn.textContent.toLowerCase().includes(id.replace(/[0-9]/g, "").trim()));
  if (botaoAtivo) botaoAtivo.classList.add("ativa");
}

// === 🧾 VARIÁVEIS GLOBAIS ===
let produtos = [];
let editandoIndex = -1;

// === 🟢 ADICIONAR PRODUTO ===
function adicionarProduto() {
  const nome = document.getElementById("produtoNome").value.trim();
  const largura = parseFloat(document.getElementById("produtoLargura").value);
  const altura = parseFloat(document.getElementById("produtoAltura").value);
  const qtd = parseInt(document.getElementById("produtoQtd").value);
  const vidro = document.getElementById("produtoVidro").value.trim();
  const area = parseFloat(document.getElementById("produtoArea").value);
  const valor = parseFloat(document.getElementById("produtoUnitario").value);
  const cor = document.getElementById("produtoCor").value;
  const corNome = document.getElementById("produtoCorNome").value.trim();
  const fotoInput = document.getElementById("produtoFoto");

  if (!nome || isNaN(valor) || isNaN(qtd)) {
    alert("Preencha pelo menos o nome, quantidade e valor unitário!");
    return;
  }

  let imagemURL = "";
  if (fotoInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagemURL = e.target.result;
      salvarProduto({ nome, largura, altura, qtd, vidro, area, valor, cor, corNome, imagemURL });
    };
    reader.readAsDataURL(fotoInput.files[0]);
  } else {
    salvarProduto({ nome, largura, altura, qtd, vidro, area, valor, cor, corNome, imagemURL });
  }
}

function salvarProduto(produto) {
  produtos.push(produto);
  atualizarListaProdutos();
  limparCampos();
  salvarHistorico();
}

// === 🟡 LISTAR PRODUTOS ===
function atualizarListaProdutos() {
  const lista = document.getElementById("listaProdutos");
  lista.innerHTML = "";

  if (produtos.length === 0) {
    lista.innerHTML = `<p class="text-gray-500">Nenhum produto adicionado ainda.</p>`;
    return;
  }

  produtos.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "product-item";

    div.innerHTML = `
      ${p.imagemURL ? `<img src="${p.imagemURL}" alt="${p.nome}">` : ""}
      <div>
        <p class="font-semibold">${p.nome}</p>
        <p class="text-sm">Qtd: ${p.qtd} | Valor: R$ ${(p.valor * p.qtd).toFixed(2)}</p>
        ${p.corNome ? `<span class="color-box" style="background-color:${p.cor}"></span>${p.corNome}` : ""}
      </div>
      <div class="action-buttons">
        <button class="edit-btn" onclick="editarProduto(${i})"><i class="fas fa-edit"></i></button>
        <button class="delete-btn" onclick="removerProduto(${i})"><i class="fas fa-trash"></i></button>
      </div>
    `;
    lista.appendChild(div);
  });
}

// === 🔵 EDITAR PRODUTO ===
function editarProduto(index) {
  const p = produtos[index];
  document.getElementById("produtoNome").value = p.nome;
  document.getElementById("produtoLargura").value = p.largura;
  document.getElementById("produtoAltura").value = p.altura;
  document.getElementById("produtoQtd").value = p.qtd;
  document.getElementById("produtoVidro").value = p.vidro;
  document.getElementById("produtoArea").value = p.area;
  document.getElementById("produtoUnitario").value = p.valor;
  document.getElementById("produtoCor").value = p.cor;
  document.getElementById("produtoCorNome").value = p.corNome;

  document.getElementById("adicionarProdutoBtn").classList.add("hidden");
  document.getElementById("salvarEdicaoBtn").classList.remove("hidden");
  editandoIndex = index;
}

function salvarEdicaoProduto() {
  if (editandoIndex === -1) return;
  const p = produtos[editandoIndex];

  p.nome = document.getElementById("produtoNome").value;
  p.largura = parseFloat(document.getElementById("produtoLargura").value);
  p.altura = parseFloat(document.getElementById("produtoAltura").value);
  p.qtd = parseInt(document.getElementById("produtoQtd").value);
  p.vidro = document.getElementById("produtoVidro").value;
  p.area = parseFloat(document.getElementById("produtoArea").value);
  p.valor = parseFloat(document.getElementById("produtoUnitario").value);
  p.cor = document.getElementById("produtoCor").value;
  p.corNome = document.getElementById("produtoCorNome").value;

  atualizarListaProdutos();
  limparCampos();
  document.getElementById("salvarEdicaoBtn").classList.add("hidden");
  document.getElementById("adicionarProdutoBtn").classList.remove("hidden");
  editandoIndex = -1;
  salvarHistorico();
}

// === 🔴 REMOVER PRODUTO ===
function removerProduto(index) {
  produtos.splice(index, 1);
  atualizarListaProdutos();
  salvarHistorico();
}

// === 🧼 LIMPAR CAMPOS ===
function limparCampos() {
  document.querySelectorAll("#orcamento input").forEach(i => {
    if (i.type !== "checkbox") i.value = "";
  });
}

// === 💾 SALVAR HISTÓRICO ===
function salvarHistorico() {
  localStorage.setItem("historicoOrcamentos", JSON.stringify(produtos));
}

// === 📜 CARREGAR HISTÓRICO ===
function carregarHistorico() {
  const historico = JSON.parse(localStorage.getItem("historicoOrcamentos")) || [];
  produtos = historico;
  atualizarListaProdutos();
}

// === 🧩 MODAL HISTÓRICO ===
const modal = document.getElementById("modalHistorico");
document.getElementById("btnHistorico").addEventListener("click", () => {
  modal.classList.remove("hidden");
  exibirHistorico();
});
document.getElementById("fecharHistorico").addEventListener("click", () => {
  modal.classList.add("hidden");
});
document.getElementById("limparHistorico").addEventListener("click", () => {
  localStorage.removeItem("historicoOrcamentos");
  produtos = [];
  atualizarListaProdutos();
  exibirHistorico();
});

function exibirHistorico() {
  const listaHistorico = document.getElementById("listaHistorico");
  const historico = JSON.parse(localStorage.getItem("historicoOrcamentos")) || [];
  listaHistorico.innerHTML = "";

  if (historico.length === 0) {
    listaHistorico.innerHTML = "<li>Nenhum orçamento salvo.</li>";
    return;
  }

  historico.forEach((p, i) => {
    const li = document.createElement("li");
    li.className = "mb-2 border-b pb-2";
    li.innerHTML = `
      <strong>${p.nome}</strong> — ${p.qtd}x (R$ ${(p.valor * p.qtd).toFixed(2)})
    `;
    listaHistorico.appendChild(li);
  });
}

// === 🟢 GERAR PDF ===
function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.text("Orçamento VIDROART", 105, 15, { align: "center" });

  doc.setFont("helvetica", "normal");
  let y = 30;
  produtos.forEach((p, i) => {
    doc.text(`${i + 1}. ${p.nome} - ${p.qtd}x - R$ ${(p.valor * p.qtd).toFixed(2)}`, 10, y);
    y += 10;
  });

  doc.save("Orcamento_VidroArt.pdf");
}

// === 🚀 CARREGAR HISTÓRICO AO INICIAR ===
window.onload = carregarHistorico;

