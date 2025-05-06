const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const { protect, teacherOnly } = require('../middleware/authMiddleware');

// Get all subjects (or only those granted access)
router.get('/getallsub', protect, async (req, res) => {
  try {
    const subjects = await Subject.find().populate({path:'teacher',model:'User',})
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subjects', error });
  }
});

// Teacher creates a new subject
router.post('/createsubject', protect, teacherOnly, async (req, res) => {
  const { name } = req.body;
  try {
    const subject = await Subject.create({ name, teacher: req.user._id });
    res.json({ message: 'Subject created', subject });
  } catch (error) {
    res.status(500).json({ message: 'Error creating subject', error });
  }
});

// Delete a subject (only by the teacher who created it)
router.delete('/:id', protect, teacherOnly, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Only the teacher who created the subject can delete it
    if (subject.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this subject' });
    }

    await subject.deleteOne();
    res.json({ message: 'Subject deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Error deleting subject', error });
  }
});


module.exports = router;
