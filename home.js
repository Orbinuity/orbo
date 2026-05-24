const token = document.cookie
    .split("; ")
    .find(row => row.startsWith('token='))
    ?.split("=")[1];

if (!token) document.location.href = "/";

async function initb(title) {
    try {
        const response = await fetch('https://orboapi.orbinuity.nl:55555/api/userinfo', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            title.textContent += data.user.name;
        } else {
            alert(data.error)
        }
    } catch (err) {
        console.error("Failed to fetch user info: "+err);
    }
}

const observerb = new MutationObserver((mutations, obs) => {
    const title = document.getElementById("title");

    if (title) {
        obs.disconnect()
        initb(title)
    }
});

observerb.observe(document.documentElement, {
    childList: true,
    subtree: true
});