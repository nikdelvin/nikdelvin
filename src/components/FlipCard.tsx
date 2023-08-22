import { type FC } from 'react'
import { animated, useSpring } from '@react-spring/web'

interface Props {
    children: JSX.Element | JSX.Element[]
}

const FlipCard: FC<Props> = (props) => {
    const [styles, api] = useSpring(() => ({ opacity: 0.2, scale: 0.9 }), [])
    const handleMouseEnter = (): void => {
        api.start({
            to: [
                { opacity: 0.2, scale: 0.9 },
                { opacity: 1, scale: 1 }
            ]
        })
    }
    const handleMouseLeave = (): void => {
        api.start({
            to: [
                { opacity: 1, scale: 1 },
                { opacity: 0.2, scale: 0.9 }
            ]
        })
    }
    return (
        <animated.div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                ...styles,
                height: '100%',
                cursor: 'pointer',
                mixBlendMode: 'screen'
            }}>
            {props.children}
        </animated.div>
    )
}

export default FlipCard
