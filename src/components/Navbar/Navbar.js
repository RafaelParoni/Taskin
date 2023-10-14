import './style.css'
import {IoLogoInstagram, IoLogoRss, IoLogoGithub , IoLogInSharp, IoPersonOutline} from 'react-icons/io5'

function Navbar(){
    return (
        <nav>
            <div className='social'><a href='https://www.instagram.com/rafaelparroni/'><IoLogoInstagram/></a><a  href='https://github.com/RafaelParoni'><IoLogoGithub/></a><a  href='https://rafaelparoni.vercel.app/'><IoLogoRss/></a></div>
            <p><IoPersonOutline/> {window.localStorage.getItem('name')}</p>
            <div className='account'><button onClick={function(){window.localStorage.clear(); window.location = '/'}}><IoLogInSharp/></button></div>
        </nav>
    )
}


export default Navbar;