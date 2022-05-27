import { Link } from "react-router-dom"

const Gallery = ({ images, condensed = false }) => {

    const gridStyle = () => {
        const styles = [
            `grid grid-cols-1`,
            `sm:grid-cols-2`,
            `lg:grid-cols-3`,
            `grid-flow-row`,
            `auto-cols-min`,
            `auto-rows-auto`,
            `gap-2`
        ]

        if (condensed) {

        } else {
            styles.push(`xl:grid-cols-4`)
        }

        return styles.join(' ') 
    }

    return (
        <div className={gridStyle()}>
            {
                images.length && images.map((item, idx) => (
                        <div
                        className='bg-zinc-600 w-full h-32 rounded-lg transition-all ease duration-200 hover:-mt-1 hover:shadow-xl'
                        key={idx}>
                        <Link to={`/profile/${item.id}`}>
                            {item.name}
                        </Link>
                    </div>
                ))
            }
        </div>
    )
}

export default Gallery