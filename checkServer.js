async function init() {
    try {
        const response = await fetch('http://localhost:3333/api/isonline', {
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