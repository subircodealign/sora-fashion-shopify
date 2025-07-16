document.addEventListener("DOMContentLoaded", function () {
  const editBtn = document.getElementById("edit-btn");
  const form = document.getElementById("profile-form");
  const inputs = form.querySelectorAll("input, select");

  let isEditing = false;

  editBtn.addEventListener("click", async () => {
    isEditing = !isEditing;

    if (isEditing) {
      inputs.forEach(input => {
        input.disabled = false;
        input.classList.remove("opacity-40");
        input.classList.add("opacity-100");
      });
      editBtn.textContent = "Save";
    } else {
      const data = {
        metafields: [
          {
            key: "full_name",
            namespace: "custom",
            value: form.full_name.value,
            type: "single_line_text_field"
          },
          {
            key: "nick_name",
            namespace: "custom",
            value: form.nick_name.value,
            type: "single_line_text_field"
          },
          {
            key: "gender",
            namespace: "custom",
            value: form.gender.value,
            type: "single_line_text_field"
          },
          {
            key: "language",
            namespace: "custom",
            value: form.language.value,
            type: "single_line_text_field"
          },
          {
            key: "country",
            namespace: "custom",
            value: form.country.value,
            type: "single_line_text_field"
          },
          {
            key: "timezone",
            namespace: "custom",
            value: form.timezone.value,
            type: "single_line_text_field"
          }
        ]
      };

      const response = await fetch("/account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert("Profile updated successfully!");
        location.reload();
      } else {
        alert("Failed to update profile.");
      }
    }
  });
});
