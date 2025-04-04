document.addEventListener('DOMContentLoaded', () => {
    const switchBtns = document.querySelectorAll('.switch-btn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Switch between forms
    switchBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            switchBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (btn.dataset.form === 'login') {
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
            } else {
                registerForm.classList.remove('hidden');
                loginForm.classList.add('hidden');
            }
        });
    });

    // Handle login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                window.location.href = '/index.html';
            } else {
                alert('Error al iniciar sesión');
            }
        } catch (error) {
            alert('Error al iniciar sesión');
        }
    });

    // Handle register
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                window.location.href = '/index.html';
            } else {
                alert('Error al registrarse');
            }
        } catch (error) {
            alert('Error al registrarse');
        }
    });
});
