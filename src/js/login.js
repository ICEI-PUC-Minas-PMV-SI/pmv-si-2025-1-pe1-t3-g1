document.addEventListener('DOMContentLoaded', () => {
    loadLayout();
    setupLoginForm();
    checkLoginStatus();
});

function loadLayout() {
    fetch('layout.html')
        .then(response => response.text())
        .then(html => {
            const temp = document.createElement('div');
            temp.innerHTML = html;
            
            const header = temp.querySelector('header');
            const footer = temp.querySelector('footer');

            const layoutContent = document.getElementById('layout-content');

            if (header) {
                layoutContent.insertBefore(header, layoutContent.firstChild);
            }
            
            if (footer) {
                layoutContent.appendChild(footer);
            }
        })
        .catch(error => console.error('Error loading layout:', error));
}

function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        try {
            const loginSucesso = await login(email, senha);
            
            if (loginSucesso) {
                window.location.replace('index.html');
            } else {
                errorMessage.classList.remove('hidden');
                localStorage.removeItem('currentUser');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            errorMessage.textContent = 'Erro ao fazer login. Tente novamente.';
            errorMessage.classList.remove('hidden');
            localStorage.removeItem('currentUser');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        window.location.replace('index.html');
    }
    
    setupLoginForm();
});

function checkLoginStatus() {
    if (isLoggedIn()) {
        window.location.href = 'index.html';
    }
}