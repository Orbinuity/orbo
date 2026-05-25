const dropdown = document.getElementById("dropdown-content");
const headerNav = document.getElementById("header-nav");
const signout = document.getElementById("signout");

async function testUser() {
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
                console.log(0);
                try {
                    const postPromises = [...data.user.posts].reverse().map(async (postId) => {
                        const responseb = await fetch('https://orboapi.orbinuity.nl:55555/api/getpost', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ postid: postId })
                        });

                        const postObject = await responseb.json();

                        if (!responseb.ok) {
                            alert(datab.error);
                            return;
                        }

                        return { postId, postObject }; 
                    });
                
                    const completedPosts = await Promise.all(postPromises);
                
                    completedPosts.forEach((postData) => {
                        console.log(1);
                        if (!postData) return;
                        const { postId, postObject } = postData;

                        const a = document.createElement('a');
                        a.href = `/p#${postId}`
                        a.textContent = postObject.title;

                        dropdown.appendChild(a);
                    });
                
                } catch (error) {
                    console.error("Error loading posts: ", error);
                }
            } else headerNav.innerHTML = "";
        } catch (err) {
            headerNav.innerHTML = "";
            console.error("Failed to check server: "+err);
        }
    } else headerNav.innerHTML = "";
}

testUser();

signout.addEventListener("click", (e) => {
    e.preventDefault();
    document.cookie = "token=; max-age=0; path=/";
    location.reload();
});