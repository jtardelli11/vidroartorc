// === Funções principais ===
let produtosAdicionados = [];
let produtoEmEdicaoIndex = -1;

// Atualiza barra de progresso
function updateProgressBar() {
  const progressBar = document.getElementById("progressBar");
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${scrollPercent}%`;
  });
}
document.addEventListener('DOMContentLoaded', updateProgressBar);

// === Adicionar produto ===
async function adicionarProduto() {
  const nome = document.getElementById("produtoNome").value;
  const largura = document.getElementById("produtoLargura").value;
  const altura = document.getElementById("produtoAltura").value;
  const qtd = document.getElementById("produtoQtd").value;
  const vidro = document.getElementById("produtoVidro").value;
  const area = document.getElementById("produtoArea").value;
  const unitario = document.getElementById("produtoUnitario").value;
  const corHex = document.getElementById("produtoCor").value;
  const corNome = document.getElementById("produtoCorNome").value;
  const fotoFile = document.getElementById("produtoFoto").files[0];

  if (!nome || !largura || !altura || !qtd || !vidro || !unitario) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  let fotoDataURL = "";
  if (fotoFile) {
    fotoDataURL = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(fotoFile);
    });
  }

  const total = parseFloat(unitario) * parseFloat(qtd);
  produtosAdicionados.push({
    nome, largura, altura, quantidade: qtd,
    vidro, area, valorUnitario: unitario, valorTotal: total,
    foto: fotoDataURL, corHex, corNome
  });

  renderizarProdutosAdicionados();
  limparCamposProduto();
}

// === Renderizar produtos ===
function renderizarProdutosAdicionados() {
  const lista = document.getElementById("listaProdutos");
  lista.innerHTML = produtosAdicionados.length
    ? ""
    : '<p id="noProductsMessage">Nenhum produto adicionado ainda.</p>';

  produtosAdicionados.forEach((p, i) => {
    lista.innerHTML += `
      <div class="product-item">
        ${p.foto ? `<img src="${p.foto}" alt="${p.nome}">` : ""}
        <div>
          <p class="font-semibold">${p.nome} (${p.largura}x${p.altura}mm)</p>
          <p class="text-sm">
            Qtd: ${p.quantidade} | Vidro: ${p.vidro}
            ${p.corNome ? ` | Cor: <span class="color-box" style="background-color:${p.corHex}"></span>${p.corNome}` : ""}
          </p>
          <p class="text-md font-bold">
            Valor Unitário: R$ ${parseFloat(p.valorUnitario).toFixed(2)} |
            Total: R$ ${parseFloat(p.valorTotal).toFixed(2)}
          </p>
        </div>
        <div class="action-buttons">
          <button onclick="editarProduto(${i})" class="edit-btn"><i class="fas fa-edit"></i></button>
          <button onclick="removerProduto(${i})" class="delete-btn"><i class="fas fa-trash-alt"></i></button>
        </div>
      </div>`;
  });
}

function limparCamposProduto() {
  ["produtoNome","produtoLargura","produtoAltura","produtoVidro","produtoArea","produtoUnitario","produtoCorNome"]
    .forEach(id => document.getElementById(id).value = "");
  document.getElementById("produtoQtd").value = "1";
  document.getElementById("produtoCor").value = "#ffffff";
  document.getElementById("produtoFoto").value = "";
}

// === Modal de histórico ===
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modalHistorico");
  const btn = document.getElementById("btnHistorico");
  const fechar = document.getElementById("fecharHistorico");
  const limpar = document.getElementById("limparHistorico");
  const lista = document.getElementById("listaHistorico");

  btn.addEventListener("click", () => {
    const historico = JSON.parse(localStorage.getItem("historicoPDFs")) || [];
    lista.innerHTML = historico.length
      ? historico.map((h, i) => `
        <li class="flex justify-between border-b py-2 text-sm">
          <span>${h.cliente} - ${h.nome}</span>
          <button onclick="removerOrcamento(${i})" class="text-red-600">Excluir</button>
        </li>`).join("")
      : "<li>Nenhum orçamento salvo.</li>";
    modal.classList.remove("hidden");
  });

  fechar.addEventListener("click", () => modal.classList.add("hidden"));
  limpar.addEventListener("click", () => {
    if (confirm("Apagar todo o histórico?")) {
      localStorage.removeItem("historicoPDFs");
      lista.innerHTML = "<li>Histórico limpo.</li>";
    }
  });
});
