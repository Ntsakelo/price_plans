document.addEventListener("DOMContentLoaded", function () {
  let msg = document.querySelector(".msg");

  if (msg.innerHTML !== "") {
    setTimeout(function () {
      msg.setAttribute("style", "opacity:0");
    }, 3000);
  }
});
