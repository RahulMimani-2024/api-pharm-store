// //CRUD

// const { MongoClient, ObjectID } = require("mongodb");
// const connectionURL = "mongodb://127.0.0.1:27017";
// const databaseName = "task-app";

// MongoClient.connect(
//   connectionURL,
//   { useNewUrlParser: true },
//   (error, client) => {
//     if (error) {
//       return console.log("Unable to connect");
//     }

//     const db = client.db(databaseName);

//     // db.collection('users').findOne({
//     // name : 'rahul',
//     // }, (error,user)=>{
//     // if(error){
//     //
//     // return console.log("unable to fetch");
//     // }
//     // console.log(user);
//     // })
//     //
//     // db.collection('users').find({
//     // age : 17,
//     // }).toArray((error,users)=>{
//     // console.log(users);
//     // })
//     //
//     // db.collection("tasks").findOne(
//     //   {
//     // _id: new ObjectID("62b2e7691528a1409ca6ad8c"),
//     //   },
//     //   (error, task) => {
//     // if (error) {
//     //   return console.log("Couldn't find the task");
//     // }
//     // console.log(task);
//     //   }
//     // );
//     //
//     // db.collection('tasks').find({
//     // completed : false
//     // }).toArray( (error,tasks) =>{
//     // if(error){
//     // return console.log("unable to fetch tasks");
//     // }
//     // console.log(tasks);
//     // })

//     const updatePromise = db.collection('users').updateOne({
//         name : "manu",
//     },{
//         $inc : {
//             age : 1,
//         }
//     })

//     updatePromise.then((result)=>{
//         console.log(result);
//     }).catch((error)=>{
//         console.log(error);
//     })

//     db.collection('users').deleteMany({
//         name : "prem",
//     }).then((result)=>{
//         console.log(result);
//     }).catch((error)=>{
//         console.log(error);
//     })
//   }
// );
