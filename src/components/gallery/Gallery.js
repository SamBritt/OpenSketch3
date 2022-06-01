import { Link } from "react-router-dom"

const Gallery = ({ images, condensed = false }) => {

    const gridStyle = () => {
        const styles = [
            `grid`,
            `grid-cols-1`,
            `sm:grid-cols-2`,
            `lg:grid-cols-3`,
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
                    <Link
                        className='group'
                        to={`/${item.userName}/${item.id}`}
                        key={idx}>
                        <div className='relative bg-zinc-600 w-full h-0 pb-full rounded-lg transition-all ease duration-200 group-hover:-translate-y-1 hover:shadow-xl'>

                            <div className='absolute bottom-0 left-0 bg-zinc-800 w-full rounded-b-lg opacity-0 h-0 group-hover:opacity-100 group-hover:h-1/2 transition-all ease duration-300'>
                                {item.name}
                            </div>
                        </div>
                    </Link>
                ))
            }
        </div>
    )
}

export default Gallery