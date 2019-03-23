import { Dimensions } from 'react-native';
import Styles from './style';

const { height, width, fontScale, scale } = Dimensions.get("window");

const screenHeight = height;
const screenWidth = width;
const config = {
    githubApi: 'https://api.github.com',
    api: 'https://www.mhd53.com/web/index.php/App',
    endpoints: {
        login: '/login',
        UpdateRegistration: '/UpdateRegistration',
        GetMiqaat: '/GetMiqaat',
        GetMiqaatAttendance: '/GetMiqaatAttendance',
        UpdateMiqaatAttendance: '/UpdateMiqaatAttendance',
        GetFMBMenu: '/GetFMBMenu',
        getAllNotifications: '/getAllNotifications',
        GetNotifications: '/GetNotifications'
    }
}

// Login Endpoint: login 
// Login POST Parameters: eJamaatID, HOF_ID, MobileNumber, FCM_ID

// Update Registration Endpoint: UpdateRegistration
// Update Registration POST Parameters: eJamaatID, MobileNumber, FCM_ID

// Download Miqaat Endpoint: GetMiqaat 
// Download Miqaat POST Parameters: eJamaatID

// Download Miqaat Attendance Endpoint: GetMiqaatAttendance 
// Download Miqaat Attendance POST Parameters: HOF_ID, AttendanceID

// Update Miqaat Attendance Endpoint: UpdateMiqaatAttendance 
// Update Miqaat Attendance POST Parameters: FKHOFITSID, FKAttendanceID, NoOfGents_Baligh, NoOfGents_GherBaligh, NoOfLadies_Baligh, NoOfLadies_GherBaligh, NoOfGents_Mehman_Baligh, NoOfGents_Mehman_GherBaligh, NoOfLadies_Mehman_Baligh, NoOfLadies_Mehman_GherBaligh

// Download FMB Menu Endpoint: GetFMBMenu 
// Download Miqaat Attendance POST Parameters: eJamaatID, gDate (dd-MM-yyyy)

// Get All Messages Endpoint: getAllNotifications 
// Get All Messages POST Parameters: eJamaatID, MsgID
// Above will download all messages after the given MessageID

// Get Messages EndPoint: GetNotifications
// Get Messages POST Parameters: eJamaatID, MsgIDs
// Above will download pending messages received from FCM


const log = (msg, header = 'LOG: ') => {
    __DEV__ && console.log(header, msg);
}

export {
    config,
    screenHeight,
    screenWidth,
    fontScale,
    scale,
    Styles,
    log,
}