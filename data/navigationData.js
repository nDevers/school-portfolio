const navigationData = [
    { title: 'প্রচ্ছদ', href: '/' },
    {
        title: 'প্রশাসন',
        subItems: [
            { title: 'প্রধান শিক্ষকের বার্তা', href: '/academic/speech' },
            { title: 'শিক্ষকবৃন্দ', href: '/academic/teachers' },
            { title: 'প্রাক্তন প্রধান শিক্ষক', href: '/academic/teachers-ex' },
            { title: 'পরিচালনা পরিষদ', href: '/academic/board' },
        ],
    },
    {
        title: 'ভর্তি',
        subItems: [
            { title: 'ভর্তি তথ্য', href: '/admission/info' },
            { title: 'ভর্তি ফরম', href: '/admission/form' },
        ],
    },
    {
        title: 'অন্যান্য',
        subItems: [
            { title: 'কৃতি শিক্ষার্থী', href: '/other/meritorious-student' },
            { title: 'শূণ্যপদের তালিকা', href: '/other/career' },
            { title: 'ছুটির তালিকা', href: '/other/holiday' },
            { title: 'যানবাহন সুবিধা', href: '/other/transportation' },
        ],
    },
    { title: 'রুটিন', href: '/routine' },
    { title: 'ফলাফল', href: '/result' },
    { title: 'নোটিশ', href: '/notice' },
    { title: 'ব্লগ', href: '/blog' },
    {
        title: 'গ্যালারী',
        subItems: [
            { title: 'ফটো গ্যালারী', href: '/gallery/photo' },
            { title: 'ভিডিও গ্যালারী', href: '/gallery/video' },
        ],
    },
    { title: 'যোগাযোগ', href: '/contact' },
];

export function getNavigationData(fields = []) {
    if (fields.length === 0) {
        return navigationData; // Return full data if no fields are specified
    }

    // Return only the items that match the specified titles in `fields`
    return navigationData.filter((item) => fields.includes(item.title));
}

export default navigationData;
