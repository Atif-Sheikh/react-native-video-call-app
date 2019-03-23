import { AttendanceAction } from '../action/index';
const INITIAL_STATE = {
  posts:null,
  post:false
};
export default function AttendanceReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case AttendanceAction.POST_ATTENDANCE:
        return Object.assign({},state,{post:false})
       case AttendanceAction.POST_ATTENDANCE_SUCCESS:
       return Object.assign({},state,{post:true})

        default:
            return state;
    }
}