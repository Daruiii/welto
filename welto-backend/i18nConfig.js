const i18n = require('i18n');
const path = require('path');

i18n.configure({
    locales: ['en', 'fr'], // Liste des langues supportées
    directory: path.join(__dirname, 'locales'), // Dossier où se trouvent les fichiers de traduction
    defaultLocale: 'en', // Langue par défaut
    queryParameter: 'lang', // Paramètre de l'URL pour spécifier la langue
    cookie: 'lang', // Nom du cookie pour stocker la langue
    header: 'accept-language', // En-tête HTTP pour détecter la langue du navigateur
    autoReload: true, // Recharge automatique des fichiers de langue si changés
    updateFiles: false // Empêche la mise à jour automatique des fichiers de langue
});

module.exports = i18n;
