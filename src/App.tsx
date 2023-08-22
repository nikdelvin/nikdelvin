import { useState, useEffect } from 'react'
import './App.css'
import FlipCard from './components/FlipCard'
import GradientBack from './components/GradientBack'
import MainCard from './components/MainCard'
import ProjectCard from './components/ProjectCard'
import { Leva } from 'leva'
import { tools } from './helpers/generateTools'

function App(): JSX.Element {
    const [screen, setScreen] = useState({ height: window.innerHeight, width: window.innerWidth })
    const [projectsOpen, setProjectsOpen] = useState(false)

    const projects = {
        BSOSite: {
            images: [
                '/assets/media/Placeholders/Space Background (1).png',
                '/assets/media/BSO Site/Main.png',
                '/assets/media/BSO Site/Services.png',
                '/assets/media/BSO Site/Property Management.png',
                '/assets/media/BSO Site/Lease Management.png',
                '/assets/media/BSO Site/Finding A Tenant.png',
                '/assets/media/BSO Site/Tenant Screening.png',
                '/assets/media/BSO Site/Property Handover.png',
                '/assets/media/BSO Site/Rental Dispute.png',
                '/assets/media/BSO Site/Tenant Eviction.png',
                '/assets/media/BSO Site/For Landlords.png',
                '/assets/media/BSO Site/For Tenants.png',
                '/assets/media/BSO Site/For Brokers.png',
                '/assets/media/BSO Site/Pay Online.png',
                '/assets/media/BSO Site/Join Team.png',
                '/assets/media/BSO Site/Contacts.png',
                '/assets/media/BSO Site/Landing 1.png',
                '/assets/media/BSO Site/Landing 2.png',
                '/assets/media/BSO Site/Landing 3.png',
                '/assets/media/BSO Site/Landing 4.png',
                '/assets/media/BSO Site/Landing 5.png',
                '/assets/media/BSO Site/Landing 6.png',
                '/assets/media/BSO Site/Landing 7.png',
                '/assets/media/BSO Site/Landing 8.png'
            ],
            title: 'BSO REM Website'
        },
        BSOMobile: {
            images: [
                '/assets/media/Placeholders/Space Background (2).png',
                '/assets/media/BSO App/Login.png',
                '/assets/media/BSO App/Register 1.png',
                '/assets/media/BSO App/Register 2.png',
                '/assets/media/BSO App/Register 3.png',
                '/assets/media/BSO App/Register 4.png',
                '/assets/media/BSO App/Register 5.png',
                '/assets/media/BSO App/Subscription.png',
                '/assets/media/BSO App/Areas.png',
                '/assets/media/BSO App/Profile.png',
                '/assets/media/BSO App/Settings 1.png',
                '/assets/media/BSO App/Settings 2.png',
                '/assets/media/BSO App/Settings 3.png',
                '/assets/media/BSO App/Units.png',
                '/assets/media/BSO App/Add Viewing.png',
                '/assets/media/BSO App/Add Offer.png',
                '/assets/media/BSO App/Viewings Schedule.png',
                '/assets/media/BSO App/Viewing Info.png',
                '/assets/media/BSO App/Offers Schedule.png',
                '/assets/media/BSO App/Offer Info.png',
                '/assets/media/BSO App/Referrals.png',
                '/assets/media/BSO App/Chats.png',
                '/assets/media/BSO App/Chat.png'
            ],
            title: 'BSO REM Mobile App'
        },
        BSOAdmin: {
            images: [
                '/assets/media/Placeholders/Space Background (3).png',
                '/assets/media/BSO Admin Panel/Login.png',
                '/assets/media/BSO Admin Panel/Main.png',
                '/assets/media/BSO Admin Panel/ApiLibrary 1.png',
                '/assets/media/BSO Admin Panel/ApiLibrary 2.png',
                '/assets/media/BSO Admin Panel/ApiLibrary 3.png'
            ],
            title: 'BSO REM Admin Panel'
        },
        BSODesign: {
            images: [
                '/assets/media/Placeholders/Space Background (4).png',
                '/assets/media/BSO Design System/DesignLibrary Blog.png',
                '/assets/media/BSO Design System/DesignLibrary ImageBackground.png',
                '/assets/media/BSO Design System/DesignLibrary ImageBackgroundImageCard.png',
                '/assets/media/BSO Design System/DesignLibrary ImageBackgroundWithButton.png',
                '/assets/media/BSO Design System/DesignLibrary ImageBackgroundWithForm.png',
                '/assets/media/BSO Design System/DesignLibrary InfoWithButton.png',
                '/assets/media/BSO Design System/DesignLibrary InfoWithImage.png',
                '/assets/media/BSO Design System/DesignLibrary InfoWithImageAndBullets.png',
                '/assets/media/BSO Design System/DesignLibrary InfoWithImageAndBulletsLanding.png',
                '/assets/media/BSO Design System/DesignLibrary InfoWithImageAndButton.png',
                '/assets/media/BSO Design System/DesignLibrary InfoWithVideoBackground.png',
                '/assets/media/BSO Design System/DesignLibrary InfoWithYouTubeVideo.png',
                '/assets/media/BSO Design System/DesignLibrary LandingAppOffer.png',
                '/assets/media/BSO Design System/DesignLibrary LandingAppOfferBullets.png',
                '/assets/media/BSO Design System/DesignLibrary OfferWithForm.png',
                '/assets/media/BSO Design System/DesignLibrary RepresentingNumbersWithIcons.png',
                '/assets/media/BSO Design System/DesignLibrary RepresentingNumbersWithTitle.png',
                '/assets/media/BSO Design System/DesignLibrary RepresentingSlogansWithIcons.png',
                '/assets/media/BSO Design System/DesignLibrary RepresentingSlogansWithRichIcons.png',
                '/assets/media/BSO Design System/DesignLibrary Reviews.png',
                '/assets/media/BSO Design System/DesignLibrary Services.png',
                '/assets/media/BSO Design System/DesignLibrary Steps.png',
                '/assets/media/BSO Design System/DesignLibrary VideoBackground.png',
                '/assets/media/BSO Design System/DesignLibrary VideoBackgroundWithButton.png',
                '/assets/media/BSO Design System/DesignLibrary VideoBackgroundWithForm.png',
                '/assets/media/BSO Design System/DesignLibrary SiteClasses.png',
                '/assets/media/BSO Design System/DesignLibrary SiteComponents.png'
            ],
            title: 'BSO REM Design System'
        },
        WhatCRM: {
            images: ['/assets/media/Placeholders/Space Background (5).png', '/assets/media/WhatCRM/AdminPanel.mp4'],
            title: 'WhatCRM: WhatsApp & Bitrix24 Integration'
        },
        WhatsAppWeb: {
            images: ['/assets/media/Placeholders/Space Background (6).png', '/assets/media/WhatCRM/WebApp.mp4'],
            title: 'WhatCRM: Web Messenger'
        },
        PoketSpace: {
            images: [
                '/assets/media/Placeholders/Space Background (7).png',
                '/assets/media/PoketSpace/PoketSpace 1.png',
                '/assets/media/PoketSpace/PoketSpace 2.png',
                '/assets/media/PoketSpace/PoketSpace 3.png',
                '/assets/media/PoketSpace/PoketSpace 4.png',
                '/assets/media/PoketSpace/PoketSpace 5.png',
                '/assets/media/PoketSpace/PoketSpace 6.png',
                '/assets/media/PoketSpace/PoketSpace 7.png',
                '/assets/media/PoketSpace/PoketSpace 8.png',
                '/assets/media/PoketSpace/PoketSpace 9.png',
                '/assets/media/PoketSpace/PoketSpace 10.png'
            ],
            title: 'Poket Space: Shader Generated Universe'
        },
        New: {
            images: ['/assets/media/Placeholders/Space Background (8).png'],
            title: 'New projects is coming soon...'
        }
    }

    function updateDimension(): void {
        setScreen({ height: window.innerHeight, width: window.innerWidth })
    }

    function updateScript(id: string, link: string): void {
        document.querySelector(`#${id}`)?.remove()
        const plugins = document.createElement('script')
        plugins.setAttribute('src', link)
        plugins.setAttribute('id', id)
        document.body.appendChild(plugins)
    }

    useEffect(() => {
        updateScript('metronic_plugins', '/assets/plugins/global/plugins.bundle.js')
        updateScript('metronic_scripts', '/assets/js/scripts.bundle.js')
        updateScript('metronic_fslightbox', '/assets/plugins/custom/fslightbox/fslightbox.bundle.js')
        window.addEventListener('resize', updateDimension)
        window.addEventListener('orientationchange', updateDimension)
        return () => {
            window.removeEventListener('resize', updateDimension)
            window.removeEventListener('orientationchange', updateDimension)
        }
    }, [projectsOpen, screen])

    return (
        <GradientBack>
            {screen.height > screen.width ? (
                <div className="d-flex flex-column w-100 min-vh-100 justify-content-center align-items-center">
                    <MainCard title="ONLY AVAILABLE ON DESKTOP" />
                </div>
            ) : (
                <>
                    <Leva hidden />
                    <div className="row g-0 min-vh-100">
                        {Array(9)
                            .fill(true)
                            .map((_, i) => (
                                <div
                                    key={String(i)}
                                    className="col-md-4 col-12">
                                    {i === 4 ? (
                                        <div
                                            className="row g-0 p-2"
                                            style={{ height: `${Math.floor(screen.height / 3)}px` }}>
                                            <MainCard
                                                byClick={() => {
                                                    setProjectsOpen(!projectsOpen)
                                                }}
                                                title={
                                                    !projectsOpen ? 'SHOW MY RECENT PROJECTS' : 'SHOW MY LOVELY TOOLS'
                                                }
                                            />
                                        </div>
                                    ) : projectsOpen ? (
                                        <div
                                            className="row g-0 p-2"
                                            style={{ height: `${Math.floor(screen.height / 3)}px` }}>
                                            <FlipCard>
                                                <ProjectCard
                                                    title={Object.values(projects)[i > 4 ? i - 1 : i].title}
                                                    images={Object.values(projects)[i > 4 ? i - 1 : i].images}
                                                    projectID={Object.keys(projects)[i > 4 ? i - 1 : i]}
                                                />
                                            </FlipCard>
                                        </div>
                                    ) : (
                                        <div
                                            className="row g-0"
                                            style={{ height: `${Math.floor(screen.height / 3)}px` }}>
                                            {Array(4)
                                                .fill(true)
                                                .map((_, j) => (
                                                    <div
                                                        key={`${i}_${j}`}
                                                        className="col-md-6 col-12 p-2">
                                                        <FlipCard>
                                                            {i > 4 ? tools[4 * (i - 1) + j] : tools[4 * i + j]}
                                                        </FlipCard>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                </>
            )}
        </GradientBack>
    )
}

export default App
