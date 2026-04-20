import { useEffect } from "react"
import { Gallery } from "../../components"
import { useImageStore } from "../../store/imageStore"

const Landing = () => {
    const { images, fetchImages } = useImageStore()

    useEffect(() => {
        fetchImages()
    }, [])

    return (
        <main className='m-8 space-y-8'>
            <Gallery images={images}/>
        </main>
    )
}

export default Landing
