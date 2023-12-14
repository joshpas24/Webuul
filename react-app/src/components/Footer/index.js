import React from "react";
import './Footer.css'

function Footer() {


    return (
        <div className="footer-container">
            <div className="footer-logo">
                <span><img src='/logo.png' className='logo-image'/></span> webuul
            </div>
            <div className="footer-right">
                <div className="footer-right-title">Learn More</div>
                <div className="footer-link">About</div>
                <div className="footer-link">My Story</div>
                <div className="footer-socials">
                    <a href="https://github.com/joshpas24" target="_blank" rel="noopener noreferrer">
                        <i class="fa-brands fa-github"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/josh-pascual/" target="_blank" rel="noopener noreferrer">
                        <i class="fa-brands fa-linkedin"></i>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Footer;
