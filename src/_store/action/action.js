import ActionTypes from '../constants/constants';

export const GetPosts = () => {
    return dispatch => {
        dispatch({type: ActionTypes.GETPOSTS});
    };
};

export const Requests = () => {
    return dispatch => {
        dispatch({type: ActionTypes.REQUESTS});
    };
};

// export const OnlineUsers = () => {
//     return dispatch => {
//         dispatch({type: ActionTypes.ONLINEUSERS});
//     };
// };
export const SaveData = (obj) => {
    console.log(obj, 'asdasdasd')
    return dispatch => {
        dispatch({type: ActionTypes.SAVEDATA, payload: obj});
    };
};
