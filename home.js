const token = document.cookie
    .split("; ")
    .find(row => row.startsWith('token='))
    ?.split("=")[1];

if (!token) document.location.href = "/";

async function init(title) {
    const response = await fetch('https://orbo-api.orbinuity.nl/api/userinfo', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    
    const data = await response.json();
    
    if (response.ok) {
        title.textContent += ", "+data.user.name;
    } else {
        title.textContent += " to Orbo"
    }
}

const observera = new MutationObserver((mutations, obs) => {
    const title = document.getElementById("title");

    if (title) {
        obs.disconnect()
        init(title)
    }
});

observera.observe(document.documentElement, {
    childList: true,
    subtree: true
});