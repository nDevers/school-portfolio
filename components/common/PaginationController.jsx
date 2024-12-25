'use client';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function PaginationController({
    currentPage,
    totalPages,
    itemsPerPage,
}) {
    const router = useRouter();
    const pathname = usePathname();

    // Function to navigate to a specific page
    const goToPage = useCallback(
        (page) => {
            if (page < 1 || page > totalPages) return;
            router.push(`${pathname}?page=${page}&items=${itemsPerPage}`);
        },
        [router, pathname, totalPages, itemsPerPage]
    );

    // Function to generate page numbers with ellipsis
    const generatePageNumbers = () => {
        const visiblePages = 3; // Number of pages to show around current
        const pages = [];

        if (totalPages <= visiblePages + 2) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else if (currentPage <= visiblePages) {
            pages.push(
                ...Array.from({ length: visiblePages }, (_, i) => i + 1),
                '...',
                totalPages
            );
        } else if (currentPage >= totalPages - visiblePages + 1) {
            pages.push(
                1,
                '...',
                ...Array.from(
                    { length: visiblePages },
                    (_, i) => totalPages - visiblePages + i + 1
                )
            );
        } else {
            pages.push(
                1,
                '...',
                currentPage - 1,
                currentPage,
                currentPage + 1,
                '...',
                totalPages
            );
        }

        return pages;
    };

    const pages = useMemo(
        () => generatePageNumbers(),
        [currentPage, totalPages]
    );

    return (
        <Pagination className={'mt-20'}>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={() => goToPage(currentPage - 1)}
                        aria-label="Previous page"
                        className={
                            currentPage <= 1
                                ? 'pointer-events-none cursor-not-allowed'
                                : 'cursor-pointer'
                        }
                    />
                </PaginationItem>

                {pages.map((page, index) => (
                    <PaginationItem key={index}>
                        {page === '...' ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                href="#"
                                onClick={() => goToPage(page)}
                                aria-current={
                                    currentPage === page ? 'page' : undefined
                                }
                                className={
                                    currentPage === page
                                        ? 'bg-primary hover:bg-primary'
                                        : ''
                                }
                            >
                                {page}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={() => goToPage(currentPage + 1)}
                        aria-label="Previous page"
                        className={
                            currentPage === totalPages
                                ? 'pointer-events-none cursor-not-allowed'
                                : 'cursor-pointer'
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
