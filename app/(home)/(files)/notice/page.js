import PageTitle from '@/components/admin/common/PageTitle';
import FileCard from '@/components/card/FileCard';

export default function NoticePage() {
    const data = [
        {
            id: 1,
            title: 'Exam Schedule Notice',
            date: '2024-10-17',
            file: '/files/exam-schedule.pdf', // Provide actual file path
        },
        {
            id: 2,
            title: 'Holiday Announcement',
            date: '2024-09-15',
            file: null, // No downloadable file for this notice
        },
        {
            id: 3,
            title: 'Meeting Notice',
            date: '2024-08-21',
            file: null, // No downloadable file for this notice
        },
        {
            id: 4,
            title: 'New Admission Circular',
            date: '2024-07-30',
            file: '/files/admission-circular.pdf', // Provide actual file path
        },
        {
            id: 5,
            title: 'Fee Payment Deadline',
            date: '2024-07-01',
            file: '/files/fee-payment-deadline.pdf', // Provide actual file path
        },
    ];
    return (
        <div className="w-full h-full max-w-7xl mx-auto sp my-6 space-y-6">
            <PageTitle title="নোটিশ" />

            <div className="grid gap-2 md:gap-4 mb-4">
                {data?.map((item) => (
                    <FileCard key={item?.id} item={item} />
                ))}
            </div>
        </div>
    );
}
