// Common toast function (assumes `showToast` is defined globally in theme.liquid)
function showToast(message = "Updated Successfully!", type = "success") {
  if (typeof window.showToast === "function") {
    window.showToast(message, type);
  } else {
    console.warn("Common showToast function is not loaded.");
  }
}

// Element selectors
const editBtn = document.getElementById('edit-btn');
const editIconBtn = document.getElementById('edit-icon-btn');
const inputs = document.querySelectorAll('#profile-form input, #profile-form select');
const toggleEmail = document.getElementById('toggleEmailField');
const emailWrapper = document.getElementById('emailInputWrapper');
const saveEmailBtn = document.getElementById('save-email-btn');
const newEmailInput = document.getElementById('new-email');

const editNameBtn = document.getElementById('edit-name');
const fullNameInput = document.getElementById('full_name');
const profilePic = document.getElementById('profile-pic');
const imageUploadInput = document.getElementById('image-upload');

//  Toggle Edit/Save State
function toggleEdit() {
  const isEditing = !inputs[0].disabled;

  inputs.forEach(input => {
    input.disabled = isEditing;
    input.classList.toggle('opacity-40', isEditing);
  });

  // Update both button labels
  if (editBtn) editBtn.innerText = isEditing ? 'Edit' : 'Save';
  if (editIconBtn) {
    editIconBtn.innerHTML = isEditing
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
<path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="#2F2F2F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.0399 3.01928L8.15988 10.8993C7.85988 11.1993 7.55988 11.7893 7.49988 12.2193L7.06988 15.2293C6.90988 16.3193 7.67988 17.0793 8.76988 16.9293L11.7799 16.4993C12.1999 16.4393 12.7899 16.1393 13.0999 15.8393L20.9799 7.95928C22.3399 6.59928 22.9799 5.01928 20.9799 3.01928C18.9799 1.01928 17.3999 1.65928 16.0399 3.01928Z" stroke="#2F2F2F" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14.9102 4.15039C15.5802 6.54039 17.4502 8.41039 19.8502 9.09039" stroke="#2F2F2F" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg></svg>`
      : `<span class="text-sm font-medium">Save</span>`;
  }

  if (isEditing) {
    showToast("Profile info saved!", "success");
  }
}


if (editBtn) {
  editBtn.addEventListener('click', toggleEdit);
}


if (editIconBtn) {
  editIconBtn.addEventListener('click', toggleEdit);
}

// Only enable name input when clicking "edit-name"
editNameBtn.addEventListener('click', () => {
  inputs.forEach(input => {
    input.disabled = true;
    input.classList.add('opacity-40');
  });

  fullNameInput.disabled = false;
  fullNameInput.classList.remove('opacity-40');
  fullNameInput.focus();

  if (editBtn) editBtn.innerText = 'Save';
  if (editIconBtn) {
    editIconBtn.innerHTML = `<span class="text-sm font-medium">Save</span>`;
  }
});

// Image upload preview
imageUploadInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    profilePic.src = evt.target.result;
    showToast("Profile image updated (preview only).", "success");
    // Backend logic (e.g. AJAX) can be added here
  };
  reader.readAsDataURL(file);
});

// Toggle email input field
toggleEmail.addEventListener('click', () => {
  emailWrapper.classList.toggle('hidden');
});

// Save email logic
saveEmailBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const newEmail = newEmailInput.value.trim();

  if (!newEmail || !newEmail.includes("@")) {
    alert("Please enter a valid email address.");
    return;
  }

  document.getElementById('main-email-display').textContent = newEmail;
  newEmailInput.value = '';
  emailWrapper.classList.add('hidden');
  showToast("Email updated successfully!", "success");
});
