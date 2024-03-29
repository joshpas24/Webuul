import React from 'react';

import { NavLink, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import { logout } from '../../store/session';
import './Navigation.css';
import WatchlistsModal from '../WatchlistsModal';
import { useNavigation } from '../../context/NavigationView';

function Navigation({ isLoaded }){
	const history = useHistory();
	const dispatch = useDispatch()

	const { navView, setNavView } = useNavigation()

	const user = useSelector(state => state.session.user);

	const handleHome = () => {
		history.push("/")
	}

	const navTransparency = navView !== 'home' ? {
		backgroundColor: 'rgba(255, 255, 255, 0.9)',
		boxShadow: '0 2px 50px rgba(107, 107, 107, 0.1)'
	} : {
		backgroundColor: 'rgba(255, 255, 255, 0)',
		boxShadow: 'none'
	}

	return (
		// <div className={user ? "three-container" : "two-container"}>
		<div className="two-container" style={navTransparency}>
			<div className='nav-left'>
				<button onClick={() => handleHome()} className='home-button'>
					{user ? <img src='/icon.png' className='logo-image' /> :
						<>
							<span><img src='/logo.png' className='logo-image'/></span> webuul
						</>
					}
				</button>
				{user && (<div className='nav-mid'>
					<div onClick={() => history.push("/markets")}
						className={navView === 'markets' ? "active-page" : ""}
					>
						MARKETS
					</div>
					<div onClick={() => history.push("/trading")}
						className={navView === 'trading' ? "active-page" : ""}
					>
						TRADING
					</div>
					<div onClick={() => history.push("/portfolio")}
						className={navView === 'portfolio' ? "active-page" : ""}
					>
						PORTFOLIO
					</div>
					<div onClick={() => history.push("/news")}
						className={navView === 'news' ? "active-page" : ""}
					>
						NEWS
					</div>
				</div>)}
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
					<WatchlistsModal />
					<button className='nav-button' id='nav-fill' onClick={() => dispatch(logout())}>SIGN OUT</button>
				</div>
			)
			}
		</div>
	);
}

export default Navigation;
