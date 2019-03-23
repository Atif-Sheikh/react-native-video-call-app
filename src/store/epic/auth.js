import { Observable } from 'rxjs/Observable';
// import { ActionsObservable } from 'redux-observable';
import { Alert } from 'react-native';
import { AuthAction } from '../action/index';
import FirebaseService from '../../firebasesService/firebaseService'
import 'rxjs/add/operator/switchMap';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
import firebase from 'react-native-firebase';
import { Actions } from 'react-native-router-flux';
import { HttpService } from "../../httpService/http";
// import firebase from 'react-native-firebase';
export default class Epic {
    static SigninEpic = (action$) => {
        return action$.ofType(AuthAction.SIGNIN)
            .switchMap(({ payload }) => {
                console.log(payload)
                return Observable.fromPromise(
                    FirebaseService.signin(payload.email, payload.password)
                ).switchMap((user) => {
                    console.log(user)
                    return Observable.fromPromise(
                        FirebaseService.getToken()
                    ).switchMap((token) => {
                        return Observable.fromPromise(
                            FirebaseService.updateOnDatabase(`/users/${user.uid}`, { deviceToken: token })
                        ).switchMap(() => {
                            return Observable.fromPromise(
                                FirebaseService.getOnceFromDatabase(`users/${user.uid}`)
                            ).map((data) => {
                                // alert(data._value);
                                console.log(data._value)
                                data._value.password = payload.password
                                return {
                                    type: AuthAction.SIGNIN_SUCCESS,
                                    payload: data._value
                                }
                            })
                        })
                    })
                }).catch((err) => {
                    alert(err)

                    return Observable.of({
                        type: AuthAction.SIGNIN_FAIL,
                        payload: err
                    })
                })
            }).catch((error) => {
                alert(error)

                return Observable.of({
                    type: AuthAction.SIGNIN_FAIL,
                    payload: error
                })
            })
    };
    static SignupEpic = (action$) => {
        return action$.ofType(AuthAction.SIGNUP)
            .switchMap(({ payload }) => {
                console.log(payload.isAdmin)
                return Observable.fromPromise(
                    FirebaseService.signup(payload.email, payload.password)
                ).switchMap((user) => {
                    return Observable.fromPromise(
                        FirebaseService.getToken()
                    ).switchMap((token) => {
                        user.sendEmailVerification();
                        return Observable.fromPromise(
                            FirebaseService.updateProfile({ displayName: payload.userName })
                        ).switchMap(() => {
                            let password = payload['password'];
                            payload.deviceToken = token;
                            payload.Uid = user.uid;
                            delete payload['password'];
                            return Observable.fromPromise(
                                FirebaseService.setOnDatabase(`users/${user.uid}/`, payload)
                            ).map(() => {
                                payload.password = password
                                return {
                                    type: AuthAction.SIGNUP_SUCCESS,
                                    payload
                                }
                            })
                        })
                    })
                    // console.log(user)
                    //     firebase.auth().currentUser.updateProfile({
                    //         displayName:payload.userName
                    //     })

                }).catch((err) => {
                    console.warn(err)
                    return Observable.of({
                        type: AuthAction.SIGNUP_FAIL,
                        payload: err
                    })
                })
            }).catch((error) => {
                alert(error)
                return Observable.of({
                    type: AuthAction.SIGNUP_FAIL,
                    payload: error
                })
            })

    }
    // static AddParent = (action$) => {
    //     return action$.ofType(AuthAction.ADD_PARENT)
    //         .switchMap(({ payload }) => {
    //             //     var body=JSON.stringify({
    //             //         "email": payload.email,
    //             //         "password": payload.password,
    //             //         "number": payload.number,
    //             //         "username": payload.userName,
    //             //         "accountType": payload.accountType
    //             //     })
    //             //     return Observable.fromPromise(
    //             //         fetch("https://us-central1-education-28e24.cloudfunctions.net/parentSignup", {
    //             //             method: "POST",
    //             //             headers: {
    //             //                 "Content-Type": "application/json"
    //             //             },
    //             //             body:body
    //             //         })
    //             //     ).map((response) => {

    //             //         return {
    //             //             type: AuthAction.ADD_PARENT_SUCCESS,
    //             //         }
    //             //     })
    //             // }).catch((err) => {
    //             //     console.log(err.message)
    //             //     return Observable.of({
    //             //         type: AuthAction.ADD_PARENT_FAILED,
    //             //         payload: err
    //             //     })
    //             // })
    //             var body ={
    //                 email: payload.email,
    //                 password: payload.password,
    //                 number: payload.number,
    //                 username: payload.userName,
    //                 accountType: payload.accountType
    //             }
    //             return HttpService.post(`https://us-central1-education-28e24.cloudfunctions.net/parentSignup`, body)
    //                 .pipe(
    //                     map(({ response }) => {
    //                         // alert(JSON.stringify(response.response));
    //                         if (response.response_code) {
    //                             console.log("success",response)
    //                             return {
    //                                 type: successActionOf(AuthAction.LOGIN),
    //                                 payload: response
    //                             };
    //                         } else {
    //                             console.log("success error",response.response)
    //                             return {
    //                                 type: failureActionOf(AuthAction.LOGIN),
    //                                 payload: response.response
    //                             };
    //                         }
    //                     }).
    //                     catch(err => {
    //                         console.log("error",err.message)
    //                         return of({
    //                             type: failureActionOf(AuthAction.LOGIN),
    //                             payload: err.message
    //                         });
    //                     })
    //                 )
    //         })

    // };
    static AddParent = (action$) => {
        return action$.ofType(AuthAction.ADD_PARENT)
            //.do(x => { console.log("===-----Epicccccccccccccccccc", x) })
            .switchMap(({ payload }) => {
                var body = {
                    "email": payload.email,
                    "password": payload.password,
                    "number": payload.number,
                    "username": payload.userName,
                    "accountType": payload.accountType
                }
                return HttpService.post(`https://us-central1-education-28e24.cloudfunctions.net/parentSignup`, body, { 'Content-Type': 'application/json', })
                    .map((res) => {
                        if(res.response.success)
                        return {
                            type: AuthAction.ADD_PARENT_SUCCESS,
                        }
                        else{
                            return {
                                type:AuthAction.ADD_PARENT_FAILED,
                                payload:res.response.errorMessage
                            }
                        }
                    }).catch((err) => {
                        return Observable.of({
                            type: AuthAction.ADD_PARENT_FAILED,
                            payload: err.message
                        })
                    });
            })

    }
    static UpdateProfile = (action$) => {
        return action$.ofType(AuthAction.UPDATE_PROFILE)
            .switchMap(({ payload }) => {
                return Observable.fromPromise(
                    FirebaseService.uploadPhoto(payload.photo)
                ).switchMap((uri) => {
                    if (uri) {

                        payload['photo'] = uri
                    }
                    return Observable.fromPromise(
                        FirebaseService.updateOnDatabase(`users/${firebase.auth().currentUser.uid}/`, payload)
                    ).switchMap(() => {
                        return Observable.fromPromise(
                            FirebaseService.updateProfile({ displayName: payload.userName, photoURL: payload.photo })
                        ).map(() => {
                            return {
                                type: AuthAction.UPDATE_PROFILE_SUCCESS,
                                payload
                            }
                        })
                    })
                })
            }).catch((error) => {
                return Observable.of({
                    type: AuthAction.UPDATE_PROFILE_FAIL,
                    payload: error
                })
            })
    }
    static Logout = (action$) => {
        return action$.ofType(AuthAction.LOGOUT)
            .switchMap(() => {
                return Observable.fromPromise(
                    FirebaseService.updateOnDatabase(`users/${firebase.auth().currentUser.uid}/`, { online: false })
                ).switchMap(() => {
                    return Observable.fromPromise(
                        FirebaseService.logoutuser()
                    ).map(() => {
                        Actions.popAndPush('login');
                        return {
                            type: AuthAction.LOGOUT_SUCCESS
                        }
                    })
                }).catch((err) => {
                    alert(err)
                    return {
                        type: AuthAction.LOGOUT_FAILED,
                    }
                })
            }).catch((err) => {
                alert(err)
                return {
                    type: AuthAction.LOGOUT_FAILED,
                    // payload: err
                }
            })
    };
    static CheckUser = (action$) => {
        return action$.ofType(AuthAction.CHECK_USER)
            .switchMap(() => {
                FirebaseService.getUser();
                return Observable.of({
                    type: ""
                })
            }).catch((err) => {
                alert(err);
                return {
                    type: AuthAction.CHECK_USER_FAILED,
                }
            })
    };
    static ListenUserData = (action$) => {
        return action$.ofType(AuthAction.LISTEN_USER_DATA)
            .switchMap(() => {
                FirebaseService.listenUserData();
                return Observable.of({
                    type: ""
                })
            }).catch((err) => {
                alert(err);
                return {
                    type: "",
                }
            })
    };

};