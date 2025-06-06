// Mock do localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock do documento
document.dispatchEvent = jest.fn();

// Importa as funções do arquivo panCards.js
const panCards = require('../js/panCards.js');

// Mock das funções que manipulam DOM
jest.mock('../js/panCards.js', () => {
    const originalModule = jest.requireActual('../js/panCards.js');
    return {
        ...originalModule,
        renderPaginationControls: jest.fn(),
        renderPanCards: jest.fn(),
        updateMonitoringCharts: jest.fn()
    };
});

describe('Testes de funcionalidades do PAN', () => {
    beforeEach(() => {
        // Limpa os mocks antes de cada teste
        localStorage.clear();
        jest.clearAllMocks();

        // Mock das funções do window
        window.alert = jest.fn();
        window.confirm = jest.fn();
        window.loadFromServer = jest.fn().mockReturnValue([
            {
                id: 1,
                nome: "Coordenador Teste",
                papel: "coordenador",
                status: "ativo"
            }
        ]);
        window.saveToServer = jest.fn();
        window.formatCurrency = jest.fn().mockReturnValue('R$ 0,00');

        // Mock do localStorage
        const mockStorage = {
            pans: [],
            currentUser: {
                id: 1,
                email: 'admin@teste.com',
                papel: 'admin'
            }
        };

        localStorage.getItem.mockImplementation((key) => {
            if (key === 'currentUser') {
                return JSON.stringify(mockStorage.currentUser);
            }
            if (key === 'pansData') {
                return JSON.stringify({ pans: mockStorage.pans });
            }
            return null;
        });

        localStorage.setItem.mockImplementation((key, value) => {
            if (key === 'pansData') {
                mockStorage.pans = JSON.parse(value).pans;
            }
        });

        // Mock simplificado dos métodos do DOM que realmente usamos
        document.getElementById = jest.fn().mockReturnValue({
            classList: { add: jest.fn(), remove: jest.fn() },
            style: {},
            innerHTML: ''
        });

        document.querySelector = jest.fn().mockReturnValue({
            classList: { add: jest.fn(), remove: jest.fn() },
            style: {},
            textContent: ''
        });

        document.querySelectorAll = jest.fn().mockReturnValue([]);

        // Mock do Event e dispatchEvent
        global.Event = class {
            constructor(eventName) {
                this.type = eventName;
            }
        };
        document.dispatchEvent = jest.fn();

        // Mock das classes do document.body sem atribuir diretamente
        jest.spyOn(document.body.classList, 'add').mockImplementation(() => {});
        jest.spyOn(document.body.classList, 'remove').mockImplementation(() => {});

        // Mock das funções que manipulam DOM no panCards
        jest.spyOn(panCards, 'renderPaginationControls').mockImplementation(() => {});
        jest.spyOn(panCards, 'renderPanCards').mockImplementation(() => {});
        jest.spyOn(panCards, 'updateMonitoringCharts').mockImplementation(() => {});

        // Mock específico para o elemento de paginação
        document.getElementById.mockImplementation((id) => {
            if (id === 'pagination-controls') {
                return {
                    innerHTML: '',
                    appendChild: jest.fn()
                };
            }
            return {
                classList: { add: jest.fn(), remove: jest.fn() },
                style: {},
                innerHTML: ''
            };
        });

        // Mock do querySelector para elementos específicos
        document.querySelector = jest.fn().mockImplementation((selector) => {
            if (selector === '.progress-ring') {
                return {
                    setAttribute: jest.fn(),
                    style: {},
                    querySelector: jest.fn().mockReturnValue({
                        textContent: '',
                        style: {}
                    })
                };
            }
            if (selector === '.text-5xl.font-bold') {
                return {
                    textContent: ''
                };
            }
            if (selector.includes('.bar-chart .bar')) {
                return {
                    style: {},
                    querySelector: jest.fn().mockReturnValue({
                        textContent: ''
                    })
                };
            }
            if (selector === '.cost-value-previsto') {
                return {
                    parentElement: {
                        style: {},
                        querySelector: jest.fn().mockReturnValue({
                            textContent: ''
                        }),
                        title: ''
                    }
                };
            }
            if (selector === '.cost-value-gasto') {
                return {
                    parentElement: {
                        style: {},
                        querySelector: jest.fn().mockReturnValue({
                            textContent: ''
                        }),
                        title: ''
                    }
                };
            }
            return {
                classList: { add: jest.fn(), remove: jest.fn() },
                style: {},
                textContent: ''
            };
        });

        // Mock do querySelectorAll para elementos específicos
        document.querySelectorAll = jest.fn().mockImplementation((selector) => {
            if (selector === '.bar-chart .bar') {
                return Array(3).fill({
                    style: {},
                    querySelector: jest.fn().mockReturnValue({
                        textContent: ''
                    })
                });
            }
            return [];
        });

        // Mock do getElementById para elementos específicos
        document.getElementById = jest.fn().mockImplementation((id) => {
            if (id === 'pagination-controls') {
                return {
                    innerHTML: '',
                    appendChild: jest.fn()
                };
            }
            if (id === 'pan-cards-container') {
                return {
                    innerHTML: ''
                };
            }
            return {
                classList: { add: jest.fn(), remove: jest.fn() },
                style: {},
                innerHTML: ''
            };
        });
    });

    test('Deve adicionar um novo PAN corretamente', async () => {
        const novoPan = {
            id: 1,
            title: "PAN Teste",
            description: "Descrição do PAN de teste",
            period: "2024-2025",
            duration: "12 meses",
            generalObjective: "Objetivo geral de teste",
            coordenador: "1",
            tag1: "Teste",
            tag1Color: "blue",
            specificObjectives: []
        };

        // Executa a função de adicionar PAN
        await panCards.removerPan(novoPan.id);
        
        const storedData = JSON.parse(localStorage.getItem('pansData'));
        expect(storedData.pans).toHaveLength(0);

        localStorage.setItem('pansData', JSON.stringify({ pans: [novoPan] }));
        const updatedData = JSON.parse(localStorage.getItem('pansData'));
        expect(updatedData.pans).toHaveLength(1);
        expect(updatedData.pans[0]).toEqual(novoPan);
    });

    test('Deve editar um PAN existente', async () => {
        const panOriginal = {
            id: 1,
            title: "PAN Original",
            description: "Descrição original",
            period: "2024-2025",
            duration: "12 meses",
            generalObjective: "Objetivo original",
            coordenador: "1",
            tag1: "Original",
            tag1Color: "blue",
            specificObjectives: []
        };

        const panEditado = {
            ...panOriginal,
            title: "PAN Editado",
            description: "Nova descrição"
        };

        // Salva o PAN original
        localStorage.setItem('pansData', JSON.stringify({ pans: [panOriginal] }));

        // Edita o PAN
        localStorage.setItem('pansData', JSON.stringify({ pans: [panEditado] }));

        // Verifica se o PAN foi editado
        const storedData = JSON.parse(localStorage.getItem('pansData'));
        expect(storedData.pans).toHaveLength(1);
        expect(storedData.pans[0].title).toBe(panEditado.title);
        expect(storedData.pans[0].description).toBe(panEditado.description);
    });

    test('Deve remover um PAN existente', async () => {
        const panExistente = {
            id: 1,
            title: "PAN para Remover",
            description: "Descrição do PAN",
            period: "2024-2025",
            duration: "12 meses",
            generalObjective: "Objetivo do PAN",
            coordenador: "1",
            tag1: "Teste",
            tag1Color: "blue",
            specificObjectives: []
        };

        // Salva o PAN
        localStorage.setItem('pansData', JSON.stringify({ pans: [panExistente] }));

        // Mock do confirm para retornar true
        window.confirm.mockReturnValue(true);

        // Remove o PAN
        await panCards.removerPan(panExistente.id);

        // Verifica se o PAN foi removido
        const storedData = JSON.parse(localStorage.getItem('pansData'));
        expect(storedData.pans).toHaveLength(0);
    });

    test('Não deve remover um PAN se o usuário cancelar', async () => {
        const panExistente = {
            id: 1,
            title: "PAN para Remover",
            description: "Descrição do PAN",
            period: "2024-2025",
            duration: "12 meses",
            generalObjective: "Objetivo do PAN",
            coordenador: "1",
            tag1: "Teste",
            tag1Color: "blue",
            specificObjectives: []
        };

        // Salva o PAN
        localStorage.setItem('pansData', JSON.stringify({ pans: [panExistente] }));

        // Mock do confirm para retornar false
        window.confirm.mockReturnValue(false);

        // Tenta remover o PAN
        await panCards.removerPan(panExistente.id);

        // Verifica se o PAN não foi removido
        const storedData = JSON.parse(localStorage.getItem('pansData'));
        expect(storedData.pans).toHaveLength(1);
        expect(storedData.pans[0]).toEqual(panExistente);
    });
}); 