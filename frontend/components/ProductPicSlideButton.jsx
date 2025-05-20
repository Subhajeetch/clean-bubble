// components/EmblaButtons.jsx
'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { useEmbla } from './EmblaContext'
import { PrevButton, NextButton } from './carousel/js/EmblaArrow'

const EmblaButtons = () => {
    const { emblaApi } = useEmbla()

    const [prevDisabled, setPrevDisabled] = useState(true)
    const [nextDisabled, setNextDisabled] = useState(true)

    const updateButtons = useCallback(() => {
        if (!emblaApi) return
        setPrevDisabled(!emblaApi.canScrollPrev())
        setNextDisabled(!emblaApi.canScrollNext())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        updateButtons()
        emblaApi.on('select', updateButtons).on('reInit', updateButtons)
    }, [emblaApi, updateButtons])

    return (
        <div className="embla__buttons">
            <PrevButton onClick={() => emblaApi && emblaApi.scrollPrev()} disabled={prevDisabled} />
            <NextButton onClick={() => emblaApi && emblaApi.scrollNext()} disabled={nextDisabled} />
        </div>
    )
}

export default EmblaButtons
