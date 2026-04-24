import { ChatAltIcon, HeartIcon } from "@heroicons/react/outline";
import {
    HeartIcon as HeartSolid,
    ChatAlt2Icon as ChatAltSolid,
    EyeIcon as EyeSolid
} from "@heroicons/react/solid"
import { useEffect } from "react"
import { Link, useParams } from "react-router-dom";
import { CommentSection, Gallery } from "@/components";
import { useImageStore } from "@/store/imageStore"
import { useCommentStore } from "@/store/commentStore"

const ImageDetail = () => {
    const params = useParams()

    const { currentImage, currentImageLoading, userImages, fetchImage, fetchUserImages, likeImage, unlikeImage } = useImageStore()
    const { comments, fetchComments } = useCommentStore()

    useEffect(() => {
        if (!params.id || !params.userName) return
        fetchImage(parseInt(params.id))
        fetchUserImages(params.userName)
        fetchComments(parseInt(params.id))
    }, [params.id, params.userName])

    if (currentImageLoading) return null

    if (!currentImage) return (
        <main className='flex items-center justify-center m-8 text-gray-400'>
            Image not found.
        </main>
    )

    return (
        <main className='flex flex-row m-8 gap-x-6'>
            <div className='flex flex-col lg:items-start w-full lg:w-2/3 h-full text-white gap-y-4'>
                <section className='rounded-t-lg overflow-hidden'>
                    <img
                        src={currentImage.imageUrl}
                        alt={currentImage.name}
                        width={600}
                        height={600}
                        className='block max-w-full'
                    />
                </section>

                <section className='flex flex-col w-full gap-y-8 p-8'>
                    <section className='flex w-full gap-x-6'>
                        <button
                            onClick={() => currentImage.liked
                                ? unlikeImage(currentImage.id)
                                : likeImage(currentImage.id)
                            }
                            className='flex gap-1 group'
                        >
                            {currentImage.liked
                                ? <HeartSolid className='w-5 h-5 text-pink-400' />
                                : <HeartIcon className='w-5 h-5 text-pink-200 transition-all ease duration-200 group-hover:scale-125' />
                            }
                            <span className={currentImage.liked ? 'text-pink-400' : 'group-hover:text-pink-200'}>
                                Like
                            </span>
                        </button>

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
                                    {currentImage?.name}
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
                                    <Link to={`/${currentImage?.userName}`}>
                                        {currentImage?.userName}
                                    </Link>
                                </span>
                            </div>

                            <div className='flex gap-2'>
                                <div className='flex gap-1'>
                                    <HeartSolid className='w-5 h-5 text-pink-200'/>
                                    <span>{ currentImage?.likes } Likes</span>
                                </div>

                                <span className='font-bold text-cyan-200'> / </span>

                                <div className='flex gap-1'>
                                    <ChatAltSolid className='w-5 h-5 text-cyan-200'/>
                                    <span>{ comments.length } Comments</span>
                                </div>

                                <span className='font-bold text-cyan-200'> / </span>

                                <div className='flex gap-1'>
                                    <EyeSolid className='w-5 h-5 text-amber-200'/>
                                    <span>{ currentImage?.views } Views</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <section className='flex h-20'>
                        <p className='text-sm'>
                            { currentImage?.description }
                        </p>
                    </section>

                    <CommentSection comments={comments} imageId={currentImage.id} />
                </section>
            </div>

            <section className='hidden lg:flex lg:flex-col w-1/3'>
                <Gallery
                    images={userImages}
                    condensed/>
            </section>
        </main>
    )
}

export default ImageDetail
