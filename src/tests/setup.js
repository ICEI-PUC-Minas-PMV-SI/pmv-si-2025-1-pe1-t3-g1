// Mock do localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
};

// Configura o localStorage no objeto window
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true
});

// Mock do window.loadFromServer e window.saveToServer
window.loadFromServer = jest.fn();
window.saveToServer = jest.fn();

// Mock do window.formatCurrency
window.formatCurrency = jest.fn(value => value);

// Mock do window.formatCEP
window.formatCEP = jest.fn(value => value);

// Mock do window.getStatusClass
window.getStatusClass = jest.fn(() => '');

// Mock do window.getStatusIcon
window.getStatusIcon = jest.fn(() => '');

// Mock do window.getProgressColor
window.getProgressColor = jest.fn(() => '');

// Mock do window.carregarMapa
window.carregarMapa = jest.fn();

// Mock do document
document.createElement = jest.fn((tag) => {
    return {
        setAttribute: jest.fn(),
        appendChild: jest.fn(),
        querySelector: jest.fn(),
        querySelectorAll: jest.fn(() => []),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        classList: {
            add: jest.fn(),
            remove: jest.fn(),
            toggle: jest.fn(),
            contains: jest.fn()
        }
    };
});

document.querySelector = jest.fn();
document.querySelectorAll = jest.fn(() => []);
document.getElementById = jest.fn();
document.dispatchEvent = jest.fn();

// Mock do window
global.window = {
    location: {
        href: '',
        replace: jest.fn()
    },
    loadFromServer: jest.fn(),
    saveToServer: jest.fn()
};

// Limpa todos os mocks antes de cada teste
beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
}); 