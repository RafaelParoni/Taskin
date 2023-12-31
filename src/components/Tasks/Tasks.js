import { useState, useRef, useEffect } from "react"

import './style.css'
import {PiPenNibBold, PiNotePencilBold, PiFunnelBold, PiPaintBrushHouseholdBold, PiPaintBrushBroadBold, PiPaintBrushBold, PiPlusBold, PiXBold, PiSealWarningBold, PiHandBold,  PiPlusCircleBold, PiCheckBold, PiTrashSimpleBold, PiCaretRightBold} from 'react-icons/pi'
import Navbar from './../Navbar/Navbar'

// Banco de dados
import { initializeApp   } from "firebase/app";
import {collection, getDocs, getFirestore, setDoc, doc, deleteDoc  } from "firebase/firestore";
import { FIRE_BASE_KEY } from "../keys/importKeys";

const firebaseApp = initializeApp({
  apiKey: FIRE_BASE_KEY,
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
          document.title  = `Taskin - ${nameUser}`
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
    setTimeout(BuscarUsers, 10)
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
        const Task = document.getElementById(`task${id}`)
        const TaskDetails = document.getElementById(`TaskDetails${id}`)
        const userDoc = doc(db, window.localStorage.getItem('id'), id)
        Task.remove()
        TaskDetails.remove()
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
        var taskBox  = document.getElementById(`TaskBox${value}`)
        const Tasks = await getDocs(TaskCollectionRef);
        var TaskSelect = Tasks.docs.map((doc) => ({...doc.data(), id: doc.id}))
        var taskEdit = ''
        var i = 0
        while(i < TaskSelect.length ){
            var ValuedDetailsHeight = '35px'
            if(TaskSelect[i].id === value){
                if(TaskSelect[i].detailsHeight === undefined){
                    ValuedDetailsHeight = '40px'
                }else{
                    ValuedDetailsHeight = TaskSelect[i].detailsHeight
                }
                TaskSelect = {name: TaskSelect[i].name, color: TaskSelect[i].color, details: TaskSelect[i].details, detailsHeight: ValuedDetailsHeight}
            }
            i++
        }
        
        if(task.attributes.getNamedItem('class').value === ''){
            task.setAttribute('class' , 'ConfirmBtnCheck')
            taskBox.setAttribute('value', 'ConfirmBtnCheck')

            taskEdit = {name: TaskSelect.name , color: TaskSelect.color, details: TaskSelect.details, stats: 'ConfirmBtnCheck', detailsHeight: TaskSelect.detailsHeight}
            await setDoc(doc(db, UserInfo.id, value.toString()), taskEdit);
          //  window.location.reload()
        }else{
            task.setAttribute('class', '' )
            taskBox.setAttribute('value', '')

            taskEdit = {name: TaskSelect.name , color: TaskSelect.color, details: TaskSelect.details, stats: '', detailsHeight: TaskSelect.detailsHeight}
            await setDoc(doc(db, UserInfo.id, value.toString()), taskEdit);
           // window.location.reload()
        }
    }
    async function EditTask(value){
        var textarea = document.getElementById(`textarea${value}`)
        var StartIcon = document.getElementById(`StartEditTexteare${value}`)
        var EndIcon = document.getElementById(`EndEditTexteare${value}`)
        if(textarea.hasAttribute('disabled')){
            textarea.removeAttribute('disabled')
            StartIcon.style.display = 'none'
            EndIcon.style.display = 'flex'
        }else{
            textarea.setAttribute('disabled', 'true')
            StartIcon.style.display = 'flex'
            EndIcon.style.display = 'none'
        }
        const Tasks = await getDocs(TaskCollectionRef);
        var TaskSelect = Tasks.docs.map((doc) => ({...doc.data(), id: doc.id}))
        var taskEdit = ''
        var i = 0
        while(i < TaskSelect.length ){
            if(TaskSelect[i].id === value){
                TaskSelect = {name: TaskSelect[i].name, stats: TaskSelect[i].stats, color: TaskSelect[i].color, details: TaskSelect[i].details, detailsHeight: TaskSelect[i].detailsHeight}
            }
            i++
        }
        var NewDetails = textarea.value
        taskEdit = {name: TaskSelect.name , color: TaskSelect.color, details: NewDetails, stats: TaskSelect.stats, detailsHeight: TaskSelect.detailsHeight}
        await setDoc(doc(db, UserInfo.id, value.toString()), taskEdit);
    }
    async function EditColorTask(id){
        var ColorInput = document.getElementById(`EditColorInput${id}`)
        var StartIcon = document.getElementById(`StartEditColor${id}`)
        var EndIcon = document.getElementById(`EndEditColor${id}`)

        if(ColorInput.style.display !== 'flex'){
            document.getElementById(`EditColorInput${id}`).style.display = 'flex'
            StartIcon.style.display = 'none'
            EndIcon.style.display = 'flex'

        }else{
            document.getElementById(`EditColorInput${id}`).style.display = 'none'
            EndIcon.style.display = 'none'
            StartIcon.style.display = 'flex'
            const Tasks = await getDocs(TaskCollectionRef);
            var TaskSelect = Tasks.docs.map((doc) => ({...doc.data(), id: doc.id}))
            var taskEdit = ''
            var i = 0
            while(i < TaskSelect.length ){
                if(TaskSelect[i].id === id){
                    TaskSelect = {name: TaskSelect[i].name, stats: TaskSelect[i].stats, color: TaskSelect[i].color, details: TaskSelect[i].details, detailsHeight: TaskSelect[i].detailsHeight}
                }
                i++
            }
            var NewColor = document.getElementById(`input-color${id}`).value
            taskEdit = {name: TaskSelect.name , color: NewColor, details: TaskSelect.details, stats: TaskSelect.stats, detailsHeight: TaskSelect.detailsHeight}
            await setDoc(doc(db, UserInfo.id, id.toString()), taskEdit);
            document.getElementById(`task${id}`).style.backgroundColor = NewColor + 'c5'
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
        var tasks = {name: NameTask , color: ColorTask, stats: '', details: Val, detailsHeight: document.getElementById('textereaDeatils').style.height }
        
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
        
        CreateTaskDiv()
        await setDoc(doc(db, UserInfo.id, idTask.toString()), tasks);
        
        window.location.reload()

    }
    function OpenDetails(id){
        var Indicador = document.getElementById(`TaskIndicator${id}`)
        var Details = document.getElementById(`TaskDetails${id}`)
        var task = document.getElementById(`task${id}`)
        if(task.attributes.getNamedItem('value').nodeValue === 'close'){
            Indicador.style.rotate = '90deg'
            Details.style.display = 'flex'
            task.attributes.getNamedItem('value').nodeValue = 'open'
        }else if(task.attributes.getNamedItem('value').nodeValue === 'close'){
            Indicador.style.rotate = '90deg'
            Details.style.display = 'flex'
            task.attributes.getNamedItem('value').nodeValue = 'open'
        }else{
            Details.style.display = 'none'
            Indicador.style.rotate = '0deg'
            task.attributes.getNamedItem('value').nodeValue = 'close'
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
                <h3 className="AlertNoneTasks"><PiHandBold/> Ops, parece que você não tem nenhuma Taksins em nosso banco de dados! crie um <span onClick={()=> CreateTaskDiv('create')}> aqui! <PiPlusCircleBold/> </span></h3>
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
                    <div value={`${status}`} id={`TaskBox${Tasks[key].id}`} className="TaskBox">
                        <div   value='close' style={{backgroundColor: `${Tasks[key].color}c5`}} className="TaskDiv" id={`task${Tasks[key].id}`}>
                                <p id={Tasks[key].id} onClick={()=> OpenDetails(Tasks[key].id)} className={status} > <span id={`TaskIndicator${Tasks[key].id}`}><PiCaretRightBold/></span> {Tasks[key].name} </p>
                                <button className="MarkButton" onClick={() => MarkTask(Tasks[key].id)}><PiCheckBold/></button>
                        </div>
                        <div className="TaskDetails"  id={`TaskDetails${Tasks[key].id}`} >
                            <textarea id={`textarea${Tasks[key].id}`} style={{height: Tasks[key].detailsHeight}} placeholder={Details} defaultValue={Details} disabled={true}  />  
                            <div className="FunctionDetails">
                                <button className="DelButton" onClick={() => DeleteTask(Tasks[key].id)}><PiTrashSimpleBold/></button>
                                <button className="EditButton" onClick={() => EditTask(Tasks[key].id)}><span id={`StartEditTexteare${Tasks[key].id}`}><PiPaintBrushBold/></span> <span id={`EndEditTexteare${Tasks[key].id}`}><PiCheckBold/></span></button>
                                <button className="EditColorButton" onClick={() => EditColorTask(Tasks[key].id) }><span id={`StartEditColor${Tasks[key].id}`}><PiPaintBrushBroadBold/></span> <span id={`EndEditColor${Tasks[key].id}`}><PiCheckBold/></span></button>
                                <div id={`EditColorInput${Tasks[key].id}`} className="EditColorInput">
                                    <input id={`input-color${Tasks[key].id}`}  className="EditColorInput-color" type="color"/>
                                </div>
                             </div>
                        </div>
                    </div>
                )
                
                
    
            }
        }
    }
    TasksListDisplay()

   function FilterTaskList(filter){
        var TasksBox = document.querySelectorAll('.TaskBox')
        if(filter === 'completed'){ 
            for (let key = 0; key < TasksBox.length; key++) {
                if(TasksBox[key].getAttribute('value') === ''){
                    TasksBox[key].style.display = 'none'
                }
                if(TasksBox[key].getAttribute('value') === 'ConfirmBtnCheck'){
                    TasksBox[key].style.display = 'flex'
                }
            }
        }else if(filter === 'incompleted'){
            for (let key = 0; key < TasksBox.length; key++) {
                if(TasksBox[key].getAttribute('value') === 'ConfirmBtnCheck'){
                    TasksBox[key].style.display = 'none'
                }
                if(TasksBox[key].getAttribute('value') === ''){
                    TasksBox[key].style.display = 'flex'
                }
            }
        }else if(filter === 'clear'){
            for (let key = 0; key < TasksBox.length; key++) {
                TasksBox[key].style.display = 'flex' 
            }
        }
   }

    
    return (
        <>
        <Navbar/>
        <div id="TaskPage" className="TaskPage" >
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
                    <input onChange={(e)=> setNameTask(e.target.value)} maxLength={30} value={NameTask} name="name" className="NewTaskFormsInput" type="text" placeholder="Name Task..."/>
                    <div className="NewTaskFormsInputColor">
                        <input id="input-color"   onChange={(e) => {setColorTask(e.target.value); NewTaskColorEdit(e.target.value)} }  className="NewTaskFormsinput-color" type="color"/>
                    </div>
                </div>
                <span id="AlertNameOut"><PiSealWarningBold/> Coloque um Nome!</span>
                <div className="NewTaskFormsDscri">
                    <textarea id="textereaDeatils" wrap="hard" value={Val} ref={textAreaRef} onChange={handleChange}  maxLength={2000}  placeholder="Escreva uma descrição da tarefa! - máximo de caracteres 2000" />
                </div>
                <span id="AlertDescriOut"><PiSealWarningBold/> Coloque uma descrição!</span>
                <div className="NewTaskButtons"> 
                    <span>Criar a tarefa!</span>   
                    <button onClick={AdicionarTask}><PiPlusBold/></button>
                </div>
            </div>
            <div  className="Tasks">
                <h4>Suas Taskins!</h4>
                <div id="taksListDisplay" className="TasksList" >
                    <div className="FilterTasks">
                        <button style={{backgroundColor: '#0d98d8c5'}}><PiFunnelBold/></button>
                        <div className="FiltersType">
                            <button  style={{backgroundColor: '#05cf7bc5'}} onClick={()=> FilterTaskList('completed')}> <PiCheckBold/> Completa</button>
                            <button  style={{backgroundColor: '#cf050fc5'}}   onClick={()=> FilterTaskList('incompleted')}> <PiXBold/> Incompletos</button>
                            <button  style={{backgroundColor: '#e4d506c5'}}  onClick={()=> FilterTaskList('clear')}><PiPaintBrushHouseholdBold/> Limpar</button>
                        </div>
                    </div>
                    {TaskDispley}
                </div>

            </div>
        </div>
        </>
    )
}

export default TasksPage;