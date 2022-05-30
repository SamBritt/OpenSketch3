import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline'
import { useRef, useState } from 'react'
import './singleCarousel.scss'

const SingleCarousel = ({ images }) => {
    const scrollerRef = useRef()
    const parentRef = useRef()

    const scrollRight = () => {
        scrollerRef.current.scrollBy({
            left: parentRef.current.offsetWidth,
            behavior: 'smooth'
        })
    }

    const scrollLeft = () => {
        scrollerRef.current.scrollBy({
            left: -parentRef.current.offsetWidth,
            behavior: 'smooth'
        })
    }

    return (
        <div
            ref={parentRef}
            className='relative h-48 overflow-x-auto'>
            <div className='absolute transition-all ease duration-200 opacity-0 hover:opacity-100 flex items-center justify-center pl-4 z-20 h-full w-20 bg-gradient-to-r from-stone-900'>
                <ArrowLeftIcon
                    onClick={scrollLeft} 
                    className='h-5 w-5 text-stone-200 transition-all ease duration-200 hover:scale-150'/>
            </div>

            <section
                ref={scrollerRef}
                className='scroller grid grid-rows-1 grid-flow-col auto-cols-min h-48 gap-x-2 overflow-x-auto'>
                {
                    images && images.map((item) => (
                        <div
                            key={item.id}
                            className='h-full w-48 xl:w-60 bg-zinc-600 rounded-lg'>
                        </div>
                    ))
                }
            </section>

            <div className='absolute transition-all ease duration-200 opacity-0 hover:opacity-100 flex justify-center items-center pr-4 z-20 top-0 right-0 h-full w-20 bg-gradient-to-l from-stone-900'>
                <ArrowRightIcon
                    onClick={scrollRight}
                    className='h-5 w-5 text-stone-200 transition-all ease duration-200 hover:scale-150'/>
            </div>
        </div>
    )
}

export default SingleCarousel