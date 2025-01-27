import PageTitle from '@/components/admin/common/PageTitle';
import VideoPlayer from '@/components/card/VideoPlayer';

export default function VideoGalleryPage() {
    const videoUrls = [
        'https://www.youtube.com/watch?v=B4I5F4Li7v8',
        'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
        'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
    ];

    return (
        <div className="w-full h-full max-w-7xl mx-auto sp my-6 space-y-6">
            <PageTitle title="ভিডিওতে আমাদের গল্প" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {videoUrls.map((videoUrl) => (
                    <div key={videoUrl} className="w-full">
                        {/* Use VideoPlayer component for each video */}
                        <VideoPlayer videoUrl={videoUrl} />
                    </div>
                ))}
            </div>
        </div>
    );
}
