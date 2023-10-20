import './style.css'

import {BsInstagram, BsGithub, BsBrowserChrome, BsFillEmojiSmileUpsideDownFill, BsHouseFill, BsPersonCircle, BsDoorClosedFill} from 'react-icons/bs'
function Navbar(){
    return (
        <>
            <div className='Navbar'>
                <div className='LargeScreen'>
                    <div className='LargeSocial'>
                        <a href='https://github.com/RafaelParoni'><BsGithub/></a>
                        <a href='https://www.instagram.com/rafaelparroni/'><BsInstagram/></a>
                        <a href='https://rafaelparoni.vercel.app/'><BsBrowserChrome/></a>
    
                    </div>
                    <div className='LargeUser'>
                        <p><BsFillEmojiSmileUpsideDownFill/> Olá {window.localStorage.getItem('name')}</p>
                    </div>
                    <div className='LargeAccount'>
                        <button onClick={()=> window.location = '/'}><BsHouseFill/></button>
                        <button onClick={()=> window.location = '/profile'}><BsPersonCircle/></button>
                        <button  onClick={()=> {window.localStorage.clear(); window.location = '/login'}}><BsDoorClosedFill/></button>
                    </div>
                </div>
                <div className='SmallScreen'>
                    <div className='SmallSocial'>
                        <a href='https://github.com/RafaelParoni'><BsGithub/></a>
                    </div>
                    <div className='SmallUser'>
                        <p>{window.localStorage.getItem('name')}</p>
                    </div>
                    <div className='SmallAccount'>
                        <button onClick={()=> window.location = '/'}><BsHouseFill/></button>
                        <button onClick={()=> window.location = '/profile'}><BsPersonCircle/></button>
                        <button onClick={()=> {window.localStorage.clear(); window.location = '/login'}}><BsDoorClosedFill/></button>
                    </div>
                </div>
            </div>
        </>
    )
}


export default Navbar;