// Banco de dados
import { initializeApp } from "firebase/app";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import { useState } from "react";
import bcrypt from "bcryptjs-react";

import './styleRegistro.css'
import {LuEye, LuEyeOff, LuShieldQuestion, LuMailWarning, LuBadgeAlert} from 'react-icons/lu'

const firebaseApp = initializeApp({
  apiKey: "AIzaSyCBBq1IMmZ_X-PdVaUlmLNr6kqOFXQQQ54",
  authDomain: "reactfirebase-664f2.firebaseapp.com",
  projectId: "reactfirebase-664f2",
  storageBucket: "reactfirebase-664f2.appspot.com",
  messagingSenderId: "747578180389",
  appId: "1:747578180389:web:d3b606db557909cecc10cc",
  measurementId: "G-SV40Z1WB5H"
});

function RegistroPage() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confiPassword, setconfiPassword] = useState('');
  const [userss, setUsers] = useState([]);


  const db = getFirestore(firebaseApp);
  const userCollectionRef = collection(db, 'users');


  var NumberValid = document.getElementById('NumberValid')
  const [NumberVeri, setNumberVeri] = useState(false);
  var StringValid = document.getElementById('StringValid')
  const [StringVeri, setStringVeri] = useState(false);
  var CaractValid = document.getElementById('CaractValid')
  const [CaractVeri, setCaractVeri] = useState(false);
  var LenghtValid = document.getElementById('LenghtValid')
  const [LenghtVeri, setLenghtVeri] = useState(false);
  var NameValid = document.getElementById('NameValid')
  var EmailValid = document.getElementById('EmailValid')
  var PasswordValid = document.getElementById('PasswordValid')
  var PasswordConfirmValid = document.getElementById('PasswordConfirmValid')
  var PasswordVerifValid = document.getElementById('PasswordVerifValid')
  var EmailDupleValid = document.getElementById('EmailDupleValid')

  async function BuscarUsers(){
    if(userss.length === 0){
       const data = await getDocs(userCollectionRef);
       setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
    }else{return}
  }
  setTimeout(BuscarUsers, 100)

    async function Registrar(){  //npm i bcryptjs
      NameValid.style.display = 'none'
      EmailValid.style.display = 'none'
      PasswordValid.style.display = 'none'
      PasswordConfirmValid.style.display = 'none'
      PasswordVerifValid.style.display = 'none'
      EmailDupleValid.style.display = 'none'

      if(name === ''){
        NameValid.style.display = 'flex'
        return
      }
      if(email === ''){
        EmailValid.style.display = 'flex'
        return
      }
      if(!NumberVeri && !StringVeri && !LenghtVeri && !CaractVeri) {
        console.log('REQUIRED')
        return
      }
      if(NumberVeri === false) {
        console.log('REQUIRED')
        return
      }
      if(StringVeri === false) {
        console.log('REQUIRED')
        return
      }
      if(LenghtVeri === false) {
        console.log('REQUIRED')
        return
      }
      if(CaractVeri === false) {
        console.log('REQUIRED')
        return
      }
      if(password === ''){
        PasswordValid.style.display = 'flex'
        return
      }
      if(confiPassword === ''){
        PasswordConfirmValid.style.display = 'flex'
        return
      }
      if(password !== confiPassword){
        PasswordVerifValid.style.display = 'flex'
        return
      }
      var i = 0
      while(i < userss.length){
        if(email === userss[i].email){
          EmailDupleValid.style.display = 'flex'
          console.log(userss[i].email)
          return
        }
        i++
      }

        const salt = bcrypt.genSaltSync(10);
        const passcrypt = bcrypt.hashSync(password, salt);
        const user = await addDoc(userCollectionRef, {
        email,
        name, 
        passcrypt,
        });  
        console.log(user)
        window.localStorage.setItem('name', name)
        window.localStorage.setItem('email', email)
        window.localStorage.setItem('password', password)
        window.localStorage.setItem('id', user.id)
        resetInput()
    }

    function VerifiquePasswordRequires(value){
      LenghtValid.style.color = '#ee0e0e'
      NumberValid.style.color = '#ee0e0e'
      StringValid.style.color = '#ee0e0e'
      CaractValid.style.color = '#ee0e0e'
     for (let c of value) {
       if (isLetter(c)) {
         StringValid.style.color = 'green'
         setNumberVeri(true)
       } else if (isDigit(c)) {
         NumberValid.style.color = 'green'
         setStringVeri(true)
       } else {
         CaractValid.style.color = 'green'
         setCaractVeri(true)
       }
     }
     if(value.length > 7){
      setLenghtVeri(true)
      LenghtValid.style.color = 'green'
     }
     function isLetter(str) {
       return str.length === 1 && str.match(/[a-zA-Z]/i);
     }
     function isDigit(str) {
       return str.length === 1 && str.match(/[0-9]/i);
     }
    }

    function resetInput(){
        setName('')
        setEmail('')
        setPassword('')
        setconfiPassword('')
    }

    async function VerifiqueSession(){
      if(window.localStorage.getItem('email') !== null){
        console.log(window.localStorage)
        console.log('temos uma conta logada')  
        window.location = '/'
      }
    }
    setTimeout(VerifiqueSession, 100)
    

    function VisiblePassword(){
      var InputPassword = document.getElementById("password");
      var VisibleIcon = document.getElementById('LuEye')
      var NoVisibleIcon = document.getElementById('LuEyeOff')
      if (InputPassword.type === "password") {
        VisibleIcon.style.display = 'none'
        NoVisibleIcon.style.display = 'flex'
        InputPassword.type = "text";
      } else {
        InputPassword.type = "password";
        VisibleIcon.style.display = 'flex'
        NoVisibleIcon.style.display = 'none'
      }
    }
    function VisiblePasswordConfirm(){
      var InputPassword = document.getElementById("passwordconfirm");
      var VisibleIcon = document.getElementById('LuEye2')
      var NoVisibleIcon = document.getElementById('LuEyeOff2')
      if (InputPassword.type === "password") {
        VisibleIcon.style.display = 'none'
        NoVisibleIcon.style.display = 'flex'
        InputPassword.type = "text";
      } else {
        InputPassword.type = "password";
        VisibleIcon.style.display = 'flex'
        NoVisibleIcon.style.display = 'none'
      }
    }
  

  return (
    <div className="RegistroPage">
      <form className="Form" >
        <h1>Registrar</h1>
        <input type="text" placeholder="name..." value={name} onChange={(e) => setName(e.target.value)} required/>
        <span id="NameValid"><LuBadgeAlert/>Coloque um Nome!</span>
        <input type="text" placeholder="email..."  value={email} onChange={(e) => setEmail(e.target.value)} required />
        <span id="EmailValid"><LuMailWarning/> Email</span>
        <span id="EmailDupleValid"><LuMailWarning/> este email já está sendo usado!</span>
        <div className="PasswordDiv"><input type="password" id="password"  autoComplete="false" placeholder="senha..."  value={password} onChange={(e) => {setPassword(e.target.value); VerifiquePasswordRequires(e.target.value)} } required/><span id="BtnPassword" onClick={VisiblePassword}><LuEye id="LuEye"/> <LuEyeOff id="LuEyeOff"/></span></div>
        <div className="PasswordDiv"><input type="password" id="passwordconfirm"  autoComplete="false" placeholder="confirme sua senha..."  value={confiPassword} onChange={(e) => setconfiPassword(e.target.value)} required/><span id="BtnPassword" onClick={VisiblePasswordConfirm}><LuEye id="LuEye2"/> <LuEyeOff id="LuEyeOff2"/></span></div>
        <span id="PasswordValid"><LuShieldQuestion/> Senhas</span>
        <span id="PasswordConfirmValid"><LuShieldQuestion/> Confirme sua Senha!</span>
        <span id="PasswordVerifValid"><LuShieldQuestion/> Senhas Diferentes!</span>
        <div id="RequiredList" >
          <ul>
            <span>requisitos para a senha:</span>
            <li id="NumberValid">Número</li>
            <li id="StringValid">Letra</li>
            <li id="CaractValid">Caractere especial</li>
            <li id="LenghtValid">Mínimo 8 caracteres</li>
          </ul>
        </div>
        <button type="button" onClick={Registrar}>Registrar</button>
        <div className="extra"> Você já tem uma conta? entre <a href="/login">aqui!</a></div>
      </form>
    </div>
  );
};

export default RegistroPage;

/* 
  <button onClick={function(){window.location = '/autologin'}}> AutoLogin</button>
  <button onClick={function(){console.log(window.localStorage)}}>localStorage</button>
*/