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

/*document.getElementById("submitBtn").addEventListener("click", async (e) => {
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
});*/

// === Funções do carregamento ===
function showLoading() {
  document.getElementById("loadingScreen").style.display = "flex";
}

function hideLoading() {
  document.getElementById("loadingScreen").style.display = "none";
}

// === Lógica do formulário ===
const form = document.getElementById("bookingForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const service = document.getElementById("service").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  if (!name || !phone || !service || !date || !time) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  const data = { name, phone, service, date, time };

  // Mostra a tela de carregamento
  showLoading();

  try {
    const response = await fetch("https://devbarber.onrender.com/agendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    hideLoading();

    if (response.ok) {
      alert(result.message || "✅ Agendamento criado com sucesso!");

      // Redireciona para o WhatsApp do barbeiro com mensagem automática
      const barbeiroPhone = "5519996462753"; 
      const message = `Olá! Meu nome é ${name}. Marquei um ${service} para o dia ${date} às ${time}.`;
      const whatsappURL = `https://wa.me/${barbeiroPhone}?text=${encodeURIComponent(message)}`;

      // Abre o WhatsApp em uma nova aba
      window.open(whatsappURL, "_blank");

      form.reset();
    } else {
      alert(result.message || "❌ Erro ao criar agendamento.");
    }
  } catch (err) {
    hideLoading();
    alert("Erro ao enviar o agendamento 😢");
    console.error("Erro no agendamento:", err);
  }
});

function showLoading() {
  document.getElementById("loadingScreen").style.display = "flex";
}

function hideLoading() {
  document.getElementById("loadingScreen").style.display = "none";
}










