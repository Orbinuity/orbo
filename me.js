async function initd() {
    const title = document.getElementById("title");
    const username = document.getElementById("username");
    const email = document.getElementById("email");
    const name = document.getElementById("name");

    const token = document.cookie
        .split("; ")
        .find(row => row.startsWith('token='))
        ?.split("=")[1];

    if (!token) document.location.href = "/";

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
            const a = document.createElement('a');
            a.href = "/u#"+data.user.username;
            a.style = "font-weight: 700;";
            a.textContent = data.user.name;

            title.innerHTML = "Hello, ";
            title.appendChild(a);
            title.innerHTML += "!";
            username.placeholder = data.user.username;
            email.placeholder = data.user.email;
            name.placeholder = data.user.name;
        } else {
            alert(data.error);
            return;
        }
    } catch (err) {
        console.error("Failed to get user info: "+err);
        return;
    }
}

async function saveOptions(event) {
    event.preventDefault(); 

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const name = document.getElementById("name").value.trim();
    const opassword = document.getElementById("opassword").value.trim();

    const formData = new FormData(document.getElementById('accountForm'));
    const captchaToken = formData.get('g-recaptcha-response'); 

    if (!captchaToken) {
        alert("Please check the 'I'm not a robot' box.");
        return;
    }

    const token = document.cookie
        .split("; ")
        .find(row => row.startsWith('token='))
        ?.split("=")[1];

    if (!token) document.location.href = "/";

    try {
        const response = await fetch('https://orboapi.orbinuity.nl:55555/api/updateuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                name: name,
                opassword: opassword,
                captchaToken: captchaToken
            })
        });

        const data = await response.json();

        if (response.ok) {
            const date = new Date();
            date.setTime(date.getTime() + (2 * 24 * 60 * 60 * 1000));

            document.cookie = `token=${data.token}; expires=${date.toUTCString()}; path=/`;
            document.location.href = "/me";
        } else {
            alert(data.error)
            return;
        }
    } catch (error) {
        console.error("Failed to update user info: "+error);
        return;
    }
}

async function removeAccount(event) {
    event.preventDefault(); 

    const password = document.getElementById("r-password").value.trim();

    const formData = new FormData(document.getElementById('removeForm'));
    const captchaToken = formData.get('g-recaptcha-response'); 

    if (!captchaToken) {
        alert("Please check the 'I'm not a robot' box.");
        return;
    }

    if (!confirm("Are you sure you want to remove your accont and all your data?\nYOU CAN NOT UNDO THIS!")) return;

    const token = document.cookie
        .split("; ")
        .find(row => row.startsWith('token='))
        ?.split("=")[1];

    if (!token) document.location.href = "/";

    try {
        const response = await fetch('https://orboapi.orbinuity.nl:55555/api/removeuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                password: password,
                captchaToken: captchaToken
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Its gone.\n"+data.message);
            document.cookie = "token=; max-age=0; path=/";
            document.location.href = "/"
        } else {
            alert(data.error)
            return;
        }
    } catch (error) {
        console.error("Failed to remove account: "+error);
        return;
    }
}

initd();