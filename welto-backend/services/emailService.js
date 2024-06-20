const mailjet = require('node-mailjet').apiConnect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET);
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const premailer = require('premailer-api');

// Charger les textes d'email depuis le fichier JSON
const loadTexts = (locale) => {
    const textsPath = path.join(__dirname, `../locales/${locale}/emailTexts.json`);
    return JSON.parse(fs.readFileSync(textsPath, 'utf8'));
};

// Charger et compiler le template HTML
const loadTemplate = (templateName, locale, context) => {
    const texts = loadTexts(locale);
    const templatePath = path.join(__dirname, `../templates/${templateName}.html`);
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const compiledTemplate = handlebars.compile(templateContent);
    return compiledTemplate({ ...context, ...texts[`${templateName}_html`] });
};

const sendEmail = async (to, templateName, context, locale, firstName) => {
    try {
        const htmlContent = loadTemplate(templateName, locale, context);
        // console log le début de htmlContent pour voir si le contenu est correct
        console.log(htmlContent.substring(0, 1000));
        const texts = loadTexts(locale);
        console.log(context); // the verifyLink is in the context

        // Utilisez handlebars pour compiler le texte de manière cohérente avec le HTML
        const textTemplate = handlebars.compile(`${texts[`${templateName}_text`]} ${context.verifyLink}`);
        const textContent = textTemplate(context);

        // Préparez la requête d'envoi d'email avec le contenu HTML et texte
        const request = mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: process.env.MAILJET_FROM_EMAIL,
                        Name: "Welto"
                    },
                    To: [
                        {
                            Email: to,
                            Name: firstName
                        }
                    ],
                    Subject: texts[`${templateName}_subject`],
                    TextPart: textContent,
                    HTMLPart: htmlContent
                }
            ]
        });

        const result = await request;
        console.log(`Email sent to ${to}`, result.body);
    } catch (error) {
        console.error('Error sending email:', error);
        if (error.response) {
            console.error(error.response.body);
        }
    }
};


module.exports = sendEmail;
