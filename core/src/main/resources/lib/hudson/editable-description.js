/* global replaceDescription */
(function () {
  function editDescription(button) {
    const template = document.getElementById("edit-description-template");
    const title = button.dataset.title;
    const form = template.content.firstElementChild.cloneNode(true);

    dialog.form(form, {
      title: title,
      okText: dialog.translations.save,
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
