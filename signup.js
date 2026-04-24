const form = document.getElementById('signupForm');
const statusMessage = document.getElementById('statusMessage');

form.addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    
    const formData = new FormData(form);
    const captchaToken = formData.get('g-recaptcha-response'); 

    if (!captchaToken) {
        statusMessage.textContent = "Please check the 'I'm not a robot' box.";
        statusMessage.style.color = "red";
        return;
    }

    try {
        const response = await fetch('http://localhost:3333/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                name: name,
                captchaToken: captchaToken
            })
        });

        const data = await response.json();

        if (response.ok) {
            statusMessage.textContent = "Success: " + data.message;
            statusMessage.style.color = "green";
            
            const date = new Date();
            date.setTime(date.getTime() + (2 * 24 * 60 * 60 * 1000));

            document.cookie = `token=${data.token}; expires=${date.toUTCString()}; path=/`;
            window.location.href = "/";
        } else {
            statusMessage.textContent = "Error: " + data.error;
            statusMessage.style.color = "red";
        }
    } catch (error) {
        statusMessage.textContent = "Failed to connect to the server.";
        statusMessage.style.color = "red";
    }
});