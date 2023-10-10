// Banco de dados
import { initializeApp } from "firebase/app";
import {collection, getDocs, getFirestore } from "firebase/firestore";
import { useState } from "react";
import bcrypt from "bcryptjs-react";

import './styleLogin.css'
import TitleLogin from "./components/Title";
import {LuEye, LuEyeOff, LuAlertTriangle, LuMailWarning, LuShieldQuestion} from 'react-icons/lu'


const firebaseApp = initializeApp({
  apiKey: "AIzaSyCBBq1IMmZ_X-PdVaUlmLNr6kqOFXQQQ54",
  authDomain: "reactfirebase-664f2.firebaseapp.com",
  projectId: "reactfirebase-664f2",
  storageBucket: "reactfirebase-664f2.appspot.com",
  messagingSenderId: "747578180389",
  appId: "1:747578180389:web:d3b606db557909cecc10cc",
  measurementId: "G-SV40Z1WB5H"
});

function LoginPage() {

    var AlertSpan = document.getElementById('FormIncorrectPassEmail')
    var EmailRequire = document.getElementById('FormRequireEmail')
    var PasswordRequire = document.getElementById('FormRequirePassword')


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userss, setUsers] = useState([]);


    const db = getFirestore(firebaseApp);
    const userCollectionRef = collection(db, 'users');

    async function BuscarUsers(){
      const data = await getDocs(userCollectionRef);
      setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
    }
    setTimeout(BuscarUsers, 100)

    async function VerifiqueSession(){
      if(window.localStorage.getItem('email') !== null){
        console.log(window.localStorage)
        console.log('temos uma conta logada')  
       window.location = '/'
      }
    }
    setTimeout(VerifiqueSession, 100)


    async function Login(){  //npm i bcryptjs
      if(email === ''){
          EmailRequire.style.display = 'flex'
          return
      }
      if(password === ''){
          PasswordRequire.style.display = 'flex'
          return
      }
      verifiqueEmail()
    }

    async function verifiqueEmail(){
        console.log(email)
        console.log(userss.length)
        var i = 0
        while(i < userss.length){
          console.log(i)
            if(email === userss[i].email){
                console.log('--------CONTA EMCONTRADA----------')
                console.log(userss[i].email)
                verifiqueSenha(userss[i])
                i = userss.length + 1
            }
            i++
        }
        if(i === userss.length){
            console.log('nenhum email encontrado')
            AlertSpan.style.display = 'flex'
        }
    }

    async function verifiqueSenha(user){
        console.log(user.passcrypt)
        var passwordCrypt  = user.passcrypt
        if(bcrypt.compareSync(password, passwordCrypt)){
            console.log('-----------Senha correto!------------')
            console.log(`fazendo login na conta ${user.email}`)
            window.localStorage.setItem('name', user.name)
            window.localStorage.setItem('email', email)
            window.localStorage.setItem('password', passwordCrypt)
            window.localStorage.setItem('id', user.id)

            window.location = '/'
        }else{
            console.log('senha incorreta!')
            AlertSpan.style.display = 'flex'
            window.localStorage.clear()
        }
    }

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


  return (
    <div className="LoginPage">
      <div className="Form">
        <TitleLogin/>
        <input type="text" id="login" placeholder="Email..."  value={email} onChange={(e) => {setEmail(e.target.value); AlertSpan.style.display = 'none'; EmailRequire.style.display = 'none'}} required />
        <spam id='FormRequireEmail'><LuMailWarning/> Coloque um e-mail!</spam>
        <div className="PasswordDiv"><input type="password" id="password"  autoComplete="false" placeholder="senha..."  value={password} onChange={(e) => {setPassword(e.target.value); AlertSpan.style.display = 'none'; PasswordRequire.style.display = 'none'}} required/><span id="BtnPassword" onClick={VisiblePassword}><LuEye id="LuEye"/> <LuEyeOff id="LuEyeOff"/></span></div>
        <spam id='FormRequirePassword'><LuShieldQuestion/>Coloque sua senha!</spam>
        <spam id='FormIncorrectPassEmail'> <LuAlertTriangle/> E-mail/Senha incorretos!</spam>
        <button  onClick={Login}>Entrar</button>
        <div className="extra">Crie uma conta clicando <a href="/registro">aqui!</a></div>
      </div>
    </div>
  );
};

export default LoginPage;
