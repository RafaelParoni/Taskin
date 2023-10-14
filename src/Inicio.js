import { useState } from "react"


function App() {

  const [nameUser, setNameUser] = useState('')
  const [emailUser, setEmailUser] = useState('')

  
  async function AutoLogin(){
    if(window.localStorage.getItem('email') === null){
      console.log('nenhuma conta logada')
      console.log(window.localStorage)
      window.location = '/autologin'
    }else{
      var email = window.localStorage.getItem('email')
      var name = window.localStorage.getItem('name')
      console.log(window.localStorage)
      setEmailUser(email)
      setNameUser(name)
      console.log(window.localStorage)
    }
  }
  setTimeout(AutoLogin, 10)


  return (
    <>
    <div>
      <h1>INICIO</h1> 
      <h2>Bem vindo: {nameUser !== '' &&(<>{nameUser}</>)} </h2>
      <h2>Email: {nameUser !== '' &&(<>{emailUser}</>)} </h2>
      <a href="/registro"> - REGISTRO - </a>
      <a href="/login"> - LOGIN - </a>
      <a href="/autologin"> - AUTOLOGIN - </a>
      <a href="/tasks"> - Tasks - </a>
      <button onClick={function(){window.localStorage.clear(); console.log(window.localStorage); window.location.reload()}}>RESET localStorage</button>
    </div>
    </>
  );
};

export default App;
