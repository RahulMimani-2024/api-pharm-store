const express = require("express");
const router = new express.Router();
const auth = require('../middleware/auth');
const Task = require("../models/task");

// Tasks CRUD operations

//creaton of task
router.post("/task",auth,async (req, res) => {
  const task = new Task({
    ...req.body,
    owner : req.user.id,
  });
  try {
    await task.save();
    res.status(201).send("task added succesfully!!");
  } catch (error) {
    res.status(500).send(error);
  }
});

//reading all the tasks for the authorizes user

// Enabling pagination property
router.get("/task", auth, async (req, res) => {
  const match ={};
  const sort ={};
  if(req.query.completed){
    
    match.completed = req.query.completed === 'true';
  }
  if(req.query.sortBy){
    const parts = req.query.sortBy.split(':');
    sort[parts[0]] = (parts[1] === 'desc') ? -1 : 1;
  }

  try {  
    await req.user.populate({
      path : 'tasks',
      match,
      options :{
        limit : parseInt(req.query.limit),
        skip : parseInt(req.query.skip),
        sort 
      }
    }).execPopulate()
    res.status(201).send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});


// find the task by the user and task id
router.get("/task/:id",auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task_required = await Task.findOne({_id , owner : req.user._id});
    if (!task_required) {
      return res.status(404).send("task not found");
    }
    res.status(201).send(task_required);
  } catch (e) {
    res.status(500).send(e);
  }
});


//updation with user authorization
router.patch("/task/:id",auth, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const updates_available = ["description", "completed"];
  const isUpdateValid = updates.every((update) => {
    return updates_available.includes(update);
  });

  if (!isUpdateValid) {
    return res.send("invalid update");
  }
  try {
    const updated_task = await Task.findOne({_id, owner : req.user._id})
    if (!updated_task) {
      return res.status(404).send("task not found");
    }
    updates.forEach( (update) => {
        updated_task[update] = req.body[update];
    })
    updated_task.save();
    res.status(201).send(updated_task);
  } catch (e) {
    res.status(400).send(e);
  }
});


//deletion with user authorization
router.delete("/task/:id",auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOneAndDelete({_id,owner : req.user._id});
    if (!task) {
      return res.status(404).send("task not found");
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router