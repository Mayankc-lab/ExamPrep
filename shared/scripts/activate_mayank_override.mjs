import dotenv from 'dotenv';
dotenv.config({ path: 'Server/.env' });

import mongoose from 'mongoose';

const email = 'mayankkrmaurya195@gmail.com'.toLowerCase();
const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/lms_database';

await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 5000, socketTimeoutMS: 15000 });

const db = mongoose.connection.db;

const courseDocs = await db.collection('courses').find({}, { projection: { _id: 1 } }).toArray();
const courseIds = courseDocs.map((course) => course._id);

const now = new Date();

await db.collection('users').updateOne(
  { email },
  {
    $set: {
      role: 'USER',
      subscription: {
        id: 'override-open',
        status: 'active'
      },
      enrolledCourses: courseIds,
      fullName: 'mayank maurya',
      updatedAt: now
    }
  },
  { upsert: true }
);

await db.collection('courses').updateMany(
  {},
  {
    $set: {
      'liveSession.isLive': true,
      'liveSession.youtubeUrl': 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
      'liveSession.startedAt': now,
      'liveSession.title': 'Live Class Session',
      'liveSession.description': 'Live class is open for enrolled students'
    }
  }
);

const updatedUser = await db.collection('users').findOne({ email });
console.log('Activated user:', Boolean(updatedUser), updatedUser?.email, updatedUser?.role, JSON.stringify(updatedUser?.subscription), updatedUser?.enrolledCourses?.length);
console.log('Courses opened:', await db.collection('courses').countDocuments({ 'liveSession.isLive': true }));

await mongoose.disconnect();
