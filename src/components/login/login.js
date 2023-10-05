// Banco de dados
import { initializeApp } from "firebase/app";
import {collection, getDocs, getFirestore } from "firebase/firestore";
import { useState } from "react";
import bcrypt from "bcryptjs-react";

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
            alert('Coloque um Email!')
            return
        }
        if(password === ''){
            alert('Coloque uma Senha!')
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

            console.log(window.localStorage)
            window.location = '/'
        }else{
            console.log('senha incorreta!')
            window.localStorage.clear()
           // window.location = '/'
        }
    }


  return (
    <>
    <div>
      <form>
        <input type="text" placeholder="email..."  value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password"  autoComplete="false" placeholder="senha..."  value={password} onChange={(e) => setPassword(e.target.value)} required/>
      </form>
      <button onClick={Login}>Logar</button>
    </div>
    </>
  );
};

export default LoginPage;
