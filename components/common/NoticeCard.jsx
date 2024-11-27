
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { HiDownload, HiOutlineCalendar } from 'react-icons/hi';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function NoticeCard({ item }) {
    return (
        <Card>
            <div className='flex items-center justify-between p-2 sm:p-3 md:p-4 hover:bg-muted'>
                <Link href={`/notice/${item?.id}`} className='flex-grow'>
                    <div className='space-y-2'>
                        <CardDescription className='flex items-center space-x-2'>
                            <HiOutlineCalendar />
                            <span>{item?.date}</span>
                        </CardDescription>
                        <CardTitle>{item?.title}</CardTitle>
                    </div>
                </Link>
                {item?.file && <div className='ml-4'>
                    <Link href={item?.file} passHref legacyBehavior>
                        <Button size='icon' as="a" aria-label="Download file">
                            <HiDownload />
                        </Button>
                    </Link>
                </div>}
            </div>
        </Card>
    )
}
