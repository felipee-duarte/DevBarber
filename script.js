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

  function trocarImagem() {
    const imagem = document.getElementById('minhaImagem');
    const larguraTela = window.innerWidth;

    if (larguraTela < 768) {
      imagem.src = 'imagens/devfaixaP.jpg'; // celular
    } else if (larguraTela < 1200) {
      imagem.src = 'imagens/devfaixaP.jpg'; // tablet
    } else {
      imagem.src = 'imagens/devfaixaG.png'; // desktop
    }
  }

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
    const response = await fetch("http://localhost:3000/agendar", {
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
    const response = await fetch("http://localhost:3000/agendar", {
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










