import React from 'react';
import './App.css';

import firebase from 'firebase/compat/app'; 
     import 'firebase/compat/firestore';
     import 'firebase/compat/auth';     

/*import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';*/

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionDate } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyC1DGHdAVxkMJMW71eyRQJcoCgizrryEBI",
  authDomain: "chatprism-61768.firebaseapp.com",
  projectId: "chatprism-61768",
  storageBucket: "chatprism-61768.appspot.com",
  messagingSenderId: "183963851227",
  appId: "1:183963851227:web:05dd02b16d00b430686ffe",
  measurementId: "G-DL17KHWT6R"
})

const auth = firebase.auth();
const firestore = firebase.firestore();



function App() {
  return (
    <div className="App">
      <header className="App-header">
 
      </header>
    </div>
  );

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
  
      </header>
  
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return(
   <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
 }

 function SignOut() {
   return auth.currentUser && (

    <button onClick={() => auth.signOut()}>Sign Out</button>
   )
 }

 
 function ChatRoom() {

  const dummy = useRef()

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');


  const sendMessage = async(e) => {

   e.preventDault();

   const { uid, photURL } = auth.currentUser;

   await messagesRef.add({
     text: formValue,
     createdAt: firebase.firestore.FieldValue.serverTimestamp(),
     uid, 
     photURL
  });
  
  setFormValue('');

  dummy.current.scrollIntoView({ behaviour: 'smooth' });

  }


  return (
    <>
    <main>
    <div>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
    
    <div ref={dummy}></div>
    
    </div>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />

      <button type="submit">🐦</button>

    </form>
    </>
  )

 }

 function ChatMessage(props) {
    const { text, uid, photURL } = props.message;

    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'; 

    return (
      <div className={'message ${messageClass}'}>
      <img src={photoURL} />
      <p>{text}</p>
      </div>
    )   
 }

export default App;
