
// const API_BASE_URL = "http://localhost:5000";
// Elements
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

let isEditing = false;

// Enable/disable inputs
function setInputsDisabled(state) {
  inputs.forEach(input => {
    input.disabled = state;
    input.classList.toggle('opacity-40', state);
  });
}

// Collect data from inputs
function collectProfileData() {
  return {
    full_name: document.getElementById('full_name').value.trim(),
    nick_name: document.getElementById('nick_name').value.trim(),
    gender: document.getElementById('gender').value,
    country: document.getElementById('country').value,
    language: document.getElementById('language').value,
    timezone: document.getElementById('timezone').value,
  };
}

// Send profile data to backend (App Proxy)
async function updateProfileData(data) {
  try {
    const response = await fetch(`/apps/sora_fashion_proxy/update-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      credentials: 'same-origin' // important for cookies/session if used
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const resData = await response.json();
    return resData;
  } catch (error) {
    console.error('Update failed:', error);
    return { success: false, message: error.message };
  }
}

// Toggle edit/save button clicked
async function toggleEdit() {
  console.log("toggleEdit called, isEditing:", isEditing);

  if (isEditing) {
    const data = collectProfileData();
    showToast("Saving profile...", "info");

    const res = await updateProfileData({ type: 'profile', ...data });
    console.log("Response from backend:", res);

    if (res.success) {
      showToast("Profile info saved!", "success");
      setInputsDisabled(true);
      editBtn.innerText = 'Edit';
      // Instead of innerHTML replace, just change textContent or toggle class:
      if (editIconBtn) {
        editIconBtn.textContent = ''; // clear text
        // or set a class to show edit icon with CSS
      }
      isEditing = false;
    } else {
      showToast(`Save failed: ${res.message}`, "error");
    }
  } else {
    setInputsDisabled(false);
    editBtn.innerText = 'Save';
    if (editIconBtn) {
      editIconBtn.textContent = 'Save'; // simple text instead of innerHTML svg change
    }
    isEditing = true;
  }
}



if (editBtn) editBtn.addEventListener('click', toggleEdit);
if (editIconBtn) editIconBtn.addEventListener('click', toggleEdit);

// Enable only full name on edit-name click
editNameBtn.addEventListener('click', () => {
  setInputsDisabled(true);
  fullNameInput.disabled = false;
  fullNameInput.classList.remove('opacity-40');
  fullNameInput.focus();

  editBtn.innerText = 'Save';
  if (editIconBtn) editIconBtn.innerHTML = `<span class="text-sm font-medium">Save</span>`;
  isEditing = true;
});

// Image upload preview + backend update
imageUploadInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async function(evt) {
    profilePic.src = evt.target.result;
    showToast("Uploading profile image...", "info");

    // Prepare FormData for file upload
    const formData = new FormData();
    formData.append('type', 'profile_image');
    formData.append('image', file);

    try {
      const response = await fetch(`/apps/sora_fashion_proxy/update-profile`, {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
      });
      const resData = await response.json();
      if (resData.success) {
        showToast("Profile image updated!", "success");
      } else {
        showToast(`Image upload failed: ${resData.message}`, "error");
      }
    } catch (err) {
      showToast(`Image upload error: ${err.message}`, "error");
    }
  };
  reader.readAsDataURL(file);
});

// Toggle email input field visibility
toggleEmail.addEventListener('click', () => {
  emailWrapper.classList.toggle('hidden');
});

// Save email logic + backend update
saveEmailBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  const newEmail = newEmailInput.value.trim();

  if (!newEmail || !newEmail.includes("@")) {
    alert("Please enter a valid email address.");
    return;
  }

  showToast("Saving email...", "info");

  const res = await updateProfileData({ type: 'email', email: newEmail });
  if (res.success) {
    document.getElementById('main-email-display').textContent = newEmail;
    newEmailInput.value = '';
    emailWrapper.classList.add('hidden');
    showToast("Email updated successfully!", "success");
  } else {
    showToast(`Email update failed: ${res.message}`, "error");
  }
});
