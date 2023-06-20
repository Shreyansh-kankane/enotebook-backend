import express from 'express';
const router = express.Router();
import Notes from '../models/Notes.js';
import { body, validationResult } from 'express-validator';
import fetchuser from '../middleware/fetchuser.js';

// ROUTE 1: Get all the notes GET "/api/auth/fetchallnotes" Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).json().send("some internal server error occured");
    }
});

// ROUTE 2: add a new notes GET "/api/auth/addnote" Login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid email').isLength({ min: 3 }),
    body('description', 'Enter a valid name').isLength({ min: 5 })
], async (req, res) => {

    // if there are errors,return bad requests and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, tag } = req.body;
        const note = new Notes({
            title, description, tag, user: req.user.id
        });
        const saveNote = await note.save()
        res.json(saveNote);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json().send("some internal server error occured");
    }
});

// ROUTE 3: update a existing note PUT "/api/auth/updatenote" Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        // create a new note object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // find the note to update
        let note = await Notes.findById(req.params.id);

        // if note not found because user provide different id of note
        if (!note) { return res.status(404).send("Not Found") }

        // if note found by its id but user is another (note does not belong to person which send update req)
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        //  everything is fine
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note);

    } catch (error) {
        console.error(error.message);
        res.status(500).json().send("some internal server error occured");
    }

});

// ROUTE 3: Delete an existing note DELETE "/api/auth/updatenote" Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {
        // find the note to delete
        let note = await Notes.findById(req.params.id);

        // if note not found because user provide different id of note.
        if (!note) { return res.status(404).send("Not Found") }

        // if note found by its id but user is another (note does not belong to person which send delete req)
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        //  everything is fine
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({Succes:"Note has been deleted",note: note});
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json().send("some internal server error occured");
    }
});

export default router;

// module.exports = router
// const express = require('express');
// const router = express.Router();
// const Notes = require('../models/Notes');
// const { body, validationResult } = require('express-validator');
// const fetchuser = require('../middleware/fetchuser');