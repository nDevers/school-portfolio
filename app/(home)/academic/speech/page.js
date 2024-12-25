import PageTitle from '@/components/admin/common/PageTitle';
import React from 'react';

export default function SpeechPage() {
    return (
        <div className="w-full h-full max-w-7xl mx-auto sp my-6 space-y-6">
            <PageTitle title="প্রধান শিক্ষকের বার্তা" />

            <div className="flex space-x-4">
                <img
                    src="/carousel/carousel (1).jpg"
                    alt="Head of the Institute"
                    className="w-36 h-52 md:w-52 md:h-60 object-cover"
                />
                <div className="space-y-2">
                    <h2 className="font-bold md:text-lg">Headmaster Name</h2>
                    <p className="text-justify">
                        Lorem ipsum, dolor sit amet consectetur adipisicing
                        elit. Illo commodi ad dignissimos quidem doloremque
                        libero accusamus, aperiam molestias? Facilis quaerat
                        dolorem aspernatur nulla, nihil reprehenderit laboriosam
                        excepturi quo voluptas ab. Lorem ipsum, dolor sit amet
                        consectetur adipisicing elit. Illo commodi ad
                        dignissimos quidem doloremque libero accusamus, aperiam
                        molestias? Facilis quaerat dolorem aspernatur nulla,
                        nihil reprehenderit laboriosam excepturi quo voluptas
                        ab. Lorem ipsum, dolor sit amet consectetur adipisicing
                        elit. Illo commodi ad dignissimos quidem doloremque
                        libero accusamus, aperiam molestias? Facilis quaerat
                        dolorem aspernatur nulla, nihil reprehenderit laboriosam
                        excepturi quo voluptas ab. Lorem ipsum, dolor sit amet
                        consectetur adipisicing elit. Illo commodi ad
                        dignissimos quidem doloremque libero accusamus, aperiam
                        molestias? Facilis quaerat dolorem aspernatur nulla,
                        nihil reprehenderit laboriosam excepturi quo voluptas
                        ab.
                    </p>
                </div>
            </div>
        </div>
    );
}
