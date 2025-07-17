// customer-profile.js
document.addEventListener('DOMContentLoaded', function() {
  const editBtn = document.getElementById('editBtn');
  const saveBtn = document.createElement('button');
  saveBtn.id = 'saveBtn';
  saveBtn.className = 'ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition hidden';
  saveBtn.textContent = 'Save';
  editBtn.parentNode.appendChild(saveBtn);

  // Get all input and select elements
  const inputs = document.querySelectorAll('input, select');
  
  editBtn.addEventListener('click', function() {
    // Enable all inputs
    inputs.forEach(input => {
      input.disabled = false;
      input.classList.remove('opacity-40');
    });
    
    // Toggle buttons
    editBtn.classList.add('hidden');
    saveBtn.classList.remove('hidden');
  });

  saveBtn.addEventListener('click', function() {
    // Prepare data to save
    const formData = {
      first_name: document.getElementById('firstName').value,
      gender: document.getElementById('gender').value,
      language: document.getElementById('language').value,
      nick_name: document.getElementById('nickName').value,
      country: document.getElementById('country').value,
      time_zone: document.getElementById('timeZone').value
    };

    // Save data to Shopify metafields
    saveCustomerData(formData)
      .then(() => {
        // Disable inputs after save
        inputs.forEach(input => {
          input.disabled = true;
          input.classList.add('opacity-40');
        });
        
        // Toggle buttons
        editBtn.classList.remove('hidden');
        saveBtn.classList.add('hidden');
        
        // Show success message
        showToast('Profile updated successfully!');
      })
      .catch(error => {
        console.error('Error saving data:', error);
        showToast('Error updating profile. Please try again.', 'error');
      });
  });

  // Function to save data to Shopify
  function saveCustomerData(data) {
    return new Promise((resolve, reject) => {
      // Shopify AJAX call to update customer metafields
      fetch('/apps/api/customer/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          customer_id: {{ customer.id | json }},
          metafields: data
        })
      })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => resolve(data))
      .catch(error => reject(error));
    });
  }

  // Helper function to show toast messages
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg text-white ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
});