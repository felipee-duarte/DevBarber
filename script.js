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



