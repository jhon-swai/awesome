
import * as firebase from 'firebase'

class Fire {
    constructor(){
        this.init();
        this.observeAuth();
    }

    observeAuth = () => firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

    onAuthStateChanged = user => {
        if(!user){
            try{
                firebase.auth().signInAnonymously();
            } catch ({ message }) {
                alert(message);
              }
        }
    }

    get ref(){
        return firebase.database().ref('messages');
    }

    on = callback =>
    this.ref
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)));

      // getting the chats and converting them to gifted format
    parse = snapshot => {
        const { timestamp: numberStamp, text, user } = snapshot.val();
        const { key: _id } = snapshot;
        
        const timestamp = new Date(numberStamp);

        const message = {
            _id,
            timestamp,
            text,
            user,
          };
        return message;
    }

    //send messages 
    
    get uid() {
        return (firebase.auth().currentUser || {}).uid;
    }
    
    get timestamp() {
        return firebase.database.ServerValue.TIMESTAMP;
    }
    
    
    send = messages => {
        for (let i = 0; i < messages.length; i++) {
        const { text, user } = messages[i];
        
        const message = {
            text,
            user,
            timestamp: this.timestamp,
        };
        this.append(message);
        }
    };
    
    append = message => this.ref.push(message);



    off() {
        this.ref.off();
    }


    init = () => firebase.initializeApp({
        apiKey:'AIzaSyBtRPNqifAfi5K8_rKgk0K-NSTvut-TBU8',
        authDomain: 'lonely-chatting.firebaseapp.com',
        databaseURL: 'https://lonely-chatting.firebaseio.com/',
        projectId: "lonely-chatting",
        storageBucket: "lonely-chatting.appspot.com",
        messagingSenderId: "626828669410",
        appId: "1:626828669410:web:c561c41a87080e80f3c9bb",
        measurementId: "G-TDLJCMBE8X"
    });

}

Fire.shared = new Fire();
export default Fire;