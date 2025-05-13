const usuariosIniciais = [
    {
        id: 1,
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
    },
    {
        id: 2,
        nome: "Coordenador",
        email: "coordenador@email.com",
        senha: btoa("coord123"),
        papel: "coordenador",
        status: "ativo",
        historico: [
            {
                data: new Date().toLocaleString('pt-BR'),
                acao: 'Usuário criado',
                por: 'sistema'
            }
        ]
    },
    {
        id: 3,
        nome: "Articulador",
        email: "articulador@email.com",
        senha: btoa("art123"),
        papel: "articulador",
        status: "ativo",
        historico: [
            {
                data: new Date().toLocaleString('pt-BR'),
                acao: 'Usuário criado',
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
    return new Promise((resolve) => {
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
            resolve(true);
        } else {
            localStorage.removeItem('currentUser');
            resolve(false);
        }
    });
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
        id: usuarios.length + 1,
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
                <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span class="text-sm font-medium text-gray-700">${user.nome}</span>
                <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </div>
        `;
        authButton.classList.remove('bg-[var(--color-primary)]', 'hover:bg-[var(--color-dark-green)]', 'text-white');
        authButton.classList.add('bg-white', 'hover:bg-gray-50', 'text-gray-700', 'border', 'border-gray-200');
        authButton.href = '#';

        dropdownContent.innerHTML = `
            <div class="py-1">
                <a href="#" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    ${user.nome}
                </a>
            </div>
            ${user.papel === 'admin' ? `
            <div class="py-1">
                <a href="admin.html" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Admin
                </a>
            </div>
            ` : ''}
            <div class="py-1">
                <a href="#" onclick="logout(); return false;" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sair
                </a>
            </div>
        `;
    } else {
        authButton.innerHTML = `
            <div class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span class="text-sm">Entrar</span>
            </div>
        `;
        authButton.classList.remove('bg-white', 'hover:bg-gray-50', 'text-gray-700', 'border', 'border-gray-200');
        authButton.classList.add('bg-[var(--color-primary)]', 'hover:bg-[var(--color-dark-green)]', 'text-white');
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

function isUserAdmin() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser?.papel === PAPEIS.ADMIN;
}

function isUserCoordinator() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser?.papel === PAPEIS.COORDENADOR;
}

function isPanCoordinator(panId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const pans = window.loadFromServer('pans');
    const pan = pans.find(p => p.id === panId);
    return pan?.coordenador?.includes(currentUser?.id);
}

function canEditPan(panId) {
    return isUserAdmin() || isPanCoordinator(panId);
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