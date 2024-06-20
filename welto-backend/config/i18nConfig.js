const i18n = require('i18n');
const path = require('path');

i18n.configure({
    locales: ['en', 'fr'], // Langues disponibles
    directory: path.join(__dirname, '../locales'), // Chemin vers le dossier des traductions
    defaultLocale: 'en', // Langue par défaut
    queryParameter: 'lang', // Paramètre d'URL pour spécifier la langue
    cookie: 'lang', // Nom du cookie pour stocker la langue
    autoReload: true, // Recharge automatique des fichiers de langue si changés
    updateFiles: false, // Empêche la mise à jour automatique des fichiers de langue
    objectNotation: true // Utilisation de la notation à points pour organiser les fichiers de langue
});
console.log("Chemin absolu des locales :", path.resolve(__dirname, './locales'));
// check file in locales
console.log('Locales configurées :', i18n.getLocales());

module.exports = i18n;
