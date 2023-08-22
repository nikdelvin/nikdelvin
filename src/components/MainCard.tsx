import { type FC } from 'react'

interface Props {
    title: string
    byClick?: () => void
}

const MainCard: FC<Props> = ({ byClick, title }) => {
    return (
        <div
            className="card bg-white justify-content-center align-items-center text-center w-100 h-100 p-4"
            style={{ mixBlendMode: 'screen' }}>
            <h1 className="fs-3x fw-normal mb-10">NIKITA STADNIK</h1>
            <h3 className="fs-1 fw-normal mb-10">FULLSTACK WEB DEVELOPER</h3>
            <a
                className="btn border border-dark hover-scale fw-bold"
                onClick={byClick}>
                {title}
            </a>
        </div>
    )
}

export default MainCard
