import { useState} from "react"
import bcrypt from "bcryptjs-react";

import './style.css'
import ProfileIconDefault from './../../profileIcons/AvatarMale01.png'
import Navbar from "../Navbar/Navbar";
import {PiProhibitBold, PiPencilSimpleLineBold, PiSmileyBold, PiTrashSimpleBold, PiHandPalmBold, PiShieldBold, PiLightbulbBold} from 'react-icons/pi'


import { initializeApp   } from "firebase/app";
import {collection, getDocs, getFirestore, setDoc, doc, deleteDoc  } from "firebase/firestore";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyCBBq1IMmZ_X-PdVaUlmLNr6kqOFXQQQ54",
  authDomain: "reactfirebase-664f2.firebaseapp.com",
  projectId: "reactfirebase-664f2",
  storageBucket: "reactfirebase-664f2.appspot.com",
  messagingSenderId: "747578180389",
  appId: "1:747578180389:web:d3b606db557909cecc10cc",
  measurementId: "G-SV40Z1WB5H"
});


function ProfilePage(){
    const [Id, setId] = useState('')
    const [NameUser, setNameUser] = useState('')
    const [UserInfo, setUserInfo] = useState({}) 

    const [userss, setUsers] = useState([]);
    const db = getFirestore(firebaseApp);
    const userCollectionRef = collection(db, 'users');


    async function AutoLogin(){
        if(window.localStorage.getItem('email') === null){
          console.log('nenhuma conta logada')
          window.location = '/autologin'
        }else{
          setId(window.localStorage.getItem('id'))
          setNameUser( window.localStorage.getItem('name'))
          document.title  = `Taskin - ${window.localStorage.getItem('name')}  perfil`
        }
    }
    setTimeout(AutoLogin, 10)


    const [NewName, setNewName] =  useState('')
    const [NewPassword, setNewPassword ] = useState('')
    const [CofnirmPassword, setCofnirmPassword] = useState('')

    const [ConfirmEmail, setConfirmEmail] = useState('')


    async function BuscarUsers(){
        if(userss.length === 0){
            const data = await getDocs(userCollectionRef);
            setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
            
        }else{BuscarInfoUser()}
    }
    setTimeout(BuscarUsers, 100)

    async function BuscarInfoUser(){
        var i = 0
        while(i < userss.length){
            if(Id === userss[i].id){
                setUserInfo(userss[i])
                break
            }
            i++
        }
    }
    async function edit(value){
        if(value === 'profileImg' || value === 'info'){
            return
        }
        document.getElementById(value).style.display = 'flex'
        document.getElementById('CloseEdit').style.display = 'flex'

    }
    function CloseEdit(){
        document.getElementById('DeletAccount').style.display = 'none'
        document.getElementById('EditName').style.display = 'none'
        document.getElementById('EditPassowrd').style.display = 'none'
        document.getElementById('CloseEdit').style.display = 'none'
    }
    async function EditName(value){
        console.warn('Eitando Nome!')
        if(value === 'close'){
            document.getElementById('EditName').style.display = 'none'
            document.getElementById('CloseEdit').style.display = 'none'
            
        }else{
            if(NewName === NameUser){
             //   alert('Coloque um nome diferente do atual!')
             document.getElementById('alertNomeIgual').style.display = 'flex'
                return
            }
            if(NewName === ''){
              //  alert('Coloque um nome!')
              document.getElementById('alertSemNome').style.display = 'flex'
                return
            }
            if(NewName.length < 5){
             //   alert('Coloque um nome maior!')
             document.getElementById('alertNomePqueno').style.display = 'flex'
                return
            }
            
            var avatar = ''
            if(UserInfo.profileImg === undefined){
                avatar = ProfileIconDefault;
            }else{
                avatar = UserInfo.profileImg;
            }
            console.log('foi aqaui')
            var ProfileEdit = {email: UserInfo.email, name: NewName, passcrypt: UserInfo.passcrypt, profileImg: avatar}
            console.log(ProfileEdit)
            console.log(Id)
            await setDoc(doc(db, 'users', Id), ProfileEdit);
            window.localStorage.setItem('name', NewName)
            window.location.reload()
        }
    }
    let LetramMinuscula = new RegExp('(?=.*[a-z])')
    let LetramMaiuscula = new RegExp('(?=.*[A-Z])')
    let Number = new RegExp('(?=.*[0-9])')
    let PasswordTotal = new RegExp('(?=.{8,})')
    let caracterEspecial = new RegExp('[^A-Za-z0-9]')

    async function EditPassowrd(){
    
        if(bcrypt.compareSync(CofnirmPassword, UserInfo.passcrypt)){
            if(bcrypt.compareSync(NewPassword, UserInfo.passcrypt)){
                document.getElementById('alertPasswordIgual').style.display = 'flex'
                return
            }
            if(NewPassword.length === 0){
                document.getElementById('alertSemPassword').style.display = 'flex'
                return
            }
            if(!LetramMaiuscula.test(NewPassword)){
                document.getElementById('LetramMaiuscula').style.color = '#fc2727'
                return
            }else{
                document.getElementById('LetramMaiuscula').style.color = '#009e0d'
            }
            if(!LetramMinuscula.test(NewPassword)){
                document.getElementById('LetramMinuscula').style.color = '#fc2727'
                return
            }else{
                document.getElementById('LetramMinuscula').style.color = '#009e0d'
            }
            if(!Number.test(NewPassword)){
                document.getElementById('Number').style.color = '#fc2727'
                return
            }else{
                document.getElementById('Number').style.color = '#009e0d'
            }
            if(!caracterEspecial.test(NewPassword)){
                document.getElementById('caracterEspecial').style.color = '#fc2727'
                return
            }else{
                document.getElementById('caracterEspecial').style.color = '#009e0d'
            }
            if(!PasswordTotal.test(NewPassword)){
                document.getElementById('PasswordTotal').style.color = '#fc2727'
                return
            }else{
                document.getElementById('PasswordTotal').style.color = '#009e0d'
            }
            var avatar = ''
            if(UserInfo.profileImg === undefined){
                avatar = ProfileIconDefault;
            }else{
                avatar = UserInfo.profileImg;
            }

            const salt = bcrypt.genSaltSync(10);
            const passcrypt = bcrypt.hashSync(NewPassword, salt);

            var ProfileEdit = {email: UserInfo.email, name: UserInfo.name, passcrypt: passcrypt, profileImg: avatar}
            await setDoc(doc(db, 'users', Id), ProfileEdit);
            window.localStorage.setItem('password', passcrypt)
            window.location.reload()
        }else{
            document.getElementById('alertIcorretPassword').style.display = 'flex'
            return
        }
    }
    const PasswordEditValidation = (e)=> {
        setNewPassword(e.target.value);
        document.getElementById('alertSemPassword').style.display = 'none'; 
        document.getElementById('alertPasswordIgual').style.display = 'none'; 
    
        if(!LetramMaiuscula.test(e.target.value)){
            document.getElementById('LetramMaiuscula').style.color = '#fc2727'
            
        }else{
            document.getElementById('LetramMaiuscula').style.color = '#009e0d'
        }
        if(!LetramMinuscula.test(e.target.value)){
            document.getElementById('LetramMinuscula').style.color = '#fc2727'
        
        }else{
            document.getElementById('LetramMinuscula').style.color = '#009e0d'
        }
        if(!Number.test(e.target.value)){
            document.getElementById('Number').style.color = '#fc2727'
        }else{
            document.getElementById('Number').style.color = '#009e0d'
        }
        if(!caracterEspecial.test(e.target.value)){
            document.getElementById('caracterEspecial').style.color = '#fc2727'
        }else{
            document.getElementById('caracterEspecial').style.color = '#009e0d'
        }
        if(!PasswordTotal.test(e.target.value)){
            document.getElementById('PasswordTotal').style.color = '#fc2727'
            
        }else{
            document.getElementById('PasswordTotal').style.color = '#009e0d'
        }
    }
    async function Delete(){
        if(ConfirmEmail !== UserInfo.email){
            document.getElementById('alertAccountDelet').style.display = 'flex'
            return
        }
        const userDoc = doc(db, 'users', Id)
        await deleteDoc(userDoc);
        window.localStorage.clear()
        window.location = '/'
    }

    return (
        <>
            <Navbar/>
            <div className="ProfilePage">
                <div className="ProfileDiv">
                    <div className="Info">
                        <img alt="Profile Icon" src={ProfileIconDefault}/>
                        <input value={UserInfo.name} disabled />
                    </div>
                    <div className="Funciton">
                        <button onClick={()=> edit('DeletAccount')} style={{backgroundColor: "#f51c1c"}}><PiTrashSimpleBold/>Deletar conta</button>
                        <button onClick={() => edit('EditName')} style={{backgroundColor: "#0999bd"}}><PiPencilSimpleLineBold/> Editar Nome</button>
                        <button onClick={() => edit('EditPassowrd')} style={{backgroundColor: "#eff31f"}}><PiShieldBold/> Editar Senha</button>
                        <button  id="BtnDisable" onClick={() => edit('profileImg')}style={{backgroundColor: "#09bd09"}}> <PiSmileyBold/> Editar Foto de perfil</button>
                        <button id="BtnDisable"  onClick={() => edit('info')}style={{backgroundColor: "#f31f89"}}> <PiLightbulbBold/> Informações da conta</button>
                    </div>
                </div>
                <div id="CloseEdit" onClick={()=> CloseEdit()}></div>
                <div id="EditName" className="EditName">
                    <button onClick={CloseEdit} className="ClsoeBtn">X</button>
                    <h3>Editar Nome:</h3>
                    <h4>Digite seu Novo Nome:</h4>
                    <input value={NewName} onChange={(e) => {setNewName(e.target.value); document.getElementById('alertSemNome').style.display = 'none'; document.getElementById('alertNomeIgual').style.display = 'none'; document.getElementById('alertNomePqueno').style.display = 'none'}} placeholder="Novo nome..."/>
                    <div id="alertSemNome" className="alertEditName"><span><PiProhibitBold/></span><span> <b>Coloque um nome! </b></span></div>
                    <div id="alertNomeIgual" className="alertEditName"><span><PiProhibitBold/></span><span> <b> Coloque um nome diferente do atual! </b></span></div>
                    <div id="alertNomePqueno" className="alertEditName"><span><PiProhibitBold/></span><span><b> Coloque um nome maior que 5 caracteres! </b></span></div>
                    <div><button onClick={()=> EditName()}>Salvar</button><button onClick={()=> EditName('close')}>voltar</button></div>
                </div>
                <div id="EditPassowrd" className="EditPassowrd">
                    <button onClick={CloseEdit} className="ClsoeBtn">X</button>
                    <h3>Editar Senha:</h3>
                    <h4>Confirme sua senha:</h4>
                    <input value={CofnirmPassword} onChange={(e) => {setCofnirmPassword(e.target.value); document.getElementById('alertIcorretPassword').style.display = 'none';}} placeholder="Senha atual..."/>
                    <div id="alertIcorretPassword" className="alertEditPassword"><span><PiProhibitBold/></span><span> <b>Senha incorreta! </b></span></div>
                    <h4>Digite sua nova senha:</h4>
                    <input value={NewPassword} onChange={(e) => PasswordEditValidation(e)} placeholder="Nova senha..."/>
                    <div id="alertSemPassword" className="alertEditPassword"><span><PiProhibitBold/></span><span> <b>Coloque uma senha! </b></span></div>
                    <div id="alertPasswordIgual" className="alertEditPassword"><span><PiProhibitBold/></span><span> <b> Coloque uma senha diferente da atual! </b></span></div>
                    <ul className="PasswordEditReq">
                        <span>requisitos para a senha:</span>
                        <li id="LetramMinuscula">Letra Minúscula</li>
                        <li id="LetramMaiuscula">Letra Maiúscula</li>
                        <li id="Number">Número</li>
                        <li id="PasswordTotal">Mínimo 8 caracteres</li>
                        <li id="caracterEspecial">Caractere especial</li>
                    </ul>
                    <div><button onClick={()=> EditPassowrd()}>Salvar</button><button onClick={()=> CloseEdit()}>voltar</button></div>
                </div>
                <div id="DeletAccount" className="DeletAccount">
                    <button onClick={CloseEdit} className="ClsoeBtn">X</button>
                    <h2>tem certeza de excluir sua conta?</h2>
                    <h4>Você perderá acesso e exluira todas as suas tarefas!</h4>
                    <label for='ConfirmEmail'>escreva <b>"{UserInfo.email}"</b> para concluir a ação</label>
                    <input name="ConfirmEmail" id="ConfirmEmail" placeholder={UserInfo.email} value={ConfirmEmail} onChange={(e)=> {setConfirmEmail(e.target.value); document.getElementById('alertAccountDelet').style.display = 'none'}} />
                    <span id="alertAccountDelet" style={{display: 'none'}}> <PiHandPalmBold/> <b>Email errado!</b></span>
                    <button onClick={()=> Delete()} className="DeletBtn">Deletar</button>
                </div>  
            </div>
        </>
    )
}

export default ProfilePage;