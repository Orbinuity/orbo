const observerd = new MutationObserver((mutations, obs) => {
    const headerNav = document.getElementById("header-nav");
    
    if (headerNav) {
        obs.disconnect(); 

        headerNav.innerHTML = "";
    }
});

observerd.observe(document.documentElement, {
    childList: true,
    subtree: true
});