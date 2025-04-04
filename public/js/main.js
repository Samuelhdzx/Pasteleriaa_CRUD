// Verificar autenticación al inicio
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }
    return token;
}

// Agregar token a todas las peticiones
async function fetchWithAuth(url, options = {}) {
    const token = checkAuth();
    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };
    
    try {
        const response = await fetch(url, { ...options, headers });
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login.html';
        }
        return response;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
}

// Reemplazar todas las llamadas fetch por fetchWithAuth
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
});