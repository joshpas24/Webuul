import React, { useEffect } from 'react';
import video from './webuul-splash.mp4'
import graphic from './graphic.webm'
import './SplashPage.css'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useSelector } from 'react-redux';
import { useNavigation } from '../../context/NavigationView';

function SplashPage() {
    const history = useHistory();
    const { navView, setNavView } = useNavigation()
    const user = useSelector(state=>state.session.user)

    useEffect(() => {
        setNavView('home')
    }, [])

    const handleGetStarted = () => {
        if (user) {
            history.push('/markets')
        } else {
            history.push('/signup')
        }
    }

    return (
        <div className='splash-container'>
            {/* <div class="video-container">
                <video autoPlay controlsList="nodownload nofullscreen noremoteplayback" loop muted playsInline preload="auto" id="video-background">
                    <source src={video} type="video/mp4" />
                </video>
                <div class="content">
                    <h1>Enjoy Tech. Enjoy Investing.</h1>
                    <h3>0 commissions and no deposit minimums.</h3>
                    <h3>Everyone gets smart tools for investing.</h3>
                    <button onClick={() => history.push("/signup")}>GET STARTED</button>
                </div>
            </div> */}
            <div className='splash-top'>
                <video autoPlay controlsList="nodownload nofullscreen noremoteplayback" loop muted playsInline preload="auto" id="graphic-splash">
                    <source src={graphic} type="video/webm" />
                </video>
                <div className='content'>
                    <h1>Enjoy Tech. Enjoy Investing.</h1>
                    <h3>Stay up-to-date with markets.</h3>
                    <h3>Track your favorite securities.</h3>
                    <h3>Build your portfolio.</h3>
                    <button onClick={handleGetStarted}>GET STARTED</button>
                </div>
            </div>
        </div>
    )
}

export default SplashPage;
