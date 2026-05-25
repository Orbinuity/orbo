async function makePost(event) {
    event.preventDefault();

    const token = document.cookie
        .split("; ")
        .find(row => row.startsWith('token='))
        ?.split("=")[1];

    if (!token) document.location.href = "/";
    
    const title = document.getElementById('title').value.trim();
    const post = document.getElementById('post').value.trim();
    
    if (!title || !post) {
        alert("Please fill in both fields.");
        return;
    }

    try {
        const response = await fetch('https://orboapi.orbinuity.nl:55555/api/makepost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: title,
                post: post
            })
        });

        const data = await response.json();

        if (response.ok) {
            window.location.href = `/p#${data.postid}`;
        } else {
            alert(data.error)
            return;
        }
    } catch (error) {
        console.error("Failed to make post: "+error);
        return;
    }
}