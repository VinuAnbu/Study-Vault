const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Resource = require('../models/Resource');
const QuizAttempt = require('../models/QuizAttempt');

// Sign Up – note password must be at least 5 characters and include a number
router.post('/signup', async (req, res) => {
  const { username, email, password, role } = req.body;
  if(password.length < 5 || !/\d/.test(password)) {
    return res.status(400).json({ message: 'Password must be at least 5 characters and include a number' });
  }
  try {
    const user = await User.create({ username, email, password, role });
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    // res.json({ token, user });
    res.json({ message:"Account created successfully"});

  } catch (error) {
    res.status(500).json({ message: 'Error signing up', error });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if(user && await user.matchPassword(password)){
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ token, user, message: 'login success',success:true });
    } else {
      res.json({success:false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

router.get('/user/:userid', async (req, res) => {
    
    try {
      const user = await User.findById(req.params.userid ).populate({path:'liked',model:'Resource',})
      if(user ){
        res.json({ user });
      } else {
        res.status(401).json({ message: 'user not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error find user', error });
    }
  });

  router.post('/addtofav', async (req, res) => {
    const {userid, RId} = req.body;
    
    try {
      const user = await User.findById(userid);
      const resource = await Resource.findById(RId);
      
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }

      if(user.liked.includes(RId)){
        // Unlike: Remove from user's liked list and decrement resource likes count
        await user.updateOne({$pull:{liked:RId}});
        await user.save();
        
        // Decrement likes count (ensure it doesn't go below 0)
        resource.likes = Math.max(0, resource.likes - 1);
        await resource.save();
        
        return res.status(200).json({
          message: "Resource unliked successfully",
          user,
          resourceId: RId,
          likes: resource.likes
        });
      } else {
        // Like: Add to user's liked list and increment resource likes count
        await user.updateOne({$addToSet:{liked:RId}});
        await user.save();
        
        // Increment likes count
        resource.likes = (resource.likes || 0) + 1;
        await resource.save();
        
        return res.status(200).json({
          message: "Resource liked successfully",
          user,
          resourceId: RId,
          likes: resource.likes
        });
      }
    } catch (error) {
      console.error("Error updating likes:", error);
      res.status(500).json({ message: 'Error updating likes', error });
    }
  });

  router.post('/removefromfav', async (req, res) => {
    const {userid,RId} = req.body;
    
    try {
      const user = await User.findById(userid)
      if(user.liked.includes(RId)){
        
           await  user.updateOne({$pull:{liked:RId}})
    await user.save()
    return res.status(200).json({message:"Resources added to fav successfully ",user})
      } else {
        await  user.updateOne({$addToSet:{liked:RId}})

            await user.save() 
            return res.status(200).json({message:"Resources removed successfully "})
      }
    } catch (error) {
      res.status(500).json({ message: 'Error find user', error });
    }
  });

  router.post('/delete', async (req, res) => {
    const {RID } = req.body;

    try {

      const resource = await Resource.findOneAndDelete({_id:RID});
    
  
      res.json({ message: 'Resource deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error rejecting resource', error });
    }
  });

  router.put('/makeprivate', async (req, res) => {
    const {RID } = req.body;

    try {

      const resource = await Resource.findByIdAndUpdate(
        RID, 
        { private: true },  // Update the `private` field to `true` (or `false` if needed)
        { new: true }  // Return the updated document
    );
    
  
      res.json({ message: 'Resource is now private' });
    } catch (error) {
      res.status(500).json({ message: 'Error rejecting resource', error });
    }
  });


router.get("/getStudents", async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("username email xp");
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: "Error fetching students" });
  }
});

router.post("/getByUser", async (req, res) => {
  try {
    const { userId } = req.body;
    const resources = await Resource.find({ author: userId }).populate({path:'subject',model:'Subject'})
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ error: "Error fetching resources" });
  }
});

router.post("/deleteuser", async (req, res) => {
  try {
    const { userId } = req.body;

    // Delete student resources first
    await Resource.deleteMany({ author: userId });

    // Delete student account
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting student" });
  }
});

router.get("/getStudent/:id", async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select("username email role xp");
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: "Error fetching student data" });
  }
});

// Update user profile
router.put('/update-profile', async (req, res) => {
  const { userId, username } = req.body;
  
  try {
    // Check if username is already taken by another user
    const existingUser = await User.findOne({ username, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken' });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username },
      { new: true }
    ).select('-password');
    
    res.status(200).json({ 
      message: 'Profile updated successfully', 
      user: updatedUser 
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error });
  }
});

// Update user password
router.put('/update-password', async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;
  
  if(newPassword.length < 5 || !/\d/.test(newPassword)) {
    return res.status(400).json({ 
      message: 'New password must be at least 5 characters and include a number' 
    });
  }
  
  try {
    const user = await User.findById(userId);
    
    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Error updating password', error });
  }
});

// Get user stats
router.get('/user-stats/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Get resources created by user
    const resources = await Resource.find({ author: userId });
    const quizzes = await QuizAttempt.find({user: userId});

    // Count resources shared (approved and not private)
    const sharedResources = resources.filter(r => r.approved && !r.private).length;
    
    // Get user's quiz attempts 
    const quizzesCompleted = quizzes.length; 
    
    res.status(200).json({
      resourcesShared: sharedResources,
      quizzesCompleted: quizzesCompleted
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Error fetching user stats', error });
  }
});

module.exports = router;
