const navigationData = [
    { title: "প্রচ্ছদ", href: "/" },
    {
        title: "প্রশাসন", subItems: [
            { title: "শিক্ষকবৃন্দ", href: "/about/mission" },
            { title: "প্রাক্তন প্রধান শিক্ষক", href: "/about/aim" },
            { title: "পরিচালনা পরিষদ", href: "/about/aim" },
        ]
    },
    {
        title: "ভর্তি", subItems: [
            { title: "ভর্তি তথ্য", href: "/member/list" },
            { title: "ভর্তি ফরম", href: "/member/about-membership" },
        ]
    },
    {
        title: "অন্যান্য", subItems: [
            { title: "কৃতি শিক্ষার্থী", href: "/about/vision" },
            { title: "শূণ্যপদের তালিকা", href: "/about/aim" },
            { title: "ছুটির তালিকা", href: "/about/aim" },
            { title: "যানবাহন সুবিধা", href: "/about/aim" },
        ]
    },
    { title: "রুটিন", href: "/legal-document" },
    { title: "ফলাফল", href: "/legal-document" },
    { title: "নোটিশ", href: "/legal-document" },
    { title: "ব্লগ", href: "/legal-document" },
    {
        title: "গ্যালারী", subItems: [
            { title: "ফটো গ্যালারী", href: "/media/photo" },
            { title: "ভিডিও গ্যালারী", href: "/media/video" },
        ]
    },
    { title: "যোগাযোগ", href: "/contact" }
];

export function getNavigationData(fields = []) {
    if (fields.length === 0) {
        return navigationData; // Return full data if no fields are specified
    }

    // Return only the items that match the specified titles in `fields`
    return navigationData.filter(item => fields.includes(item.title));
}

export default navigationData;