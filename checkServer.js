async function init() {
    try {
        const response = await fetch('http://orbo.api.orbinuity.nl/api/isonline', {
            method: 'GET'
        });

        if (!response.ok) {
            document.location.href = "/serverOffline";
            return;
        }
    } catch (error) {
        document.location.href = "/serverOffline";
    }
}

init()