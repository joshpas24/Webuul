import React from 'react';
import video from './webuul-splash.mp4'
import './SplashPage.css'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useSelector } from 'react-redux';

function SplashPage() {
    const history = useHistory();

    const user = useSelector(state=>state.session.user)

    if (user) return history.push("/markets")

    return (
        <div class="video-container">
            <video autoPlay controlsList="nodownload nofullscreen noremoteplayback" loop muted playsInline preload="auto" id="video-background">
                <source src={video} type="video/mp4" />
            </video>
            <div class="content">
                <h1>Enjoy Tech. Enjoy Investing.</h1>
                <h3>0 commissions and no deposit minimums.</h3>
                <h3>Everyone gets smart tools for investing.</h3>
                <button onClick={() => history.push("/signup")}>GET STARTED</button>
            </div>
        </div>
    )
}

export default SplashPage;
