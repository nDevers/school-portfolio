const URL = process.env.NEXT_PUBLIC_BASE_URL
const VERSION = process.env.NEXT_PUBLIC_VERSION

// const isServer = typeof window === 'undefined';

export default {
    // BASE_URL: isServer ? `${URL}/api/${VERSION}` : `/api/v1`,  // Absolute URL for server, relative for client
    BASE_URL: `${URL}/api/${VERSION}`,

    //────────────────────────────────────────────
    //? API: ---- Auth
    //────────────────────────────────────────────
    MEMBER_LOGIN : '/auth/login',
    ADMIN_LOGIN : '/auth/admin/login',
    SUPER_ADMIN_LOGIN : '/auth/super-admin/login',

    //────────────────────────────────────────────
    //? API: ---- Setting
    //────────────────────────────────────────────
    GET_GENERAL_INFO : '/settings/general',
    CREATE_GENERAL_INFO : '/admin/settings/general',

    //────────────────────────────────────────────
    //? API: ---- About
    //────────────────────────────────────────────
    GET_ABOUT_MISSION : '/about/mission',
    ABOUT_MISSION : '/admin/about/mission',

    GET_ABOUT_VISION : '/about/vision',
    ABOUT_VISION : '/admin/about/vision',

    GET_ABOUT_AIM_OBJECTIVE : '/about/aim-objective',
    ABOUT_AIM_OBJECTIVE : '/admin/about/aim-objective',

    //────────────────────────────────────────────
    //? API: ---- Membership
    //────────────────────────────────────────────
    GET_ABOUT_MEMBERSHIP : '/membership/about-membership',
    ABOUT_MEMBERSHIP : '/admin/membership/about-membership',

    GET_MEMBERSHIP_CRITERIA : '/membership/membership-criteria',
    MEMBERSHIP_CRITERIA : '/admin/membership/membership-criteria',

    GET_MEMBERSHIP_FEE : '/membership/membership-fee',
    MEMBERSHIP_FEE : '/admin/membership/membership-fee',
    //────────────────────────────────────────────
    //? API: ---- Member
    //────────────────────────────────────────────
    GET_MEMBER_LIST : '/member',
    GET_MEMBER_BY_ID : '/member/',
    CREATE_MEMBER : '/admin/member',
    UPDATE_MEMBER : '/admin/member/',
    DELETE_MEMBER : '/admin/member/',

    GET_MEMBER_TYPE : '/member/type',
    GET_MEMBER_STATUS : '/member/status',
    
    GET_MEMBER_COUNT : '/member/count',         // ! have to implement in home ui

    //────────────────────────────────────────────
    //? API: ---- Team
    //────────────────────────────────────────────
    GET_TEAM_LIST : '/team/executive',
    GET_TEAM_BY_ID : '/team/executive/',
    CREATE_TEAM_COMMITTEE : '/admin/team/executive',
    UPDATE_TEAM_COMMITTEE : '/admin/team/executive/',
    DELETE_TEAM_COMMITTEE : '/admin/team/executive/',

    GET_TEAM_TYPE : '/team/type',
    GET_TEAM_STATUS : '/team/status',
    //────────────────────────────────────────────
    //? API: ---- Event
    //────────────────────────────────────────────
    GET_EVENT_CATEGORY : '/event/category',
    CREATE_EVENT_CATEGORY : '/admin/event/category',
    UPDATE_EVENT_CATEGORY : '/admin/event/category/',
    DELETE_EVENT_CATEGORY : '/admin/event/category/',
    GET_EVENT_CATEGORY_BY_ID : '/event/category/',

    GET_EVENT_SUBCATEGORY : '/event/sub-category',
    CREATE_EVENT_SUBCATEGORY : '/admin/event/sub-category',
    UPDATE_EVENT_SUBCATEGORY : '/admin/event/sub-category/',
    DELETE_EVENT_SUBCATEGORY : '/admin/event/sub-category/',
    GET_EVENT_SUBCATEGORY_BY_ID : '/event/sub-category/',

    GET_EVENT_STATUS : '/event/status',
    CREATE_EVENT_STATUS : '/admin/event/status',
    UPDATE_EVENT_STATUS : '/admin/event/status/',
    DELETE_EVENT_STATUS : '/admin/event/status/',
    GET_EVENT_STATUS_BY_ID : '/event/status/',

    GET_EVENT : '/event',
    CREATE_EVENT : '/admin/event',
    UPDATE_EVENT : '/admin/event/',
    DELETE_EVENT : '/admin/event/',
    GET_EVENT_BY_ID : '/event/',
    //────────────────────────────────────────────
    //? API: ---- Event Special Forms
    //────────────────────────────────────────────
    GET_SCHOLARSHIP_FORM : '/event/form/special/scholarship',
    GET_SCHOLARSHIP_FORM_BY_ID : '/event/form/special/scholarship/',
    CREATE_SCHOLARSHIP_FORM : '/admin/event/form/special/scholarship',
    UPDATE_SCHOLARSHIP_FORM : '/admin/event/form/special/scholarship/',
    DELETE_SCHOLARSHIP_FORM : '/admin/event/form/special/scholarship/',
    //────────────────────────────────────────────
    //? API: ---- Eligible School
    //────────────────────────────────────────────
    GET_ELIGIBLE_SCHOOL : '/event/form/special/scholarship/eligible/school',
    GET_ELIGIBLE_SCHOOL_BY_ID : '/event/form/special/scholarship/eligible/school/',
    CREATE_ELIGIBLE_SCHOOL : '/admin/event/form/special/scholarship/eligible/school',
    UPDATE_ELIGIBLE_SCHOOL : '/admin/event/form/special/scholarship/eligible/school/',
    DELETE_ELIGIBLE_SCHOOL : '/admin/event/form/special/scholarship/eligible/school/',
    //────────────────────────────────────────────
    //? API: ---- Home
    //────────────────────────────────────────────
    GET_BENEFITS_OF_MEMBERS : '/home/benefits-of-member',
    GET_BENEFITS_OF_MEMBERS_BY_ID : '/home/benefits-of-member/',
    CREATE_BENEFITS_OF_MEMBERS : '/admin/home/benefits-of-member',
    UPDATE_BENEFITS_OF_MEMBERS : '/admin/home/benefits-of-member/',
    DELETE_BENEFITS_OF_MEMBERS : '/admin/home/benefits-of-member/',

    GET_CAROUSEL : '/home/carousel',
    GET_CAROUSEL_BY_ID : '/home/carousel/',
    CREATE_CAROUSEL : '/admin/home/carousel',
    UPDATE_CAROUSEL : '/admin/home/carousel/',
    DELETE_CAROUSEL : '/admin/home/carousel/',
    
    GET_MESSAGE : '/home/message',
    GET_MESSAGE_BY_ID : '/home/message/',
    CREATE_MESSAGE : '/admin/home/message',
    UPDATE_MESSAGE : '/admin/home/message/',
    DELETE_MESSAGE : '/admin/home/message/',
    //────────────────────────────────────────────
    //? API: ---- Media
    //────────────────────────────────────────────
    GET_NEWS : '/media/news',
    GET_NEWS_BY_ID : '/media/news/',
    CREATE_NEWS : '/admin/media/news',
    UPDATE_NEWS : '/admin/media/news/',
    DELETE_NEWS : '/admin/media/news/',

    GET_PHOTO : '/media/photo',
    GET_PHOTO_BY_ID : '/media/photo/',
    CREATE_PHOTO : '/admin/media/photo',
    UPDATE_PHOTO : '/admin/media/photo/',
    DELETE_PHOTO : '/admin/media/photo/',

    GET_VIDEO : '/media/video',
    GET_VIDEO_BY_ID : '/media/video/',
    CREATE_VIDEO : '/admin/media/video',
    UPDATE_VIDEO : '/admin/media/video/',
    DELETE_VIDEO : '/admin/media/video/',
    
    GET_NOTICE : '/notice',
    GET_NOTICE_BY_ID : '/notice/',
    CREATE_NOTICE : '/admin/notice',
    UPDATE_NOTICE : '/admin/notice/',
    DELETE_NOTICE : '/admin/notice/',
    //────────────────────────────────────────────
    //? API: ---- Finance
    //────────────────────────────────────────────
    GET_PAYMENT_METHOD : '/finance/payment-method',
    GET_PAYMENT_METHOD_BY_ID : '/finance/payment-method/',
    CREATE_PAYMENT_METHOD : '/admin/finance/payment-method',
    UPDATE_PAYMENT_METHOD : '/admin/finance/payment-method/',
    DELETE_PAYMENT_METHOD : '/admin/finance/payment-method/',

    GET_DONATION : '/finance/donation',
    GET_DONATION_BY_ID : '/finance/donation/',
    CREATE_DONATION : '/admin/finance/donation',
    UPDATE_DONATION : '/admin/finance/donation/',
    DELETE_DONATION : '/admin/finance/donation/',

    GET_BUDGET : '/finance/budget',
    GET_BUDGET_BY_ID : '/finance/budget/',
    CREATE_BUDGET : '/admin/finance/budget',
    UPDATE_BUDGET : '/admin/finance/budget/',
    DELETE_BUDGET : '/admin/finance/budget/',
}