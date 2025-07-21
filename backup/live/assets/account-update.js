

  // Use common toast function from theme.liquid (assumed)
  function showToast(message = "Updated Successfully!", type = "success") {
    if (typeof window.showToast === "function") {
      window.showToast(message, type);
    } else {
      console.warn("Common showToast function is not loaded.");
    }
  }

  const editBtn = document.getElementById('edit-btn');
  const inputs = document.querySelectorAll('#profile-form input, #profile-form select');
  const toggleEmail = document.getElementById('toggleEmailField');
  const emailWrapper = document.getElementById('emailInputWrapper');
  const saveEmailBtn = document.getElementById('save-email-btn');
  const newEmailInput = document.getElementById('new-email');

  const editNameBtn = document.getElementById('edit-name');
  const fullNameInput = document.getElementById('full_name');
  const profilePic = document.getElementById('profile-pic');
  const imageUploadInput = document.getElementById('image-upload');

  editBtn.addEventListener('click', () => {
    const isCurrentlyEditing = !inputs[0].disabled;

    inputs.forEach(input => {
      input.disabled = isCurrentlyEditing;
      input.classList.toggle('opacity-40', isCurrentlyEditing);
    });

    editBtn.innerText = isCurrentlyEditing ? 'Edit' : 'Save';

    if (isCurrentlyEditing) {
      // Save logic here (AJAX call ideally)
      showToast("Profile info saved!", "success");
    }
  });

  editNameBtn.addEventListener('click', () => {
    inputs.forEach(input => {
      input.disabled = true;
      input.classList.add('opacity-40');
    });
    fullNameInput.disabled = false;
    fullNameInput.classList.remove('opacity-40');
    fullNameInput.focus();
    editBtn.innerText = 'Save';
  });

  imageUploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
      profilePic.src = evt.target.result;
      showToast("Profile image updated (preview only).", "success");
      // Backend upload logic would go here
    };
    reader.readAsDataURL(file);
  });

  toggleEmail.addEventListener('click', () => {
    emailWrapper.classList.toggle('hidden');
  });

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
