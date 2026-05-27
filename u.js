import MarkdownIt from 'https://esm.sh/markdown-it@14.1.0';
import { full as markdownItEmoji } from 'https://esm.sh/markdown-it-emoji@3.0.0';

const md = new MarkdownIt({
    html: false,         
    linkify: true,      
    typographer: true   
}).use(markdownItEmoji);

let loadedPosts = 0;

async function renderContent() {
    const route = window.location.hash.substring(1); 
    const pageTitle = document.getElementById("pageTitle");
    const title = document.getElementById("title");
    const mainObj = document.getElementById("mainObj");

    if (!route || route === '/') {
        document.location.href = "/";
        return;
    }

    const token = document.cookie
        .split("; ")
        .find(row => row.startsWith('token='))
        ?.split("=")[1];

    if (!token) document.location.href = "/";

    try {
        const response = await fetch('https://orboapi.orbinuity.nl:55555/api/pubuserinfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                username: route
            })
        });

        const data = await response.json();

        if (response.ok) {
            pageTitle.textContent += data.user.name;
            title.textContent = data.user.name;
            try {
                const postPromises = [...data.user.posts].reverse().slice(loadedPosts, loadedPosts+5).map(async (postId) => {
                    const responseb = await fetch('https://orboapi.orbinuity.nl:55555/api/getpost', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ postid: postId })
                    });

                    const datab = await responseb.json();

                    if (!responseb.ok) {
                        alert(datab.error);
                        return;
                    }

                    return { postId, datab }; 
                });
            
                const completedPosts = await Promise.all(postPromises);

                let loggedInUsername = null;
                try {
                    const responsec = await fetch('https://orboapi.orbinuity.nl:55555/api/userinfo', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    const datac = await responsec.json();
                    
                    if (responsec.ok) {
                        loggedInUsername = datac.user.username;
                    } else {
                        alert(datac.error);
                        return;
                    }
                } catch (error) {
                    console.error("Error loading user info: ", error);
                }
            
                completedPosts.forEach((postData) => {
                    if (!postData) return;
                    const { postId, datab } = postData;

                    const h2 = document.createElement("h2");
                    h2.textContent = datab.title;

                    const p = document.createElement("p");
                    p.style = "color: var(--dark-text); font-size: 75%;"
                    const date = new Date(datab.timestamp * 1000);
                    const options = { month: 'long', day: 'numeric', year: 'numeric' };
                    p.textContent = date.toLocaleDateString('en-US', options).replace(',', '');
                
                    const card = document.createElement("div");
                    card.className = "card";
                    card.innerHTML = md.render(datab.post);
                    card.appendChild(document.createElement("br"));
                    card.appendChild(p);

                    if (loggedInUsername && loggedInUsername === datab.username) {
                        const button = document.createElement('button');
                        button.textContent = "Edit post";
                        const a_b = document.createElement('a');
                        a_b.href = "/edit#" + route;
                        a_b.style = "display: block; margin-left: auto; width: max-content;";
                        a_b.appendChild(button);
                        card.appendChild(a_b);
                    }

                    const a = document.createElement("a");
                    a.className = "card-link";
                    a.href = "/p#" + postId;
                    a.appendChild(card);
                
                    const section = document.createElement("section");
                    section.appendChild(h2);
                    section.appendChild(a);
                
                    mainObj.appendChild(section);
                });
            
            } catch (error) {
                console.error("Error loading posts: ", error);
            }
        } else {
            alert(data.error)
            return;
        }
    } catch (error) {
        console.error("Failed to get user`s info: "+error);
        return;
    }
}

async function onscroll() {
    if (window.pageYOffset + window.innerHeight >= document.body.scrollHeight) {
        loadedPosts += 5;
        await renderContent()
    }
}

renderContent();

window.addEventListener('hashchange', renderContent);
window.addEventListener("scroll", onscroll);