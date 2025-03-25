import * as React from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import useEmblaCarousel, {
  type UseEmblaCarouselType
} from 'embla-carousel-react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentIndex } from '@/store/carouselSlice';
import { RootState } from '@/store/store';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type CarouselApi = UseEmblaCarouselType[1];
type CarouselOptions = Parameters<typeof useEmblaCarousel>[0];
type CarouselPlugin = Parameters<typeof useEmblaCarousel>[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: 'horizontal' | 'vertical';
};

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = 'horizontal',
      opts,
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
        axis: orientation === 'horizontal' ? 'x' : 'y'
      },
      plugins
    );
    const dispatch = useDispatch();
    const currentIndex = useSelector((state: RootState) => state.carousel.currentIndex);

    const scrollPrev = () => {
      api?.scrollPrev();
      dispatch(setCurrentIndex(currentIndex - 1));
    };

    const scrollNext = () => {
      api?.scrollNext();
      dispatch(setCurrentIndex(currentIndex + 1));
    };

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
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
      if (!api) return;

      api.on('select', () => {
        dispatch(setCurrentIndex(api.selectedScrollSnap()));
      });

      return () => {
        api.off('select');
      };
    }, [api, dispatch]);

    return (
      <div
        ref={ref}
        onKeyDownCapture={handleKeyDown}
        className={cn('relative', className)}
        role="region"
        aria-roledescription="carousel"
        {...props}
      >
        <Button onClick={scrollPrev} disabled={currentIndex === 0}>
          <ArrowLeftIcon />
        </Button>
        {children}
        <Button onClick={scrollNext}>
          <ArrowRightIcon />
        </Button>
      </div>
    );
  }
);
Carousel.displayName = 'Carousel';

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef } = useEmblaCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div ref={ref} className={cn('flex', className)} {...props} />
    </div>
  );
});
CarouselContent.displayName = 'CarouselContent';

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn('min-w-0 shrink-0 grow-0 basis-full', className)}
      {...props}
    />
  );
});
CarouselItem.displayName = 'CarouselItem';

export { Carousel, CarouselContent, CarouselItem };
