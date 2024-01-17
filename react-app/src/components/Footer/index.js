import React from "react";
import './Footer.css'

function Footer() {


    return (
        <div>
            <div className="footer-container">
                <div className="footer-logo">
                    <span><img src='/logo.png' className='logo-image'/></span> webuul
                </div>
                <div className="footer-right">
                    <div className="footer-right-title">Contact Me</div>
                    <div className="footer-link">joshapascual@gmail.com</div>
                    {/* <div className="footer-link">My Story</div> */}
                    <div className="footer-socials">
                        <a href="https://www.linkedin.com/in/josh-pascual/" target="_blank" rel="noopener noreferrer">
                            <i class="fa-brands fa-linkedin"></i>
                        </a>
                        <a href="https://github.com/joshpas24" target="_blank" rel="noopener noreferrer">
                            <i class="fa-brands fa-github"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div className="copyright">
                <h7>© 2024 Webuul Financial LLC, All rights reserved.</h7>
            </div>
        </div>
    )
}

export default Footer;
