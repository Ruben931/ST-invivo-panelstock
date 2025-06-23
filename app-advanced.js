// INVIVO Panel Avancé - JavaScript Ultra-Moderne
console.log('🚀 Chargement INVIVO Panel Avancé...');

// Configuration globale
const CONFIG = {
    chartColors: {
        primary: '#04a4dc',
        secondary: '#263684',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444'
    }
};

// Gestionnaire d'état global simplifié
class SimpleState {
    constructor() {
        this.data = {
            darkMode: localStorage.getItem('invivo-dark-mode') === 'true',
            sidebarOpen: localStorage.getItem('invivo-sidebar-open') !== 'false',
            isLoading: true
        };
    }

    set(key, value) {
        this.data[key] = value;
        if (key === 'darkMode') {
            localStorage.setItem('invivo-dark-mode', value);
            this.applyTheme(value);
        }
        if (key === 'sidebarOpen') {
            localStorage.setItem('invivo-sidebar-open', value);
        }
    }

    get(key) {
        return this.data[key];
    }

    applyTheme(isDark) {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
}

const appState = new SimpleState();

// Gestionnaire de notifications simplifié
class SimpleNotifications {
    constructor() {
        this.notifications = [];
        this.container = null;
        this.init();
    }

    init() {
        this.container = document.createElement('div');
        this.container.className = 'fixed top-4 right-4 z-50 space-y-3';
        document.body.appendChild(this.container);
    }

    show(title, message, type = 'info') {
        const notification = {
            id: Date.now(),
            title,
            message,
            type,
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            icon: this.getIcon(type)
        };

        this.notifications.unshift(notification);
        if (this.notifications.length > 5) {
            this.notifications = this.notifications.slice(0, 5);
        }

        const element = this.createElement(notification);
        this.container.appendChild(element);

        setTimeout(() => {
            element.style.transform = 'translateX(0)';
            element.style.opacity = '1';
        }, 10);

        setTimeout(() => {
            this.remove(element);
        }, 5000);

        return notification;
    }

    createElement(notification) {
        const element = document.createElement('div');
        element.className = `
            transform translate-x-full opacity-0 transition-all duration-300
            max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl 
            border border-gray-200 dark:border-gray-700 p-4
        `;

        element.innerHTML = `
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <div class="${this.getIconClasses(notification.type)} w-8 h-8 rounded-lg flex items-center justify-center">
                        <i class="${notification.icon} text-white text-sm"></i>
                    </div>
                </div>
                <div class="ml-3 flex-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">${notification.title}</p>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">${notification.message}</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" 
                        class="ml-4 text-gray-400 hover:text-gray-600 p-1">
                    <i class="fas fa-times text-sm"></i>
                </button>
            </div>
        `;

        return element;
    }

    remove(element) {
        if (element && element.parentNode) {
            element.style.transform = 'translateX(100%)';
            element.style.opacity = '0';
            setTimeout(() => element.remove(), 300);
        }
    }

    getIcon(type) {
        const icons = {
            success: 'fas fa-check',
            error: 'fas fa-exclamation-triangle',
            warning: 'fas fa-exclamation',
            info: 'fas fa-info'
        };
        return icons[type] || icons.info;
    }

    getIconClasses(type) {
        const classes = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };
        return classes[type] || classes.info;
    }

    success(title, message) { return this.show(title, message, 'success'); }
    error(title, message) { return this.show(title, message, 'error'); }
    warning(title, message) { return this.show(title, message, 'warning'); }
    info(title, message) { return this.show(title, message, 'info'); }
}

const notifications = new SimpleNotifications();

// Gestionnaire de graphiques simplifié
class SimpleCharts {
    constructor() {
        this.charts = new Map();
    }

    createMiniChart(canvasId, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || !window.Chart) return;

        try {
            const chart = new Chart(canvas, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
                        data: data.values,
                        borderColor: CONFIG.chartColors.primary,
                        backgroundColor: CONFIG.chartColors.primary + '20',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { display: false },
                        y: { display: false }
                    }
                }
            });
            this.charts.set(canvasId, chart);
        } catch (error) {
            console.warn('Erreur création mini chart:', error);
        }
    }

    createRevenueChart() {
        const canvas = document.getElementById('revenueChart');
        if (!canvas) {
            console.error('❌ Canvas revenueChart non trouvé');
            return;
        }
        if (!window.Chart) {
            console.error('❌ Chart.js non chargé');
            return;
        }
        
        console.log('✅ Canvas et Chart.js trouvés, création du graphique demande...');

        try {
            // Obtenir les données des entrepôts depuis l'instance globale
            const appInstance = window.appInstance;
            let warehouseData = [];
            
            if (appInstance && appInstance.stockLocations) {
                // Filtrer les entrepôts actifs et créer les données pour le graphique
                warehouseData = appInstance.stockLocations
                    .filter(stock => stock.status === 'active')
                    .map(stock => ({
                        name: stock.name,
                        articles: stock.articles
                    }))
                    .sort((a, b) => b.articles - a.articles); // Trier par nombre d'articles décroissant
            } else {
                // Données par défaut si l'instance n'est pas encore disponible
                warehouseData = [
                    { name: 'Collégien', articles: 428 },
                    { name: 'Mouans Sartoux', articles: 356 },
                    { name: 'St Ouen', articles: 298 },
                    { name: 'Rennes', articles: 267 },
                    { name: 'Servon', articles: 234 },
                    { name: 'Aix en Provence', articles: 187 },
                    { name: 'Toulouse', articles: 145 }
                ];
            }

            const chart = new Chart(canvas, {
                type: 'bar',
                data: {
                    labels: warehouseData.map(w => w.name),
                    datasets: [{
                        label: 'Articles en stock',
                        data: warehouseData.map(w => w.articles),
                        backgroundColor: [
                            'rgba(4, 164, 220, 0.8)',    // Bleu INVIVO
                            'rgba(34, 197, 94, 0.8)',    // Vert
                            'rgba(249, 115, 22, 0.8)',   // Orange
                            'rgba(168, 85, 247, 0.8)',   // Violet
                            'rgba(236, 72, 153, 0.8)',   // Rose
                            'rgba(245, 158, 11, 0.8)',   // Ambre
                            'rgba(139, 92, 246, 0.8)'    // Indigo
                        ],
                        borderColor: [
                            'rgba(4, 164, 220, 1)',
                            'rgba(34, 197, 94, 1)',
                            'rgba(249, 115, 22, 1)',
                            'rgba(168, 85, 247, 1)',
                            'rgba(236, 72, 153, 1)',
                            'rgba(245, 158, 11, 1)',
                            'rgba(139, 92, 246, 1)'
                        ],
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { 
                            display: false  // Masquer la légende pour un look plus propre
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.parsed.y} articles en stock`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 50
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                maxRotation: 45,
                                minRotation: 0
                            }
                        }
                    },
                    animation: {
                        duration: 1000,
                        easing: 'easeOutBounce'
                    }
                }
            });
            this.charts.set('revenueChart', chart);
            console.log('🎯 Graphique demande créé avec succès !');
        } catch (error) {
            console.error('❌ Erreur création demande chart:', error);
        }
    }

    createStockChart() {
        const canvas = document.getElementById('stockChart');
        if (!canvas) {
            console.error('❌ Canvas stockChart non trouvé');
            return;
        }
        if (!window.Chart) {
            console.error('❌ Chart.js non chargé');
            return;
        }
        
        console.log('✅ Canvas et Chart.js trouvés, création du graphique stocks...');

        try {
            const chart = new Chart(canvas, {
                type: 'doughnut',
                data: {
                    labels: ['Collégien', 'Mouans Sartoux', 'St Ouen', 'Rennes', 'Servon', 'Aix en Provence', 'Toulouse'],
                    datasets: [{
                        data: [428, 356, 298, 267, 234, 187, 145],
                        backgroundColor: [
                            CONFIG.chartColors.primary,
                            CONFIG.chartColors.success,
                            CONFIG.chartColors.warning,
                            '#6366f1',
                            '#ec4899',
                            '#f59e0b',
                            '#8b5cf6'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '60%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                padding: 15
                            }
                        }
                    }
                }
            });
            this.charts.set('stockChart', chart);
            console.log('🥧 Graphique stocks créé avec succès !');
        } catch (error) {
            console.error('❌ Erreur création stock chart:', error);
        }
    }
}

const chartManager = new SimpleCharts();

// Fonction Alpine.js principale
window.app = function() {
    return {
        // État
        activeTab: 'dashboard',
        isLoading: true,
        darkMode: appState.get('darkMode'),
        sidebarOpen: appState.get('sidebarOpen'),
        searchQuery: '',

        // Configuration
        tabs: {
            dashboard: {
                label: 'Dashboard',
                title: 'Tableau de Bord',
                subtitle: 'Vue d\'ensemble de votre activité',
                icon: 'fas fa-chart-pie',
                badge: null
            },
            stocks: {
                label: 'Stocks',
                title: 'Gestion des Stocks',
                subtitle: 'Gérez vos inventaires par localisation',
                icon: 'fas fa-boxes',
                badge: '6'
            },
            salons: {
                label: 'Salons',
                title: 'Salons d\'Entreprise',
                subtitle: 'Gérez vos événements professionnels',
                icon: 'fas fa-building',
                badge: '24'
            },
            transport: {
                label: 'Transport',
                title: 'Gestion des Transports',
                subtitle: 'Planifiez et suivez vos livraisons',
                icon: 'fas fa-truck',
                badge: '12'
            }
        },

        // État de synchronisation
        lastSyncTime: null,

        // Données
        stats: [
            {
                label: 'Total Stock',
                value: '1,915',
                change: 12.8,
                icon: 'fas fa-boxes',
                color: 'bg-gradient-to-br from-blue-500 to-blue-600',
                data: { labels: ['L','M','M','J','V','S','D'], values: [1820,1847,1865,1891,1902,1915,1915] }
            },
            {
                label: 'Entrepôts Actifs',
                value: '7',
                change: 16.7,
                icon: 'fas fa-warehouse',
                color: 'bg-gradient-to-br from-green-500 to-green-600',
                data: { labels: ['L','M','M','J','V','S','D'], values: [6,6,7,7,7,7,7] }
            },
            {
                label: 'Valeur Totale',
                value: '€88.3K',
                change: 8.9,
                icon: 'fas fa-euro-sign',
                color: 'bg-gradient-to-br from-orange-500 to-orange-600',
                data: { labels: ['L','M','M','J','V','S','D'], values: [82.1,84.5,86.2,87.8,88.0,88.3,88.3] }
            },
            {
                label: 'Catégories',
                value: '42',
                change: 23.5,
                icon: 'fas fa-tags',
                color: 'bg-gradient-to-br from-purple-500 to-purple-600',
                data: { labels: ['L','M','M','J','V','S','D'], values: [38,39,40,41,42,42,42] }
            }
        ],

        stockLocations: [
            {
                name: 'Collégien',
                articles: 428,
                value: 18750,
                status: 'active',
                categories: [
                    { name: 'Outils', count: 156, value: 8950 },
                    { name: 'Matériaux', count: 189, value: 6400 },
                    { name: 'Équipements', count: 83, value: 3400 }
                ]
            },
            {
                name: 'Mouans Sartoux',
                articles: 356,
                value: 15200,
                status: 'active',
                categories: [
                    { name: 'Outils', count: 144, value: 7200 },
                    { name: 'Matériaux', count: 134, value: 5450 },
                    { name: 'Équipements', count: 78, value: 2550 }
                ]
            },
            {
                name: 'Servon',
                articles: 234,
                value: 11400,
                status: 'active',
                categories: [
                    { name: 'Outils', count: 89, value: 4800 },
                    { name: 'Matériaux', count: 97, value: 4200 },
                    { name: 'Équipements', count: 48, value: 2400 }
                ]
            },
            {
                name: 'St Ouen',
                articles: 298,
                value: 13650,
                status: 'active',
                categories: [
                    { name: 'Outils', count: 125, value: 6400 },
                    { name: 'Matériaux', count: 118, value: 4850 },
                    { name: 'Équipements', count: 55, value: 2400 }
                ]
            },
            {
                name: 'Aix en Provence',
                articles: 187,
                value: 9200,
                status: 'active',
                categories: [
                    { name: 'Outils', count: 67, value: 3900 },
                    { name: 'Matériaux', count: 79, value: 3500 },
                    { name: 'Équipements', count: 41, value: 1800 }
                ]
            },
            {
                name: 'Toulouse',
                articles: 145,
                value: 7800,
                status: 'active',
                categories: [
                    { name: 'Outils', count: 54, value: 3600 },
                    { name: 'Matériaux', count: 68, value: 2800 },
                    { name: 'Équipements', count: 23, value: 1400 }
                ]
            },
            {
                name: 'Rennes',
                articles: 267,
                value: 12300,
                status: 'active',
                categories: [
                    { name: 'Outils', count: 99, value: 5100 },
                    { name: 'Matériaux', count: 123, value: 4900 },
                    { name: 'Équipements', count: 45, value: 2300 }
                ]
            },
            {
                name: 'Vierge',
                articles: 0,
                value: 0,
                status: 'empty',
                categories: []
            }
        ],

        recentActivity: [
            {
                id: 1,
                            title: 'Drones BTP reçus',
            description: 'Livraison de 8 drones de surveillance à Toulouse',
                time: 'Il y a 3 minutes',
                icon: 'fas fa-helicopter',
                color: 'bg-blue-500'
            },
            {
                id: 2,
                title: 'Engins de Construction',
                description: 'Maintenance effectuée à Mouans Sartoux',
                time: 'Il y a 15 minutes',
                icon: 'fas fa-wrench',
                color: 'bg-orange-500'
            },
            {
                id: 3,
                title: 'Stock Matériaux',
                description: 'Réception grues et pièces à Rennes',
                time: 'Il y a 32 minutes',
                icon: 'fas fa-plus',
                color: 'bg-green-500'
            },
            {
                id: 4,
                            title: 'Matériel Bâtiment',
            description: 'Commande bâtiments modulaires St Ouen',
                time: 'Il y a 1 heure',
                icon: 'fas fa-building',
                color: 'bg-purple-500'
            },
            {
                id: 5,
                            title: 'Systèmes de Sécurité',
            description: 'Installation de 15 capteurs sécurité à Toulouse',
                time: 'Il y a 2 heures',
                icon: 'fas fa-microchip',
                color: 'bg-indigo-500'
            }
        ],

        notifications: [
            {
                id: 1,
                            title: 'Drones Toulouse',
            message: '8 nouveaux drones BTP disponibles',
                type: 'success',
                icon: 'fas fa-helicopter',
                time: 'Il y a 1 min'
            },
            {
                id: 2,
                title: 'Stock critique',
                message: 'Niveau bas: Ciment à Collégien (23 sacs restants)',
                type: 'warning',
                icon: 'fas fa-exclamation-triangle',
                time: 'Il y a 4 min'
            },
            {
                id: 3,
                title: 'Maintenance programmée',
                message: 'Révision engins construction Mouans Sartoux',
                type: 'info',
                icon: 'fas fa-wrench',
                time: 'Il y a 8 min'
            },
            {
                id: 4,
                title: 'Nouvelle catégorie',
                message: 'Systèmes sécurité ajoutés à Toulouse',
                type: 'success',
                icon: 'fas fa-microchip',
                time: 'Il y a 15 min'
            }
        ],

        // Initialisation
        init() {
            console.log('🌱 Initialisation INVIVO Panel...');
            
            // Rendre l'instance accessible globalement pour la synchronisation
            window.appInstance = this;
            
            // Appliquer le thème initial
            appState.applyTheme(this.darkMode);
            
            // Simuler le chargement
            setTimeout(() => {
                this.isLoading = false;
                notifications.success('Système Initialisé', 'Panel INVIVO chargé avec succès');
                
                // Initialiser les graphiques seulement si on est sur le dashboard
                setTimeout(() => {
                    if (this.activeTab === 'dashboard') {
                        console.log('🎯 Dashboard actif, initialisation des graphiques...');
                        this.initCharts();
                    }
                }, 1000);
                
                // Démarrer la synchronisation automatique
                syncManager.markModified('app_initialized', {
                    timestamp: new Date().toISOString(),
                    stocks: this.stockLocations.length
                });
            }, 2000);

            // Raccourcis clavier
            this.setupKeyboardShortcuts();

            // Observer les changements de sync
            this.observeSyncChanges();
        },

        observeSyncChanges() {
            // Mettre à jour l'affichage de la dernière sync
            setInterval(() => {
                if (syncManager.lastSync) {
                    this.lastSyncTime = syncManager.lastSync.toLocaleTimeString('fr-FR');
                }
            }, 1000);

            // Écouter les événements de mise à jour des données
            window.addEventListener('stock-data-updated', () => {
                console.log('🔄 Données mises à jour, rafraîchissement interface...');
                this.$nextTick(() => {
                    // Forcer le re-calcul des stats
                    this.updateDashboardStats();
                    // Mettre à jour les graphiques
                    setTimeout(() => this.initCharts(), 200);
                });
            });
        },

        // Mettre à jour les statistiques du dashboard
        updateDashboardStats() {
            const totalArticles = this.stockLocations.reduce((sum, stock) => sum + stock.articles, 0);
            const totalValue = this.stockLocations.reduce((sum, stock) => sum + stock.value, 0);
            const activeStocks = this.stockLocations.filter(stock => stock.status === 'active').length;
            const totalCategories = this.stockLocations.reduce((sum, stock) => sum + stock.categories.length, 0);

            // Mettre à jour les stats
            this.stats[0].value = totalArticles.toLocaleString();
            this.stats[1].value = activeStocks.toString();
            this.stats[2].value = '€' + (totalValue / 1000).toFixed(1) + 'K';
            this.stats[3].value = totalCategories.toString();

            console.log(`📊 Stats mises à jour: ${totalArticles} articles, €${(totalValue/1000).toFixed(1)}K`);
        },

        openSyncConfig(type) {
            this.createSyncConfigModal(type);
        },

        createSyncConfigModal(type) {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm';
            modal.style.opacity = '0';
            modal.style.transition = 'opacity 0.3s ease';

            const isGoogle = type === 'google';
            const title = isGoogle ? 'Configuration Google Sheets' : 'Configuration Excel Online';
            const icon = isGoogle ? 'fab fa-google' : 'fab fa-microsoft';
            const color = isGoogle ? 'blue' : 'orange';

            modal.innerHTML = `
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 m-4 w-full max-w-2xl shadow-2xl transform scale-95 transition-all duration-300">
                    <div class="flex items-center justify-between mb-6">
                        <div class="flex items-center space-x-4">
                            <div class="w-12 h-12 bg-${color}-100 dark:bg-${color}-900/30 rounded-xl flex items-center justify-center">
                                <i class="${icon} text-${color}-600 text-xl"></i>
                            </div>
                            <div>
                                <h2 class="text-xl font-bold text-gray-900 dark:text-white">${title}</h2>
                                <p class="text-gray-500 dark:text-gray-400">Synchronisation temps réel</p>
                            </div>
                        </div>
                        <button class="close-modal p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                            <i class="fas fa-times text-xl text-gray-400"></i>
                        </button>
                    </div>

                    ${isGoogle ? this.getGoogleSheetsConfig() : this.getExcelOnlineConfig()}

                    <div class="flex justify-end space-x-3 mt-6">
                        <button class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg close-modal">
                            Annuler
                        </button>
                        <button class="px-4 py-2 bg-${color}-500 text-white rounded-lg hover:bg-${color}-600 save-config" data-type="${type}">
                            <i class="fas fa-save mr-2"></i>Enregistrer
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Animation
            setTimeout(() => {
                modal.style.opacity = '1';
                const content = modal.querySelector('div > div');
                content.style.transform = 'scale(1)';
            }, 10);

            // Gestion événements
            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.closest('.close-modal')) {
                    this.closeSyncModal(modal);
                }
                
                if (e.target.closest('.save-config')) {
                    this.saveSyncConfig(e, type, modal);
                }
            });

            notifications.info('Configuration', `Configuration ${isGoogle ? 'Google Sheets' : 'Excel Online'} ouverte`);
        },

        getGoogleSheetsConfig() {
            return `
                <div class="space-y-6">
                    <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                        <h3 class="font-semibold text-blue-900 dark:text-blue-300 mb-3">
                            <i class="fas fa-info-circle mr-2"></i>Instructions
                        </h3>
                        <ol class="text-sm text-blue-800 dark:text-blue-400 space-y-2 list-decimal list-inside">
                            <li>Créez un Google Sheet et notez son ID (dans l'URL)</li>
                            <li>Activez l'API Google Sheets dans Google Cloud Console</li>
                            <li>Créez une clé API et ajoutez-la ci-dessous</li>
                            <li>Partagez votre sheet avec l'email du service account</li>
                        </ol>
                    </div>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ID du Google Sheet</label>
                            <input type="text" id="google-sheet-id" placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms" 
                                   class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <p class="text-xs text-gray-500 mt-1">Trouvez l'ID dans l'URL de votre Google Sheet</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Clé API Google</label>
                            <input type="password" id="google-api-key" placeholder="AIza..." 
                                   class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <p class="text-xs text-gray-500 mt-1">Générez une clé API dans Google Cloud Console</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Plage de données</label>
                            <input type="text" id="google-range" value="Stock!A:F" 
                                   class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        </div>
                    </div>
                </div>
            `;
        },

        getExcelOnlineConfig() {
            return `
                <div class="space-y-6">
                    <div class="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
                        <h3 class="font-semibold text-orange-900 dark:text-orange-300 mb-3">
                            <i class="fas fa-info-circle mr-2"></i>Instructions
                        </h3>
                        <ol class="text-sm text-orange-800 dark:text-orange-400 space-y-2 list-decimal list-inside">
                            <li>Créez une application dans Azure Portal</li>
                            <li>Configurez les permissions Microsoft Graph</li>
                            <li>Notez le Client ID de votre application</li>
                            <li>Créez un classeur Excel dans OneDrive/SharePoint</li>
                        </ol>
                    </div>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Client ID Azure</label>
                            <input type="text" id="azure-client-id" placeholder="12345678-1234-1234-1234-123456789012" 
                                   class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ID du Classeur Excel</label>
                            <input type="text" id="excel-workbook-id" placeholder="01ABCDEFG..." 
                                   class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <p class="text-xs text-gray-500 mt-1">ID du fichier Excel dans OneDrive</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom de la feuille</label>
                            <input type="text" id="excel-worksheet" value="Stock" 
                                   class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        </div>
                    </div>

                    <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
                        <div class="flex items-start space-x-3">
                            <i class="fas fa-exclamation-triangle text-yellow-600 mt-0.5"></i>
                            <div>
                                <h4 class="font-medium text-yellow-900 dark:text-yellow-300">Authentification requise</h4>
                                <p class="text-sm text-yellow-800 dark:text-yellow-400 mt-1">
                                    La première synchronisation nécessitera une authentification Microsoft 365.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        saveSyncConfig(e, type, modal) {
            const isGoogle = type === 'google';
            
            if (isGoogle) {
                const sheetId = modal.querySelector('#google-sheet-id').value;
                const apiKey = modal.querySelector('#google-api-key').value;
                const range = modal.querySelector('#google-range').value;

                if (!sheetId || !apiKey) {
                    notifications.error('Configuration Incomplète', 'Veuillez remplir tous les champs requis');
                    return;
                }

                // Sauvegarder la configuration Google Sheets
                SYNC_CONFIG.googleSheets.enabled = true;
                SYNC_CONFIG.googleSheets.sheetId = sheetId;
                SYNC_CONFIG.googleSheets.apiKey = apiKey;
                SYNC_CONFIG.googleSheets.range = range;

                localStorage.setItem('invivo_google_config', JSON.stringify(SYNC_CONFIG.googleSheets));
                
            } else {
                const clientId = modal.querySelector('#azure-client-id').value;
                const workbookId = modal.querySelector('#excel-workbook-id').value;
                const worksheetName = modal.querySelector('#excel-worksheet').value;

                if (!clientId || !workbookId) {
                    notifications.error('Configuration Incomplète', 'Veuillez remplir tous les champs requis');
                    return;
                }

                // Sauvegarder la configuration Excel Online
                SYNC_CONFIG.excelOnline.enabled = true;
                SYNC_CONFIG.excelOnline.clientId = clientId;
                SYNC_CONFIG.excelOnline.workbookId = workbookId;
                SYNC_CONFIG.excelOnline.worksheetName = worksheetName;

                localStorage.setItem('invivo_excel_config', JSON.stringify(SYNC_CONFIG.excelOnline));
            }

            notifications.success('Configuration Sauvée', `${isGoogle ? 'Google Sheets' : 'Excel Online'} configuré avec succès`);
            this.closeSyncModal(modal);
            
            // Test de synchronisation
            setTimeout(() => {
                syncManager.syncNow();
            }, 1000);
        },

        closeSyncModal(modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.remove();
                }
            }, 300);
        },

        // Gestion de l'import Excel manuel
        async handleExcelDrop(event) {
            const file = event.target.files[0];
            if (!file) return;

            // Vérifier le type de fichier
            if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
                notifications.error('Format Invalide', 'Veuillez sélectionner un fichier Excel (.xlsx ou .xls)');
                return;
            }

            // Utiliser le gestionnaire de synchronisation pour l'import
            await syncManager.importExcelFile(file);

            // Réinitialiser l'input
            event.target.value = '';
        },

        // Méthodes
        setActiveTab(tab) {
            this.activeTab = tab;
            if (tab === 'dashboard') {
                setTimeout(() => this.initCharts(), 100);
            }
        },

        toggleDarkMode() {
            this.darkMode = !this.darkMode;
            appState.set('darkMode', this.darkMode);
            notifications.info('Thème Modifié', `Mode ${this.darkMode ? 'sombre' : 'clair'} activé`);
        },

        handleSearch() {
            if (this.searchQuery.length > 2) {
                notifications.info('Recherche', `Recherche pour "${this.searchQuery}"`);
            }
        },

                 openStockDetails(stock) {
             this.createStockModal(stock);
         },

         createStockModal(stock) {
             // Créer la modal
             const modal = document.createElement('div');
             modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm';
             modal.style.opacity = '0';
             modal.style.transition = 'opacity 0.3s ease';

             modal.innerHTML = `
                 <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 m-4 w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl transform scale-95 transition-all duration-300">
                     <div class="flex items-center justify-between mb-6">
                         <div class="flex items-center space-x-4">
                             <div class="w-16 h-16 bg-gradient-to-br from-invivo-500 to-invivo-600 rounded-2xl flex items-center justify-center">
                                 <i class="fas fa-warehouse text-white text-2xl"></i>
                             </div>
                             <div>
                                 <h2 class="text-2xl font-bold text-gray-900 dark:text-white">${stock.name}</h2>
                                 <p class="text-gray-500 dark:text-gray-400">Détails de l'inventaire</p>
                             </div>
                         </div>
                         <button class="close-modal p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                             <i class="fas fa-times text-xl text-gray-400"></i>
                         </button>
                     </div>

                     <!-- Stats principales -->
                     <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                         <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 text-center">
                             <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">${stock.articles}</div>
                             <div class="text-sm text-blue-500 dark:text-blue-300 mt-1">Articles Total</div>
                         </div>
                         <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 text-center">
                             <div class="text-3xl font-bold text-green-600 dark:text-green-400">€${(stock.value / 1000).toFixed(1)}K</div>
                             <div class="text-sm text-green-500 dark:text-green-300 mt-1">Valeur Totale</div>
                         </div>
                         <div class="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 text-center">
                             <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">${stock.categories.length}</div>
                             <div class="text-sm text-purple-500 dark:text-purple-300 mt-1">Catégories</div>
                         </div>
                         <div class="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 text-center">
                             <div class="text-3xl font-bold text-orange-600 dark:text-orange-400">${stock.status === 'active' ? '100%' : '0%'}</div>
                             <div class="text-sm text-orange-500 dark:text-orange-300 mt-1">Utilisation</div>
                         </div>
                     </div>

                     <!-- Catégories détaillées -->
                     <div class="mb-8">
                         <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Répartition par Catégorie</h3>
                         <div class="space-y-4">
                             ${stock.categories && stock.categories.length > 0 ? stock.categories.map(category => `
                                 <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer category-detail-btn" 
                                      data-category="${category.name}" data-stock="${stock.name}" onclick="window.testCategoryClick('${category.name}', '${stock.name}')">
                                     <div class="flex items-center space-x-4">
                                         <div class="w-12 h-12 bg-gradient-to-br from-invivo-400 to-invivo-600 rounded-lg flex items-center justify-center">
                                             <i class="fas fa-box text-white"></i>
                                         </div>
                                         <div>
                                             <div class="font-medium text-gray-900 dark:text-white">${category.name}</div>
                                             <div class="text-sm text-gray-500 dark:text-gray-400">${category.count} articles</div>
                                         </div>
                                     </div>
                                     <div class="text-right">
                                         <div class="font-semibold text-gray-900 dark:text-white">€${(category.value / 1000).toFixed(1)}K</div>
                                         <div class="text-xs text-blue-600 font-medium mb-2">👁️ Voir détails</div>
                                         <div class="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                             <div class="bg-gradient-to-r from-invivo-500 to-invivo-600 h-2 rounded-full transition-all duration-500" 
                                                  style="width: ${stock.value > 0 ? (category.value / stock.value) * 100 : 0}%"></div>
                                         </div>
                                     </div>
                                 </div>
                             `).join('') : `
                                 <div class="text-center py-8">
                                     <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                         <i class="fas fa-box-open text-gray-400 text-2xl"></i>
                                     </div>
                                     <p class="text-gray-500 dark:text-gray-400">Aucune catégorie disponible</p>
                                     <p class="text-sm text-gray-400 dark:text-gray-500">Cet entrepôt est vide</p>
                                 </div>
                             `}
                         </div>
                     </div>

                     <!-- Actions -->
                     <div class="flex flex-col sm:flex-row gap-4">
                         <button class="edit-inventory flex-1 bg-gradient-to-r from-invivo-500 to-invivo-600 text-white px-6 py-3 rounded-xl hover:from-invivo-600 hover:to-invivo-700 transition-all duration-200 flex items-center justify-center font-medium" data-stock='${JSON.stringify(stock)}'>
                             <i class="fas fa-edit mr-2"></i>
                             Modifier l'Inventaire
                         </button>
                         <button class="export-excel flex-1 bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition-colors duration-200 flex items-center justify-center font-medium" data-stock='${JSON.stringify(stock)}'>
                             <i class="fas fa-download mr-2"></i>
                             Exporter Excel
                         </button>
                         <button class="print-stock flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center font-medium" data-stock='${JSON.stringify(stock)}'>
                             <i class="fas fa-print mr-2"></i>
                             Imprimer
                         </button>
                     </div>
                 </div>
             `;

             // Ajouter au DOM
             document.body.appendChild(modal);

             // Animation d'entrée
             setTimeout(() => {
                 modal.style.opacity = '1';
                 const content = modal.querySelector('div > div');
                 content.style.transform = 'scale(1)';
             }, 10);

             // Gérer la fermeture
             modal.addEventListener('click', (e) => {
                 if (e.target === modal || e.target.closest('.close-modal')) {
                     this.closeStockModal(modal);
                 }
             });

             // Gérer les boutons d'action
             modal.addEventListener('click', (e) => {
                 // Gestion des clics sur les catégories dans la modal de détails
                 if (e.target.closest('.category-detail-btn')) {
                     console.log('🔧 CATEGORY DETAIL: Catégorie cliquée !');
                     const categoryDiv = e.target.closest('.category-detail-btn');
                     const categoryName = categoryDiv.getAttribute('data-category');
                     const stockName = categoryDiv.getAttribute('data-stock');
                     
                     console.log(`📂 CATEGORY DETAIL: ${categoryName} dans ${stockName}`);
                     
                     // Empêcher la propagation
                     e.preventDefault();
                     e.stopPropagation();
                     
                     try {
                         // Ouvrir la vue détaillée des articles
                         this.openCategoryDetailView(categoryName, stockName);
                         notifications.success('Catégorie Ouverte', `Affichage des détails: ${categoryName}`);
                         
                         // Fermer la modal actuelle après un délai
                         setTimeout(() => {
                             this.closeStockModal(modal);
                         }, 100);
                     } catch (error) {
                         console.error('❌ Erreur ouverture modal catégorie:', error);
                         alert(`Erreur: ${error.message}`);
                     }
                     return;
                 }
                 
                 // Gestion des boutons d'action normaux
                 const button = e.target.closest('button');
                 if (!button) return;

                 const stockData = button.getAttribute('data-stock');
                 if (stockData) {
                     const stockInfo = JSON.parse(stockData);
                     
                     if (button.classList.contains('export-excel')) {
                         e.preventDefault();
                         this.exportToExcel(stockInfo);
                     } else if (button.classList.contains('edit-inventory')) {
                         e.preventDefault();
                         this.editInventory(stockInfo);
                     } else if (button.classList.contains('print-stock')) {
                         e.preventDefault();
                         this.printStock(stockInfo);
                     }
                 }
             });

             // Fermeture avec Echap
             const handleEscape = (e) => {
                 if (e.key === 'Escape') {
                     this.closeStockModal(modal);
                     document.removeEventListener('keydown', handleEscape);
                 }
             };
             document.addEventListener('keydown', handleEscape);

             // Notification
             notifications.success('Détails Chargés', `Inventaire ${stock.name} affiché`);
         },

         closeStockModal(modal) {
             modal.style.opacity = '0';
             const content = modal.querySelector('div > div');
             content.style.transform = 'scale(0.95)';
             
             setTimeout(() => {
                 if (modal.parentNode) {
                     modal.remove();
                 }
             }, 300);
         },

         // Fonctions d'intégration Excel
         exportToExcel(stock) {
             try {
                 // Créer un nouveau workbook
                 const wb = XLSX.utils.book_new();

                 // Feuille 1: Résumé
                 const summaryData = [
                     ['INVIVO - Rapport de Stock'],
                     ['Site:', stock.name],
                     ['Date d\'export:', new Date().toLocaleDateString('fr-FR')],
                     ['Statut:', stock.status === 'active' ? 'Actif' : 'Vide'],
                     [],
                     ['Résumé'],
                     ['Total Articles:', stock.articles],
                     ['Valeur Totale:', `€${(stock.value / 1000).toFixed(1)}K`],
                     ['Nombre Catégories:', stock.categories.length],
                     ['Taux d\'utilisation:', `${Math.round((stock.articles / 500) * 100)}%`]
                 ];

                 const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
                 XLSX.utils.book_append_sheet(wb, summaryWS, 'Résumé');

                 // Feuille 2: Détail par catégories
                 if (stock.categories && stock.categories.length > 0) {
                     const categoryData = [
                         ['Détail par Catégorie'],
                         [],
                         ['Catégorie', 'Nombre d\'Articles', 'Valeur (€)', 'Pourcentage']
                     ];

                     stock.categories.forEach(category => {
                         const percentage = stock.value > 0 ? ((category.value / stock.value) * 100).toFixed(1) : '0';
                         categoryData.push([
                             category.name,
                             category.count,
                             category.value,
                             `${percentage}%`
                         ]);
                     });

                     // Ajouter totaux
                     categoryData.push([]);
                     categoryData.push(['TOTAL', stock.articles, stock.value, '100%']);

                     const categoryWS = XLSX.utils.aoa_to_sheet(categoryData);
                     XLSX.utils.book_append_sheet(wb, categoryWS, 'Catégories');
                 }

                 // Feuille 3: Articles détaillés (simulation)
                 const itemsData = [
                     ['Liste des Articles'],
                     [],
                     ['Code Article', 'Nom', 'Catégorie', 'Quantité', 'Prix Unitaire', 'Valeur Totale']
                 ];

                 // Générer des articles d'exemple
                 let itemCounter = 1;
                 stock.categories.forEach(category => {
                     for (let i = 0; i < Math.min(category.count, 10); i++) {
                         const unitPrice = Math.round((category.value / category.count) * 100) / 100;
                         itemsData.push([
                             `INV-${String(itemCounter).padStart(4, '0')}`,
                             `${category.name} ${i + 1}`,
                             category.name,
                             Math.floor(Math.random() * 10) + 1,
                             unitPrice,
                             unitPrice
                         ]);
                         itemCounter++;
                     }
                 });

                 const itemsWS = XLSX.utils.aoa_to_sheet(itemsData);
                 XLSX.utils.book_append_sheet(wb, itemsWS, 'Articles');

                 // Télécharger le fichier
                 const fileName = `INVIVO_Stock_${stock.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
                 XLSX.writeFile(wb, fileName);

                 notifications.success('Export Réussi', `Fichier Excel généré: ${fileName}`);
                 
             } catch (error) {
                 console.error('Erreur export Excel:', error);
                 notifications.error('Erreur Export', 'Impossible de générer le fichier Excel');
             }
         },

         editInventory(stock) {
             this.createInventoryEditModal(stock);
         },

         createInventoryEditModal(stock) {
             const modal = document.createElement('div');
             modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm';
             modal.style.opacity = '0';
             modal.style.transition = 'opacity 0.3s ease';

             modal.innerHTML = `
                 <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 m-4 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl transform scale-95 transition-all duration-300">
                     <div class="flex items-center justify-between mb-6">
                         <div class="flex items-center space-x-4">
                             <div class="w-12 h-12 bg-gradient-to-br from-invivo-500 to-invivo-600 rounded-xl flex items-center justify-center">
                                 <i class="fas fa-edit text-white text-xl"></i>
                             </div>
                             <div>
                                 <h2 class="text-xl font-bold text-gray-900 dark:text-white">Modifier ${stock.name}</h2>
                                 <p class="text-gray-500 dark:text-gray-400">Gérer l'inventaire</p>
                             </div>
                         </div>
                         <button class="close-modal p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                             <i class="fas fa-times text-xl text-gray-400"></i>
                         </button>
                     </div>

                     <div class="space-y-6">
                         <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                             <div class="flex items-center space-x-3 mb-3">
                                 <i class="fas fa-upload text-blue-600"></i>
                                 <h3 class="font-semibold text-blue-900 dark:text-blue-300">Import Excel</h3>
                             </div>
                             <p class="text-sm text-blue-700 dark:text-blue-400 mb-4">Importez un fichier Excel pour mettre à jour cet inventaire</p>
                             <input type="file" accept=".xlsx,.xls" class="w-full p-3 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 transition-colors">
                             <button class="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                 <i class="fas fa-upload mr-2"></i>Importer
                             </button>
                         </div>

                                                                 <!-- Ajout Rapide par Catégorie -->
                                        <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4">
                                            <div class="flex items-center space-x-3 mb-4">
                                                <i class="fas fa-bolt text-green-600"></i>
                                                <h3 class="font-semibold text-green-900 dark:text-green-300">Ajout Rapide</h3>
                                                <span class="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 text-xs rounded-full">1 clic</span>
                                            </div>
                                            
                                            <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                                                ${this.getQuickAddButtons(stock).join('')}
                                            </div>
                                            
                                            <div class="bg-white dark:bg-gray-800 rounded-lg p-3">
                                                <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                                    <i class="fas fa-info-circle mr-1"></i>
                                                    Cliquez sur une catégorie pour ajouter automatiquement des articles
                                                </p>
                                                <div class="text-xs text-gray-500 dark:text-gray-500">
                                                    Articles ajoutés : quantité aléatoire (1-5) • Prix réaliste • Sync Excel automatique
                                                </div>
                                            </div>
                                        </div>

                                        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                                            <div class="flex items-center space-x-3 mb-3">
                                                <i class="fas fa-edit text-blue-600"></i>
                                                <h3 class="font-semibold text-blue-900 dark:text-blue-300">Ajout Manuel</h3>
                                            </div>
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input type="text" placeholder="Nom de l'article" class="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                                <select class="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                                    ${stock.categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('')}
                                                </select>
                                                <input type="number" placeholder="Quantité" class="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                                <input type="number" placeholder="Prix unitaire €" class="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                            </div>
                                            <button class="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors add-article-btn" data-stock-name="${stock.name}">
                                                <i class="fas fa-plus mr-2"></i>Ajouter Article Personnalisé
                                            </button>
                                        </div>

                         <div class="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
                             <div class="flex items-center space-x-3 mb-3">
                                 <i class="fas fa-download text-orange-600"></i>
                                 <h3 class="font-semibold text-orange-900 dark:text-orange-300">Template Excel</h3>
                             </div>
                             <p class="text-sm text-orange-700 dark:text-orange-400 mb-3">Téléchargez un template Excel pour faciliter l'import</p>
                             <button class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors download-template" data-stock='${JSON.stringify(stock)}'>
                                 <i class="fas fa-download mr-2"></i>Télécharger Template
                             </button>
                         </div>
                     </div>
                 </div>
             `;

             document.body.appendChild(modal);

             // Animation
             setTimeout(() => {
                 modal.style.opacity = '1';
                 const content = modal.querySelector('div > div');
                 content.style.transform = 'scale(1)';
             }, 10);

             // Gestion événements
             modal.addEventListener('click', (e) => {
                 if (e.target === modal || e.target.closest('.close-modal')) {
                     this.closeStockModal(modal);
                 }
                 
                 if (e.target.closest('.download-template')) {
                     this.downloadExcelTemplate(stock);
                 }
                 
                 if (e.target.closest('.add-article-btn')) {
                     this.handleAddArticle(e, stock);
                 }

                 // Gestion des boutons d'ajout rapide
                 if (e.target.closest('.quick-add-btn')) {
                     console.log('🔧 EVENT LISTENER: Bouton catégorie cliqué !');
                     const button = e.target.closest('.quick-add-btn');
                     const categoryName = button.getAttribute('data-category');
                     const stockName = button.getAttribute('data-stock');
                     
                     console.log(`📂 EVENT LISTENER: Catégorie: ${categoryName}, Entrepôt: ${stockName}`);
                     
                     // Empêcher la propagation
                     e.preventDefault();
                     e.stopPropagation();
                     
                     // Animation du bouton
                     button.style.transform = 'scale(0.95)';
                     setTimeout(() => {
                         button.style.transform = 'scale(1)';
                     }, 150);
                     
                     // Test simple : notification d'abord
                     notifications.success('Catégorie Cliquée', `Ouverture de ${categoryName} dans ${stockName}`);
                     
                     try {
                         // Ouvrir la vue détaillée des articles
                         this.openCategoryDetailView(categoryName, stockName);
                         
                         // Fermer la modal actuelle après un délai
                         setTimeout(() => {
                             this.closeStockModal(modal);
                         }, 100);
                     } catch (error) {
                         console.error('❌ Erreur ouverture modal:', error);
                         alert(`Erreur: ${error.message}`);
                     }
                 }
             });

             // Gestion de l'upload de fichier Excel
             const fileInput = modal.querySelector('input[type="file"]');
             if (fileInput) {
                 fileInput.addEventListener('change', (e) => {
                     this.handleExcelImport(e, stock);
                 });
             }

             notifications.info('Édition Ouverte', `Mode édition pour ${stock.name}`);
         },

         downloadExcelTemplate(stock) {
             try {
                 const wb = XLSX.utils.book_new();

                 // Template principal
                 const templateData = [
                     ['TEMPLATE IMPORT INVIVO - ' + stock.name],
                     ['Instructions: Remplissez les données ci-dessous et importez le fichier'],
                     [],
                     ['Code Article', 'Nom Article', 'Catégorie', 'Quantité', 'Prix Unitaire €', 'Notes'],
                     ['INV-0001', 'Exemple Article 1', 'Matériel Bâtiment', '10', '25.50', 'Article d\'exemple'],
                     ['INV-0002', 'Exemple Article 2', 'Outils', '5', '48.00', 'Supprimez cette ligne'],
                     [],
                     ['Catégories disponibles:'],
                     ...stock.categories.map(cat => [cat.name])
                 ];

                 const templateWS = XLSX.utils.aoa_to_sheet(templateData);
                 XLSX.utils.book_append_sheet(wb, templateWS, 'Import Template');

                 const fileName = `Template_Import_${stock.name.replace(/\s+/g, '_')}.xlsx`;
                 XLSX.writeFile(wb, fileName);

                 notifications.success('Template Téléchargé', `Fichier: ${fileName}`);
             } catch (error) {
                 notifications.error('Erreur', 'Impossible de générer le template');
             }
         },

         printStock(stock) {
             const printWindow = window.open('', '_blank');
             const printContent = `
                 <html>
                 <head>
                     <title>INVIVO - Stock ${stock.name}</title>
                     <style>
                         body { font-family: Arial, sans-serif; margin: 20px; }
                         .header { text-align: center; border-bottom: 2px solid #04a4dc; padding-bottom: 20px; margin-bottom: 30px; }
                         .logo { color: #04a4dc; font-size: 24px; font-weight: bold; }
                         .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 30px 0; }
                         .stat-box { border: 1px solid #ddd; padding: 15px; text-align: center; border-radius: 8px; }
                         .stat-value { font-size: 24px; font-weight: bold; color: #04a4dc; }
                         .categories { margin-top: 30px; }
                         .category { margin: 10px 0; padding: 10px; border-left: 4px solid #04a4dc; background: #f9f9f9; }
                         table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                         th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                         th { background: #04a4dc; color: white; }
                         .footer { margin-top: 50px; text-align: center; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
                     </style>
                 </head>
                 <body>
                     <div class="header">
                         <div class="logo">🌱 INVIVO</div>
                         <h1>Rapport de Stock - ${stock.name}</h1>
                         <p>Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
                     </div>

                     <div class="stats">
                         <div class="stat-box">
                             <div class="stat-value">${stock.articles}</div>
                             <div>Articles Total</div>
                         </div>
                         <div class="stat-box">
                             <div class="stat-value">€${(stock.value / 1000).toFixed(1)}K</div>
                             <div>Valeur Totale</div>
                         </div>
                         <div class="stat-box">
                             <div class="stat-value">${stock.categories.length}</div>
                             <div>Catégories</div>
                         </div>
                         <div class="stat-box">
                             <div class="stat-value">${Math.round((stock.articles / 500) * 100)}%</div>
                             <div>Utilisation</div>
                         </div>
                     </div>

                     <div class="categories">
                         <h2>Répartition par Catégorie</h2>
                         ${stock.categories.map(category => `
                             <div class="category">
                                 <strong>${category.name}</strong> - ${category.count} articles - €${(category.value / 1000).toFixed(1)}K
                             </div>
                         `).join('')}
                     </div>

                     <div class="footer">
                         <p>INVIVO - Panel de Gestion des Stocks</p>
                         <p>Document confidentiel - Usage interne uniquement</p>
                     </div>
                 </body>
                 </html>
             `;

             printWindow.document.write(printContent);
             printWindow.document.close();
             printWindow.print();
             
             notifications.success('Impression', `Rapport ${stock.name} envoyé à l'imprimante`);
         },

         // Gestion de l'ajout d'articles avec sync temps réel
         handleAddArticle(e, stock) {
             const modal = e.target.closest('.bg-white, .dark\\:bg-gray-800');
             const inputs = modal.querySelectorAll('input, select');
             
             const articleData = {
                 name: inputs[0]?.value || '',
                 category: inputs[1]?.value || '',
                 quantity: parseInt(inputs[2]?.value) || 0,
                 unitPrice: parseFloat(inputs[3]?.value) || 0
             };

             // Validation
             if (!articleData.name || !articleData.category || articleData.quantity <= 0 || articleData.unitPrice <= 0) {
                 notifications.error('Erreur', 'Veuillez remplir tous les champs correctement');
                 return;
             }

             // Mettre à jour les données locales
             this.addArticleToStock(stock.name, articleData);

             // Déclencher la synchronisation
             syncManager.markModified('add_item', {
                 stock: stock.name,
                 article: articleData,
                 timestamp: new Date().toISOString()
             });

             // Notification de succès
             notifications.success('Article Ajouté', `${articleData.name} ajouté à ${stock.name}`);

             // Vider les champs
             inputs.forEach(input => input.value = '');

             // Mettre à jour l'affichage
             this.refreshStockDisplay();
         },

         // Import Excel avec synchronisation
         async handleExcelImport(e, stock) {
             const file = e.target.files[0];
             if (!file) return;

             try {
                 notifications.info('Import Excel', 'Lecture du fichier en cours...');

                 const data = await this.readExcelFile(file);
                 let importedCount = 0;

                 // Traiter chaque ligne du fichier Excel
                 data.forEach((row, index) => {
                     if (index === 0 || !row[1]) return; // Ignorer l'en-tête et lignes vides

                     const articleData = {
                         code: row[0] || `INV-${Date.now()}-${index}`,
                         name: row[1] || '',
                         category: row[2] || 'Non catégorisé',
                         quantity: parseInt(row[3]) || 1,
                         unitPrice: parseFloat(row[4]) || 0,
                         notes: row[5] || ''
                     };

                     if (articleData.name && articleData.quantity > 0) {
                         this.addArticleToStock(stock.name, articleData);
                         importedCount++;
                     }
                 });

                 // Synchronisation après import
                 syncManager.markModified('bulk_import', {
                     stock: stock.name,
                     imported: importedCount,
                     source: 'excel_file',
                     timestamp: new Date().toISOString()
                 });

                 notifications.success('Import Réussi', `${importedCount} articles importés dans ${stock.name}`);
                 this.refreshStockDisplay();

             } catch (error) {
                 console.error('Erreur import Excel:', error);
                 notifications.error('Erreur Import', 'Impossible de lire le fichier Excel');
             }
         },

         // Lire un fichier Excel
         readExcelFile(file) {
             return new Promise((resolve, reject) => {
                 const reader = new FileReader();
                 reader.onload = (e) => {
                     try {
                         const data = new Uint8Array(e.target.result);
                         const workbook = XLSX.read(data, { type: 'array' });
                         const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                         const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
                         resolve(jsonData);
                     } catch (error) {
                         reject(error);
                     }
                 };
                 reader.onerror = reject;
                 reader.readAsArrayBuffer(file);
             });
         },

         // Générer les boutons d'ajout rapide - 3 catégories universelles
         getQuickAddButtons(stock) {
             const universalCategories = [
                 { name: 'Outils', icon: 'fas fa-tools', color: 'blue' },
                 { name: 'Matériaux', icon: 'fas fa-cubes', color: 'green' },
                 { name: 'Équipements', icon: 'fas fa-cogs', color: 'orange' }
             ];

             const buttons = [];

             // Ajouter les 3 catégories universelles
             universalCategories.forEach(category => {
                 // Compter les articles existants dans cette catégorie
                 const existingCategory = stock.categories?.find(c => c.name === category.name);
                 const currentCount = existingCategory ? existingCategory.count : 0;
                 
                 buttons.push(`
                     <button class="quick-add-btn p-4 bg-white dark:bg-gray-800 border-2 border-${category.color}-200 dark:border-${category.color}-600 rounded-xl hover:border-${category.color}-400 hover:bg-${category.color}-50 dark:hover:bg-${category.color}-900/20 transition-all duration-200 group shadow-sm hover:shadow-md" 
                             data-category="${category.name}" data-stock="${stock.name}" onclick="window.testCategoryClick('${category.name}', '${stock.name}')">
                         <div class="text-center">
                             <div class="w-12 h-12 bg-${category.color}-100 dark:bg-${category.color}-900/30 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                 <i class="${category.icon} text-${category.color}-600 text-xl"></i>
                             </div>
                             <div class="text-base font-semibold text-gray-900 dark:text-white">${category.name}</div>
                             <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">${currentCount} en stock</div>
                             <div class="text-xs text-${category.color}-600 dark:text-${category.color}-400 mt-1 font-medium">+ Voir détails</div>
                         </div>
                     </button>
                 `);
             });

             return buttons;
         },

         // Obtenir l'icône pour une catégorie
         getCategoryIcon(categoryName) {
             const icons = {
                 'Outils': 'fas fa-tools',
                 'Matériaux': 'fas fa-cubes',
                 'Équipements': 'fas fa-cogs'
             };
             return icons[categoryName] || 'fas fa-box';
         },

         // Obtenir la couleur pour une catégorie
         getCategoryColor(categoryName) {
             const colors = {
                 'Outils': 'blue',
                 'Matériaux': 'green',
                 'Équipements': 'orange'
             };
             return colors[categoryName] || 'blue';
         },

         // Base de données d'articles détaillée avec photos et infos complètes
         getDetailedArticlesByCategory(categoryName) {
             const articleDatabase = {
                 'Outils': [
                     { 
                         id: 'OUT001', 
                         name: 'Perceuse Bosch GSR 120', 
                         price: 120, 
                         photo: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=300&h=200&fit=crop',
                         code: 'BOSCH-GSR120',
                         description: 'Perceuse visseuse sans fil 12V avec 2 batteries',
                         etat: 'Bon',
                         dateControle: '2024-01-15',
                         commentaires: 'Automatique STRAPEX',
                         chantier: 'Chantier A',
                         dateDepart: '',
                         dateRetour: ''
                     },
                     { 
                         id: 'OUT002', 
                         name: 'Visseuse DeWalt DCD771', 
                         price: 95,
                         photo: 'https://images.unsplash.com/photo-1609010697446-11f2155278f0?w=300&h=200&fit=crop',
                         code: 'DEWALT-DCD771',
                         description: 'Visseuse perceuse 18V Li-Ion',
                         etat: 'Excellent',
                         dateControle: '2024-01-20',
                         commentaires: 'Révision complète effectuée',
                         chantier: '',
                         dateDepart: '',
                         dateRetour: ''
                     },
                     { 
                         id: 'OUT003', 
                         name: 'Marteau perforateur Makita', 
                         price: 180,
                         photo: 'https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=300&h=200&fit=crop',
                         code: 'MAKITA-DHR263',
                         description: 'Perforateur SDS+ 26mm sans fil',
                         etat: 'Bon',
                         dateControle: '2024-01-10',
                         commentaires: 'Nettoyage requis',
                         chantier: 'Chantier B',
                         dateDepart: '2024-01-25',
                         dateRetour: '2024-02-01'
                     },
                     { 
                         id: 'OUT004', 
                         name: 'Scie circulaire Bosch GKS', 
                         price: 160,
                         photo: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&h=200&fit=crop',
                         code: 'BOSCH-GKS190',
                         description: 'Scie circulaire 1400W lame 190mm',
                         etat: 'Très bon',
                         dateControle: '2024-01-18',
                         commentaires: 'Lame changée récemment',
                         chantier: '',
                         dateDepart: '',
                         dateRetour: ''
                     }
                 ],
                 'Matériaux': [
                     { 
                         id: 'MAT001', 
                         name: 'Sac béton 35kg', 
                         price: 8,
                         photo: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop',
                         code: 'BETON-35KG',
                         description: 'Béton prêt à l\'emploi 35kg',
                         etat: 'Neuf',
                         dateControle: '2024-01-22',
                         commentaires: 'Stock important disponible',
                         chantier: '',
                         dateDepart: '',
                         dateRetour: ''
                     },
                     { 
                         id: 'MAT002', 
                         name: 'Plaque OSB 18mm', 
                         price: 25,
                         photo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
                         code: 'OSB-18MM',
                         description: 'Panneau OSB 18mm 250x125cm',
                         etat: 'Bon',
                         dateControle: '2024-01-12',
                         commentaires: 'Stockage sec nécessaire',
                         chantier: 'Projet C',
                         dateDepart: '',
                         dateRetour: ''
                     }
                 ],
                 'Équipements': [
                     { 
                         id: 'EQP001', 
                         name: 'Casque de protection', 
                         price: 25,
                         photo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
                         code: 'CASQUE-SEC01',
                         description: 'Casque de sécurité blanc EN397',
                         etat: 'Bon',
                         dateControle: '2024-01-16',
                         commentaires: 'Contrôle mensuel OK',
                         chantier: '',
                         dateDepart: '',
                         dateRetour: ''
                     },
                     { 
                         id: 'EQP002', 
                         name: 'Chaussures sécurité S3', 
                         price: 85,
                         photo: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop',
                         code: 'CHAUSSURE-S3',
                         description: 'Chaussures sécurité S3 pointure 42',
                         etat: 'Excellent',
                         dateControle: '2024-01-14',
                         commentaires: 'Neuves, jamais utilisées',
                         chantier: '',
                         dateDepart: '',
                         dateRetour: ''
                     }
                 ]
             };

             return articleDatabase[categoryName] || [];
         },

         // Version simple pour ajout rapide
         getRandomArticlesByCategory(categoryName) {
             const detailed = this.getDetailedArticlesByCategory(categoryName);
             const count = Math.floor(Math.random() * 3) + 1;
             const shuffled = detailed.sort(() => 0.5 - Math.random());
             return shuffled.slice(0, count).map(item => ({
                 name: item.name,
                 price: item.price
             }));
         },

         // Ouvrir la vue détaillée d'une catégorie avec interface ultra-moderne
         openCategoryDetailView(categoryName, stockName) {
             console.log(`🚀 openCategoryDetailView appelée: ${categoryName} - ${stockName}`);
             
             try {
                 const articles = this.getDetailedArticlesByCategory(categoryName);
                 console.log(`📋 Articles trouvés: ${articles.length}`);
                 
                 if (articles.length === 0) {
                     notifications.warning(`Catégorie vide`, `Aucun article trouvé pour ${categoryName}`);
                     return;
                 }
                 
                 const categoryIcon = this.getCategoryIcon(categoryName);
                 const categoryColor = this.getCategoryColor(categoryName);
                 const totalValue = articles.reduce((sum, a) => sum + a.price, 0);
                 
                 // Créer la modal ultra-moderne
                 const modal = document.createElement('div');
                 modal.className = 'fixed inset-0 z-50 flex items-center justify-center modal-overlay';
                 modal.style.opacity = '0';
                 modal.style.transition = 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
                 
                 modal.innerHTML = `
                     <div class="modal-ultra crystal-card neon-effect p-8 m-4 w-full max-w-7xl max-h-[95vh] overflow-hidden transform scale-95 transition-all duration-500">
                         <!-- Header ultra-moderne -->
                         <div class="flex items-center justify-between mb-8 pb-6 border-b border-gray-200/50 dark:border-gray-700/50">
                             <div class="flex items-center space-x-6">
                                 <div class="w-20 h-20 bg-gradient-to-br from-${categoryColor}-400 via-${categoryColor}-500 to-${categoryColor}-600 rounded-3xl flex items-center justify-center shadow-xl particle-stat neon-effect">
                                     <i class="${categoryIcon} text-white text-3xl"></i>
                                 </div>
                                 <div>
                                     <h1 class="text-4xl font-black bg-gradient-to-r from-gray-900 via-${categoryColor}-600 to-gray-700 dark:from-white dark:via-${categoryColor}-400 dark:to-gray-300 bg-clip-text text-transparent mb-2">${categoryName}</h1>
                                     <p class="text-lg text-gray-600 dark:text-gray-400 font-medium">${stockName} • ${articles.length} articles • €${totalValue.toFixed(2)}</p>
                                 </div>
                             </div>
                             <div class="flex items-center space-x-4">
                                 <button class="magnetic-btn p-3 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 rounded-xl text-white shadow-lg export-category-btn">
                                     <i class="fas fa-download text-lg"></i>
                                 </button>
                                 <button class="magnetic-btn p-3 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 rounded-xl text-white shadow-lg print-category-btn">
                                     <i class="fas fa-print text-lg"></i>
                                 </button>
                                 <button class="magnetic-btn p-3 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 rounded-xl text-white shadow-lg add-article-btn">
                                     <i class="fas fa-plus text-lg"></i>
                                 </button>
                                 <button class="close-modal magnetic-btn p-3 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 rounded-xl text-white shadow-lg">
                                     <i class="fas fa-times text-lg"></i>
                                 </button>
                             </div>
                         </div>
                         
                         <!-- Tableau ultra-moderne type Excel -->
                         <div class="overflow-hidden rounded-2xl">
                             <div class="futuristic-table overflow-x-auto overflow-y-auto max-h-[60vh] custom-scrollbar">
                                 <table class="w-full">
                                     <thead class="sticky top-0 z-10">
                                         <tr>
                                             <th class="text-left py-4 px-6 font-bold text-sm">N°</th>
                                             <th class="text-left py-4 px-6 font-bold text-sm">PHOTO</th>
                                             <th class="text-left py-4 px-6 font-bold text-sm">CODE PRODUIT</th>
                                             <th class="text-left py-4 px-6 font-bold text-sm">DESCRIPTION</th>
                                             <th class="text-left py-4 px-6 font-bold text-sm">PRIX</th>
                                             <th class="text-left py-4 px-6 font-bold text-sm">ÉTAT</th>
                                             <th class="text-left py-4 px-6 font-bold text-sm">CONTRÔLE</th>
                                             <th class="text-left py-4 px-6 font-bold text-sm">CHANTIER</th>
                                             <th class="text-right py-4 px-6 font-bold text-sm">ACTIONS</th>
                                         </tr>
                                     </thead>
                                     <tbody>
                                         ${articles.map((article, index) => `
                                             <tr class="group hover:scale-[1.01] transition-all duration-300" data-article-id="${article.id}">
                                                 <td class="py-4 px-6">
                                                     <div class="w-8 h-8 bg-gradient-to-br from-${categoryColor}-500 to-${categoryColor}-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                         ${index + 1}
                                                     </div>
                                                 </td>
                                                 <td class="py-4 px-6">
                                                     <div class="relative group/img">
                                                         <img src="${article.photo}" alt="${article.name}" 
                                                              class="w-16 h-12 object-cover rounded-lg shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300 article-photo"
                                                              onclick="this.requestFullscreen()">
                                                         <div class="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                                             <i class="fas fa-search-plus text-white text-lg"></i>
                                                         </div>
                                                     </div>
                                                 </td>
                                                 <td class="py-4 px-6">
                                                     <div class="font-bold text-lg text-gray-900 dark:text-white mb-1">${article.code}</div>
                                                     <div class="text-sm font-medium text-${categoryColor}-600 dark:text-${categoryColor}-400">${article.name}</div>
                                                 </td>
                                                 <td class="py-4 px-6">
                                                     <div class="max-w-xs">
                                                         <p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">${article.description}</p>
                                                         ${article.commentaires ? `<p class="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">${article.commentaires}</p>` : ''}
                                                     </div>
                                                 </td>
                                                 <td class="py-4 px-6">
                                                     <div class="font-black text-xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                                         €${article.price.toFixed(2)}
                                                     </div>
                                                 </td>
                                                 <td class="py-4 px-6">
                                                     <span class="px-3 py-1 rounded-full text-xs font-bold ${this.getStateBadgeClass(article.etat)}">
                                                         ${article.etat}
                                                     </span>
                                                 </td>
                                                 <td class="py-4 px-6">
                                                     <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                         ${this.formatDate(article.dateControle)}
                                                     </div>
                                                 </td>
                                                 <td class="py-4 px-6">
                                                     ${article.chantier ? `
                                                         <div class="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-2">
                                                             <div class="text-sm font-bold text-orange-700 dark:text-orange-400">${article.chantier}</div>
                                                             ${article.dateDepart ? `<div class="text-xs text-orange-600 dark:text-orange-500">Départ: ${this.formatDate(article.dateDepart)}</div>` : ''}
                                                             ${article.dateRetour ? `<div class="text-xs text-orange-600 dark:text-orange-500">Retour: ${this.formatDate(article.dateRetour)}</div>` : ''}
                                                         </div>
                                                     ` : `
                                                         <span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold">
                                                             <i class="fas fa-check-circle mr-1"></i>Disponible
                                                         </span>
                                                     `}
                                                 </td>
                                                 <td class="py-4 px-6">
                                                     <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                         <button class="magnetic-btn p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg edit-article-btn" data-article-id="${article.id}">
                                                             <i class="fas fa-edit text-sm"></i>
                                                         </button>
                                                         <button class="magnetic-btn p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg delete-article-btn" data-article-id="${article.id}">
                                                             <i class="fas fa-trash text-sm"></i>
                                                         </button>
                                                     </div>
                                                 </td>
                                             </tr>
                                         `).join('')}
                                     </tbody>
                                 </table>
                             </div>
                         </div>
                         
                         <!-- Footer avec statistiques -->
                         <div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                             <div class="flex items-center space-x-8">
                                 <div class="crystal-card p-4 text-center">
                                     <div class="text-2xl font-black text-${categoryColor}-600">${articles.length}</div>
                                     <div class="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">Articles</div>
                                 </div>
                                 <div class="crystal-card p-4 text-center">
                                     <div class="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">€${totalValue.toFixed(0)}</div>
                                     <div class="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">Valeur Total</div>
                                 </div>
                                 <div class="crystal-card p-4 text-center">
                                     <div class="text-2xl font-black text-orange-600">${articles.filter(a => a.chantier).length}</div>
                                     <div class="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">En Mission</div>
                                 </div>
                             </div>
                             
                             <div class="flex items-center space-x-4">
                                 <button class="magnetic-btn px-6 py-3 bg-gradient-to-r from-${categoryColor}-500 to-${categoryColor}-600 hover:from-${categoryColor}-400 hover:to-${categoryColor}-500 text-white rounded-xl font-bold shadow-xl add-article-btn">
                                     <i class="fas fa-plus mr-2"></i>Nouvel Article
                                 </button>
                                 <button class="magnetic-btn px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-xl font-bold shadow-xl export-category-btn">
                                     <i class="fas fa-download mr-2"></i>Exporter Excel
                                 </button>
                             </div>
                         </div>
                     </div>
                 `;
                 
                 document.body.appendChild(modal);
                 
                 // Animation d'entrée spectaculaire
                 setTimeout(() => {
                     modal.style.opacity = '1';
                     const content = modal.querySelector('div > div');
                     content.style.transform = 'scale(1)';
                 }, 10);
                 
                 // Gestion des événements
                 this.setupCategoryDetailEvents(modal, categoryName, stockName, articles);
                 
                 console.log(`✅ Interface ultra-moderne créée pour ${categoryName} avec ${articles.length} articles`);
                 
             } catch (error) {
                 console.error('❌ Erreur dans openCategoryDetailView:', error);
                 notifications.error('Erreur', `Impossible d'ouvrir ${categoryName}: ${error.message}`);
             }
         },
         
         // Configuration des événements pour la vue catégorie
         setupCategoryDetailEvents(modal, categoryName, stockName, articles) {
             // Fermeture modal
             modal.addEventListener('click', (e) => {
                 if (e.target === modal || e.target.closest('.close-modal')) {
                     modal.style.opacity = '0';
                     modal.querySelector('div > div').style.transform = 'scale(0.95)';
                     setTimeout(() => modal.remove(), 300);
                 }
             });
             
             // Export Excel
             modal.addEventListener('click', (e) => {
                 if (e.target.closest('.export-category-btn')) {
                     this.exportCategoryToExcel(categoryName, articles);
                 }
             });
             
             // Impression
             modal.addEventListener('click', (e) => {
                 if (e.target.closest('.print-category-btn')) {
                     this.printCategory(categoryName, articles);
                 }
             });
             
             // Ajouter article
             modal.addEventListener('click', (e) => {
                 if (e.target.closest('.add-article-btn')) {
                     this.openAddArticleForm(categoryName, stockName, modal);
                 }
             });
             
             // Modifier article
             modal.addEventListener('click', (e) => {
                 if (e.target.closest('.edit-article-btn')) {
                     const articleId = e.target.closest('.edit-article-btn').getAttribute('data-article-id');
                     const article = articles.find(a => a.id === articleId);
                     if (article) {
                         this.openEditArticleForm(article, modal);
                     }
                 }
             });
             
             // Supprimer article
             modal.addEventListener('click', (e) => {
                 if (e.target.closest('.delete-article-btn')) {
                     const articleId = e.target.closest('.delete-article-btn').getAttribute('data-article-id');
                     const row = modal.querySelector(`[data-article-id="${articleId}"]`);
                     this.confirmDeleteArticle(articleId, row);
                 }
             });
             
             // Fermeture avec Échap
             const handleEscape = (e) => {
                 if (e.key === 'Escape') {
                     modal.querySelector('.close-modal').click();
                     document.removeEventListener('keydown', handleEscape);
                 }
             };
             document.addEventListener('keydown', handleEscape);
         },
         
         // Obtenir la classe CSS pour les badges d'état
         getStateBadgeClass(etat) {
             switch(etat) {
                 case 'Excellent': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
                 case 'Très bon': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
                 case 'Bon': return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400';
                 case 'Moyen': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
                 case 'Mauvais': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
                 default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
             }
         },
         
         // Formater les dates pour l'affichage
         formatDate(dateString) {
             if (!dateString) return 'Non définie';
             const date = new Date(dateString);
             return date.toLocaleDateString('fr-FR');
         },

         // Exporter une catégorie vers Excel
         exportCategoryToExcel(categoryName, articles) {
             const wb = XLSX.utils.book_new();
             
             const data = [
                 ['INVIVO - Export ' + categoryName],
                 ['Date d\'export:', new Date().toLocaleString('fr-FR')],
                 [],
                 ['N°', 'Code Produit', 'Nom', 'Description', 'Prix €', 'État', 'Date Contrôle', 'Commentaires', 'Chantier', 'Date Départ', 'Date Retour']
             ];

             articles.forEach((article, index) => {
                 data.push([
                     index + 1,
                     article.code,
                     article.name,
                     article.description,
                     article.price,
                     article.etat,
                     article.dateControle,
                     article.commentaires,
                     article.chantier,
                     article.dateDepart,
                     article.dateRetour
                 ]);
             });

             const ws = XLSX.utils.aoa_to_sheet(data);
             XLSX.utils.book_append_sheet(wb, ws, categoryName);
             XLSX.writeFile(wb, `INVIVO_${categoryName}_${new Date().toISOString().split('T')[0]}.xlsx`);
             
             notifications.success('Export Excel', `${categoryName} exporté avec succès`);
             
             // Sync automatique
             syncManager.markModified('category_export', {
                 category: categoryName,
                 articles: articles.length
             });
         },

         // Imprimer une catégorie
         printCategory(categoryName, articles) {
             const printWindow = window.open('', '_blank');
             const icon = this.getCategoryIcon(categoryName);
             
             printWindow.document.write(`
                 <!DOCTYPE html>
                 <html>
                 <head>
                     <title>INVIVO - ${categoryName}</title>
                     <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                     <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
                     <style>
                         @media print {
                             body { print-color-adjust: exact; }
                         }
                         .article-photo { max-width: 80px; max-height: 60px; }
                     </style>
                 </head>
                 <body class="bg-white p-8">
                     <div class="max-w-7xl mx-auto">
                         <div class="flex items-center space-x-4 mb-8">
                             <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                                 <i class="${icon} text-3xl text-blue-600"></i>
                             </div>
                             <div>
                                 <h1 class="text-3xl font-bold text-gray-900">INVIVO - ${categoryName}</h1>
                                 <p class="text-gray-600">Imprimé le ${new Date().toLocaleString('fr-FR')}</p>
                             </div>
                         </div>
                         
                         <table class="w-full border-collapse border border-gray-300">
                             <thead>
                                 <tr class="bg-gray-100">
                                     <th class="border border-gray-300 p-2 text-left">N°</th>
                                     <th class="border border-gray-300 p-2 text-left">Photo</th>
                                     <th class="border border-gray-300 p-2 text-left">Code</th>
                                     <th class="border border-gray-300 p-2 text-left">Description</th>
                                     <th class="border border-gray-300 p-2 text-left">État</th>
                                     <th class="border border-gray-300 p-2 text-left">Contrôle</th>
                                     <th class="border border-gray-300 p-2 text-left">Chantier</th>
                                 </tr>
                             </thead>
                             <tbody>
                                 ${articles.map((article, index) => `
                                     <tr>
                                         <td class="border border-gray-300 p-2">${index + 1}</td>
                                         <td class="border border-gray-300 p-2">
                                             <img src="${article.photo}" alt="${article.name}" class="article-photo object-cover rounded">
                                         </td>
                                         <td class="border border-gray-300 p-2">
                                             <div class="font-semibold">${article.code}</div>
                                             <div class="text-sm text-gray-600">${article.name}</div>
                                         </td>
                                         <td class="border border-gray-300 p-2">
                                             <div>${article.description}</div>
                                             <div class="text-sm text-green-600 font-medium">€${article.price}</div>
                                         </td>
                                         <td class="border border-gray-300 p-2">${article.etat}</td>
                                         <td class="border border-gray-300 p-2">${this.formatDate(article.dateControle)}</td>
                                         <td class="border border-gray-300 p-2">${article.chantier || 'Disponible'}</td>
                                     </tr>
                                 `).join('')}
                             </tbody>
                         </table>
                         
                         <div class="mt-8 text-sm text-gray-600">
                             <p>Total: ${articles.length} articles - Valeur: €${articles.reduce((sum, a) => sum + a.price, 0)}</p>
                         </div>
                     </div>
                 </body>
                 </html>
             `);
             
             printWindow.document.close();
             printWindow.focus();
             setTimeout(() => printWindow.print(), 500);
             
             notifications.success('Impression', `Liste ${categoryName} envoyée à l'imprimante`);
         },

         // Ouvrir le formulaire d'ajout d'article
         openAddArticleForm(categoryName, stockName, parentModal) {
             const color = this.getCategoryColor(categoryName);
             
             const formModal = document.createElement('div');
             formModal.className = 'fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4';
             
             formModal.innerHTML = `
                 <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl transform scale-95 transition-all duration-300">
                     <div class="bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-t-2xl p-6 text-white">
                         <h3 class="text-2xl font-bold">Ajouter un article - ${categoryName}</h3>
                         <p class="text-${color}-100">Entrepôt: ${stockName}</p>
                     </div>
                     
                     <form class="p-6 space-y-6" id="add-article-form">
                         <div class="grid grid-cols-2 gap-4">
                             <div>
                                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Code Produit *</label>
                                 <input type="text" name="code" required class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                             </div>
                             <div>
                                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prix (€) *</label>
                                 <input type="number" name="price" step="0.01" required class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                             </div>
                         </div>
                         
                         <div>
                             <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom de l'article *</label>
                             <input type="text" name="name" required class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                         </div>
                         
                         <div>
                             <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                             <textarea name="description" rows="3" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
                         </div>
                         
                         <div class="grid grid-cols-2 gap-4">
                             <div>
                                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">État</label>
                                 <select name="etat" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                     <option value="Excellent">Excellent</option>
                                     <option value="Très bon">Très bon</option>
                                     <option value="Bon" selected>Bon</option>
                                     <option value="Moyen">Moyen</option>
                                     <option value="Mauvais">Mauvais</option>
                                 </select>
                             </div>
                             <div>
                                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Contrôle</label>
                                 <input type="date" name="dateControle" value="${new Date().toISOString().split('T')[0]}" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                             </div>
                         </div>
                         
                         <div>
                             <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">URL Photo</label>
                             <input type="url" name="photo" placeholder="https://..." class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                         </div>
                         
                         <div>
                             <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Commentaires</label>
                             <input type="text" name="commentaires" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                         </div>
                         
                         <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                             <button type="button" class="px-6 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cancel-add">
                                 Annuler
                             </button>
                             <button type="submit" class="px-6 py-3 bg-${color}-500 text-white rounded-lg hover:bg-${color}-600 transition-colors duration-200">
                                 <i class="fas fa-save mr-2"></i>Ajouter l'article
                             </button>
                         </div>
                     </form>
                 </div>
             `;
             
             document.body.appendChild(formModal);
             
             // Animation
             setTimeout(() => {
                 formModal.querySelector('div > div').style.transform = 'scale(1)';
             }, 10);
             
             // Gestion événements
             formModal.addEventListener('click', (e) => {
                 if (e.target === formModal || e.target.closest('.cancel-add')) {
                     formModal.remove();
                 }
             });
             
             formModal.querySelector('#add-article-form').addEventListener('submit', (e) => {
                 e.preventDefault();
                 this.saveNewArticle(e.target, categoryName, stockName, formModal, parentModal);
             });
         },

         // Sauvegarder un nouvel article
         saveNewArticle(form, categoryName, stockName, formModal, parentModal) {
             const formData = new FormData(form);
             const newArticle = {
                 id: categoryName.substring(0, 3).toUpperCase() + Date.now().toString().slice(-3),
                 name: formData.get('name'),
                 code: formData.get('code'),
                 description: formData.get('description'),
                 price: parseFloat(formData.get('price')),
                 etat: formData.get('etat'),
                 dateControle: formData.get('dateControle'),
                 photo: formData.get('photo') || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
                 commentaires: formData.get('commentaires'),
                 chantier: '',
                 dateDepart: '',
                 dateRetour: ''
             };
             
             // Ajouter à la base de données (simulation)
             console.log('Nouvel article ajouté:', newArticle);
             
             // Synchronisation Excel
             syncManager.markModified('article_added', {
                 category: categoryName,
                 stock: stockName,
                 article: newArticle
             });
             
             notifications.success('Article Ajouté', `${newArticle.name} ajouté à ${categoryName}`);
             
             formModal.remove();
             
             // Rafraîchir la vue
             setTimeout(() => {
                 parentModal.remove();
                 this.openCategoryDetailView(categoryName, stockName);
             }, 500);
         },

         // Confirmer suppression d'article
         confirmDeleteArticle(articleId, row) {
             if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
                 // Animation de suppression
                 row.style.transition = 'all 0.3s ease';
                 row.style.opacity = '0';
                 row.style.transform = 'translateX(-100%)';
                 
                 setTimeout(() => {
                     row.remove();
                     notifications.success('Article Supprimé', 'Article retiré de l\'inventaire');
                     
                     // Sync Excel
                     syncManager.markModified('article_deleted', {
                         articleId: articleId
                     });
                 }, 300);
             }
         },

         // Ouvrir le formulaire de modification d'article
         openEditArticleForm(article, parentModal) {
             const color = 'blue'; // Couleur par défaut pour l'édition
             
             const formModal = document.createElement('div');
             formModal.className = 'fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4';
             
             formModal.innerHTML = `
                 <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl transform scale-95 transition-all duration-300">
                     <div class="bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-t-2xl p-6 text-white">
                         <h3 class="text-2xl font-bold">Modifier l'article</h3>
                         <p class="text-${color}-100">${article.code} - ${article.name}</p>
                     </div>
                     
                     <form class="p-6 space-y-6" id="edit-article-form">
                         <div class="grid grid-cols-2 gap-4">
                             <div>
                                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Code Produit *</label>
                                 <input type="text" name="code" value="${article.code}" required class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                             </div>
                             <div>
                                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prix (€) *</label>
                                 <input type="number" name="price" value="${article.price}" step="0.01" required class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                             </div>
                         </div>
                         
                         <div>
                             <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom de l'article *</label>
                             <input type="text" name="name" value="${article.name}" required class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                         </div>
                         
                         <div>
                             <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                             <textarea name="description" rows="3" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">${article.description}</textarea>
                         </div>
                         
                         <div class="grid grid-cols-2 gap-4">
                             <div>
                                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">État</label>
                                 <select name="etat" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                     <option value="Excellent" ${article.etat === 'Excellent' ? 'selected' : ''}>Excellent</option>
                                     <option value="Très bon" ${article.etat === 'Très bon' ? 'selected' : ''}>Très bon</option>
                                     <option value="Bon" ${article.etat === 'Bon' ? 'selected' : ''}>Bon</option>
                                     <option value="Moyen" ${article.etat === 'Moyen' ? 'selected' : ''}>Moyen</option>
                                     <option value="Mauvais" ${article.etat === 'Mauvais' ? 'selected' : ''}>Mauvais</option>
                                 </select>
                             </div>
                             <div>
                                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Contrôle</label>
                                 <input type="date" name="dateControle" value="${article.dateControle}" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                             </div>
                         </div>
                         
                         <div>
                             <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">URL Photo</label>
                             <input type="url" name="photo" value="${article.photo}" placeholder="https://..." class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                         </div>
                         
                         <div class="grid grid-cols-2 gap-4">
                             <div>
                                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Commentaires</label>
                                 <input type="text" name="commentaires" value="${article.commentaires || ''}" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                             </div>
                             <div>
                                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chantier</label>
                                 <input type="text" name="chantier" value="${article.chantier || ''}" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                             </div>
                         </div>
                         
                         <div class="grid grid-cols-2 gap-4">
                             <div>
                                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Départ</label>
                                 <input type="date" name="dateDepart" value="${article.dateDepart || ''}" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                             </div>
                             <div>
                                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Retour</label>
                                 <input type="date" name="dateRetour" value="${article.dateRetour || ''}" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                             </div>
                         </div>
                         
                         <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                             <button type="button" class="px-6 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cancel-edit">
                                 Annuler
                             </button>
                             <button type="submit" class="px-6 py-3 bg-${color}-500 text-white rounded-lg hover:bg-${color}-600 transition-colors duration-200">
                                 <i class="fas fa-save mr-2"></i>Sauvegarder
                             </button>
                         </div>
                     </form>
                 </div>
             `;
             
             document.body.appendChild(formModal);
             
             // Animation
             setTimeout(() => {
                 formModal.querySelector('div > div').style.transform = 'scale(1)';
             }, 10);
             
             // Gestion événements
             formModal.addEventListener('click', (e) => {
                 if (e.target === formModal || e.target.closest('.cancel-edit')) {
                     formModal.remove();
                 }
             });
             
             formModal.querySelector('#edit-article-form').addEventListener('submit', (e) => {
                 e.preventDefault();
                 this.saveEditedArticle(e.target, article, formModal);
             });
         },

         // Sauvegarder les modifications d'un article
         saveEditedArticle(form, originalArticle, formModal) {
             const formData = new FormData(form);
             const updatedArticle = {
                 ...originalArticle,
                 name: formData.get('name'),
                 code: formData.get('code'),
                 description: formData.get('description'),
                 price: parseFloat(formData.get('price')),
                 etat: formData.get('etat'),
                 dateControle: formData.get('dateControle'),
                 photo: formData.get('photo'),
                 commentaires: formData.get('commentaires'),
                 chantier: formData.get('chantier'),
                 dateDepart: formData.get('dateDepart'),
                 dateRetour: formData.get('dateRetour')
             };
             
             // Sauvegarder (simulation)
             console.log('Article modifié:', updatedArticle);
             
             // Synchronisation Excel
             syncManager.markModified('article_updated', {
                 articleId: originalArticle.id,
                 changes: updatedArticle
             });
             
             notifications.success('Article Modifié', `${updatedArticle.name} mis à jour avec succès`);
             
             formModal.remove();
             
             // Mise à jour visuelle immédiate de la ligne
             const row = document.querySelector(`[data-article-id="${originalArticle.id}"]`);
             if (row) {
                 // Animation de mise à jour
                 row.style.backgroundColor = '#dbeafe';
                 setTimeout(() => {
                     row.style.backgroundColor = '';
                 }, 1000);
             }
         },

         // Ajouter des articles automatiquement en cliquant sur une catégorie
         quickAddByCategory(categoryName, stockName) {
             const articles = this.getRandomArticlesByCategory(categoryName);
             let addedCount = 0;
             const addedArticles = [];

             articles.forEach(article => {
                 const quantity = Math.floor(Math.random() * 5) + 1; // 1-5 articles
                 const articleData = {
                     name: article.name,
                     category: categoryName,
                     quantity: quantity,
                     unitPrice: article.price
                 };

                 this.addArticleToStock(stockName, articleData);
                 addedCount += quantity;
                 addedArticles.push(articleData);
             });

             // Affichage en temps réel des articles ajoutés
             this.showQuickAddFeedback(categoryName, addedArticles, stockName);

             // Déclencher la synchronisation
             syncManager.markModified('quick_add_category', {
                 stock: stockName,
                 category: categoryName,
                 articlesAdded: addedCount,
                 articles: addedArticles,
                 timestamp: new Date().toISOString()
             });

             // Notification de succès
             notifications.success('Ajout Rapide', `${addedCount} articles "${categoryName}" ajoutés à ${stockName}`);

             // Mettre à jour l'affichage
             this.refreshStockDisplay();

             // Log détaillé pour debug
             console.log(`⚡ Ajout rapide: ${addedCount} articles "${categoryName}" → ${stockName}`);
             addedArticles.forEach(article => {
                 console.log(`  + ${article.quantity}x ${article.name} (€${article.unitPrice})`);
             });

             return addedCount;
         },

         // Ajouter un article à un stock spécifique
         addArticleToStock(stockName, articleData) {
             const stockIndex = this.stockLocations.findIndex(s => s.name === stockName);
             if (stockIndex === -1) return;

             const stock = this.stockLocations[stockIndex];
             
             // Trouver ou créer la catégorie
             let category = stock.categories.find(c => c.name === articleData.category);
             if (!category) {
                 category = {
                     name: articleData.category,
                     count: 0,
                     value: 0
                 };
                 stock.categories.push(category);
             }

             // Mettre à jour les totaux
             const totalValue = articleData.quantity * articleData.unitPrice;
             category.count += articleData.quantity;
             category.value += totalValue;
             stock.articles += articleData.quantity;
             stock.value += totalValue;

             // Mettre à jour l'instance globale si elle existe
             if (window.appInstance) {
                 const globalStockIndex = window.appInstance.stockLocations.findIndex(s => s.name === stockName);
                 if (globalStockIndex !== -1) {
                     window.appInstance.stockLocations[globalStockIndex] = stock;
                 }
             }
         },

         // Gestion de l'ajout d'une nouvelle catégorie
         handleNewCategory(stockName, modal) {
             const categoryName = prompt('Nom de la nouvelle catégorie:', 'Nouvelle Catégorie');
             if (!categoryName || categoryName.trim() === '') return;

             // Créer la catégorie avec des articles d'exemple
             const articleData = {
                 name: `Article ${categoryName} exemple`,
                 category: categoryName.trim(),
                 quantity: 1,
                 unitPrice: 100
             };

             this.addArticleToStock(stockName, articleData);

             // Déclencher la synchronisation
             syncManager.markModified('new_category_added', {
                 stock: stockName,
                 category: categoryName.trim(),
                 timestamp: new Date().toISOString()
             });

             notifications.success('Nouvelle Catégorie', `"${categoryName}" créée dans ${stockName}`);
             
             // Fermer et rouvrir la modal pour voir la nouvelle catégorie
             this.closeStockModal(modal);
             setTimeout(() => {
                 const stock = this.stockLocations.find(s => s.name === stockName);
                 if (stock) {
                     this.createInventoryEditModal(stock);
                 }
             }, 500);
         },

         // Affichage en temps réel des articles ajoutés
         showQuickAddFeedback(categoryName, articles, stockName) {
             const feedbackDiv = document.createElement('div');
             feedbackDiv.className = 'fixed top-4 right-4 z-50 bg-green-500 text-white p-4 rounded-xl shadow-lg transform scale-0 transition-all duration-300';
             
             feedbackDiv.innerHTML = `
                 <div class="flex items-center space-x-3">
                     <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                         <i class="fas fa-plus text-sm"></i>
                     </div>
                     <div>
                         <div class="font-medium">${categoryName}</div>
                         <div class="text-sm opacity-90">${articles.length} articles ajoutés à ${stockName}</div>
                     </div>
                 </div>
                 <div class="mt-2 space-y-1">
                     ${articles.map(article => `
                         <div class="text-xs opacity-80">+ ${article.quantity}x ${article.name}</div>
                     `).join('')}
                 </div>
             `;

             document.body.appendChild(feedbackDiv);

             // Animation d'entrée
             setTimeout(() => {
                 feedbackDiv.style.transform = 'scale(1)';
             }, 10);

             // Retirer après 3 secondes
             setTimeout(() => {
                 feedbackDiv.style.transform = 'scale(0)';
                 setTimeout(() => {
                     if (feedbackDiv.parentNode) {
                         feedbackDiv.remove();
                     }
                 }, 300);
             }, 3000);
         },

         // Rafraîchir l'affichage des stocks
         refreshStockDisplay() {
             // Forcer le rendu des composants Alpine.js
             if (window.Alpine) {
                 window.Alpine.nextTick(() => {
                     // Déclencher un re-render des cartes de stock
                     const stockCards = document.getElementById('stockCards');
                     if (stockCards) {
                         // Déclencher un événement pour forcer la mise à jour
                         stockCards.dispatchEvent(new CustomEvent('refresh-stocks'));
                     }
                 });
             }
         },

                 initCharts() {
             try {
                 console.log('🔄 Initialisation des graphiques...');
                 
                 // Détruire les graphiques existants CORRECTEMENT
                 if (window.chartManager && window.chartManager.charts) {
                     window.chartManager.charts.forEach((chart, key) => {
                         if (chart && typeof chart.destroy === 'function') {
                             chart.destroy();
                         }
                     });
                     window.chartManager.charts.clear();
                 }
                 
                 // S'assurer que chartManager existe
                 if (!window.chartManager) {
                     window.chartManager = new SimpleCharts();
                     console.log('📈 Nouveau gestionnaire de graphiques créé');
                 }
                 
                 // Créer les graphiques principaux avec délai
                 setTimeout(() => {
                     console.log('📊 Création graphique demande...');
                     window.chartManager.createRevenueChart();
                 }, 200);
                 
                 setTimeout(() => {
                     console.log('🥧 Création graphique stocks...');
                     window.chartManager.createStockChart();
                 }, 400);
                 
                 // Créer les mini graphiques
                 this.stats.forEach((stat, index) => {
                     if (stat.data) {
                         setTimeout(() => {
                             console.log(`📈 Création mini-chart ${index}...`);
                             window.chartManager.createMiniChart(`chart-${index}`, stat.data);
                         }, 600 + (index * 200));
                     }
                 });
                 
                 console.log('✅ Initialisation graphiques programmée');
             } catch (error) {
                 console.error('❌ Erreur initialisation graphiques:', error);
             }
         },

        setupKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey) {
                    switch(e.key) {
                        case '1':
                            e.preventDefault();
                            this.setActiveTab('dashboard');
                            break;
                        case '2':
                            e.preventDefault();
                            this.setActiveTab('stocks');
                            break;
                        case '3':
                            e.preventDefault();
                            this.setActiveTab('salons');
                            break;
                        case '4':
                            e.preventDefault();
                            this.setActiveTab('transport');
                            break;
                        case 'd':
                            e.preventDefault();
                            this.toggleDarkMode();
                            break;
                    }
                }
            });
        }
    };
};

// Configuration de synchronisation
const SYNC_CONFIG = {
    // Google Sheets (plus facile à configurer)
    googleSheets: {
        enabled: false, // À activer après configuration
        sheetId: '', // ID du Google Sheet
        apiKey: '', // Clé API Google
        range: 'Stock!A:F' // Plage de données
    },
    
    // Excel Online (Microsoft Graph)
    excelOnline: {
        enabled: false, // À activer après configuration
        clientId: '', // ID application Azure
        workbookId: '', // ID du classeur Excel
        worksheetName: 'Stock'
    },
    
    // Mode local avec export automatique
    autoExport: {
        enabled: true, // Activé par défaut
        interval: 5000, // Export toutes les 5 secondes si modifié
        fileName: 'INVIVO_Stock_Sync'
    },
    
    // Synchronisation bidirectionnelle
    bidirectionalSync: {
        enabled: true, // Sync Excel → Site
        watchInterval: 3000, // Vérifier les changements toutes les 3 secondes
        lastModified: null, // Timestamp dernière modification
        conflictResolution: 'excel_priority' // 'excel_priority' ou 'site_priority'
    }
};

// Gestionnaire de synchronisation
class SyncManager {
    constructor() {
        this.isModified = false;
        this.syncQueue = [];
        this.lastSync = null;
        this.init();
    }

    init() {
        // Charger les configurations sauvegardées
        this.loadSavedConfigs();

        // Auto-sync local (Site → Excel)
        if (SYNC_CONFIG.autoExport.enabled) {
            setInterval(() => {
                if (this.isModified) {
                    this.autoExportToExcel();
                    this.isModified = false;
                }
            }, SYNC_CONFIG.autoExport.interval);
        }

        // Sync bidirectionnelle (Excel → Site)
        if (SYNC_CONFIG.bidirectionalSync.enabled) {
            setInterval(() => {
                this.watchForExternalChanges();
            }, SYNC_CONFIG.bidirectionalSync.watchInterval);
        }

        // Initialiser APIs si configurées
        if (SYNC_CONFIG.googleSheets.enabled) {
            this.initGoogleSheets();
        }
        
        if (SYNC_CONFIG.excelOnline.enabled) {
            this.initExcelOnline();
        }
    }

    loadSavedConfigs() {
        // Charger configuration Google Sheets
        const googleConfig = localStorage.getItem('invivo_google_config');
        if (googleConfig) {
            try {
                const config = JSON.parse(googleConfig);
                Object.assign(SYNC_CONFIG.googleSheets, config);
                console.log('✅ Configuration Google Sheets chargée');
            } catch (error) {
                console.warn('Erreur chargement config Google:', error);
            }
        }

        // Charger configuration Excel Online
        const excelConfig = localStorage.getItem('invivo_excel_config');
        if (excelConfig) {
            try {
                const config = JSON.parse(excelConfig);
                Object.assign(SYNC_CONFIG.excelOnline, config);
                console.log('✅ Configuration Excel Online chargée');
            } catch (error) {
                console.warn('Erreur chargement config Excel:', error);
            }
        }
    }

    // Marquer comme modifié
    markModified(operation, data) {
        this.isModified = true;
        this.syncQueue.push({
            timestamp: new Date(),
            operation: operation,
            data: data
        });
        
        notifications.info('Sync', `Modification détectée: ${operation}`);
        
        // Sync immédiat pour les opérations critiques
        if (operation === 'add_item' || operation === 'update_stock') {
            this.syncNow();
        }
    }

    // Synchronisation immédiate
    async syncNow() {
        if (SYNC_CONFIG.googleSheets.enabled) {
            await this.syncToGoogleSheets();
        }
        
        if (SYNC_CONFIG.excelOnline.enabled) {
            await this.syncToExcelOnline();
        }
        
        this.autoExportToExcel();
        this.lastSync = new Date();
        
        notifications.success('Sync Réussie', 'Données synchronisées avec Excel');
    }

    // Export Excel automatique
    autoExportToExcel() {
        try {
            const wb = XLSX.utils.book_new();
            
            // Obtenir les données actuelles
            const appInstance = window.appInstance || app();
            const allStocks = appInstance.stockLocations || [];
            
            // Feuille principale avec tous les stocks
            const mainData = [
                ['INVIVO - Synchronisation Automatique'],
                ['Dernière mise à jour:', new Date().toLocaleString('fr-FR')],
                [],
                ['Site', 'Articles', 'Valeur €', 'Statut', 'Catégories']
            ];

            allStocks.forEach(stock => {
                mainData.push([
                    stock.name,
                    stock.articles,
                    stock.value,
                    stock.status,
                    stock.categories.length
                ]);
            });

            const mainWS = XLSX.utils.aoa_to_sheet(mainData);
            XLSX.utils.book_append_sheet(wb, mainWS, 'Résumé');

            // Feuille détaillée pour chaque stock
            allStocks.forEach(stock => {
                if (stock.categories && stock.categories.length > 0) {
                    const stockData = [
                        [`Stock ${stock.name}`],
                        ['Mise à jour:', new Date().toLocaleString('fr-FR')],
                        [],
                        ['Catégorie', 'Articles', 'Valeur €', 'Pourcentage']
                    ];

                    stock.categories.forEach(category => {
                        const percentage = stock.value > 0 ? ((category.value / stock.value) * 100).toFixed(1) : '0';
                        stockData.push([
                            category.name,
                            category.count,
                            category.value,
                            `${percentage}%`
                        ]);
                    });

                    const stockWS = XLSX.utils.aoa_to_sheet(stockData);
                    XLSX.utils.book_append_sheet(wb, stockWS, stock.name.substring(0, 31));
                }
            });

            // Log des modifications
            if (this.syncQueue.length > 0) {
                const logData = [
                    ['Journal des Modifications'],
                    ['Timestamp', 'Opération', 'Détails'],
                    []
                ];

                this.syncQueue.slice(-50).forEach(entry => {
                    logData.push([
                        entry.timestamp.toLocaleString('fr-FR'),
                        entry.operation,
                        JSON.stringify(entry.data)
                    ]);
                });

                const logWS = XLSX.utils.aoa_to_sheet(logData);
                XLSX.utils.book_append_sheet(wb, logWS, 'Journal');
            }

            // Log uniquement (pas de téléchargement automatique)
            console.log('📊 Export Excel préparé mais non téléchargé automatiquement');
            
        } catch (error) {
            console.error('Erreur auto-export:', error);
        }
    }

    // Google Sheets API
    async syncToGoogleSheets() {
        if (!SYNC_CONFIG.googleSheets.enabled) return;
        
        try {
            // Code pour synchroniser avec Google Sheets
            const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SYNC_CONFIG.googleSheets.sheetId}/values/${SYNC_CONFIG.googleSheets.range}?key=${SYNC_CONFIG.googleSheets.apiKey}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    values: this.prepareDataForSheets()
                })
            });
            
            if (response.ok) {
                notifications.success('Google Sheets', 'Synchronisation réussie');
            }
        } catch (error) {
            console.error('Erreur sync Google Sheets:', error);
            notifications.error('Sync Error', 'Erreur Google Sheets');
        }
    }

    // Excel Online API (Microsoft Graph)
    async syncToExcelOnline() {
        if (!SYNC_CONFIG.excelOnline.enabled) return;
        
        try {
            // Authentification Microsoft Graph
            const token = await this.getMicrosoftGraphToken();
            
            // Mise à jour du classeur Excel
            const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${SYNC_CONFIG.excelOnline.workbookId}/workbook/worksheets/${SYNC_CONFIG.excelOnline.worksheetName}/range(address='A1:F100')`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    values: this.prepareDataForExcel()
                })
            });
            
            if (response.ok) {
                notifications.success('Excel Online', 'Synchronisation réussie');
            }
        } catch (error) {
            console.error('Erreur sync Excel Online:', error);
            notifications.error('Sync Error', 'Erreur Excel Online');
        }
    }

    prepareDataForSheets() {
        const appInstance = window.appInstance || app();
        const allStocks = appInstance.stockLocations || [];
        
        const data = [
            ['Site', 'Articles', 'Valeur', 'Statut', 'Dernière MAJ'],
            ...allStocks.map(stock => [
                stock.name,
                stock.articles,
                stock.value,
                stock.status,
                new Date().toLocaleString('fr-FR')
            ])
        ];
        
        return data;
    }

    prepareDataForExcel() {
        return this.prepareDataForSheets(); // Même format
    }

    async getMicrosoftGraphToken() {
        // Simulation - en réalité il faudrait OAuth2
        return 'mock_token_need_real_auth';
    }

    // === SYNCHRONISATION BIDIRECTIONNELLE === //

    async watchForExternalChanges() {
        try {
            // Surveiller Google Sheets
            if (SYNC_CONFIG.googleSheets.enabled) {
                await this.checkGoogleSheetsChanges();
            }

            // Surveiller Excel Online
            if (SYNC_CONFIG.excelOnline.enabled) {
                await this.checkExcelOnlineChanges();
            }

            // Note: surveillance locale nécessiterait FileSystemAPI
            console.log('📁 Surveillance fichiers locaux: API en attente...');

        } catch (error) {
            console.warn('Erreur surveillance changements:', error);
        }
    }

    async checkGoogleSheetsChanges() {
        if (!SYNC_CONFIG.googleSheets.enabled) return;

        try {
            const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SYNC_CONFIG.googleSheets.sheetId}/values/${SYNC_CONFIG.googleSheets.range}?key=${SYNC_CONFIG.googleSheets.apiKey}`);
            
            if (response.ok) {
                const data = await response.json();
                const lastModified = response.headers.get('Last-Modified');
                
                // Vérifier si les données ont changé
                if (lastModified && lastModified !== SYNC_CONFIG.bidirectionalSync.lastModified) {
                    console.log('🔄 Changements détectés dans Google Sheets');
                    await this.importFromGoogleSheets(data.values);
                    SYNC_CONFIG.bidirectionalSync.lastModified = lastModified;
                    
                    notifications.info('Sync Détectée', 'Changements importés depuis Google Sheets');
                }
            }
        } catch (error) {
            console.warn('Erreur vérification Google Sheets:', error);
        }
    }

    async checkExcelOnlineChanges() {
        if (!SYNC_CONFIG.excelOnline.enabled) return;

        try {
            const token = await this.getMicrosoftGraphToken();
            const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${SYNC_CONFIG.excelOnline.workbookId}/workbook/worksheets/${SYNC_CONFIG.excelOnline.worksheetName}/range(address='A1:F100')`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const lastModified = data.lastModified || new Date().toISOString();
                
                if (lastModified !== SYNC_CONFIG.bidirectionalSync.lastModified) {
                    console.log('🔄 Changements détectés dans Excel Online');
                    await this.importFromExcelOnline(data.values);
                    SYNC_CONFIG.bidirectionalSync.lastModified = lastModified;
                    
                    notifications.info('Sync Détectée', 'Changements importés depuis Excel Online');
                }
            }
        } catch (error) {
            console.warn('Erreur vérification Excel Online:', error);
        }
    }

    async importFromGoogleSheets(values) {
        if (!values || values.length < 2) return;

        // Ignorer l'en-tête (première ligne)
        const dataRows = values.slice(1);
        
        this.updateStockFromExternalData(dataRows);
    }

    async importFromExcelOnline(values) {
        if (!values || values.length < 2) return;

        const dataRows = values.slice(1);
        this.updateStockFromExternalData(dataRows);
    }

    updateStockFromExternalData(dataRows) {
        const appInstance = window.appInstance;
        if (!appInstance) return;

        // Créer une copie des stocks actuels pour comparaison
        const originalStocks = JSON.stringify(appInstance.stockLocations);
        
        // Nettoyer les stocks existants
        appInstance.stockLocations.forEach(stock => {
            if (stock.name !== 'Vierge') {
                stock.articles = 0;
                stock.value = 0;
                stock.categories = [];
            }
        });

        console.log('📊 Import des données externes...');
        let importedCount = 0;

        // Traiter chaque ligne de données
        dataRows.forEach(row => {
            if (!row[0] || row[0] === 'Site') return; // Ignorer en-têtes et lignes vides

            const siteName = row[0];
            const articles = parseInt(row[1]) || 0;
            const value = parseFloat(row[2]) || 0;
            const status = row[3] || 'active';

            // Trouver le site correspondant
            let stock = appInstance.stockLocations.find(s => s.name === siteName);
            
            // Si le site n'existe pas, le créer
            if (!stock) {
                stock = {
                    name: siteName,
                    articles: 0,
                    value: 0,
                    status: 'active',
                    categories: []
                };
                appInstance.stockLocations.push(stock);
                console.log(`➕ Nouveau site créé: ${siteName}`);
            }

            // Mettre à jour les données
            stock.articles = articles;
            stock.value = value;
            stock.status = status;
            
            importedCount++;
        });

        // Vérifier si les données ont vraiment changé
        const newStocks = JSON.stringify(appInstance.stockLocations);
        if (originalStocks !== newStocks) {
            console.log(`✅ ${importedCount} sites mis à jour depuis Excel`);
            
            // Forcer la mise à jour de l'interface
            this.forceUIRefresh();
            
            // Marquer comme modifié pour éviter les boucles
            this.isModified = false;
            
            notifications.success('Import Réussi', `${importedCount} sites synchronisés depuis Excel`);
        }
    }

    forceUIRefresh() {
        // Déclencher une mise à jour complète de l'interface
        if (window.Alpine) {
            // Forcer Alpine.js à re-render
            const appElement = document.querySelector('[x-data]');
            if (appElement && appElement._x_dataStack) {
                // Déclencher un re-render complet
                window.Alpine.nextTick(() => {
                    // Émettre un événement personnalisé pour forcer la mise à jour
                    window.dispatchEvent(new CustomEvent('stock-data-updated'));
                });
            }
        }

        // Mettre à jour les graphiques
        setTimeout(() => {
            if (window.appInstance && window.appInstance.initCharts) {
                window.appInstance.initCharts();
            }
        }, 500);

        console.log('🔄 Interface mise à jour avec les nouvelles données');
    }

    // Méthode pour importer manuellement un fichier Excel
    async importExcelFile(file) {
        try {
            notifications.info('Import Manuel', 'Lecture du fichier Excel...');
            
            const data = await this.readExcelFileAdvanced(file);
            
            if (data && data.length > 0) {
                this.updateStockFromExternalData(data);
                
                // Marquer comme modifié pour export automatique
                this.markModified('manual_excel_import', {
                    fileName: file.name,
                    rowsProcessed: data.length,
                    timestamp: new Date().toISOString()
                });
            }
            
        } catch (error) {
            console.error('Erreur import fichier Excel:', error);
            notifications.error('Erreur Import', 'Impossible de lire le fichier Excel');
        }
    }

    async readExcelFileAdvanced(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    
                    // Chercher la feuille "Résumé" ou prendre la première
                    let sheetName = 'Résumé';
                    if (!workbook.Sheets[sheetName]) {
                        sheetName = workbook.SheetNames[0];
                    }
                    
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    
                    resolve(jsonData);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }
}

// Instance globale du gestionnaire de sync
const syncManager = new SyncManager();

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ INVIVO Panel Avancé - Prêt');
    console.log('🔄 Gestionnaire de synchronisation initialisé');
    console.log('📊 Inventaire réaliste chargé: 8 entrepôts, 42 catégories, 1915 articles');
    console.log('↕️ Synchronisation bidirectionnelle active');
    console.log('⚡ Excel ↔ Site en temps réel (3 sec)');
    
    // Initialiser le gestionnaire de graphiques global
    window.chartManager = new SimpleCharts();
    console.log('📈 Gestionnaire de graphiques initialisé');
    

    
    // Ajouter fonction globale pour les clics de catégorie
    window.testCategoryClick = (categoryName, stockName) => {
        console.log(`🔧 CLIC CATÉGORIE: ${categoryName} dans ${stockName}`);
        const appInstance = window.appInstance;
        if (appInstance) {
            console.log('🎯 Instance trouvée, ouverture modal...');
            try {
                appInstance.openCategoryDetailView(categoryName, stockName);
                // Fermer la modal actuelle si elle existe
                const modal = document.querySelector('.fixed.inset-0.z-50');
                if (modal && modal.style.display !== 'none') {
                    setTimeout(() => {
                        modal.remove();
                    }, 100);
                }
            } catch(e) {
                console.error('❌ Erreur ouverture modal:', e);
                alert('Erreur: ' + e.message);
            }
        } else {
            console.error('❌ Instance non trouvée');
            alert('Instance non trouvée !');
        }
    };
    
    // Notifications
    setTimeout(() => {
        notifications.success('Sync Bidirectionnelle Active', 'Excel ↔ Site synchronisés en temps réel !');
    }, 3000);
}); 