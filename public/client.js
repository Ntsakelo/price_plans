document.addEventListener("DOMContentLoaded", function () {
  const msg = document.querySelector(".msg");

  if (msg.innerHTML !== "") {
    setTimeout(function () {
      msg.setAttribute("style", "display:none");
    }, 3000);
  }
});
