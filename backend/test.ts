import { translate } from '@vitalets/google-translate-api';

translate('Привет, мир! Как дела?', { to: 'en' })
    .then((response) => {
        console.log(response.text) // => 'Hello World! How are you?'
    });
