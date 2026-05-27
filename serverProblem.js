const route = window.location.hash.substring(1);
const errorMsg = document.getElementById("error-msg");

if (route && route !== '/') {
    if (route === "offline") errorMsg.textContent = "Our servers are offline at the moment.";
}

