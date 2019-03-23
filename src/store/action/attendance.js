// import { createAction } from 'redux-actions';

export default class AttendanceAction {

    static POST_ATTENDANCE = 'POST_ATTENDANCE';
    static POST_ATTENDANCE_SUCCESS = 'POST_ATTENDANCE_SUCCESS';
    static POST_ATTENDANCE_FAIL="POST_ATTENDANCE_FAIL";
    static NULL = 'NULL';
    static GET_ATTENDANCE="GET_ATTENDANCE";
    static GET_ATTENDANCE_SUCCESS="GET_ATTENDANCE_SUCCESS";
    static GET_ATTENDANCE_FAIL="GET_ATTENDANCE_FAIL";

    static getAttendance() {
        return {
            type: AttendanceAction.GET_ATTENDANCE,
            
        };
    }
    static postAttendance(payload){
        return{
            type:AttendanceAction.POST_ATTENDANCE,
            payload
        }
    }
}