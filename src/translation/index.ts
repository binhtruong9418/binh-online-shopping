import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import translationEN from './resources/en.json';

const resources = {
    en: {
        translation: translationEN
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'vi',
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },

    });
export default i18n;
