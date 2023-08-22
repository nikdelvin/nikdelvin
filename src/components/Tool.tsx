import { type FC } from 'react'

interface Props {
    link: string
    image: string
    title: string
}

const Tool: FC<Props> = ({ link, image, title }) => {
    return (
        <a
            href={link}
            className="card bg-white justify-content-center align-items-center text-center w-100 h-100 p-4">
            <img
                src={image}
                alt={title}
                width="40"
                height="40"
            />
            <p className="mt-2 mb-0 fw-bold text-dark">{title}</p>
        </a>
    )
}

export default Tool
