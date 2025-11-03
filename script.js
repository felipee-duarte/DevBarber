document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("checkbox");
  const menuOverlay = document.querySelector(".menu-overlay");
  const menuItems = document.querySelectorAll(".menu-item");

  // Abrir/fechar menu ao clicar no hambúrguer
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      menuOverlay.style.opacity = "1";
      menuOverlay.style.visibility = "visible";
      document.body.style.overflow = "hidden"; // trava scroll
    } else {
      menuOverlay.style.opacity = "0";
      menuOverlay.style.visibility = "hidden";
      document.body.style.overflow = ""; // libera scroll
    }
  });

  // Fecha o menu quando clicar em algum link
  menuItems.forEach(item => {
    item.addEventListener("click", () => {
      checkbox.checked = false;
      menuOverlay.style.opacity = "0";
      menuOverlay.style.visibility = "hidden";
      document.body.style.overflow = "";
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const button = document.getElementById('whatsappButton');
  if (!button) return;

  const threshold = 200; // px de rolagem antes de aparecer (ajuste se quiser)

  // função que verifica scroll e alterna a classe
  function checkScroll() {
    if (window.scrollY > threshold) {
      if (!button.classList.contains('show')) button.classList.add('show');
    } else {
      if (button.classList.contains('show')) button.classList.remove('show');
    }
  }

  // checa imediatamente (útil se o usuário abriu a página já rolada)
  checkScroll();

  // ouvinte de scroll (passive para performance)
  window.addEventListener('scroll', checkScroll, { passive: true });
});

function trocarImg() {
  const imagem = document.getElementById('faixada');
  const larguraTela = window.innerWidth;

  if (larguraTela < 768) {
    imagem.src = 'imagens/Sobre-P.png'; // celular
  } else if (larguraTela < 1200) {
    imagem.src = 'imagens/Sobre-M.png'; // tablet
  } else {
    imagem.src = 'imagens/Sobre-G.png'; // desktop
  }
}

  function trocarImagem() {
    const imagem = document.getElementById('minhaImagem');
    const larguraTela = window.innerWidth;

    if (larguraTela < 768) {
      imagem.src = 'imagens/Servico-P.png'; // celular
    } else if (larguraTela < 1200) {
      imagem.src = 'imagens/Servico-M.png'; // tablet
    } else {
      imagem.src = 'imagens/Servico-G.png'; // desktop
    }
  }

const slidesContainer = document.querySelector('.slides');
const slides = document.querySelectorAll('.slides img');
const slideWidth = slides[0].clientWidth; // Pega a largura de um slide
let index = 0; // Índice do slide atual
const tempoTroca = 5000; // Tempo em milissegundos (3 segundos)

function mostrarSlide() {
  // Calcula o quanto o contêiner de slides deve se mover (em pixels)
  // O movimento é a largura de um slide * o índice atual
  const offset = -index * slideWidth;
  slidesContainer.style.transform = `translateX(${offset}px)`;
}

// 🔁 Função de Carrossel Automático
function proximoSlideAutomatico() {
  index = (index + 1) % slides.length; // Avança para o próximo, voltando ao 0 se chegar ao final
  mostrarSlide();
}

// Inicia a troca automática
setInterval(proximoSlideAutomatico, tempoTroca);

  // Troca quando carregar e quando redimensionar
  window.addEventListener('load', trocarImagem);
  window.addEventListener('resize', trocarImagem);

document.getElementById("bookingForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const service = document.getElementById("service").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  const data = { name, phone, service, date, time };

  try {
    const response = await fetch("https://devbarber.onrender.com/agendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    alert(result.message);
  } catch (error) {
    alert("Erro ao enviar agendamento");
    console.error(error);
  }
});

document.getElementById("submitBtn").addEventListener("click", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const service = document.getElementById("service").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  const data = { name, phone, service, date, time };

  try {
    const response = await fetch("https://devbarber.onrender.com/agendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    alert(result.message);
  } catch (error) {
    alert("Erro ao enviar agendamento");
    console.error(error);
  }

  // Cria a mensagem automática do WhatsApp
  const msg = `Olá! Meu nome é ${name}, marquei um ${service} no dia ${date} às ${time}.`;
  const numeroBarbeiro = "5519996462753";
  const url = `https://wa.me/${numeroBarbeiro}?text=${encodeURIComponent(msg)}`;

  // Redireciona o cliente para o WhatsApp
  window.location.href = url;

});

function showLoading() {
  document.getElementById("loadingScreen").style.display = "flex";
}

function hideLoading() {
  document.getElementById("loadingScreen").style.display = "none";
}

document.addEventListener('DOMContentLoaded', (event) => {
  const loadingScreen = document.getElementById('loadingScreen');

  // Esconde a tela de carregamento após a página estar pronta
  if (loadingScreen) {
    // Usa um pequeno atraso para garantir que a animação seja vista
    setTimeout(() => {
      loadingScreen.style.opacity = '0';
      // Usa 'visibility: hidden' para que o elemento não seja clicável após o fade-out
      loadingScreen.style.visibility = 'hidden';
    }, 300); // 300ms de atraso
  }
});

async function handleAgendamento(event) {
  event.preventDefault();
  const loadingScreen = document.getElementById('loadingScreen');

  // 1. MOSTRAR O SPINNER ANTES DA CHAMADA API
  loadingScreen.style.visibility = 'visible';
  loadingScreen.style.opacity = '1';

  try {
    const response = await fetch('/api/agendar', {
      method: 'POST',
      // ... resto das configurações ...
    });

    const data = await response.json();
    // ... processar a resposta ...

  } catch (error) {
    console.error('Erro no agendamento:', error);
    // ... mostrar mensagem de erro ...

  } finally {
    // 2. ESCONDER O SPINNER APÓS A REQUISIÇÃO (SEJA SUCESSO OU FALHA)
    loadingScreen.style.opacity = '0';
    loadingScreen.style.visibility = 'hidden';
  }
}










