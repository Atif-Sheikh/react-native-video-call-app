import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/dom/ajax';
// import {ToastAndroid} from 'react-native'
// https://xgrommx.github.io/rx-book/content/rxjs_bindings/dom/index.html#rxdomrequestgetjsonurl
// https://github.com/ReactiveX/rxjs/blob/master/src/observable/dom/AjaxObservable.ts
export class HttpService {

    static get(url: string, headers:Object=null): Observable<any> {
        return Observable.ajax({
            url,
           headers,
            method: 'GET',
            // async: true,
            crossDomain: true,
            responseType: 'json',
            createXHR: () => new XMLHttpRequest()
        } )  ;
    } // get
    static getDoc(url: string, headers:Object=null): Observable<any> {
        // console.log(url)
        return Observable.ajax({
            url,
           headers,
            method: 'GET',
            // async: true,
            crossDomain: true,
            responseType: 'json',
            createXHR: () => new XMLHttpRequest()
        } ).catch((Err)=>{
            console.log("abc",Err)
            return Observable.of({
                type:"1",
            
            })
        })  ;
    } // get
    static post(url: string, body: any, headers:any = { 'Content-Type': 'application/json' }): Observable<any> {
        return Observable.ajax({
            url,
            method: 'POST',
            body,
            headers,
            // async: true,
            crossDomain: true,
            responseType: 'json',
            createXHR: () => new XMLHttpRequest()
        });
    } // post
    static newPost(url: string, body: any, headers:any = { 'Content-Type': 'application/json' }): Observable<any> {
        return Observable.ajax({
            url,
            method: 'POST',
            body,
            headers,
            // async: true,
            crossDomain: true,
            responseType: 'json',
            createXHR: () => new XMLHttpRequest()
        }).catch((err)=>{
            console.log(err)
            if (err.response) {

                if (err.response.errors) {

                    err.response.errors.message && ToastAndroid.show(err.response.errors.message, ToastAndroid.SHORT)
                }
                else if (err.response.error) {
                    err.response.error.message && ToastAndroid.show(err.response.error.message, ToastAndroid.SHORT)

                }
                else {
                    let errors = ""
                    for (let i in err.response) {
                        errors += err.response[i][0] + " \n"

                    }
                    ToastAndroid.show(errors, ToastAndroid.LONG)
                }
            }
            else {
                ToastAndroid.show("An Error Occured", ToastAndroid.LONG)

            }
            return Observable.of({
                type:"1"
            })
        });
    }
    static put(url: string, body: any, headers:any = { 'Content-Type': 'application/json' }): Observable<any> {
        return Observable.ajax({
            url,
            method: 'PUT',
            body,
            headers,
            // async: true,
            crossDomain: true,
            responseType: 'json',
            createXHR: () => new XMLHttpRequest()
        });
    }//put
    static delete(url: string, body: any, headers:any = { 'Content-Type': 'application/json' }): Observable<any> {
        return Observable.ajax({
            url,
            method: 'DELETE',
            body,
            headers,
            // async: true,
            crossDomain: true,
            responseType: 'json',
            createXHR: () => new XMLHttpRequest()
        });
    }
}