async function init() {
    try {
        const response = await fetch('http://89.184.185.202:55555/api/isonline', {
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