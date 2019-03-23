// https://redux-observable.js.org/docs/basics/SettingUpTheMiddleware.html

import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';

// reducers
import { AuthReducer, DataReducer, AttendanceReducer } from './reducer/index';
import { AuthEpic, DataEpic, AttendanceEpic } from './epic/index'
// import { todoReducer } from './reducer/todo';
const rootEpic = combineEpics(
    AuthEpic.SigninEpic,
    AuthEpic.SignupEpic,
    AuthEpic.UpdateProfile,
    AuthEpic.Logout,
    AuthEpic.AddParent,
    AuthEpic.CheckUser,

    DataEpic.PostData,
    DataEpic.GetData,
    DataEpic.GetUsers,
    DataEpic.SendMessage,
    DataEpic.PostTask,
    DataEpic.SelectChilds,
    DataEpic.RemoveChild,
    DataEpic.FetchParentChilds,
    DataEpic.SubmitMarks,
    DataEpic.FetchResult,
    DataEpic.FetchNotifications,
    DataEpic.SetLastScene,
    DataEpic.GetLastScene,
    DataEpic.SubmitTaskAnswer,
    DataEpic.FetchDoneTasks,
    DataEpic.FetchIfTaskDone,
    DataEpic.DiscardSubmittedTask,
    // DataEpic.GetChat,

    AttendanceEpic.PostAttendance,
    AuthEpic.ListenUserData
)
const epicMiddleware = createEpicMiddleware(rootEpic);
// Application Reducers
const rootReducer = combineReducers({
    AuthReducer: AuthReducer,
    DataReducer: DataReducer,
    AttendanceReducer: AttendanceReducer
});
// const epicMiddleware = createEpicMiddleware(rootEpic);

const createStoreWithMiddleware = applyMiddleware(epicMiddleware)(createStore);

export let store = createStoreWithMiddleware(rootReducer);