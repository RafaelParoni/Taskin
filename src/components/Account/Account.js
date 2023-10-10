import { useState } from "react"

import './../../components/style.css'

// Banco de dados
import { initializeApp   } from "firebase/app";
import {collection, getDocs, getFirestore, setDoc, doc, addDoc, updateDoc  } from "firebase/firestore";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyCBBq1IMmZ_X-PdVaUlmLNr6kqOFXQQQ54",
  authDomain: "reactfirebase-664f2.firebaseapp.com",
  projectId: "reactfirebase-664f2",
  storageBucket: "reactfirebase-664f2.appspot.com",
  messagingSenderId: "747578180389",
  appId: "1:747578180389:web:d3b606db557909cecc10cc",
  measurementId: "G-SV40Z1WB5H"
});

function AccountPage(){

    const [nameUser, setNameUser] = useState('')
    const [Id, setId] = useState('')
    const [UserInfo, setUserInfo] = useState({}) // info User

    const [Tasks, setTasks] = useState([]); // Tasks User

    
    const [userss, setUsers] = useState([]);
    const db = getFirestore(firebaseApp);
    const userCollectionRef = collection(db, 'users');
    const TaskCollectionRef = collection(db, 'SIAJLTFPRWpCifRIn0Wu');


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

    async function BuscarTasks(){
        if(userss.length === 0){
            const data = await getDocs(TaskCollectionRef);
            console.log('BUSCANDO TASKS')
           // console.log(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
            setTasks(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
        }else{}
    }
    setTimeout(BuscarTasks, 100)

    async function AutoLogin(){
        if(window.localStorage.getItem('email') === null){
          console.log('nenhuma conta logada')
          window.location = '/autologin'
        }else{
          var id = window.localStorage.getItem('id')
          var name = window.localStorage.getItem('name')
          setId(id)
          setNameUser(name)
          document.title  = `Taskin - ${nameUser} perfil`
        }
    }
    setTimeout(AutoLogin, 10)

    function MostrarTasks(value){
        for(const key in value){
            console.log(Tasks[key])
        }
    }
    async function AdicionarTask(){
        console.log('Adicionando Task!')
        var tasks = {name: 'tesk2' , color: '#fff'}
        var idTask = Tasks.length + 1

        await setDoc(doc(db, UserInfo.id, idTask.toString()), tasks);
        window.location.reload()
    }

    return (
        <div>
            Bem vindo {nameUser}
            <button onClick={()=> MostrarTasks(Tasks)}>Info</button>
            <button onClick={()=> AdicionarTask()}>Adicionar uma Task</button>
            <div className="Tasks">
                
            </div>
        </div>
    )
}

export default AccountPage;