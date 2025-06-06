// Importa as funções do arquivo auth.js
const auth = require('../js/auth.js');

describe('Testes de funcionalidades de Usuário', () => {
    beforeEach(() => {
        // Limpa os mocks antes de cada teste
        localStorage.clear();
        jest.clearAllMocks();

        // Mock do usuário atual
        const usuarioAtual = {
            email: 'admin@teste.com',
            papel: 'admin'
        };

        // Mock do window.loadFromServer
        window.loadFromServer = jest.fn().mockReturnValue([]);
        window.saveToServer = jest.fn();

        // Mock do localStorage.getItem
        localStorage.getItem.mockImplementation((key) => {
            if (key === 'currentUser') {
                return JSON.stringify(usuarioAtual);
            }
            return null;
        });

        // Configura o usuário atual
        localStorage.setItem('currentUser', JSON.stringify(usuarioAtual));
    });

    test('Deve adicionar um novo usuário', async () => {
        const novoUsuario = {
            email: 'teste@teste.com',
            senha: 'senha123',
            nome: 'Usuário Teste',
            papel: 'colaborador'
        };

        // Executa a função de adicionar usuário
        await auth.registrarUsuario(novoUsuario.email, novoUsuario.senha, novoUsuario.nome, novoUsuario.papel);

        // Verifica se o usuário foi adicionado corretamente
        expect(window.saveToServer).toHaveBeenCalledWith('users', expect.arrayContaining([
            expect.objectContaining({
                email: novoUsuario.email,
                nome: novoUsuario.nome,
                papel: novoUsuario.papel
            })
        ]));
    });

    test('Deve editar um usuário existente', async () => {
        const usuarioExistente = {
            id: 1,
            email: 'teste@teste.com',
            nome: 'Usuário Original',
            papel: 'colaborador',
            status: 'ativo',
            historico: []
        };

        // Mock dos dados iniciais
        window.loadFromServer.mockReturnValue([usuarioExistente]);

        const dadosEdicao = {
            nome: 'Usuário Editado',
            papel: 'coordenador'
        };

        // Executa a função de editar usuário
        await auth.editarUsuario(usuarioExistente.email, dadosEdicao);

        // Verifica se o usuário foi editado corretamente
        expect(window.saveToServer).toHaveBeenCalledWith('users', expect.arrayContaining([
            expect.objectContaining({
                email: usuarioExistente.email,
                nome: dadosEdicao.nome,
                papel: dadosEdicao.papel
            })
        ]));
    });

    test('Deve inativar um usuário existente', async () => {
        const usuarioExistente = {
            id: 1,
            email: 'teste@teste.com',
            nome: 'Usuário Teste',
            papel: 'colaborador',
            status: 'ativo',
            historico: []
        };

        // Mock dos dados iniciais
        window.loadFromServer.mockReturnValue([usuarioExistente]);

        // Executa a função de inativar usuário
        await auth.alternarStatus(usuarioExistente.email);

        // Verifica se o status foi alterado corretamente
        expect(window.saveToServer).toHaveBeenCalledWith('users', expect.arrayContaining([
            expect.objectContaining({
                email: usuarioExistente.email,
                status: 'inativo'
            })
        ]));
    });

    test('Não deve permitir inativar um usuário master', async () => {
        const usuarioMaster = {
            id: 1,
            email: 'master@icmbio.com',
            nome: 'Master',
            papel: 'admin',
            status: 'ativo',
            historico: []
        };

        // Mock dos dados iniciais
        window.loadFromServer.mockReturnValue([usuarioMaster]);

        // Executa a função de inativar usuário
        const resultado = await auth.alternarStatus(usuarioMaster.email);

        // Verifica se a operação foi negada
        expect(resultado.sucesso).toBe(false);
        expect(resultado.mensagem).toBe('O usuário master não pode ser inativado');
    });
}); 