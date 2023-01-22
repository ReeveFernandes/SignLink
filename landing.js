var myNav = document.getElementById("nav");
window.onscroll = function () {
  if (document.body.scrollTop >= 200) {
    console.log("yes");
    myNav.classList.add("nav-solid");
  } else {
    myNav.classList.remove("nav-solid");
  }
};

