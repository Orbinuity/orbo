const observerb = new MutationObserver((mutations, obs) => {
    const headerNav = document.getElementById("header-nav");
    
    if (headerNav) {
        obs.disconnect(); 

        headerNav.innerHTML = "";
    }
});

observerb.observe(document.documentElement, {
    childList: true,
    subtree: true
});