import PageTitle from '@/components/admin/common/PageTitle';
import AcademicProfileCard from '@/components/card/AcademicProfileCard';
import PaginationController from '@/components/common/PaginationController';
import constConfig from '@/configs/constConfig';

// Dummy Data
const profiles = [
    {
        image: '/carousel/carousel (1).jpg',
        name: 'ড. মো. সাদিকুল ইসলাম',
        designation: 'অধ্যাপক, গণিত বিভাগ',
        address: 'ঢাকা, বাংলাদেশ',
        contact: '+৮৮০ ১৭১১ ১২৩ ৪৫৬',
        profession: 'অধ্যাপক',
    },
    {
        image: '/carousel/carousel (2).jpg',
        name: 'সাবিনা আক্তার',
        designation: 'সহকারী অধ্যাপক, ইংরেজি বিভাগ',
        address: 'চট্টগ্রাম, বাংলাদেশ',
        contact: '+৮৮০ ১৭২২ ১২৩ ৭৮৯',
        profession: 'অধ্যাপক',
    },
    {
        image: '/carousel/carousel (3).jpg',
        name: 'অধ্যাপক মোহাম্মদ আলী',
        designation: 'অধ্যাপক, ইতিহাস বিভাগ',
        address: 'খুলনা, বাংলাদেশ',
        contact: '+৮৮০ ১৯১৩ ৪৫৬ ৭৮৯',
        profession: 'অধ্যাপক',
    },
    {
        image: '/carousel/carousel (4).jpg',
        name: 'এনামুল হক',
        designation: 'সহকারী অধ্যাপক, কম্পিউটার বিজ্ঞান বিভাগ',
        address: 'রাজশাহী, বাংলাদেশ',
        contact: '+৮৮০ ১৭৩৩ ১২৩ ৫৬৭',
        profession: 'অধ্যাপক',
    },
    {
        image: '/carousel/carousel (5).jpg',
        name: 'রেহেনা আক্তার',
        designation: 'অধ্যাপক, পদার্থবিদ্যা বিভাগ',
        address: 'বরিশাল, বাংলাদেশ',
        contact: '+৮৮০ ১৭৬৬ ১২৩ ৮৯০',
        profession: 'অধ্যাপক',
    },
    {
        image: '/carousel/carousel (1).jpg',
        name: 'ড. মো. সাদিকুল ইসলাম',
        designation: 'অধ্যাপক, গণিত বিভাগ',
        address: 'ঢাকা, বাংলাদেশ',
        contact: '+৮৮০ ১৭১১ ১২৩ ৪৫৬',
        profession: 'অধ্যাপক',
    },
    {
        image: '/carousel/carousel (2).jpg',
        name: 'সাবিনা আক্তার',
        designation: 'সহকারী অধ্যাপক, ইংরেজি বিভাগ',
        address: 'চট্টগ্রাম, বাংলাদেশ',
        contact: '+৮৮০ ১৭২২ ১২৩ ৭৮৯',
        profession: 'অধ্যাপক',
    },
    {
        image: '/carousel/carousel (3).jpg',
        name: 'অধ্যাপক মোহাম্মদ আলী',
        designation: 'অধ্যাপক, ইতিহাস বিভাগ',
        address: 'খুলনা, বাংলাদেশ',
        contact: '+৮৮০ ১৯১৩ ৪৫৬ ৭৮৯',
        profession: 'অধ্যাপক',
    },
    {
        image: '/carousel/carousel (4).jpg',
        name: 'এনামুল হক',
        designation: 'সহকারী অধ্যাপক, কম্পিউটার বিজ্ঞান বিভাগ',
        address: 'রাজশাহী, বাংলাদেশ',
        contact: '+৮৮০ ১৭৩৩ ১২৩ ৫৬৭',
        profession: 'অধ্যাপক',
    },
    {
        image: '/carousel/carousel (5).jpg',
        name: 'রেহেনা আক্তার',
        designation: 'অধ্যাপক, পদার্থবিদ্যা বিভাগ',
        address: 'বরিশাল, বাংলাদেশ',
        contact: '+৮৮০ ১৭৬৬ ১২৩ ৮৯০',
        profession: 'অধ্যাপক',
    },
    {
        image: '/carousel/carousel (1).jpg',
        name: 'ড. মো. সাদিকুল ইসলাম',
        designation: 'অধ্যাপক, গণিত বিভাগ',
        address: 'ঢাকা, বাংলাদেশ',
        contact: '+৮৮০ ১৭১১ ১২৩ ৪৫৬',
        profession: 'অধ্যাপক',
    },
    {
        image: '/carousel/carousel (2).jpg',
        name: 'সাবিনা আক্তার',
        designation: 'সহকারী অধ্যাপক, ইংরেজি বিভাগ',
        address: 'চট্টগ্রাম, বাংলাদেশ',
        contact: '+৮৮০ ১৭২২ ১২৩ ৭৮৯',
        profession: 'অধ্যাপক',
    },
    {
        image: '/carousel/carousel (3).jpg',
        name: 'অধ্যাপক মোহাম্মদ আলী',
        designation: 'অধ্যাপক, ইতিহাস বিভাগ',
        address: 'খুলনা, বাংলাদেশ',
        contact: '+৮৮০ ১৯১৩ ৪৫৬ ৭৮৯',
        profession: 'অধ্যাপক',
    },
    {
        image: '/carousel/carousel (4).jpg',
        name: 'এনামুল হক',
        designation: 'সহকারী অধ্যাপক, কম্পিউটার বিজ্ঞান বিভাগ',
        address: 'রাজশাহী, বাংলাদেশ',
        contact: '+৮৮০ ১৭৩৩ ১২৩ ৫৬৭',
        profession: 'অধ্যাপক',
    },
    {
        image: '/carousel/carousel (5).jpg',
        name: 'রেহেনা আক্তার',
        designation: 'অধ্যাপক, পদার্থবিদ্যা বিভাগ',
        address: 'বরিশাল, বাংলাদেশ',
        contact: '+৮৮০ ১৭৬৬ ১২৩ ৮৯০',
        profession: 'অধ্যাপক',
    },
];

async function getData(page, pageSize) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedProfiles = profiles.slice(start, end);

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ data: paginatedProfiles, total: profiles.length });
        }, 1000); // Simulate a delay
    });
}

export default async function TeacherPage({ searchParams }) {
    const currentPage = Number(searchParams['page'] ?? '1');
    const itemsPerPage = Number(
        searchParams['items'] ?? constConfig?.ItemsPerPage
    );

    const { data, total } = await getData(currentPage, itemsPerPage);
    const totalPages = Math.ceil(total / itemsPerPage);

    return (
        <div className="w-full h-full max-w-7xl mx-auto sp my-6 space-y-6">
            <PageTitle title="শিক্ষকবৃন্দ" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {data?.map((profile, index) => (
                    <AcademicProfileCard key={index} profile={profile} />
                ))}
            </div>

            {/* Pagination */}
            <PaginationController
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
            />
        </div>
    );
}
