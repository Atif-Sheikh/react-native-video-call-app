import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/dom/ajax';
import firebase from 'react-native-firebase';

// https://xgrommx.github.io/rx-book/content/rxjs_bindings/dom/index.html#rxdomrequestgetjsonurl
// https://github.com/ReactiveX/rxjs/blob/master/src/observable/dom/AjaxObservable.ts
import { store } from '../store/index'
import { AuthAction } from '../store/action';
import { Actions } from 'react-native-router-flux';
export default class FirebaseService {

    // static get(url, headers=null) {
    //     return Observable.ajax({
    //         url,
    //        headers,
    //         method: 'GET',
    //         // async: true,
    //         crossDomain: true,
    //         responseType: 'json',
    //         createXHR: () => new XMLHttpRequest()
    //     });
    // } // get
    // static post(url, body, headers = { 'Content-Type': 'application/json' }) {
    //     return Observable.ajax({
    //         url,
    //         method: 'POST',
    //         body,
    //         headers,
    //         async: true,
    //         crossDomain: true,
    //         responseType: 'json',
    //         // withCredentials:true,
    //         createXHR: () => new XMLHttpRequest()
    //     });
    // } // post
    // static put(url, body, headers = { 'Content-Type': 'application/json' }) {
    //     return Observable.ajax({
    //         url,
    //         method: 'PUT',
    //         body,
    //         headers,
    //         // async: true,
    //         crossDomain: true,
    //         responseType: 'json',
    //         createXHR: () => new XMLHttpRequest()
    //     });
    // }//put
    // static delete(url, body, headers = { 'Content-Type': 'application/json' }) {
    //     return Observable.ajax({
    //         url,
    //         method: 'DELETE',
    //         body,
    //         headers,
    //         // async: true,
    //         crossDomain: true,
    //         responseType: 'json',
    //         createXHR: () => new XMLHttpRequest()
    //     });
    // }
    static getToken(){
        return firebase.messaging().getToken()
    }
    static listenUserData(){
        firebase.database().ref(`/users/${firebase.auth().currentUser.uid}`).on("value",(snap)=>{
            store.dispatch({type:AuthAction.NEW_USER_DATA,payload:snap.val()})
        })
    }
    static getUser(){
        return firebase.auth().onAuthStateChanged((user) => {
            if(Actions.currentScene === "login"){
                if(user){
                    firebase.database().ref(`/users/${user.uid}`).once('value', snapshot => {
                        console.log(snapshot.val());
                        store.dispatch({ type: AuthAction.CHECK_USER_SUCCESS, payload: snapshot.val() })
                    }).then(() => {
                        // alert("yes")
                        Actions.reset('home');
                    })
                }else{
                    store.dispatch({ type: AuthAction.CHECK_USER_FAILED })
                }
            }
            })
    }
    static signin(email, password) {
        return firebase.auth().signInWithEmailAndPassword(email, password)
    }
    static signup(email, password) {
        return firebase.auth().createUserWithEmailAndPassword(email, password)
    }
    static updateProfile(payload) {
        return firebase.auth().currentUser.updateProfile(payload)
    }
    static setOnDatabase(ref, payload) {
        return firebase.database().ref(ref).set(payload)
    }
    static pushOnDatabase(ref, payload) {
        return firebase.database().ref(ref).push(payload)
    }
    static getOnceFromDatabase(ref) {
        return firebase.database().ref(ref).once("value", (snapshot) => snapshot)
    }
    static updateOnDatabase(ref, payload) {
        return firebase.database().ref(ref).update(payload)
    }
    static removeFromDatabase(ref) {
        return firebase.database().ref(ref).remove();
    }
    static listenOnDatabase(ref) {
        return firebase.database().ref(ref).once("value", (snapshot) => snapshot.val())
    }
    static logoutuser() {
        return firebase.auth().signOut()
    }
    static uploadPhoto(uri) {
        if (uri) {

            const storage = firebase.storage();
            const sessionId = new Date().getTime();
            const imageRef = storage.ref(`images/${sessionId}`);
            return imageRef.putFile(uri).then(() => {
                return imageRef.getDownloadURL()

            })
        }
        else {
            return Promise.resolve()
        }

    }
}