const form = document.getElementById('signupForm');
const statusMessage = document.getElementById('statusMessage');
const ousername = document.getElementById('username');
const oemail = document.getElementById('email');
const opassword = document.getElementById('password');
const oname = document.getElementById('name');

async function signup(event) {
    event.preventDefault(); 

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const name = document.getElementById('name').value.trim();
    
    const formData = new FormData(form);
    const captchaToken = formData.get('g-recaptcha-response'); 

    if (!captchaToken) {
        statusMessage.textContent = "Please check the 'I'm not a robot' box.";
        statusMessage.style.color = "red";
        return;
    }

    ousername.setCustomValidity("Username can only contain lowercase letters, numbers and underscores and must be less then 32 characters long.");
    oemail.setCustomValidity("This is not a valid email, make sure its a email and is less then 254 characters long.");
    opassword.setCustomValidity("Password needs to be between 6 and 256 characters long.");
    oname.setCustomValidity("Name must be less then 64 characters long.");

    try {
        const response = await fetch('https://orboapi.orbinuity.nl:55555/api/signup', {
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
}

ousername.oninvalid = () => ousername.setCustomValidity("Username can only contain lowercase letters, numbers and underscores and must be less then 32 characters long.");
oemail.oninvalid = () => oemail.setCustomValidity("This is not a valid email, make sure its a email and is less then 254 characters long.");
opassword.oninvalid = () => opassword.setCustomValidity("Password needs to be between 6 and 256 characters long.");
oname.oninvalid = () => oname.setCustomValidity("Name must be less then 64 characters long.");