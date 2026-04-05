const scriptURL =
  "https://script.google.com/macros/s/AKfycbxtbULw3LQbP_Af0eoIRU4wUqkTthHHMXLu6CrKg9j4MitQkC3UAmwtNz3YUl2L5WXbbA/exec";

let form = document.getElementById("form_contact");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  fetch(scriptURL, {
    method: "post",
    body: new FormData(form),
  })
    .then((Response) => {
      setTimeout(() => {
        localStorage.removeItem("cart");
        window.location.reload();
      }, 3000);
    })

    .catch((error) => console.error("error", error.message));
});
