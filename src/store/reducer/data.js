import { DataAction } from '../action/index';
import { AsyncStorage } from "react-native";
const INITIAL_STATE = {
    posts: null,
    postData: null,
    postLoader: false,
    err: '',
    errorMessage: "",
    users: [],
    childs: null,
    error: '',
    submitLoader: false,
    postsLoader: null,
    loader: false,
    chat: [],
    isChat: null,
    result: null,
    taskLoader: null,
    postTask: null,
    fetchLoader: false
};
export default function DataReducer(state = INITIAL_STATE, action) {
    switch (action.type) {

        case DataAction.GET_CHAT:
            return ({
                ...state,
                chat: action.payload,
            });
        case DataAction.POST_TASK:
            return Object.assign({}, state, { taskLoader: true });
        case DataAction.POST_TASK_SUCCESS:
            return Object.assign({}, state, { taskLoader: false, postTask: true });
        case DataAction.POST_TASK_FAILED:
            return Object.assign({}, state, { taskLoader: false, postTask: false });

        // return Object.assign({}, state, { chat: action.payload, isChat: true });
        case DataAction.GET_CHAT_FAILED:
            return Object.assign({}, state, { isChat: false })

        case DataAction.GET_DATA:
            return Object.assign({}, state, { postsLoader: true });
        case DataAction.GET_DATA_SUCCESS:
            return Object.assign({}, state, { posts: action.payload, postsLoader: false });
        case DataAction.GET_DATA_FAIL:
            return Object.assign({}, state, { error: action.payload, postsLoader: false });

        // return Object.assign({}, state, { chat: action.payload });

        case DataAction.SEND_MESSAGE_SUCCESS:
            return Object.assign({}, state, { chat: action.payload })
        case DataAction.GET_USERS:
            return Object.assign({}, state, { loader: true })
        case DataAction.GET_USERS_SUCCESS:
            return Object.assign({}, state, { users: action.payload, loader: false });
        case DataAction.GET_USERS_FAILED:
            return Object.assign({}, state, { error: action.payload, loader: false });


        case DataAction.POST_DATA:
            return Object.assign({}, state, { postLoader: true });
        case DataAction.POST_DATA_SUCCESS:
            return Object.assign({}, state, { postLoader: false, postData: true });
        case DataAction.POST_DATA_FAIL:
            return Object.assign({}, state, { postLoader: false, err: action.payload });

        case DataAction.SUBMIT_MARKS:
            return Object.assign({}, state, { submitLoader: true })
        case DataAction.SUBMIT_MARKS_SUCCESS:
            return Object.assign({}, state, { submitLoader: false, success: true })
        case DataAction.SUBMIT_MARKS_FAIL:
            return Object.assign({}, state, { submitLoader: false, errorMessage: "Error in Saving Record" })

        case DataAction.FETCH_RESULT:
            return Object.assign({}, state, { submitLoader: true })
        case DataAction.FETCH_RESULT_SUCCESS:
            return Object.assign({}, state, { submitLoader: false, result: action.payload })
        case DataAction.FETCH_RESULT_FAIL:
            return Object.assign({}, state, { submitLoader: false, errorMessage: "Error in Fetching Your Result" })

        case DataAction.FETCH_CHILDS:
            return Object.assign({}, state, { loader: true })
        case DataAction.FETCH_CHILDS_SUCCESS:
            return Object.assign({}, state, { childs: action.payload, loader: false })
        case DataAction.FETCH_NOTIFICATIONS:
            return Object.assign({}, state, { loader: true });
        case DataAction.FETCH_NOTIFICATIONS_SUCCESS:
            return Object.assign({}, state, { loader: false, notifications: action.payload })
        case DataAction.FETCH_NOTIFICATIONS_FAIL:
            return Object.assign({}, state, { loader: false, errorMessage: action.payload })
        case DataAction.CLEAR_REDUX:
            return Object.assign({}, state, { users: [], childs: null, success: false })
        case DataAction.SET_LAST_SCENE:
            return state;
        case DataAction.GET_LAST_SCENE:
            return Object.assign({}, state, { lastScene: action.payload })
        case DataAction.GET_LAST_SCENE_SUCCESS:
            return Object.assign({}, state, { lastScene: action.payload })
        case DataAction.SUBMIT_TASK_ANSWER_SUCCESS:
            return Object.assign({}, state, { success: true, taskDone: [] })
        case DataAction.FETCH_DONE_TASKS_SUCCESS:
            return Object.assign({}, state, { notifications: action.payload })
        case DataAction.FETCH_IF_TASK_DONE:
            return Object.assign({}, state, { fetchLoader: true })
        case DataAction.FETCH_IF_TASK_DONE_SUCCESS:
            return Object.assign({}, state, { taskDone: action.payload, fetchLoader: false })
        case DataAction.DISCARD_SUBMITTED_TASK:
            return Object.assign({}, state, { loader: true })
        case DataAction.DISCARD_SUBMITTED_TASK_SUCCESS:
            return Object.assign({}, state, { loader: false, deleteSuccess: true,taskDone:null })
        case DataAction.DISCARD_SUBMITTED_TASK_FAIL:
            return Object.assign({}, state, { loader: false, errorMessage: action.payload })
        default:
            return state;
    }
}