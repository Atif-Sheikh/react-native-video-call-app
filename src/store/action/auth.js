// import { createAction } from 'redux-actions';

export default class AuthAction {

    static SIGNIN = 'SIGNIN';
    static SIGNIN_SUCCESS = 'SIGNIN_SUCCESS';
    static SIGNIN_FAIL = "SIGNIN_FAIL";
    static NULL = 'NULL';
    static SIGNUP = "SIGNUP";
    static SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
    static SIGNUP_FAIL = "SIGNUP_FAIL";

    static UPDATE_PROFILE = "UPDATE_PROFILE";
    static UPDATE_PROFILE_SUCCESS = "UPDATE_PROFILE_SUCCESS";
    static UPDATE_PROFILE_FAIL = 'UPDATE_PROFILE_FAIL';
    
    static ADD_PARENT = 'ADD_PARENT';
    static ADD_PARENT_SUCCESS = 'ADD_PARENT_SUCCESS';
    static ADD_PARENT_FAILED = 'ADD_PARENT_FAILED';

    static LOGOUT = 'LOGOUT';
    static LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
    static LOGOUT_FAILED = 'LOGOUT_FAILED';

    static CHECK_USER = 'CHECK_USER';
    static CHECK_USER_SUCCESS = 'CHECK_USER_SUCCESS';
    static CHECK_USER_FAILED = 'CHECK_USER_FAILED';

    static CLEAR_STORE = 'CLEAR_STORE';
    static LISTEN_USER_DATA="LISTEN_USER_DATA";
    static NEW_USER_DATA="NEW_USER_DATA";

    static ClearStore(){
        return {
           type: AuthAction.CLEAR_STORE
       };
    };
    static CheckUser(){
        return {
            type: AuthAction.CHECK_USER,
        }
    };
    static signin(payload) {
        console.log(payload);
        return {
            type: AuthAction.SIGNIN,
            payload
        };
    }
    static signup(payload) {
        return {
            type: AuthAction.SIGNUP,
            payload
        }
    }
    static updateProfile(payload) {
        return {
            type: AuthAction.UPDATE_PROFILE,
            payload
        }
    }
    static parentSignup(payload){
        // alert(JSON.stringify(payload))
        return {
            type: AuthAction.ADD_PARENT,
            payload
        }
    }
    static Logout(){
        return {
            type: AuthAction.LOGOUT
        }
    }
    static listUser(){
        return{
            type:AuthAction.LISTEN_USER_DATA
        }
    }
}