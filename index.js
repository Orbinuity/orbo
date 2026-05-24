async function testToken() {
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

            const data = await response.json();

            if (response.ok) {
                document.location.href = "/home";
            } else {
                document.cookie = "token=; max-age=0; path=/";
            }
        } catch (err) {
            console.error("Failed to fetch user info: "+err);
        }
    }
}

testToken();