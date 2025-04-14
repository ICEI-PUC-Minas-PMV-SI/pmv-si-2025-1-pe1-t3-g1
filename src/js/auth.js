const usuariosIniciais = [
    {
        email: 'master@icmbio.com',
        senha: btoa('pucprojetos'),
        nome: 'Master',
        papel: 'admin',
        status: 'ativo',
        historico: [
            {
                data: new Date().toLocaleString('pt-BR'),
                acao: 'Usuário criado como administrador master',
                por: 'sistema'
            }
        ]
    }
];

const PAPEIS = {
    ADMIN: 'admin',
    COORDENADOR: 'coordenador',
    ARTICULADOR: 'articulador',
    COLABORADOR: 'colaborador'
};

function inicializarUsuarios() {
    const usuariosExistentes = window.loadFromServer('users');
    if (!usuariosExistentes) {
        window.saveToServer('users', usuariosIniciais);
    }
}

function login(email, senha) {
    const usuarios = window.loadFromServer('users') || [];
    const usuario = usuarios.find(u => {
        if (u.email === email && u.status === 'ativo') {
            try {
                const senhaArmazenada = atob(u.senha);
                return senhaArmazenada === senha;
            } catch (e) {
                console.error('Erro ao descriptografar senha:', e);
                return false;
            }
        }
        return false;
    });
    
    if (usuario) {
        const { senha, ...usuarioSemSenha } = usuario;
        localStorage.setItem('currentUser', JSON.stringify(usuarioSemSenha));
        return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function isLoggedIn() {
    return !!localStorage.getItem('currentUser');
}

function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

async function registrarUsuario(email, senha, nome, papel = 'colaborador') {
    const usuarios = await window.loadFromServer('users') || [];
    const usuarioAtual = getCurrentUser();
    
    if (usuarios.some(u => u.email === email)) {
        return { sucesso: false, mensagem: 'Email já cadastrado' };
    }
    
    const novoUsuario = {
        email,
        senha: btoa(senha),
        nome,
        papel,
        status: 'ativo',
        historico: [
            {
                data: new Date().toLocaleString('pt-BR'),
                acao: `Usuário criado com papel ${papel}`,
                por: usuarioAtual.email
            }
        ]
    };
    
    usuarios.push(novoUsuario);
    await window.saveToServer('users', usuarios);
    return { sucesso: true, mensagem: 'Usuário criado com sucesso' };
}

async function editarUsuario(email, atualizacoes) {
    const usuarios = await window.loadFromServer('users') || [];
    const usuarioAtual = getCurrentUser();
    const indiceUsuario = usuarios.findIndex(u => u.email === email);
    
    if (indiceUsuario === -1) {
        return { sucesso: false, mensagem: 'Usuário não encontrado' };
    }
    
    const usuario = usuarios[indiceUsuario];

    if (email === 'master@icmbio.com') {
        return { sucesso: false, mensagem: 'O usuário master não pode ser editado' };
    }
    
    const valoresAntigos = { ...usuario };
    
    if (atualizacoes.nome) usuario.nome = atualizacoes.nome;
    if (atualizacoes.papel) usuario.papel = atualizacoes.papel;
    if (atualizacoes.senha) usuario.senha = btoa(atualizacoes.senha);
    
    usuario.historico.push({
        data: new Date().toLocaleString('pt-BR'),
        acao: `Usuário editado por ${usuarioAtual.email}`,
        por: usuarioAtual.email,
        alteracoes: Object.entries(atualizacoes)
            .filter(([chave]) => chave !== 'senha')
            .map(([chave, valor]) => {
                const nomeCampo = chave === 'nome' ? 'nome' : 
                                chave === 'papel' ? 'papel' : chave;
                return `${nomeCampo}: ${valoresAntigos[chave]} -> ${valor}`;
            })
            .join(', ')
    });
    
    await window.saveToServer('users', usuarios);

    if (usuarioAtual.email === email) {
        const { senha, ...usuarioSemSenha } = usuario;
        localStorage.setItem('currentUser', JSON.stringify(usuarioSemSenha));
        updateAuthUI();
    }

    return { sucesso: true, mensagem: 'Usuário atualizado com sucesso' };
}

async function alternarStatus(email) {
    const usuarios = await window.loadFromServer('users') || [];
    const usuarioAtual = getCurrentUser();
    const indiceUsuario = usuarios.findIndex(u => u.email === email);
    
    if (indiceUsuario === -1) {
        return { sucesso: false, mensagem: 'Usuário não encontrado' };
    }
    
    const usuario = usuarios[indiceUsuario];

    if (email === 'master@icmbio.com') {
        return { sucesso: false, mensagem: 'O usuário master não pode ser inativado' };
    }

    if (email === usuarioAtual.email) {
        return { sucesso: false, mensagem: 'Você não pode inativar sua própria conta' };
    }
    
    const novoStatus = usuario.status === 'ativo' ? 'inativo' : 'ativo';
    usuario.status = novoStatus;
    
    usuario.historico.push({
        data: new Date().toLocaleString('pt-BR'),
        acao: `Status alterado para ${novoStatus}`,
        por: usuarioAtual.email
    });
    
    await window.saveToServer('users', usuarios);
    return { sucesso: true, mensagem: `Usuário ${novoStatus === 'ativo' ? 'ativado' : 'inativado'} com sucesso` };
}

async function listarUsuarios() {
    const usuarios = await window.loadFromServer('users') || [];
    return usuarios.map(({ senha, ...usuario }) => usuario);
}

function updateAuthUI() {
    const loginButton = document.getElementById('auth-button');
    const dropdownContent = document.getElementById('dropdown-content');
    
    if (!loginButton || !dropdownContent) {
        setTimeout(updateAuthUI, 100);
        return;
    }
    
    if (isLoggedIn()) {
        const user = getCurrentUser();
        updateAuthButton(user);
        setupDropdownListeners();
    } else {
        updateAuthButton(null);
    }
}

function updateAuthButton(user) {
    const authButton = document.getElementById('auth-button');
    const dropdownContent = document.getElementById('dropdown-content');

    if (!authButton || !dropdownContent) return;

    if (user) {
        authButton.innerHTML = `
            <div class="flex items-center space-x-2">
                <span class="text-sm font-medium text-gray-700">${user.nome}</span>
                <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </div>
        `;
        authButton.classList.remove('bg-primary', 'hover:bg-dark', 'text-white');
        authButton.classList.add('bg-white', 'hover:bg-gray-50', 'text-gray-700', 'border', 'border-gray-200');
        authButton.href = '#';

        dropdownContent.innerHTML = `
            <div class="py-1">
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">${user.nome}</a>
            </div>
            ${user.papel === 'admin' ? `
            <div class="py-1">
                <a href="admin.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin</a>
            </div>
            ` : ''}
            <div class="py-1">
                <a href="#" onclick="logout(); return false;" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sair</a>
            </div>
        `;
    } else {
        authButton.innerHTML = '<span>LOGIN</span>';
        authButton.classList.remove('bg-white', 'hover:bg-gray-50', 'text-gray-700', 'border', 'border-gray-200');
        authButton.classList.add('bg-primary', 'hover:bg-dark');
        authButton.href = 'login.html';
        dropdownContent.innerHTML = '';
    }
}

function setupDropdownListeners() {
    const authButton = document.getElementById('auth-button');
    const dropdownContent = document.getElementById('dropdown-content');

    if (!authButton || !dropdownContent) return;

    const newAuthButton = authButton.cloneNode(true);
    authButton.parentNode.replaceChild(newAuthButton, authButton);

    if (isLoggedIn()) {
        newAuthButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropdownContent.classList.toggle('hidden');
        });

        document.addEventListener('click', function(e) {
            if (!dropdownContent.contains(e.target) && !newAuthButton.contains(e.target)) {
                dropdownContent.classList.add('hidden');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    
    await inicializarUsuarios();
    
    updateAuthUI();
    
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                const authButton = document.getElementById('auth-button');
                const dropdownContent = document.getElementById('dropdown-content');
                if (authButton && dropdownContent) {
                    updateAuthUI();
                    observer.disconnect();
                }
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}); 