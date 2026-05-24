async function initc() {
    try {
        const response = await fetch('https://orboapi.orbinuity.nl:55555/api/isonline', {
            method: 'GET'
        });

        if (!response.ok) {
            document.location.href = "/serverProblem";
        }
    } catch (error) {
        document.location.href = "/serverProblem";
    }
}

initc()