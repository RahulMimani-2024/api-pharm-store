const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description : {
        type : String,
        required : true,
        validate(value){
            if(value.length === 0){
                throw new Error('description must be non empty');
            }
        }
    },
    completed : {
        type : Boolean,
        default : false,
    },
    owner :{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'user'
    }
},{
    timestamps:true
})
 
taskSchema.pre('save',async function (next){
    const task = this;
    console.log('task saved/updated');
    next();
})

const tasks = mongoose.model('tasks',taskSchema);

module.exports = tasks;