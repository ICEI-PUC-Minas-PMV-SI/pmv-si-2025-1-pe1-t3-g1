(function(window) {
    window.loadFromServer = function(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    };

    window.saveToServer = function(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    };
})(window); 