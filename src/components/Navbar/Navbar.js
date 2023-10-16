import './style.css'
import {IoLogoInstagram, IoLogoRss, IoLogoGithub} from 'react-icons/io5'
import {PiSignOutBold, PiUserBold} from 'react-icons/pi'
function Navbar(){
    return (
        <nav>
            <div className='social'><a href='https://www.instagram.com/rafaelparroni/'><IoLogoInstagram/></a><a  href='https://github.com/RafaelParoni'><IoLogoGithub/></a><a  href='https://rafaelparoni.vercel.app/'><IoLogoRss/></a></div>
            <p><PiUserBold/> {window.localStorage.getItem('name')}</p>
            <div className='account'><button onClick={function(){window.localStorage.clear(); window.location = '/'}}><PiSignOutBold/></button></div>
        </nav>
    )
}


export default Navbar;