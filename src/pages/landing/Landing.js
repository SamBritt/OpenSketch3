import { useEffect, useState } from "react"
import { Gallery } from "../../components"
import data from '../../data.json'

const Landing = () => {

    const [state, setState] = useState({
        images: {}
    })

    useEffect(() => {
        const images = data.images

        setState(prev => ({
            ...prev,
            images: images
        }))
        return
    }, [state.images.length])


    return (
        <main className='m-8 space-y-8'>
            <Gallery images={state.images}/>
        </main>
    )
}

export default Landing