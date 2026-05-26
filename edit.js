async function renderContent() {
    const route = window.location.hash.substring(1); 
    const title = document.getElementById("title");
    const post = document.getElementById("post");
    
    let thisUser = "";

    const token = document.cookie
        .split("; ")
        .find(row => row.startsWith('token='))
        ?.split("=")[1];

    if (!token) document.location.href = "/";

    if (!route || route === '/') {
        document.location.href = "/";
        return;
    }

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
            thisUser = data.user.username;
        } else {
            alert(data.error)
            return;
        }
    } catch (error) {
        console.error("Failed to get user info: "+error);
        return;
    }

    try {
        const response = await fetch('https://orboapi.orbinuity.nl:55555/api/getpost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                postid: route
            })
        });

        const data = await response.json();

        if (response.ok) {
            if (data.username !== thisUser) document.location.href = "/"
            title.value = data.title;
            post.value = data.post;
        } else {
            alert(data.error)
            return;
        }
    } catch (error) {
        console.error("Failed to get post: "+error);
        return;
    }
}

async function savePost(event) {
    event.preventDefault();

    const route = window.location.hash.substring(1); 
    const title = document.getElementById('title').value.trim();
    const post = document.getElementById('post').value.trim();

    const token = document.cookie
        .split("; ")
        .find(row => row.startsWith('token='))
        ?.split("=")[1];

    if (!token) document.location.href = "/";
    
    if (!title || !post) {
        alert("Please fill in both fields.");
        return;
    }

    try {
        const response = await fetch('https://orboapi.orbinuity.nl:55555/api/editpost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: title,
                post: post,
                postid: route
            })
        });

        if (response.ok) {
            window.location.href = `/p#${route}`;
        } else {
            alert(data.error)
            return;
        }
    } catch (error) {
        console.error("Failed to make post: "+error);
        return;
    }
}

function back(event) {
    event.preventDefault();

    const route = window.location.hash.substring(1); 

    window.location.href = `/p#${route}`;
}

renderContent()

window.addEventListener('hashchange', renderContent);