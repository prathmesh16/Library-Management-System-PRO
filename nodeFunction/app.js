var express = require('express');
var app = express();
var cors = require('cors')
var admin = require("firebase-admin");
app.use(cors()) 
var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


app.get('/createUser', async (req, res) => {

    await admin
    .auth()
    .createUser({
        email: req.query.email,
        password: req.query.password,
    })
    .then((userRecord) => {
    // See the UserRecord reference doc for the contents of userRecord.
        admin.firestore().collection('users').doc(userRecord.uid).set({
            email : req.query.email,
            name : req.query.name,
            password : req.query.password,
            uid : userRecord.uid
        })
        console.log('Successfully created new user: '+ userRecord.uid)
        res.json({result: 'Successfully created new user: '+ userRecord.uid});   

    })
    .catch((error) => {
        console.log('Error creating new user:'+ error)
        res.json({result: 'Error creating new user:'+ error});
    });
})

app.get('/deleteUser', async (req, res) => {

    await admin
    .auth()
    .deleteUser(req.query.uid)
    .then(() => {
    // See the UserRecord reference doc for the contents of userRecord.
        admin.firestore().collection('users').doc(req.query.uid).delete();
        console.log('Successfully deleted user');
        res.json({result: 'Successfully deleted user'});    
    })
    .catch((error) => {
        console.log('Error deleting user:'+ error);
        res.json({result: 'Error deleting user:'+ error});
    });
})


var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("server listening at http://%s:%s", host, port)
})