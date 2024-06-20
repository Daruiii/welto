const mailjet = require('node-mailjet').apiConnect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET);
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const premailer = require('premailer-api');

// Load email texts from the JSON file
const loadTexts = (locale) => {
    const textsPath = path.join(__dirname, `../locales/${locale}.json`);
    return JSON.parse(fs.readFileSync(textsPath, 'utf8'));
};

// Load and compile the HTML template
const loadTemplate = (templateName, locale, context) => {
    const texts = loadTexts(locale);
    const templatePath = path.join(__dirname, `../templates/${templateName}.html`);
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const compiledTemplate = handlebars.compile(templateContent);
    return compiledTemplate({ ...context, ...texts[templateName].html });
};

const sendEmail = async (to, templateName, context, locale, firstName) => {
    try {
        const texts = loadTexts(locale);
        const htmlContent = loadTemplate(templateName, locale, context);
        const textTemplate = handlebars.compile(`${texts[templateName].text} ${context.actionLink}`);
        const textContent = textTemplate(context);

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
                    Subject: texts[templateName].subject,
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