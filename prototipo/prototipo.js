const sidebar = document.querySelector(".sidebar-navigation");
const menuButton = document.querySelector(".mobile-menu");
const sidebarClose = document.querySelector(".sidebar-close");
const backdrop = document.querySelector(".nav-backdrop");
const profileButton = document.querySelector(".profile-button");
const profileMenu = document.querySelector(".profile-menu");
const modal = document.querySelector("#schedule-modal");
const modalName = modal.querySelector(".modal-space-name");
const modalCloseButtons = modal.querySelectorAll(
  ".modal-close, .modal-dismiss",
);
const bookingForm = document.querySelector("#booking-form");
const formMessage = bookingForm.querySelector(".form-message");

function setSidebar(open) {
  sidebar.classList.toggle("is-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  backdrop.hidden = !open;
  if (open) sidebarClose.focus();
}

menuButton.addEventListener("click", () => setSidebar(true));
sidebarClose.addEventListener("click", () => setSidebar(false));
backdrop.addEventListener("click", () => setSidebar(false));

document.querySelectorAll(".sidebar-item").forEach((item) => {
  item.addEventListener("click", () => {
    document
      .querySelectorAll(".sidebar-item")
      .forEach((navItem) => navItem.classList.remove("sidebar-item-active"));
    if (!item.classList.contains("sidebar-logout"))
      item.classList.add("sidebar-item-active");
    setSidebar(false);
  });
});

profileButton.addEventListener("click", () => {
  const expanded = profileButton.getAttribute("aria-expanded") === "true";
  profileButton.setAttribute("aria-expanded", String(!expanded));
  profileMenu.hidden = expanded;
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".header-actions")) {
    profileButton.setAttribute("aria-expanded", "false");
    profileMenu.hidden = true;
  }
});

function setModal(open, spaceName = "") {
  modal.hidden = !open;
  document.body.classList.toggle("modal-open", open);
  modalName.textContent = spaceName;
  if (open) modal.querySelector(".modal-close").focus();
}

document.querySelectorAll(".space-button").forEach((button) => {
  button.addEventListener("click", () => setModal(true, button.dataset.space));
});
modalCloseButtons.forEach((button) =>
  button.addEventListener("click", () => setModal(false)),
);
modal.addEventListener("click", (event) => {
  if (event.target === modal) setModal(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  setModal(false);
  setSidebar(false);
  profileButton.setAttribute("aria-expanded", "false");
  profileMenu.hidden = true;
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!bookingForm.checkValidity()) {
    bookingForm.reportValidity();
    formMessage.textContent = "Preencha todos os campos obrigatórios.";
    formMessage.classList.remove("success");
    formMessage.hidden = false;
    return;
  }
  formMessage.textContent =
    "Solicitação enviada com sucesso! Você receberá uma confirmação.";
  formMessage.classList.add("success");
  formMessage.hidden = false;
  bookingForm.reset();
});
