import { Observable } from 'rxjs/Observable';
import { ActionsObservable } from 'redux-observable';
import { DataAction } from '../action/index';
import { AsyncStorage } from "react-native";
import { Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import FirebaseService from '../../firebasesService/firebaseService'
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';

import firebase from 'react-native-firebase';
import moment from 'moment';

export default class Epic {

    static GetData = (action$) => {
        return action$.ofType(DataAction.GET_DATA)
            .switchMap(({ payload }) => {
                return Observable.fromPromise(
                    FirebaseService.listenOnDatabase("status")
                ).map((data) => {
                    console.log(data);
                    return {
                        type: DataAction.GET_DATA_SUCCESS,
                        payload: data._value
                    }
                })

            }).catch((error) => {
                alert(error)

                return Observable.of({
                    type: DataAction.GET_DATA_FAIL,
                    payload: error
                })
            })

    }

    static PostData = (action$) => {
        return action$.ofType(DataAction.POST_DATA)
            .switchMap(({ payload }) => {
                return Observable.fromPromise(
                    FirebaseService.uploadPhoto(payload.photo)
                ).switchMap((uri) => {
                    payload['photo'] = uri;
                    return Observable.fromPromise(
                        FirebaseService.pushOnDatabase(`user-status/${firebase.auth().currentUser.uid}/`, payload)
                    ).switchMap(() => {
                        return Observable.fromPromise(
                            FirebaseService.pushOnDatabase(`status`, payload)
                        ).map(() => {
                            Alert.alert(null, 'SuccessFully Posted', [{ text: 'OK', onPress: () => console.log("closed") }]);
                            return {
                                type: DataAction.POST_DATA_SUCCESS
                            }
                        })
                    })
                }).catch((err) => {
                    alert(error)

                })
            }).catch((error) => {
                alert(error)

                return Observable.of({
                    type: DataAction.POST_DATA_FAIL,
                    payload: error
                })
            })

    }

    static GetUsers = (action$) => {
        return action$.ofType(DataAction.GET_USERS)
            .switchMap(({ payload }) => {
                return Observable.fromPromise(
                    FirebaseService.listenOnDatabase('/users/')
                ).map((data) => {
                    // console.warn(data.val());
                    return {
                        type: DataAction.GET_USERS_SUCCESS,
                        payload: data.val()
                    }
                })
            }).catch((err) => {
                alert(err)
                return {
                    type: DataAction.GET_USERS_FAILED,
                    payload: err
                }
            })
    };
    static FetchResult = (action$) => {
        return action$.ofType(DataAction.FETCH_RESULT)
            .switchMap(({ payload }) => {
                return Observable.fromPromise(
                    FirebaseService.listenOnDatabase(`/results/${payload}`)
                ).map((data) => {
                    return {
                        type: DataAction.FETCH_RESULT_SUCCESS,
                        payload: data.val()
                    }
                })
            }).catch((err) => {
                return {
                    type: DataAction.FETCH_RESULT_FAIL,
                    payload: err.message
                }
            })
    };
    // static OnlineUsers = (action$) => {
    //     return action$.ofType(DataAction.ONLINE_USERS)
    //         .switchMap(() => {
    //             return Observable.fromPromise(
    //                 FirebaseService.listenOnDatabase(`/users`)
    //             ).map((data) => {
    //                 console.warn(data);
    //                 return {
    //                     type: DataAction.ONLINE_USERS_SUCCESS,
    //                     payload: data.val()
    //                 }
    //             })
    //         }).catch((err) => {
    //             alert(err)
    //             return {
    //                 type: DataAction.ONLINE_USERS_FAILED,
    //                 payload: err
    //             }
    //         })
    // }
    
    static SendMessage = (action$) => {
        return action$.ofType(DataAction.SEND_MESSAGE)
            .switchMap(({ payload }) => {
                let path = payload.path;
                delete payload['path'];
                return Observable.fromPromise(
                    FirebaseService.pushOnDatabase(`chatMessages/${path}`, payload)
                ).map(() => {
                    return {
                        type: DataAction.SEND_MESSAGE_SUCCESS,
                        payload
                    }
                })
            }).catch((err) => {
                alert(err);
                return {
                    type: DataAction.SEND_MESSAGE_FAILED,
                }
            })
    };
    static GetChat = (action$) => {
        return action$.ofType(DataAction.GET_CHAT)
            .switchMap(({ payload }) => {
                return Observable.fromPromise(
                    FirebaseService.getOnceFromDatabase(`chatMessages/${payload}`)
                ).map((data) => {
                    return {
                        type: DataAction.GET_CHAT_SUCCESS,
                        payload: data.val()
                    }
                })
            }).catch((err) => {
                alert(err);
                return {
                    type: DataAction.GET_CHAT_FAILED,
                }
            })
    };
    static PostTask = (action$) => {
        return action$.ofType(DataAction.POST_TASK)
            .switchMap(({ payload }) => {
                return Observable.fromPromise(
                    FirebaseService.uploadPhoto(payload.file)
                ).switchMap((uri) => {
                    payload['file'] = uri
                    return Observable.fromPromise(
                        FirebaseService.pushOnDatabase(`/tasks/${moment(payload.date).format("YYYY-MM-DD")}/`, payload)
                    ).map(() => {
                        return {
                            type: DataAction.POST_TASK_SUCCESS,
                        }
                    })
                })
            }).catch((err) => {
                alert(err);
                return {
                    type: DataAction.POST_TASK_FAILED
                }
            })
    };
    static SubmitMarks = (action$) => {
        return action$.ofType(DataAction.SUBMIT_MARKS)
            .switchMap(({ payload }) => {
                return Observable.fromPromise(
                    FirebaseService.pushOnDatabase(`/results/${payload.studentUid}`, payload)
                ).map(() => {
                    return {
                        type: DataAction.SUBMIT_MARKS_SUCCESS,
                    }
                })
            }).catch((err) => {
                return {
                    type: DataAction.SUBMIT_MARKS_FAIL,
                    err: err.message
                }
            })
    };
    static FetchParentChilds = (action$) => {
        return action$.ofType(DataAction.FETCH_CHILDS)
            .switchMap(({ payload }) => {
                return Observable.fromPromise(
                    FirebaseService.listenOnDatabase(`/users/${payload}/childs`)
                ).map((res) => {
                    return {
                        type: DataAction.FETCH_CHILDS_SUCCESS,
                        payload: res.val()
                    }
                })
            }).catch((err) => {
                alert(err);
                return {
                    type: DataAction.FETCH_CHILDS_FAIL
                }
            })
    };

    static SelectChilds = (action$) => {
        return action$.ofType(DataAction.SELECT_CHILDS)
            .switchMap(({ payload }) => {
                return Observable.fromPromise(
                    FirebaseService.updateOnDatabase(`/users/${payload.parentUid}/childs/${payload.user.Uid}`, payload.user)
                ).switchMap(() => {
                    return FirebaseService.updateOnDatabase(`/users/${payload.user.Uid}`, { linked: true })
                }).map(() => {
                    return {
                        type: DataAction.SELECT_CHILDS_SUCCESS
                    }
                })
            }).catch((err) => {
                alert(err);
                return {
                    type: DataAction.SELECT_CHILDS_FAILED
                }
            })
    };
    static RemoveChild = (action$) => {
        return action$.ofType(DataAction.REMOVE_CHILD)
            .switchMap(({ payload }) => {
                return Observable.fromPromise(
                    FirebaseService.removeFromDatabase(`/users/${payload.parentUid}/childs/${payload.childUid}`)
                ).switchMap(() => {
                    return Observable.fromPromise(
                        FirebaseService.updateOnDatabase(`/users/${payload.childUid}`, { linked: false })
                    ).map(() => {
                        return {
                            type: DataAction.REMOVE_CHILD_SUCCESS,
                        }
                    })
                }).catch((err) => {
                    alert(err);
                    return {
                        type: DataAction.REMOVE_CHILD_FAILED
                    }
                })
            }).catch((err) => {
                alert(err);
                return {
                    type: DataAction.REMOVE_CHILD_FAILED
                }
            })
    };
    static FetchNotifications = (action$) => {
        return action$.ofType(DataAction.FETCH_NOTIFICATIONS)
            .switchMap(({ }) => {
                return Observable.fromPromise(
                    FirebaseService.listenOnDatabase(`/tasks`)
                ).map((response) => {
                    return {
                        type: DataAction.FETCH_NOTIFICATIONS_SUCCESS,
                        payload: response.val()
                    }
                })
            }).catch((err) => {
                return {
                    type: DataAction.FETCH_NOTIFICATIONS_FAIL,
                    payload: err.message
                }
            })
    };
    static SetLastScene = (action$) => {
        return action$.ofType(DataAction.SET_LAST_SCENE)
            .switchMap(({ payload }) => {
                return AsyncStorage.setItem(payload.accountType, JSON.stringify(payload.lastScene)).then((res) => {
                    return {
                        type: DataAction.SET_LAST_SCENE_SUCCESS,
                        payload: payload.lastScene
                    }
                })
            }).catch((err) => {
                return {
                    type: DataAction.SET_LAST_SCENE_FAIL,
                    payload: err.message
                }
            })
    };
    static GetLastScene = (action$) => {
        return action$.ofType(DataAction.GET_LAST_SCENE)
            .switchMap(({ payload }) => {
                return AsyncStorage.getItem(payload).then((res) => {
                    return {
                        type: DataAction.GET_LAST_SCENE_SUCCESS,
                        payload: JSON.parse(res)
                    }
                })
            }).catch((err) => {
                return {
                    type: DataAction.GET_LAST_SCENE_FAIL,
                    payload: err.message
                }
            })
    };
    static SubmitTaskAnswer = (action$) => {
        return action$.ofType(DataAction.SUBMIT_TASK_ANSWER)
            .switchMap(({ payload }) => {
                return Observable.fromPromise(
                    FirebaseService.uploadPhoto(payload.file)
                ).switchMap((uri) => {
                    payload['file'] = uri
                    return Observable.fromPromise(
                        FirebaseService.setOnDatabase(`/tasksDone/${payload.teacherID}/${payload.taskId}/${payload.studentId}`, payload)
                    ).map(() => {
                        return {
                            type: DataAction.SUBMIT_TASK_ANSWER_SUCCESS
                        }
                    })
                })
            }).catch((err) => {
                return {
                    type: DataAction.SUBMIT_TASK_ANSWER_FAIL,
                    err: err.message
                }
            })
    };
    static FetchDoneTasks = (action$) => {
        return action$.ofType(DataAction.FETCH_DONE_TASKS)
            .switchMap(({ payload }) => {
                if (payload) {
                    return Observable.fromPromise(
                        FirebaseService.listenOnDatabase(`/tasksDone/${payload}`)
                    ).map((response) => {
                        return {
                            type: DataAction.FETCH_DONE_TASKS_SUCCESS,
                            payload: response.val()
                        }
                    })
                }
            }).catch((err) => {
                return {
                    type: DataAction.FETCH_DONE_TASKS_FAIL,
                    payload: err.message
                }
            })
    };
    static FetchIfTaskDone = (action$) => {
        return action$.ofType(DataAction.FETCH_IF_TASK_DONE)
            .switchMap(({ payload }) => {
                if (payload) {
                    return Observable.fromPromise(
                        FirebaseService.listenOnDatabase(`/tasksDone/${payload.teacherId}/${payload.taskId}/${payload.studentId}`)
                    ).map((response) => {
                        return {
                            type: DataAction.FETCH_IF_TASK_DONE_SUCCESS,
                            payload: response.val()
                        }
                    })
                }
            }).catch((err) => {
                return {
                    type: DataAction.FETCH_IF_TASK_DONE_FAIL,
                    payload: err.message
                }
            })
    };
    // static DiscardSubmittedTask = (action$) => {
    //     return action$.ofType(DataAction.DISCARD_SUBMITTED_TASK)
    //         .switchMap(({ payload }) => {
    //             // if (payload) {
    //             return Observable.fromPromise(
    //                 FirebaseService.removeFromDatabase(`/tasksDone/${payload.teacherId}/${payload.taskId}/${payload.studentId}`)
    //             ).map(() => {
    //                 console.log(payload, "payloaddd")
    //                 return {
    //                     type: DataAction.DISCARD_SUBMITTED_TASK_SUCCESS,
    //                 }
    //             });
    //             // }
    //         }).catch((err) => {
    //             console.log("Catch", err)
    //             alert(err)
    //             return {
    //                 type: DataAction.DISCARD_SUBMITTED_TASK_FAIL,
    //                 payload: err.message
    //             }
    //         })
    // };

    static DiscardSubmittedTask = (action$) => {
        return action$.ofType(DataAction.DISCARD_SUBMITTED_TASK)
            .switchMap(({ payload }) => {
                return Observable.fromPromise(
                    FirebaseService.removeFromDatabase(`/tasksDone/${payload.teacherId}/${payload.taskId}/${payload.studentId}`)
                
                ).map(() => {
                    return {
                        type: DataAction.DISCARD_SUBMITTED_TASK_SUCCESS,
                    }
                })
                
            })
            .catch((err) => {
                alert(err);
                return {
                    type: DataAction.DISCARD_SUBMITTED_TASK_FAIL
                }
            })
    };
};