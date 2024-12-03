const navigationData = [
    { title: "প্রচ্ছদ", href: "/" },
    {
        title: "প্রশাসন", subItems: [
            { title: "Mission", href: "/about/mission" },
            { title: "Vision", href: "/about/vision" },
            { title: "Aim & Objective", href: "/about/aim" },
        ]
    },
    {
        title: "শিক্ষার্থীদের তথ্য", subItems: [
            { title: "Member List", href: "/member/list" },
            { title: "About Membership", href: "/member/about-membership" },
            { title: "Membership Criteria", href: "/member/membership-criteria" },
            { title: "Membership Fee", href: "/member/membership-fee" },
            { title: "Membership Upgrade", href: "/member/membership-upgrade" },
        ]
    },
    {
        title: "ভর্তি", subItems: [
            { title: "ভর্তি তথ্য", href: "/member/list" },
            { title: "ভর্তি ফরম", href: "/member/about-membership" },
        ]
    },
    { title: "ডাউনলোড", href: "/legal-document" },
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