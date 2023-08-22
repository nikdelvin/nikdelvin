import { type FC } from 'react'

interface Props {
    title: string
    images: string[]
    projectID: string
}

const ProjectCard: FC<Props> = ({ title, images, projectID }) => {
    return (
        <div className="h-100">
            <a
                key={0}
                className="d-block card bg-white overlay h-100"
                data-fslightbox={`lightbox-${projectID}`}
                href={images[1]}>
                <div
                    className="overlay-wrapper bgi-no-repeat bgi-position-center bgi-size-cover card-rounded h-100"
                    style={{
                        backgroundImage: `url('${images[0]}')`
                    }}></div>
                <div className="overlay-layer card-rounded bg-dark bg-opacity-25 d-flex flex-column">
                    <i className="ki-duotone ki-eye fs-3x text-white">
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                    </i>
                    <div className="card bg-white p-4 mt-4">
                        <p className="mb-0 fw-bold">{title}</p>
                    </div>
                </div>
            </a>
            {images.slice(2).map((image, index) => (
                <a
                    key={index + 1}
                    className="d-none"
                    data-fslightbox={`lightbox-${projectID}`}
                    href={image}
                />
            ))}
        </div>
    )
}

export default ProjectCard
