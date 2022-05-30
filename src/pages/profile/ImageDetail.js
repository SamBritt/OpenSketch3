import { ChatAltIcon, HeartIcon } from "@heroicons/react/outline";
import {
    HeartIcon as HeartSolid,
    ChatAlt2Icon as ChatAltSolid,
    EyeIcon as EyeSolid
} from "@heroicons/react/solid"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { CommentSection, Gallery } from "../../components";
import data from '../../data.json'


const ImageDetail = () => {
    let params = useParams()

    const [state, setState] = useState({
        currentImage: {},
        userImages: {},
        comments: {}
    })

    useEffect(() => {
        const images = data.images.filter(item => item.userId === data.users[0].id)
        const currentImage = data.images.find(item => item.id === parseInt(params.id))
        const currentComments = data.comments.filter(comment => comment.imageId === currentImage.id)
        
        setState(prev => ({
            ...prev,
            userImages: images,
            currentImage: currentImage,
            comments: currentComments
        }))
        return
    }, [params])
    
    return (
        <main className='flex flex-row m-8 gap-x-6'>
            <div className='flex flex-col lg:items-start w-full lg:w-2/3 h-full text-white gap-y-4'>
                <section className='bg-zinc-500 w-full h-96 rounded-t-lg'>
                    {state.currentImage.name}
                </section>

                
                <section className='flex flex-col w-full gap-y-8 p-8'>
                    <section className='flex w-full gap-x-6'>
                        <div className='flex gap-1 group'>
                            <span>
                                <HeartIcon className='w-5 h-5 text-pink-200 transition-all ease duration-200 group-hover:scale-125'/>
                            </span>

                            <span className='group-hover:text-pink-200'>
                                Like
                            </span>
                        </div>

                        <div className='flex gap-1 group'>
                            <span>
                                <ChatAltIcon className='w-5 h-5 text-cyan-200 transition-all ease duration-200 group-hover:scale-125'/>
                            </span>

                            <span className='group-hover:text-cyan-200'>
                                Comment
                            </span>
                        </div>
                    </section>
                    <div className='flex flex-row h-24 gap-4'>
                        <div className='h-20 w-20 bg-gray-200 rounded-full border-gray-800 border-4'>
                        </div>
                
                        <div className='flex flex-col flex-1'>
                            <div className='flex flex-row items-center justify-between'>
                                <h1 className='flex text-3xl font-bold'>
                                    {state.currentImage.name}
                                </h1>

                                <span>
                                    Created: 05/25/2022
                                </span>
                            </div>

                            <div className='flex text-lg gap-x-1 items-end'>
                                <span>
                                    by
                                </span>

                                <span className='underline font-bold'>
                                    sambritt2
                                </span>
                            </div>

                            <div className='flex gap-2'>
                                <div className='flex gap-1'>
                                    <HeartSolid className='w-5 h-5 text-pink-200'/>
                                    <span>{ state.currentImage.likes } Likes</span>    
                                </div>

                                <span className='font-bold text-cyan-200'> / </span>

                                <div className='flex gap-1'>
                                    <ChatAltSolid className='w-5 h-5 text-cyan-200'/>
                                    <span>{ state.comments.length } Comments</span>   
                                </div>

                                <span className='font-bold text-cyan-200'> / </span>

                                <div className='flex gap-1'>
                                    <EyeSolid className='w-5 h-5 text-amber-200'/>
                                    <span>{ state.currentImage.views } Views</span>  
                                </div>
                            </div>
                        </div>
                    </div>

                    <section className='flex h-20'>
                        <p className='text-sm'>
                            { state.currentImage.description }
                        </p>
                    </section>

                    <CommentSection comments={state.comments}/>
                </section>
            </div>

            <section className='hidden lg:flex lg:flex-col w-1/3'>
                <Gallery 
                    images={state.userImages}
                    condensed/>
            </section>
        </main>
    )
}

export default ImageDetail