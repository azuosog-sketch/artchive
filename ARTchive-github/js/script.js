// =========================================================
// ARTchive: comportamentos da página
// =========================================================

// ----- 1. Menu do celular -----
// "querySelector" procura um elemento na página pelo nome da classe
const menuBotao = document.querySelector(".menu-botao");
const menu = document.querySelector(".menu");

function fecharMenu() {
  menu.classList.remove("aberto");
  menuBotao.setAttribute("aria-expanded", "false");
  menuBotao.setAttribute("aria-label", "Abrir menu");
}

// Quando clicar no botão ☰, abre ou fecha o menu
menuBotao.addEventListener("click", function () {
  const estaAberto = menu.classList.toggle("aberto");
  menuBotao.setAttribute("aria-expanded", estaAberto);
  menuBotao.setAttribute("aria-label", estaAberto ? "Fechar menu" : "Abrir menu");
});

// Quando clicar em um link do menu, fecha o menu
menu.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", fecharMenu);
});

// ----- 2. Filtros da galeria -----
const filtros = document.querySelectorAll(".filtro");
const trabalhos = document.querySelectorAll(".trabalho");

filtros.forEach(function (botao) {
  botao.addEventListener("click", function () {
    const escolhido = botao.dataset.filtro; // lê o "data-filtro" do botão

    // Marca só o botão clicado como ativo
    filtros.forEach(function (b) {
      b.setAttribute("aria-pressed", b === botao ? "true" : "false");
    });

    // Mostra os trabalhos da categoria escolhida e esconde os outros
    trabalhos.forEach(function (trabalho) {
      const mostrar = escolhido === "todos" || trabalho.dataset.categoria === escolhido;
      trabalho.hidden = !mostrar;
    });
  });
});

// ----- 3. Ampliar imagens -----
const janela = document.querySelector(".ampliar");
const imagemGrande = document.querySelector(".ampliar-imagem");
const legenda = document.querySelector(".ampliar-legenda");
const linkOriginal = document.querySelector(".ampliar-link");
const botaoFechar = document.querySelector(".ampliar-fechar");
let ultimoBotao = null; // lembra qual obra foi aberta, para voltar a ela depois

// Partes da página que ficam "atrás" da janela ampliada
const fundoDaPagina = document.querySelectorAll("header, main, footer");

// "inert" deixa uma parte da página inativa: não recebe foco nem cliques.
// Assim, enquanto a imagem está aberta, o Tab não "foge" para o fundo.
function deixarFundoInativo(inativo) {
  fundoDaPagina.forEach(function (parte) {
    parte.inert = inativo;
  });
}

function abrirImagem(botao) {
  const imagem = botao.querySelector("img");
  const titulo = botao.closest(".trabalho").querySelector("h3");
  // Usa a versão grande (data-grande), se existir; senão, a própria imagem
  const endereco = imagem.dataset.grande || imagem.src;

  imagemGrande.src = endereco;
  imagemGrande.alt = imagem.alt;
  legenda.textContent = titulo ? titulo.textContent : "";
  linkOriginal.href = endereco;

  ultimoBotao = botao;
  janela.hidden = false;
  deixarFundoInativo(true);
  document.body.style.overflow = "hidden"; // impede a página de rolar por trás
  botaoFechar.focus();
}

function fecharJanela() {
  janela.hidden = true;
  deixarFundoInativo(false);
  imagemGrande.removeAttribute("src");
  document.body.style.overflow = "";
  if (ultimoBotao) ultimoBotao.focus(); // devolve o foco para a obra
}

// Mantém o Tab "em círculo" dentro da janela:
// do último item volta para o primeiro (e o contrário com Shift+Tab).
janela.addEventListener("keydown", function (evento) {
  if (evento.key !== "Tab") return;
  const primeiro = botaoFechar;
  const ultimo = linkOriginal;

  if (evento.shiftKey && document.activeElement === primeiro) {
    evento.preventDefault();
    ultimo.focus();
  } else if (!evento.shiftKey && document.activeElement === ultimo) {
    evento.preventDefault();
    primeiro.focus();
  }
});

document.querySelectorAll(".trabalho .moldura").forEach(function (botao) {
  botao.addEventListener("click", function () {
    abrirImagem(botao);
  });
});

botaoFechar.addEventListener("click", fecharJanela);

// Clicar no fundo escuro (fora da imagem) também fecha
janela.addEventListener("click", function (evento) {
  if (evento.target === janela) {
    fecharJanela();
  }
});

// A tecla Esc fecha a imagem ampliada ou o menu
document.addEventListener("keydown", function (evento) {
  if (evento.key !== "Escape") return;
  if (!janela.hidden) {
    fecharJanela();
  } else if (menu.classList.contains("aberto")) {
    fecharMenu();
    menuBotao.focus();
  }
});

// ----- 4. Ano automático no rodapé -----
document.getElementById("ano").textContent = new Date().getFullYear();
