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
    //────────────────────────────────────────────
    //? API: ---- About
    //────────────────────────────────────────────
    GET_CAROUSEL : '/home/carousel',
    GET_CAROUSEL_BY_ID : '/home/carousel/',
    CREATE_CAROUSEL : '/admin/home/carousel',
    UPDATE_CAROUSEL : '/admin/home/carousel/',
    DELETE_CAROUSEL : '/admin/home/carousel/',

    GET_FAQ : '/faq',
    GET_FAQ_BY_ID : '/faq/',
    CREATE_FAQ : '/admin/faq',
    UPDATE_FAQ : '/admin/faq/',
    DELETE_FAQ : '/admin/faq/',

    GET_MORE_ABOUT_US : '/about-us',
    GET_MORE_ABOUT_US_BY_ID : '/about-us/',
    CREATE_MORE_ABOUT_US : '/admin/about-us',
    UPDATE_MORE_ABOUT_US : '/admin/about-us/',
    DELETE_MORE_ABOUT_US : '/admin/about-us/',
}