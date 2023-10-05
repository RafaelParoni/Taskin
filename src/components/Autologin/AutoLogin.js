// Banco de dados
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";
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

function AutoLoginPage() {

    // setUserAtivo(data.docs.map((doc) => ({...doc.data(), id: doc.id}))[i])

    const db = getFirestore(firebaseApp);
    const userCollectionRef = collection(db, 'users');

    async function AutoVerification(){
        console.log('---------verificando Login!----------')
      const data = await getDocs(userCollectionRef);
        if(window.localStorage.getItem('email') === null){
            console.log('nenhuma conta logada')
            window.location = '/login'
        }else{
          var email = window.localStorage.getItem('email')
          var i = 0
          while( i < data.docs.map((doc) => ({...doc.data(), id: doc.id})).length){
            if(email === data.docs.map((doc) => ({...doc.data(), id: doc.id}))[i].email){
                console.log('-----------Login correto!------------')
                AutoLogin(data.docs.map((doc) => ({...doc.data(), id: doc.id}))[i])
                i = data.docs.map((doc) => ({...doc.data(), id: doc.id})).length + 1;
            }
            i++;
          }
          if(i === data.docs.map((doc) => ({...doc.data(), id: doc.id})).length){
            console.log('n achei um email')
          }
        };
    }
    setTimeout(AutoVerification, 100)
    async function AutoLogin(user){
        // info users name - id - email - passcrypt
        console.log('---------verificando Senha!----------')
        var password = window.localStorage.getItem('password')
        if(bcrypt.compareSync(password, user.passcrypt)){
            console.log('-----------Senha correto!------------')
            console.log(`fazendo login na conta ${user.email}`)
            window.location = '/'
        }else{
            console.log('senha incorreta!')
            window.localStorage.clear()
            window.location = '/'
        }
    }

  return (
    <>
    <div>
      <h1>CARREGANDO</h1>
    </div>
    </>
  );
};

export default AutoLoginPage;
