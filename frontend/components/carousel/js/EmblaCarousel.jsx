"use client"

import React, { useEffect } from 'react'
import { DotButton, useDotButton } from './EmblaDot'
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
} from './EmblaArrow'
import useEmblaCarousel from 'embla-carousel-react'
import { useEmbla } from '../../EmblaContext'

const EmblaCarousel = (props) => {
    const { slides, options } = props
    const [emblaRef, emblaApi] = useEmblaCarousel(options)
    const { setEmblaApi } = useEmbla()

    useEffect(() => {
        if (emblaApi) setEmblaApi(emblaApi)
    }, [emblaApi, setEmblaApi])

    const { selectedIndex, scrollSnaps, onDotButtonClick } =
        useDotButton(emblaApi)

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    return (
        <section className="embla">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {slides.map((index) => (
                        <div className="embla__slide" key={index}>
                            <div className="embla__slide__number">{index + 1}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="embla__controls w-full flex items-center justify-center bg-amber-700">
                <div className="w-full flex justify-center items-center bg-amber-500">
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
