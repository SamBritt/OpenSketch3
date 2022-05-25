import { useState } from "react"
import { SingleCarousel } from "../../components"
import { AcademicCapIcon, CakeIcon, LocationMarkerIcon, PlusIcon } from '@heroicons/react/outline'

const Profile = () => {


    const [images, setImages] = useState([
            {
                id: 1
            },
            {
                id: 2
            },
            {
                id: 3
            },
            {
                id: 4
            },
            {
                id: 5
            },
            {
                id: 6
            },
            {
                id: 7
            },
        ])

    return (
        <main className='m-8 space-y-8'>
        <div className='absolute flex group left-0 bottom-0 h-14 w-24'>
            <div className='flex justify-center items-center z-40 ml-2 left-0 bottom-0 w-14 h-14 rounded-full bg-zinc-600 shadow-lg group-hover:shadow-2xl'>
                <PlusIcon className='w-5 h-5 text-slate-200 group-hover:scale-110'/>
            </div>
            <div className='absolute flex self-center left-0 bottom-1 ml-6 rounded-md z-30 transition-all ease duration-300 w-0 group-hover:w-60 opacity-0 group-hover:opacity-100 h-12 bg-zinc-600 shadow-xl text-center border border-zinc-400'>
                <div className='flex items-center justify-center w-full h-full hover:bg-zinc-700 text-slate-200'>
                    Create
                </div>
            </div>
        </div>
            <section className='flex items-end h-60 bg-zinc-700 rounded-lg text-white p-8'>
                <div className='flex flex-row h-24 gap-4'>
                    <div className='h-24 w-24 bg-gray-200 rounded-full border-gray-800 border-4'></div>
                    
                    <div className='flex flex-col justify-between'>
                        <h1 className='text-4xl font-bold'>
                                sambritt2
                        </h1>

                        <p className='text-sm'>
                            I like trees.
                        </p>

                        <div className='flex gap-2'>
                            <span>8600 Followers</span>
                            <span className='font-bold text-cyan-200'> / </span>
                            <span>789 Following</span>
                            <span className='font-bold text-cyan-200'> / </span>
                            <span>266 Creations</span>
                        </div>
                    </div>

                </div>
            </section>

            <SingleCarousel images={images}/>

            <section className='flex flex-row gap-x-8'>
                <div className='flex flex-col h-full w-1/2 gap-y-4'>
                    <h1 className='text-2xl text-stone-200'>
                        About
                    </h1>

                    <div className='flex flex-col bg-zinc-700 rounded-lg p-8 gap-y-8 text-gray-200'>
                        <div>
                            <h1 className='text-2xl'>
                                @sambritt2
                            </h1>

                            <p className='italic'>
                                Samuel J Britt
                            </p>
                        </div>

                        <div className='flex flex-row gap-4'>
                            <span className='flex gap-1'>
                            <CakeIcon className='h-5 w-5 text-rose-400 m-0'/>
                                September 16
                            </span>
                            <span className='flex gap-1'>
                            <LocationMarkerIcon className='h-5 w-5 text-amber-400'/>
                                Nashville
                            </span>
                            <span className='flex gap-1'>
                            <AcademicCapIcon className='h-5 w-5 text-cyan-400'/>
                            Member since 2022
                            </span>
                        </div>

                        <p className='text-sm'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </div>
                </div>

                <div className='flex flex-col h-full w-1/2 gap-y-4'>
                    <h1 className='text-2xl text-stone-200'>
                        Images
                    </h1>
                    
                    <div className='grid grid-cols-3 grid-flow-row auto-rows-auto gap-2'>
                        {
                            images.map((item, idx) => (
                                    <div 
                                    className='bg-zinc-600 w-full h-32 rounded-lg transition-all ease duration-200 hover:-mt-1 hover:shadow-xl'
                                    key={idx}>
                                </div>)
                            )
                        }
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Profile