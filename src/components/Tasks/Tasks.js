import { useState } from "react"

import './style.css'
import {AiOutlineDelete, AiOutlineCheck, AiOutlineExclamationCircle, AiOutlineFileAdd, AiOutlineClose} from 'react-icons/ai'
import {IoAdd} from 'react-icons/io5'
import Navbar from './../Navbar/Navbar'

// Banco de dados
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

function TasksPage(){
    const [nameUser, setNameUser] = useState('')
    const [Id, setId] = useState('')
    const [UserInfo, setUserInfo] = useState({}) // info User

    const [Tasks, setTasks] = useState([]); // Tasks User


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
    
    const [userss, setUsers] = useState([]);
    const db = getFirestore(firebaseApp);
    const userCollectionRef = collection(db, 'users');
    const TaskCollectionRef = collection(db, window.localStorage.getItem('id'));



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






    async function DeleteTask(id){ // DELETAR TASK DO BD
        const userDoc = doc(db, window.localStorage.getItem('id'), id)
        await deleteDoc(userDoc);
        window.location.reload()
    }

    const [NameTask, setNameTask] = useState('')
    const [ColorTask, setColorTask] = useState('')

    function EditColorExemeple(color){ // PEGANDO COR ESCOLHIDA PELO USUARIO
        var TaskExemeple = document.getElementById('TaskExemeple')
        TaskExemeple.style.backgroundColor = color
    }

    async function MarkTask(value){ // MARCAR TASK 
        var task = document.getElementById(value)
        var CheckTask = document.getElementById(`CheckTask`)
        var CheckTaskOff = document.getElementById('CheckOffTask')
        const Tasks = await getDocs(TaskCollectionRef);
        var TaskSelect = Tasks.docs.map((doc) => ({...doc.data(), id: doc.id}))
        var taskEdit = ''
        var i = 0
        while(i < TaskSelect.length ){
            if(TaskSelect[i].id === value){
                TaskSelect = {name: TaskSelect[i].name, color: TaskSelect[i].color}
            }
            i++
        }
        console.log(TaskSelect)
        
        if(task.attributes.getNamedItem('class').value === ''){
            task.setAttribute('class' , 'ConfirmBtnCheck')
            CheckTaskOff.style.display = 'flex'
            CheckTask.style.display = 'none'

            taskEdit = {name: TaskSelect.name , color: TaskSelect.color, stats: 'ConfirmBtnCheck'}
            await setDoc(doc(db, UserInfo.id, value.toString()), taskEdit);
            window.location.reload()
        }else{
            task.setAttribute('class', '' )
            CheckTaskOff.style.display = 'none'
            CheckTask.style.display = 'flex'

            taskEdit = {name: TaskSelect.name , color: TaskSelect.color, stats: ''}
            await setDoc(doc(db, UserInfo.id, value.toString()), taskEdit);
            window.location.reload()
        }
    }
    
    function MostrarTasks({item}){ // MOSTRAR TASKS PARA O USUARIOS
        var status = ''
        if(item.stats === 'ConfirmBtnCheck'){
            status = 'ConfirmBtnCheck'
        }else{
            status = ''
        }
        return (
            <div className="TasksDiv">
                <div id="Task" className="Task" onClick={()=> MarkTask(item.id)} style={{backgroundColor: `${item.color}`}}>
                        <span  onClick={()=> MarkTask(item.id)} className={status} id={item.id} > {item.name} </span>
                        <button className="ConfirmBtn"><AiOutlineCheck id="CheckTask"/><AiOutlineClose id="CheckOffTask"/></button>
                        <button onClick={()=> DeleteTask(item.id)} className="DeletBtn"><AiOutlineDelete/></button>
                </div>
            </div>
        )
    }
    function CreateNewTaskDiv(value){ // MONSTAR DIV PARA CRIAR UMA NOVA TASK
        if(value === 'visible'){
            document.getElementById('CreateTaskDiv').style.display = 'flex'
        }else {
            document.getElementById('CreateTaskDiv').style.display = 'none'
        }
    }
    async function AdicionarTask(){ // ADICIONAR UMA NOVA TASK AO BANCO DE DADOS
        
        if(NameTask === ''){
            document.getElementById('AlertNameOut').style.display = 'flex'
            return
        }
        var tasks = {name: NameTask , color: ColorTask, stats: ''}
        var idTask = Tasks.length + 1

        await setDoc(doc(db, UserInfo.id, idTask.toString()), tasks);
        window.location.reload()
    }


    return (
        <>
        <Navbar/>
        <div className="TaskPage">
            <fieldset>
                <legend>Tasks</legend>
                <div className="NewTaskDiv">
                    <span>Criar uma nova task!</span>
                    <button onClick={()=> CreateNewTaskDiv('visible')}><AiOutlineFileAdd/></button>
                </div>
            </fieldset>
            <fieldset id="CreateTaskDiv" className="CreateTasksForm">
                <legend>Adicionar uma Task!</legend>
                <button className="CloseBtn" onClick={()=> CreateNewTaskDiv()}><AiOutlineClose/></button>
                <div id="TaskExemeple" className="TaskExemeple">
                    <input  type="text" className="" id="key" value={NameTask}  placeholder="........" disabled />
                    <button onClick={()=> MarkTask('key')} className="ConfirmBtn"><span id="CheckTask"><AiOutlineCheck/></span> <span id="CheckOffTask"><AiOutlineClose/></span></button>
                    <button className="DeletBtn"><AiOutlineDelete/></button>
                </div>
                <div className="TaskCreate">
                    <span id="AlertNameOut"><AiOutlineExclamationCircle/> Coloque um Nome!</span>
                    <input className="InputName"
                        onChange={(e) => {setNameTask(e.target.value);  document.getElementById('AlertNameOut').style.display = 'none'}} 
                        value={NameTask} 
                        id="NameTaskk"  
                        type="text"  
                        placeholder="Task name..." 
                        maxLength={25}/>
                    <div>
                        <input 
                            onChange={(e) => {setColorTask(e.target.value); EditColorExemeple(e.target.value)} }
                            id="ColorTaskk" 
                            type="color" />
                    </div>
                </div>
                <button className="createBtn" onClick={()=> AdicionarTask()}><span><IoAdd/></span></button>
            </fieldset>
            <div className="Tasks">
                {Tasks.map((Tasks, index) => <MostrarTasks item={Tasks} />)}
            </div>
        </div>
        </>
    )
}

export default TasksPage;