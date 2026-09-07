import{initializeApp}from"https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import{getAuth,signInAnonymously,onAuthStateChanged}from"https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import{getFirestore,collection,addDoc,deleteDoc,doc,query,orderBy,limit,onSnapshot,serverTimestamp}from"https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig={
apiKey:"AIzaSyBjrFhYiYshFqg0TOiswCZSOHeKOrcKV08",
authDomain:"vila-chat.firebaseapp.com",
projectId:"vila-chat",
storageBucket:"vila-chat.firebasestorage.app",
messagingSenderId:"149766884961",
appId:"1:149766884961:web:61d24e568eac9853c7e420",
measurementId:"G-Z39EJ58NDP"
};

const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app);
const messages=document.getElementById("messages"),form=document.getElementById("messageForm"),input=document.getElementById("messageInput"),counter=document.getElementById("counter"),nameDialog=document.getElementById("nameDialog"),nameForm=document.getElementById("nameForm"),nameInput=document.getElementById("nameInput"),currentName=document.getElementById("currentName"),onlineCount=document.getElementById("onlineCount"),emojiPanel=document.getElementById("emojiPanel");
let user=null,name=localStorage.getItem("vilaChatName")||"";
currentName.textContent=name||"Anônimo";
function openName(){nameInput.value=name;nameDialog.showModal()}
if(!name)openName();
document.getElementById("changeNameBtn").onclick=openName;
nameForm.addEventListener("submit",e=>{if(e.submitter?.value==="save"){const n=nameInput.value.trim();if(!n){e.preventDefault();return}name=n.slice(0,20);localStorage.setItem("vilaChatName",name);currentName.textContent=name}});
input.oninput=()=>counter.textContent=`${input.value.length}/1000`;
document.getElementById("emojiBtn").onclick=()=>emojiPanel.hidden=!emojiPanel.hidden;
emojiPanel.querySelectorAll("button").forEach(b=>b.onclick=()=>{input.value=(input.value+b.textContent).slice(0,1000);input.dispatchEvent(new Event("input"));emojiPanel.hidden=true;input.focus()});
signInAnonymously(auth).catch(e=>{console.error(e);onlineCount.textContent="Erro ao conectar"});
onAuthStateChanged(auth,u=>{user=u;if(u){onlineCount.textContent="Online";listen()}});
function listen(){
const q=query(collection(db,"messages"),orderBy("createdAt","asc"),limit(100));
onSnapshot(q,snap=>{messages.innerHTML="";snap.forEach(s=>{const m=s.data(),box=document.createElement("article");box.className="message"+(m.uid===user.uid?" mine":"");const meta=document.createElement("div");meta.className="meta";meta.textContent=m.name||"Anônimo";const time=document.createElement("span");time.className="time";time.textContent=m.createdAt?.toDate?m.createdAt.toDate().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}):"";meta.appendChild(time);const text=document.createElement("div");text.className="text";text.textContent=m.text||"";box.append(meta,text);if(m.uid===user.uid){const del=document.createElement("button");del.className="delete";del.textContent="🗑️";del.onclick=async()=>{if(confirm("Apagar esta mensagem?"))await deleteDoc(doc(db,"messages",s.id))};box.appendChild(del)}messages.appendChild(box)});messages.scrollTop=messages.scrollHeight},e=>console.error(e))
}
form.onsubmit=async e=>{e.preventDefault();if(!user)return;const text=input.value.trim();if(!text)return;try{await addDoc(collection(db,"messages"),{name:name||"Anônimo",text:text.slice(0,1000),uid:user.uid,createdAt:serverTimestamp()});input.value="";counter.textContent="0/1000";input.focus()}catch(e){console.error(e);alert("Erro ao enviar")}};