async function testToken(token, headerNav) {
    if (token) {
        const response = await fetch('https://orbo-api.orbinuity.nl/api/userinfo', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) document.location.href = "/home";
        else headerNav.innerHTML = "";
    } else headerNav.innerHTML = "";
}

const observerb = new MutationObserver((mutations, obs) => {
    const headerNav = document.getElementById("header-nav");
    
    if (headerNav) {
        obs.disconnect(); 

        const token = document.cookie
            .split("; ")
            .find(row => row.startsWith('token='))
            ?.split("=")[1];

        testToken(token, headerNav)
    }
});

observerb.observe(document.documentElement, {
    childList: true,
    subtree: true
});