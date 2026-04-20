

const CommentSection = ({ comments }) => {
    return (
        <section className='flex flex-col gap-y-4'>
            <h1 className='flex flex-row items-center gap-x-2 text-lg text-stone-200 font-semibold'>
                <span>
                    Comments 
                </span>

                <span className='text-sm'>
                    { comments.length }
                </span>
            </h1>
                {
                    comments.length ? comments.map(item => (
                        <div
                            key={item.id} 
                            className='flex w-1/2 h-full gap-x-2'>
                            <div className='w-10 h-10 rounded-full bg-zinc-500'>
                            
                            </div>

                            <div className='flex-1 h-full bg-zinc-600 p-4 rounded-md'>
                                {item.comment}
                            </div>
                        </div>
                    ))
                    : <div>No Comments</div>
                }
        </section>
    )
}

export default CommentSection