const URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const VERSION = process.env.NEXT_PUBLIC_VERSION || 'v1';

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '';

const isServer = typeof window === 'undefined';

const apiConfig = {
    BASE_URL: isServer ? `${URL}/api/${VERSION}` : `/api/${VERSION}`, // Absolute URL for server, relative for client

    UNSPLASH_ACCESS_KEY,

    //────────────────────────────────────────────
    //? API: ---- Auth
    //────────────────────────────────────────────
    ADMIN_LOGIN: '/auth/admin/login',
    REFRESH_TOKEN: '/auth/refresh-token',

    //────────────────────────────────────────────
    //? API: ---- Setting
    //────────────────────────────────────────────
    GET_CONFIGURATION: '/configuration',
    CREATE_CONFIGURATION: '/admin/configuration',
    UPDATE_CONFIGURATION: '/admin/configuration',

    //────────────────────────────────────────────
    //? API: ---- About
    //────────────────────────────────────────────
    GET_CAROUSEL: '/home/carousel',
    GET_CAROUSEL_BY_ID: '/home/carousel/',
    CREATE_CAROUSEL: '/admin/home/carousel',
    UPDATE_CAROUSEL: '/admin/home/carousel/',
    DELETE_CAROUSEL: '/admin/home/carousel/',

    GET_FAQ: '/faq',
    GET_FAQ_BY_ID: '/faq/',
    CREATE_FAQ: '/admin/faq',
    UPDATE_FAQ: '/admin/faq/',
    DELETE_FAQ: '/admin/faq/',

    GET_SCHOOL_INFO: '/school/info',
    GET_SCHOOL_INFO_BY_ID: '/school/info/',
    CREATE_SCHOOL_INFO: '/admin/school/info',
    UPDATE_SCHOOL_INFO: '/admin/school/info/',
    DELETE_SCHOOL_INFO: '/admin/school/info/',

    GET_SCHOOL_ACHIEVEMENT: '/school/achievement',
    GET_SCHOOL_ACHIEVEMENT_BY_ID: '/school/achievement/',
    CREATE_SCHOOL_ACHIEVEMENT: '/admin/school/achievement',
    UPDATE_SCHOOL_ACHIEVEMENT: '/admin/school/achievement/',
    DELETE_SCHOOL_ACHIEVEMENT: '/admin/school/achievement/',

    GET_SCHOOL_SPEECH: '/school/speech',
    GET_SCHOOL_SPEECH_BY_ID: '/school/speech/',
    CREATE_SCHOOL_SPEECH: '/admin/school/speech',
    UPDATE_SCHOOL_SPEECH: '/admin/school/speech/',
    DELETE_SCHOOL_SPEECH: '/admin/school/speech/',

    GET_MORE_ABOUT_US: '/about-us',
    GET_MORE_ABOUT_US_BY_ID: '/about-us/',
    CREATE_MORE_ABOUT_US: '/admin/about-us',
    UPDATE_MORE_ABOUT_US: '/admin/about-us/',
    DELETE_MORE_ABOUT_US: '/admin/about-us/',

    //────────────────────────────────────────────
    //? API: ---- Faculty
    //────────────────────────────────────────────
    GET_FACULTY_All: '/faculty',
    GET_FACULTY_BY_CATEGORY: '/faculty/', //! e.g: /faculty/{teacher}
    GET_FACULTY_BY_CATEGORY_BY_ID: '/faculty/', //! e.g: /faculty/{teacher}/{id}
    CREATE_FACULTY_BY_CATEGORY: '/admin/faculty/', //! e.g: /faculty/{teacher}
    UPDATE_FACULTY_BY_CATEGORY: '/admin/faculty/', //! e.g: /faculty/{teacher}/{id}
    DELETE_FACULTY_BY_CATEGORY: '/admin/faculty/', //! e.g: /faculty/{teacher}/{id}

    GET_ACADEMIC_All: '/academic',
    GET_ACADEMIC_BY_CATEGORY: '/academic/', //! e.g: /academic/{admission_form}
    GET_ACADEMIC_BY_CATEGORY_BY_ID: '/academic/', //! e.g: /academic/{admission_form}/{id}
    CREATE_ACADEMIC_BY_CATEGORY: '/admin/academic/', //! e.g: /academic/{admission_form}
    UPDATE_ACADEMIC_BY_CATEGORY: '/admin/academic/', //! e.g: /academic/{admission_form}/{id}
    DELETE_ACADEMIC_BY_CATEGORY: '/admin/academic/', //! e.g: /academic/{admission_form}/{id}

    GET_ANNOUNCEMENT_All: '/announcement',
    GET_ANNOUNCEMENT_BY_CATEGORY: '/announcement/', //! e.g: /academic/{admission_form}
    GET_ANNOUNCEMENT_BY_CATEGORY_BY_ID: '/announcement/', //! e.g: /academic/{admission_form}/{id}
    CREATE_ANNOUNCEMENT_BY_CATEGORY: '/admin/announcement/', //! e.g: /academic/{admission_form}
    UPDATE_ANNOUNCEMENT_BY_CATEGORY: '/admin/announcement/', //! e.g: /academic/{admission_form}/{id}
    DELETE_ANNOUNCEMENT_BY_CATEGORY: '/admin/announcement/', //! e.g: /academic/{admission_form}/{id}

    GET_CAREER: '/career',
    GET_CAREER_BY_ID: '/career/',
    CREATE_CAREER: '/admin/career',
    UPDATE_CAREER: '/admin/career/',
    DELETE_CAREER: '/admin/career/',
};

export default apiConfig;
