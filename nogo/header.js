async function testUser(headerNav) {
    const token = document.cookie
        .split("; ")
        .find(row => row.startsWith('token='))
        ?.split("=")[1];

    if (token) {
        try {
            const response = await fetch('https://orboapi.orbinuity.nl:55555/api/userinfo', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) headerNav.innerHTML = "";
        } catch (err) {
            headerNav.innerHTML = "";
            console.error("Failed to check server: "+err);
        }
    } else headerNav.innerHTML = "";
}

function setupUserNavigation(headerNav, signout, observer = null) {
    
    if (observer) observer.disconnect(); 

    testUser(headerNav);

    signout.addEventListener("click", (e) => {
        e.preventDefault();
        document.cookie = "token=; max-age=0; path=/";
        location.reload();
    });
}

const immediateHeaderNav = document.getElementById("header-nav");
const immediateSignout = document.getElementById("signout");

if (immediateHeaderNav && immediateSignout) {
    setupUserNavigation(immediateHeaderNav, immediateSignout);
} else {
    const observere = new MutationObserver((mutations, obs) => {
        const headerNav = document.getElementById("header-nav");
        const signout = document.getElementById("signout");

        if (signout && headerNav) {
            setupUserNavigation(headerNav, signout, obs);
        }
    });

    observere.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
}