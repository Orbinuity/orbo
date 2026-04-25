async function init() {
    try {
        const response = await fetch('https://orbo-api.orbinuity.nl/api/isonline', {
            method: 'GET'
        });

        if (!response.ok) {
            document.location.href = "/serverOffline";
        }
    } catch (error) {
        document.location.href = "/serverOffline";
    }
}

init()