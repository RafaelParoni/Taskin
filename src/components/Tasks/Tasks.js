import { useState, useRef, useEffect } from "react"

import './style.css'
import {PiPenNibBold, PiNotePencilBold, PiPlusBold, PiXBold, PiSealWarningBold, PiHandBold,  PiPlusCircleBold, PiCheckBold, PiTrashSimpleBold, PiCaretRightBold} from 'react-icons/pi'
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
    var TaskDispley = []


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
        const element = document.getElementById(`task${id}`)
        const userDoc = doc(db, window.localStorage.getItem('id'), id)
        element.remove()
        await deleteDoc(userDoc);

        const data = await getDocs(TaskCollectionRef);
        console.log(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
        if(data.docs.map((doc) => ({...doc.data(), id: doc.id})).length === 0){
            window.location.reload()
        }
    }

    const [NameTask, setNameTask] = useState('')
    const [ColorTask, setColorTask] = useState('')

    const textAreaRef = useRef(null);
    const [Val, setVal] = useState("");
    const handleChange = (e) => {
        setVal(e.target.value);
    }
    useEffect(() => {
        textAreaRef.current.style.height = "25px";
        textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
    }, [Val])



    function NewTaskColorEdit(color){ // PEGANDO COR ESCOLHIDA PELO USUARIO
        var NewTaskH1 = document.getElementById('NewTaskH1')
        NewTaskH1.style.color = color
    }

    async function MarkTask(value){ // MARCAR TASK 
        var task = document.getElementById(value)
        const Tasks = await getDocs(TaskCollectionRef);
        var TaskSelect = Tasks.docs.map((doc) => ({...doc.data(), id: doc.id}))
        var taskEdit = ''
        var i = 0
        while(i < TaskSelect.length ){
            if(TaskSelect[i].id === value){
                TaskSelect = {name: TaskSelect[i].name, color: TaskSelect[i].color, details: TaskSelect[i].details}
            }
            i++
        }
        
        if(task.attributes.getNamedItem('class').value === ''){
            task.setAttribute('class' , 'ConfirmBtnCheck')

            taskEdit = {name: TaskSelect.name , color: TaskSelect.color, details: TaskSelect.details, stats: 'ConfirmBtnCheck'}
            await setDoc(doc(db, UserInfo.id, value.toString()), taskEdit);
          //  window.location.reload()
        }else{
            task.setAttribute('class', '' )

            taskEdit = {name: TaskSelect.name , color: TaskSelect.color, details: TaskSelect.details, stats: ''}
            await setDoc(doc(db, UserInfo.id, value.toString()), taskEdit);
           // window.location.reload()
        }
    }
    
    function CreateTaskDiv(value){ // MONSTAR DIV PARA CRIAR UMA NOVA TASK
        if(value === 'create'){
            document.getElementById('CreateTaskDiv').style.display = 'flex'
            document.getElementById('BackgroundCreateTaskDiv').style.display = 'flex'
            document.getElementById('textereaDeatils').style.height = '35px'
        }else {
            document.getElementById('CreateTaskDiv').style.display = 'none'
            document.getElementById('textereaDeatils').style.height = '35px'
            document.getElementById('BackgroundCreateTaskDiv').style.display = 'none'
        }
    }
    async function AdicionarTask(){ // ADICIONAR UMA NOVA TASK AO BANCO DE DADOS
        if(NameTask === ''){
            document.getElementById('AlertNameOut').style.display = 'flex'
            return
        }
        const data = await getDocs(TaskCollectionRef);
        var Total = data.docs.map((doc) => ({...doc.data(), id: doc.id}))
      
        var tasks = {name: NameTask , color: ColorTask, stats: '', details: Val}
        
        var i = 0
        var maiorNum = 0
        while( i < Total.length){
            var NumberTask = parseInt(Total[i].id)
            if(NumberTask >= maiorNum){
                maiorNum = NumberTask
            }
            i++
        }
        console.log(`Maior Numero: ${maiorNum}`)
        var idTask =  maiorNum  + 1

        await setDoc(doc(db, UserInfo.id, idTask.toString()), tasks);

        window.location.reload()

    }
    function OpenDetails(DetailsId, IndicadorId){
        var Indicador = document.getElementById(IndicadorId)
        var Details = document.getElementById(DetailsId)
        if(Details.style.display === ''){
            Indicador.style.rotate = '90deg'
            Details.style.display = 'flex'
        }else if(Details.style.display === 'none'){
            Indicador.style.rotate = '90deg'
            Details.style.display = 'flex'
        }else{
            Indicador.style.rotate = '0deg'
            Details.style.display = 'none'
        }
    }

 
    function TasksListDisplay(){
        TaskDispley = []
        if(TaskDispley.length !== 0){
            return
        }
        var status = ''
        if(Tasks.length === 0){
            TaskDispley.push(
                <h3 className="AlertNoneTasks"><PiHandBold/> Ops, parece que você não tem nenhuma Takins em nosso banco de dados! crie um <span onClick={()=> CreateTaskDiv('create')}> aqui! <PiPlusCircleBold/> </span></h3>
            )
        }else{
            for(const key in Tasks){
                if(Tasks[key].stats === 'ConfirmBtnCheck'){
                    status = 'ConfirmBtnCheck'
                }else{
                    status = ''
                }
                var Details = ''
                if(Tasks[key].details === '' || Tasks[key].details === undefined){
                    Details = 'Parece que você não colocou nenhum detalhe na hora de criar sua Taskin :('
                }else {
                    Details = Tasks[key].details
                }
                TaskDispley.push(
                    <>
                        <div style={{backgroundColor: `${Tasks[key].color}c5`}} className="TaskDiv" id={`task${Tasks[key].id}`}>
                                <p id={Tasks[key].id} onClick={()=> OpenDetails(`TaskDetails${Tasks[key].id}`, `TaskIndicator${Tasks[key].id}`)} className={status} > <span id={`TaskIndicator${Tasks[key].id}`}><PiCaretRightBold/></span> {Tasks[key].name} </p>
                                <button className="MarkButton" onClick={() => MarkTask(Tasks[key].id)}><PiCheckBold/></button>
                                <button className="DelButton" onClick={() => DeleteTask(Tasks[key].id)}><PiTrashSimpleBold/></button>
                        </div>
                        <div className="TaskDetails" id={`TaskDetails${Tasks[key].id}`} >
                            <textarea defaultValue={Details} disabled='true'  />  
                        </div>
                    </>
                )
    
            }
        }
    }
    TasksListDisplay()

    
    return (
        <>
        <Navbar/>
        <div className="TaskPage" >
            <div className="main" id="ExemepleTaskDiv">
                <div className="mainTitles">
                    <h1>Taskin <PiNotePencilBold/> </h1>
                    <p>Crie tarefas no taskin com Nomes, Descrições e Cores personalizadas e quando se concretizaram marcar como concluída.</p>
                </div>
                <div className="MainFuncitons">
                    <div className="Funcitons">
                        <span>Crie uma nova tarefa!</span>
                        <button onClick={() => CreateTaskDiv('create')}><PiPenNibBold/></button>
                    </div>
                </div>
            </div>
            <div className="BackgroundNewTask" id="BackgroundCreateTaskDiv" onClick={()=> CreateTaskDiv()}></div>
            <div className="NewTask" id="CreateTaskDiv">
                <button className="CloseNewTask" onClick={()=> CreateTaskDiv()} ><PiXBold/></button>
                <div className="NewTaskTitles">
                    <h3 id="NewTaskH1">Crie sua nova task!</h3>
                    <p>Crie sua tarefa de acordo com os requisitos abaixo:</p>
                </div>
                <div className="NewTaskFormsName-Color">
                    <input onChange={(e)=> setNameTask(e.target.value)} value={NameTask} name="name" className="NewTaskFormsInput" type="text" placeholder="Name Task..."/>
                    <div class="NewTaskFormsInputColor">
                        <input id="input-color"  onChange={(e) => {setColorTask(e.target.value); NewTaskColorEdit(e.target.value)} }  class="NewTaskFormsinput-color" type="color"/>
                    </div>
                </div>
                <span id="AlertNameOut"><PiSealWarningBold/> Coloque um Nome!</span>
                <div className="NewTaskFormsDscri">
                    <textarea id="textereaDeatils"  wrap="hard" value={Val} ref={textAreaRef} onChange={handleChange} maxLength={2000}  placeholder="Escreva uma descrição da tarefa! - máximo de caracteres 2000" />
                </div>
                <span id="AlertDescriOut"><PiSealWarningBold/> Coloque uma descrição!</span>
                <div className="NewTaskButtons"> 
                    <span>Criar a tarefa!</span>   
                    <button onClick={AdicionarTask}><PiPlusBold/></button>
                </div>
            </div>
            <div className="Tasks">
                <h4>Suas Taskins!</h4>
                <div className="TasksList" onLoad={TasksListDisplay}>
                    {TaskDispley}
                </div>

            </div>
        </div>
        </>
    )
}

export default TasksPage;