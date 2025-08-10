#Database Connection (config/db.js)
  
  
  const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;



#Define Data Models(models/Member.js)


  const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: String,
  joinDate: {
    type: Date,
    default: Date.now
  },
  membershipType: {
    type: String,
    enum: ['Premium', 'Standard', 'Student', 'Corporate', 'Senior'],
    default: 'Standard'
  },
  trainer: String,
  lastVisit: Date,
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  visits: {
    type: Number,
    default: 0
  },
  churnRisk: {
    type: Number,
    default: 0
  },
  age: Number,
  gender: String
});

module.exports = mongoose.model('Member', MemberSchema);




#Create API Routes (routes/members.js)


  const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

// Get all members
router.get('/', async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new member
router.post('/', async (req, res) => {
  const member = new Member(req.body);
  
  try {
    const newMember = await member.save();
    res.status(201).json(newMember);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Check-in a member
router.post('/:id/checkin', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    
    // Update last visit and increment visits
    member.lastVisit = new Date();
    member.visits += 1;
    member.churnRisk = Math.max(0, member.churnRisk - 15); // Reduce risk
    
    const updatedMember = await member.save();
    res.json(updatedMember);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;



# Analytics Endpoints(routes/analytics.js)



  const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

// Get key metrics
router.get('/metrics', async (req, res) => {
  try {
    const totalMembers = await Member.countDocuments();
    const activeMembers = await Member.countDocuments({ status: 'active' });
    
    // Calculate attendance rate
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentVisitors = await Member.countDocuments({ 
      lastVisit: { $gte: thirtyDaysAgo } 
    });
    
    // Calculate churn risk
    const highRiskCount = await Member.countDocuments({ churnRisk: { $gt: 70 } });
    
    res.json({
      totalMembers,
      attendanceRate: (recentVisitors / totalMembers * 100).toFixed(1),
      avgDailyCheckins: (recentVisitors / 30).toFixed(1),
      churnRisk: (highRiskCount / totalMembers * 100).toFixed(1)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get churn risk distribution
router.get('/churn-distribution', async (req, res) => {
  try {
    const total = await Member.countDocuments();
    const lowRisk = await Member.countDocuments({ churnRisk: { $lt: 30 } });
    const mediumRisk = await Member.countDocuments({ 
      churnRisk: { $gte: 30, $lt: 70 } 
    });
    const highRisk = await Member.countDocuments({ churnRisk: { $gte: 70 } });
    
    res.json({
      lowRisk: (lowRisk / total * 100).toFixed(1),
      mediumRisk: (mediumRisk / total * 100).toFixed(1),
      highRisk: (highRisk / total * 100).toFixed(1)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;




