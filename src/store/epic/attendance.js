import { Observable } from 'rxjs/Observable';
import { ActionsObservable } from 'redux-observable';
import { AttendanceAction } from '../action/index';
import FirebaseService from '../../firebasesService/firebaseService'
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
import firebase from 'react-native-firebase';
import moment from 'moment';


export default class Epic {

    static GetAttendance = (action$) => {
        return action$.ofType(AttendanceAction.GET_ATTENDANCE)
            .switchMap(({ payload }) => {


            }).catch((error) => {
                alert(error)

                return Observable.of({
                    type: AttendanceAction.GET_ATTENDANCE_SUCCESS,
                    payload: error
                })
            })

    }

    static PostAttendance = (action$) => {
        return action$.ofType(AttendanceAction.POST_ATTENDANCE)
            .switchMap(({ payload }) => {
                console.log(payload)
                let uid = payload.uid;
                delete payload['uid'];
                return Observable.fromPromise(
                    FirebaseService.setOnDatabase(`attendance/${moment(new Date()).format("YYYY-MM-DD")}/${uid}/`, payload)
                ).map((res) => {
                    console.log(res)
                    return {
                        type: AttendanceAction.POST_ATTENDANCE_SUCCESS,
                    }
                }).catch((err) => { console.log(err) })
            }).catch((error) => {
                alert(error)

                return Observable.of({
                    type: AttendanceAction.POST_ATTENDANCE_FAIL,
                    payload: error
                })
            })
    }
}