import ActionTypes from '../constants/constants';

const INITIAL_STATE = {
    posts: [
            {name: 'Robbert Alex', time: Date.now(), title:'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', likes: 23, comments: 12, shares: 3, postType: 'Update'},
            {name: 'Marry Alex ', time: Date.now(), title:'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', likes: 12, comments: 6, shares: 6, postType: 'Tip'}
    ],
    requests: [
        {name: 'Marry Collen', mutualFriends: 4},
        {name: 'Robert Alex', mutualFriends: 6},
        {name: 'Calvin Collen', mutualFriends: 2},                
    ],
    onlineUsers: [
        {name: 'Merry Color', status: 'online'},
        {name: 'Robbert Allex', status: '1hr'},
        {name: 'Calvin Colen', status: '3hr'},                
    ],
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // case ActionTypes.GETPOSTS: 
        //     return ({
        //         ...state,
        //         posts: state.posts,
        //     });
        // case ActionTypes.REQUESTS:
        //     return ({
        //         ...state,
        //         reque
        //     });
        case ActionTypes.SAVEDATA:
            return({
                ...state,
                posts: state.posts.concat(action.payload),
            });
        default:
            return state;
    };
};