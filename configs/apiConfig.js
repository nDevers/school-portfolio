const URL = process.env.NEXT_PUBLIC_BASE_URL
const VERSION = process.env.NEXT_PUBLIC_VERSION

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY

const isServer = typeof window === 'undefined';

export default {
    BASE_URL: isServer ? `${URL}/api/${VERSION}` : `/api/${VERSION}`,  // Absolute URL for server, relative for client

    UNSPLASH_ACCESS_KEY,

    //────────────────────────────────────────────
    //? API: ---- Auth
    //────────────────────────────────────────────
    ADMIN_LOGIN : '/auth/admin/login',
    REFRESH_TOKEN : '/auth/refresh-token',

    //────────────────────────────────────────────
    //? API: ---- Setting
    //────────────────────────────────────────────
    GET_CONFIGURATION : '/configuration',
    CREATE_CONFIGURATION : '/admin/configuration',
    UPDATE_CONFIGURATION : '/admin/configuration',
}