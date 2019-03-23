
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
    //  response.send("Hello from Firebase!");
    // });
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

// exports.sendNewMessageNotification = functions.database.ref('/status').onWrite(event => {
//         const payload = {
//             notification: {
//                 title: 'New msg',
//                 body: 'new Message',
//             }
//         };

//         return admin.messaging()
//                     .sendToTopic('/status', payload);
// });

///////////////exports.sendPushNotification = functions.firestore
function loadUsers() {
    let dbRef = admin.database().ref('/users');
    let defer = new Promise((resolve, reject) => {
        dbRef.once('value', (snap) => {
            let data = snap.val();
            // let users = [];
            // for (var property in data) {
            //     users.push(data[property]);
            // }
            resolve(data);
        }, (err) => {
            reject(err);
        });
    });
    return defer;
};

exports.sendPushNotification = functions.database.ref("/status/{listId}")
  .onCreate(event => {
    console.log('event', event);
    // gets standard JavaScript object from the new write
    // const writeData = event.data.data();
    // access data necessary for push notification 
    // const sender = writeData.uid;
    // const senderName = writeData.name;
    // const recipient = writeData.recipient;
    return loadUsers().then(users => {
        let tokens = [];
        for (let key in users) {
            if(users[key]['deviceToken']){
                tokens.push(users[key]['deviceToken']);
            }
        }
        let payload = {
            data: {
                priority: 'high'
            },
                notification: {
                title: 'New Notification',
                body: 'New Post in Social App',
                sound: 'default',
            }
        };
        return admin.messaging().sendToDevice(tokens, payload);
    });
    // let tokens = [];
    // return admin.database().ref('users').once('value', snap => {
    //     let data = snap.val();
    //     for(let key in data){
    //         if(data[key]['deviceToken']){
    //             return admin.messaging().sendToDevice(data[key]['deviceToken'], payload);
    //         console.log(data[key]['deviceToken']);    
    //         tokens.push(data[key]['deviceToken']);
    //         }
    //     }
    // });
    // console.log(tokens, 'tokennnssssssssssssss');
    // if(tokens){
    //     setTimeout(() => {
    //     }, 2000);
    // }
    // the payload is what will be delivered to the device(s)
    // either store the recepient tokens in the document write
    // const tokens = writeData.tokens;  
    
    // or collect them by accessing your database
    // var pushToken = "";
    // return functions
    //   .database
    //   .ref("/status")
    //   .then(doc => {
    // //   .get()
    //     //  pushToken = doc.data().token;
    //      // sendToDevice can also accept an array of push tokens
    //   });
});

exports.chatNotification = functions.https.onRequest((req, res) => {
    res.send('success');
    console.log('sucesss');
    // admin.database().ref(`users/${req.body.uid}`).once('value', snap => {
        // res.json(snap.val().deviceToken);
        if(req.body.deviceToken){
            let payload = {
                data: {
                    priority: 'high'
                },
                notification: {
                    title: `New Message from ${req.body.name}`,
                    body: req.body.message,
                    sound: 'default',
                }
            };
            console.log(req.body.deviceToken)
            return admin.messaging().sendToDevice(req.body.deviceToken, payload);
        }
});
    // });

exports.parentSignup = functions.https.onRequest((req,res)=>{
    var req=req.body
    console.log("requesting function")
    if(req){
        return admin.auth().createUser({
            email:req.email,
            password:req.password,
            displayName:req.username
        }).then((response)=>{
            let obj={
                Uid:response.uid,
                accountType:req.accountType,
                email:req.email,
                number:req.number,
                userName:req.username
            }
            return admin.database().ref(`users/${response.uid}`).set(obj).then(()=>{
                res.send({success:true})
            }).catch(error=>{
                res.send({success:false,errorMessage:error.message})
            })
        }).catch((error)=>{
            res.send({success:false,errorMessage:error.message})
        })
    }
})

// exports.chatNotification = functions.database.ref("/chatMessages/{uid}").onWrite((event) => {
//     // Path segment values are read from event.params
//     const {uid, nid} = event.params;
//     // const notification = event.data.val()

//     const payload = {
//     console.log(`Send notification to ${uid}`);
//         data: { nid },
//         notification: {
//             body: 'formatBody(notification)'
//         }
//     };

//     return admin.messaging()
//         .sendToTopic(`/chatMessages/${uid}`, payload)
//         .then((result) => console.log(result))
//         .catch((error) => console.error(error));
// });

