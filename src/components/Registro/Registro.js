// Banco de dados
import { initializeApp } from "firebase/app";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
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

function RegistroPage() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confiPassword, setconfiPassword] = useState('');
  const [userss, setUsers] = useState([]);


  const db = getFirestore(firebaseApp);
  const userCollectionRef = collection(db, 'users');


    async function Registrar(){  //npm i bcryptjs
        const data = await getDocs(userCollectionRef);
        setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})))

        if(name === ''){
            alert('Coloque um Nome!')
            return
        }
        if(email === ''){
            alert('Coloque um Email!')
            return
        }
        if(password === ''){
            alert('Coloque uma Senha!')
            return
        }
        if(confiPassword === ''){
            alert('Confirme sua Senha!')
            return
        }
        if(password !== confiPassword){
            alert('Senhas Diferentes!')
            return
        }
        var i = 0
        while(i < userss.length){
            if(email === userss[i].email){
                alert('JA TEM UM COM ESTE EMAIL')
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
        resetInput()
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
    
  

  return (
    <>
    <div>
      <form>
        <input type="text" placeholder="name..." value={name} onChange={(e) => setName(e.target.value)} required/>
        <input type="text" placeholder="email..."  value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password"  autoComplete="false" placeholder="senha..."  value={password} onChange={(e) => setPassword(e.target.value)} required/>
        <input type="password" autoComplete="false" placeholder="confirme sua senha..."  value={confiPassword} onChange={(e) => setconfiPassword(e.target.value)} required/>
      </form>
      <button onClick={Registrar}>Registrar</button>
      <button onClick={function(){window.location = '/autologin'}}> AutoLogin</button>
      <button onClick={function(){console.log(window.localStorage)}}>localStorage</button>
    </div>
    </>
  );
};

export default RegistroPage;
