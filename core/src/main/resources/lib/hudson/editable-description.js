(function () {
  function editDescription(button) {
    const template = document.getElementById("edit-description-template");
    const title = button.dataset.title;
    const form = template.content.firstElementChild.cloneNode(true);
    const textarea = form.querySelector("#description-textarea");
    textarea.value = template.dataset.description;

    dialog
      .form(form, {
        title: title,
        okText: dialog.translations.save,
        submitButton: false,
      })
      .then((formData) => {
        const description = formData.get("description");
        const url = button.dataset.url;
        fetch(url, {
          method: "POST",
          headers: crumb.wrap({
            "Content-Type": "application/x-www-form-urlencoded",
          }),
          body: new URLSearchParams({ description }),
        }).then((response) => {
          if (response.ok) {
            fetch(rootURL + "/markupFormatter/previewDescription", {
              method: "post",
              headers: crumb.wrap({
                "Content-Type": "application/x-www-form-urlencoded",
              }),
              body: new URLSearchParams({
                text: textarea.value,
              }),
            }).then((rsp) => {
              rsp.text().then((responseText) => {
                if (rsp.ok) {
                  const description = document.getElementById(
                    "description-content",
                  );
                  if (description != null) {
                    description.innerHTML = responseText;
                  }
                } else {
                  window.location.reload();
                }
              });
            });
          } else {
            notificationBar.show(
              "Failed to save description",
              notificationBar.WARNING,
            );
          }
        });
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    const descriptionLink = document.querySelector("#description-link");
    const description = document.getElementById("description");
    if (description != null) {
      descriptionLink.classList.remove("jenkins-hidden");
      descriptionLink.addEventListener("click", function (e) {
        e.preventDefault();
        editDescription(descriptionLink);
      });
    }
  });
})();
