"use client"

import React, { useEffect } from 'react'
import { DotButton, useDotButton } from './EmblaDot'
import useEmblaCarousel from 'embla-carousel-react'
import { useEmbla } from '../../EmblaContext'

// product pics
import productPics from '@/productPics'

const EmblaCarousel = (props) => {
    const { slides, options } = props
    const [emblaRef, emblaApi] = useEmblaCarousel(options)
    const { setEmblaApi } = useEmbla()

    useEffect(() => {
        if (emblaApi) setEmblaApi(emblaApi)
    }, [emblaApi, setEmblaApi])

    const { selectedIndex, scrollSnaps, onDotButtonClick } =
        useDotButton(emblaApi)

    return (
        <section className="embla custom-m-query w-[360px] h-full">
            <div className="embla__viewport h-full" ref={emblaRef}>
                <div className="embla__container h-full ">
                    {productPics.map((pic, i) => (
                        <div className="embla__slide " key={i}>
                            <div className="embla__slide__number w-full rounded-2xl overflow-hidden">
                                <img src={pic.src} alt={pic.alt} className='h-full object-cover rounded-t-full' />

                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative w-full flex items-center justify-center">
                <div className="absolute bottom-1 w-full flex justify-center items-center">
                    {scrollSnaps.map((_, index) => (
                        <DotButton
                            key={index}
                            onClick={() => onDotButtonClick(index)}
                            className={'w-3 h-3 embla__dot'.concat(
                                index === selectedIndex ? ' embla__dot--selected' : ''
                            )}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default EmblaCarousel
