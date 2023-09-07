import React from 'react';

import { NavLink, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
	const history = useHistory();

	const user = useSelector(state => state.session.user);

	return (
		<div className='nav-container'>
			<div>
				<button onClick={() => history.push("/")} className='home-button'>
					<span><img src='/logo.png' className='logo-image'/></span> webuul
				</button>
			</div>
			<div className='nav-mid'>
				<div>MARKETS</div>
				<div>TRADING</div>
				<div>PORTFOLIO</div>
				<div>ABOUT</div>
			</div>
			{!user ? (
				<div className='nav-right'>
					<button className='nav-button' id='nav-no-fill'
						onClick={() => history.push("/login")}
					>LOG IN</button>
					<button className='nav-button' id='nav-fill'
						onClick={() => history.push("/signup")}
					>SIGN UP</button>
				</div>
			) : (
				<div className='nav-right'>
					<button className='nav-button' id='nav-no-fill'>WALLET</button>
					<button className='nav-button' id='nav-fill'>SIGN UP</button>
				</div>
			)
			}
		</div>
	);
}

export default Navigation;
