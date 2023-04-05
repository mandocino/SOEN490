export const isDevMode = process.env.REACT_APP_DEV_MODE === 'true';
export const hostname = isDevMode ? "localhost" : "iku.ddns.net";
