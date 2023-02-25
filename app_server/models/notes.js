const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const NotesSchema = new mongoose.Schema(
  {
    noteID: {
      _id: mongoose.Schema.Types.ObjectId,
    },
    note: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'incomplete',
    },
  },
  { timestamps: true }
);

const Notes = mongoose.model('Note', NotesSchema);
module.exports = Notes;
