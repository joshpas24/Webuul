import React from "react";
import video from './loading.mp4'
import './loading.css'

function LoadingComponent() {


    return (
        <div className="loading-container">
            <video autoPlay controlsList="nodownload nofullscreen noremoteplayback" loop muted playsInline preload="auto" id="loading-vid">
                <source src={video} type="video/mp4" />
            </video>
        </div>
    )
}

export default LoadingComponent;
