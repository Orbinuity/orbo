import MarkdownIt from 'https://esm.sh/markdown-it@14.1.0';
import { full as markdownItEmoji } from 'https://esm.sh/markdown-it-emoji@3.0.0';

const md = new MarkdownIt({
    html: false,         
    linkify: true,      
    typographer: true   
}).use(markdownItEmoji);

async function renderContent() {
    const route = window.location.hash.substring(1); 
    const user = document.getElementById("user");
    const title = document.getElementById("title");
    const pageTitle = document.getElementById("pageTitle");
    const post = document.getElementById("post");

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

        if (response.ok) {
            const a = document.createElement('a');
            a.href = "/u#"+data.username;
            a.textContent = "u#"+data.username;
            user.appendChild(a);
            title.textContent = data.title;
            pageTitle.textContent += data.title;
            post.innerHTML = md.render(data.post);
            if (loggedInUsername && loggedInUsername === datab.username) {
                const button = document.createElement('button');
                button.textContent = "Edit post";
                const a_b = document.createElement('a');
                a_b.href = "/edit#" + route;
                a_b.style = "display: block; margin-left: auto; width: max-content;";
                a_b.appendChild(button);
                post.appendChild(a_b);
            }
        } else {
            alert(data.error)
            return;
        }
    } catch (error) {
        console.error("Failed to get post: "+error);
        return;
    }
}

renderContent();

window.addEventListener('hashchange', renderContent);