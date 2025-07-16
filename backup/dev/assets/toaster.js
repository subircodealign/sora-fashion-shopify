window.toastTimeout = null;

window.showToast = function(message, type = "success", duration = 4000) {
  const toast = document.getElementById('toast');
  const messageEl = document.getElementById('toast-message');
  const iconEl = document.getElementById('toast-icon');

  if (window.toastTimeout) {
    clearTimeout(window.toastTimeout);
  }

  messageEl.textContent = message;

  if (type === "success") {
    toast.classList.remove("bg-red-100", "text-red-700");
    toast.classList.add("bg-green-100", "text-green-800");
    iconEl.innerHTML = `
      <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
      </svg>`;
  } else if (type === "error") {
    toast.classList.remove("bg-green-100", "text-green-800");
    toast.classList.add("bg-red-100", "text-red-700");
    iconEl.innerHTML = `
      <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
      </svg>`;
  } else {
    toast.classList.remove("bg-green-100", "text-green-800", "bg-red-100", "text-red-700");
    iconEl.innerHTML = "";
  }

  toast.classList.remove("opacity-0", "pointer-events-none");

  window.toastTimeout = setTimeout(() => {
    toast.classList.add("opacity-0", "pointer-events-none");
  }, duration);
};
