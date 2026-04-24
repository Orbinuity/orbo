async function init() {
    const token = document.cookie
        .split("; ")
        .find(row => row.startsWith('token='))
        ?.split("=")[1];

    if (token) {
        const response = await fetch('http://localhost:3333/api/userinfo', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) document.location.href = "/";
    } else document.location.href = "/";
}

init()