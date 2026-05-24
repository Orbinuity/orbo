const tokenb = document.cookie
    .split("; ")
    .find(row => row.startsWith('token='))
    ?.split("=")[1];

if (!tokenb) document.location.href = "/";

async function inita(PS, accept) {
    accept.addEventListener("click", (e) => {
        e.preventDefault();

        async function press(PS) {
            try {
                const response = await fetch('https://orboapi.orbinuity.nl:55555/api/useraccept', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${tokenb}`
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    PS.close();
                } else {
                    document.location.href = "/";
                    alert(data.error)
                    console.error("Failed to accept: "+data.error);
                }
            } catch (err) {
                console.error("Network error: "+err);
            }
        }

        press(PS);
    });

    try {
        const response = await fetch('https://orboapi.orbinuity.nl:55555/api/userinfo', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenb}`
            }
        });
        
        const data = await response.json();

        if (response.ok) {
            if (data?.user?.psa) {
                PS.close();
            } else {
                PS.showModal();
            }
        } else {
            alert(data.error);
            console.error("Failed to fetch user info: "+data.error);
        }
    } catch (err) {
        console.error("Failed to fetch user info: "+err);
    }
}

const observera = new MutationObserver((mutations, obs) => {
    const signout = document.getElementById("signout");
    const accept = document.getElementById("accept");
    const PS = document.getElementById("PS");

    if (PS && signout && accept) {
        obs.disconnect();

        signout.addEventListener("click", (e) => {
            e.preventDefault();

            document.cookie = "token=; max-age=0; path=/";
            location.reload();
        });
        
        inita(PS, accept);
    }
});

observera.observe(document.documentElement, {
    childList: true,
    subtree: true
});