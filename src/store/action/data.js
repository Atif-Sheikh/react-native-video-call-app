import { createAction } from 'redux-actions';

export default class DataAction {

    static POST_DATA = 'POST_DATA';
    static POST_DATA_SUCCESS = 'POST_DATA_SUCCESS';
    static POST_DATA_FAIL = "POST_DATA_FAIL";
    static NULL = 'NULL';

    static GET_DATA = "GET_DATA";
    static GET_DATA_SUCCESS = "GET_DATA_SUCCESS";
    static GET_DATA_FAIL = "GET_DATA_FAIL";

    static GET_USERS = "GET_USERS";
    static GET_USERS_SUCCESS = "GET_USERS_SUCCESS";
    static GET_USERS_FAILED = "GET_USERS_FAILED";

    static ONLINE_USERS = 'ONLINE_USERS';
    static ONLINE_USERS_SUCCESS = 'ONLINE_USERS_SUCCESS';
    static ONLINE_USERS_FAILED = 'ONLINE_USERS_FAILED';

    static SEND_MESSAGE = 'SEND_MESSAGE';
    static SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS';
    static SEND_MESSAGE_FAILED = 'SEND_MESSAGE_FAILED';

    static GET_CHAT = 'GET_CHAT';
    static GET_CHAT_SUCCESS = 'GET_CHAT_SUCCESS';
    static GET_CHAT_FAILED = 'GET_CHAT_FAILED';

    static POST_TASK = 'POST_TASK';
    static POST_TASK_SUCCESS = 'POST_TASK_SUCCESS';
    static POST_TASK_FAILED = 'POST_TASK_FAILED';

    static FETCH_CHILDS = "FETCH_CHILDS";
    static FETCH_CHILDS_SUCCESS = "FETCH_CHILDS_SUCCESS";
    static FETCH_CHILDS_FAIL = "FETCH_CHILDS_FAIL";

    static SELECT_CHILDS = 'SELECT_CHILDS';
    static SELECT_CHILDS_SUCCESS = 'SELECT_CHILDS_SUCCESS';
    static SELECT_CHILDS_FAILED = 'SELECT_CHILDS_FAILED';

    static REMOVE_CHILD = 'REMOVE_CHILD';
    static REMOVE_CHILD_SUCCESS = 'REMOVE_CHILD_SUCCESS';
    static REMOVE_CHILD_FAILED = 'REMOVE_CHILD_FAILED';

    static SUBMIT_MARKS = "SUBMIT_MARKS";
    static SUBMIT_MARKS_SUCCESS = "SUBMIT_MARKS_SUCCESS";
    static SUBMIT_MARKS_FAIL = "SUBMIT_MARKS_FAIL";

    static FETCH_RESULT = "FETCH_RESULT";
    static FETCH_RESULT_SUCCESS = "FETCH_RESULT_SUCCESS";
    static FETCH_RESULT_FAIL = "FETCH_RESULT_FAIL";

    static FETCH_NOTIFICATIONS = "FETCH_NOTIFICATIONS";
    static FETCH_NOTIFICATIONS_SUCCESS = "FETCH_NOTIFICATIONS_SUCCESS";
    static FETCH_NOTIFICATIONS_FAIL = "FETCH_NOTIFICATIONS_FAIL";

    static SET_LAST_SCENE = "SET_LAST_SCENE";
    static SET_LAST_SCENE_SUCCESS = "SET_LAST_SCENE_SUCCESS";
    static SET_LAST_SCENE_FAIL = "SET_LAST_SCENE_FAIL";

    static GET_LAST_SCENE = "GET_LAST_SCENE";
    static GET_LAST_SCENE_SUCCESS = "SET_LAST_SCENE_SUCCESS";
    static GET_LAST_SCENE_FAIL = "SET_LAST_SCENE_FAIL";

    static SUBMIT_TASK_ANSWER = "SUBMIT_TASK_ANSWER";
    static SUBMIT_TASK_ANSWER_SUCCESS = "SUBMIT_TASK_ANSWER_SUCCESS";
    static SUBMIT_TASK_ANSWER_FAIL = "SUBMIT_TASK_ANSWER_FAIL";

    static FETCH_DONE_TASKS = "FETCH_DONE_TASKS";
    static FETCH_DONE_TASKS_SUCCESS = "FETCH_DONE_TASKS_SUCCESS";
    static FETCH_DONE_TASKS_FAIL = "FETCH_DONE_TASKS_FAIL";

    static FETCH_IF_TASK_DONE = "FETCH_IF_TASK_DONE";
    static FETCH_IF_TASK_DONE_SUCCESS = "FETCH_IF_TASK_DONE_SUCCESS";
    static FETCH_IF_TASK_DONE_FAIL = "FETCH_IF_TASK_DONE_FAIL"

    static DISCARD_SUBMITTED_TASK="DISCARD_SUBMITTED_TASK";
    static DISCARD_SUBMITTED_TASK_SUCCESS="DISCARD_SUBMITTED_TASK";
    static DISCARD_SUBMITTED_TASK_FAIL="DISCARD_SUBMITTED_TASK_FAIL";

    static CLEAR_REDUX = "CLEAR_REDUX";

    static removeChild(payload) {
        return {
            type: DataAction.REMOVE_CHILD,
            payload
        }
    };
    static getData() {
        return {
            type: DataAction.GET_DATA,
        };
    };
    static postData(payload) {
        return {
            type: DataAction.POST_DATA,
            payload
        };
    };
    static getUsers() {
        return {
            type: DataAction.GET_USERS,
        };
    };
    // static OnlineUsers() {
    //     return {
    //         type: DataAction.ONLINE_USERS
    //     }
    // };
    static SendMessage(payload) {
        return {
            type: DataAction.SEND_MESSAGE,
            payload
        }
    };
    static GetChat(payload) {
        return {
            type: DataAction.GET_CHAT,
            payload
        }
    };
    static PostTask(payload) {
        return {
            type: DataAction.POST_TASK,
            payload
        }
    };
    static fetchParentChilds(payload) {
        return {
            type: DataAction.FETCH_CHILDS,
            payload
        }
    }
    static SelectChilds(payload) {
        return {
            type: DataAction.SELECT_CHILDS,
            payload
        }
    }
    static submitMarks(payload) {
        return {
            type: DataAction.SUBMIT_MARKS,
            payload
        }
    }
    static fetchResult(payload) {
        return {
            type: DataAction.FETCH_RESULT,
            payload
        }
    }
    static clearRedux() {
        return {
            type: DataAction.CLEAR_REDUX
        }
    }
    static fetchNotifications() {
        return {
            type: DataAction.FETCH_NOTIFICATIONS
        }
    }
    static setLastScene(payload) {
        return {
            type: DataAction.SET_LAST_SCENE,
            payload
        }
    }
    static getLastScene(payload) {
        return {
            type: DataAction.GET_LAST_SCENE,
            payload
        }
    }
    static submitTaskAnswer(payload) {
        return {
            type: DataAction.SUBMIT_TASK_ANSWER,
            payload
        }
    }
    static fetchDoneTasks(payload) {
        return {
            type: DataAction.FETCH_DONE_TASKS,
            payload
        }
    }
    static fetchIfTaskDone(payload) {
        return {
            type: DataAction.FETCH_IF_TASK_DONE,
            payload
        }
    }
    static discardSubmittedTask(payload){
        return {
            type:DataAction.DISCARD_SUBMITTED_TASK,
            payload:payload
        }
    }
};