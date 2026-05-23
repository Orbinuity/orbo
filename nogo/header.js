const observere = new MutationObserver((mutations, obs) => {
    const signout = document.getElementById("signout");

    if (signout) {
        obs.disconnect(); 

        signout.addEventListener("click", (e) => {
            e.preventDefault();

            document.cookie = "token=; max-age=0; path=/";
            location.reload();
        })
    }
});

observere.observe(document.documentElement, {
    childList: true,
    subtree: true
});