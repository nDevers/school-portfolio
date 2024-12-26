'use client';

import * as React from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import useEmblaCarousel from 'embla-carousel-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const CarouselContext = React.createContext(null);

function useCarousel() {
    const context = React.useContext(CarouselContext);

    if (!context) {
        throw new Error('useCarousel must be used within a <Carousel />');
    }

    return context;
}

const Carousel = React.forwardRef(
    (
        {
            orientation = 'horizontal',
            opts,
            setApi,
            plugins,
            className,
            children,
            ...props
        },
        ref
    ) => {
        const [carouselRef, api] = useEmblaCarousel(
            {
                ...opts,
                axis: orientation === 'horizontal' ? 'x' : 'y',
            },
            plugins
        );
        const [canScrollPrev, setCanScrollPrev] = React.useState(false);
        const [canScrollNext, setCanScrollNext] = React.useState(false);

        const onSelect = React.useCallback((api) => {
            if (!api) {
                return;
            }

            setCanScrollPrev(api.canScrollPrev());
            setCanScrollNext(api.canScrollNext());
        }, []);

        const scrollPrev = React.useCallback(() => {
            api?.scrollPrev();
        }, [api]);

        const scrollNext = React.useCallback(() => {
            api?.scrollNext();
        }, [api]);

        const handleKeyDown = React.useCallback(
            (event) => {
                if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    scrollPrev();
                } else if (event.key === 'ArrowRight') {
                    event.preventDefault();
                    scrollNext();
                }
            },
            [scrollPrev, scrollNext]
        );

        React.useEffect(() => {
            if (!api || !setApi) {
                return;
            }

            setApi(api);
        }, [api, setApi]);

        React.useEffect(() => {
            if (!api) {
                return;
            }

            onSelect(api);
            api.on('reInit', onSelect);
            api.on('select', onSelect);

            return () => {
                api?.off('select', onSelect);
            };
        }, [api, onSelect]);

        return (
            <CarouselContext.Provider
                value={{
                    carouselRef,
                    api,
                    opts,
                    orientation:
                        orientation ||
                        (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
                    scrollPrev,
                    scrollNext,
                    canScrollPrev,
                    canScrollNext,
                }}
            >
                <div
                    ref={ref}
                    onKeyDownCapture={handleKeyDown}
                    className={cn('relative', className)}
                    role="region"
                    aria-roledescription="carousel"
                    {...props}
                >
                    {children}
                </div>
            </CarouselContext.Provider>
        );
    }
);
Carousel.displayName = 'Carousel';

const CarouselContent = React.forwardRef(({ className, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel();

    return (
        <div ref={carouselRef} className="overflow-hidden w-full h-full">
            <div
                ref={ref}
                className={cn(
                    'flex w-full h-full',
                    orientation === 'horizontal' ? '-ml-0' : '-mt-0 flex-col',
                    className
                )}
                {...props}
            />
        </div>
    );
});
CarouselContent.displayName = 'CarouselContent';

const CarouselItem = React.forwardRef(({ className, ...props }, ref) => {
    const { orientation } = useCarousel();

    return (
        <div
            ref={ref}
            role="group"
            aria-roledescription="slide"
            className={cn(
                'w-full h-full shrink-0 grow-0 basis-full',
                orientation === 'horizontal' ? 'pl-0' : 'pt-0',
                className
            )}
            {...props}
        />
    );
});
CarouselItem.displayName = 'CarouselItem';

const CarouselPrevious = React.forwardRef(
    ({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
        const { orientation, scrollPrev, canScrollPrev } = useCarousel();

        return (
            <Button
                ref={ref}
                variant={variant}
                size={size}
                className={cn('h-8 w-8 rounded-full', className)}
                disabled={!canScrollPrev}
                onClick={scrollPrev}
                {...props}
            >
                <ArrowLeftIcon className="h-4 w-4" />
                <span className="sr-only">Previous slide</span>
            </Button>
        );
    }
);
CarouselPrevious.displayName = 'CarouselPrevious';

const CarouselNext = React.forwardRef(
    ({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
        const { orientation, scrollNext, canScrollNext } = useCarousel();

        return (
            <Button
                ref={ref}
                variant={variant}
                size={size}
                className={cn('h-8 w-8 rounded-full', className)}
                disabled={!canScrollNext}
                onClick={scrollNext}
                {...props}
            >
                <ArrowRightIcon className="h-4 w-4" />
                <span className="sr-only">Next slide</span>
            </Button>
        );
    }
);
CarouselNext.displayName = 'CarouselNext';

export {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
};
