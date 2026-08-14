import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../Server/models/usermodel.js';
import Course from '../Server/models/course.model.js';

const email = 'mayankkrmaurya195@gmail.com'.toLowerCase();

try {
  const mongoUrl = process.env.MONGODB_URL || process.env.MONGO_URI || 'mongodb://localhost:27017/lms_database';
  await mongoose.connect(mongoUrl);

  const courses = await Course.find({}, { _id: 1 });
  const courseIds = courses.map((course) => course._id);

  const user = await User.findOne({ email });
  if (!user) {
    console.log('User not found:', email);
    await mongoose.disconnect();
    process.exit(0);
  }

  user.enrolledCourses = courseIds;
  user.subscription = {
    ...(user.subscription || {}),
    id: user.subscription?.id || 'override-open',
    status: 'active'
  };

  await user.save();

  await Course.updateMany(
    {},
    {
      $set: {
        'liveSession.isLive': true,
        'liveSession.youtubeUrl': 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
        'liveSession.startedAt': new Date(),
        'liveSession.title': 'Live Class Session',
        'liveSession.description': 'Live class is open for enrolled students'
      }
    }
  );

  const courseCount = await Course.countDocuments({});
  const liveCount = await Course.countDocuments({ 'liveSession.isLive': true });

  console.log(`Updated enrollment for ${email} with ${courseCount} course IDs.`);
  console.log(`Live sessions enabled for ${liveCount} courses.`);

  await mongoose.disconnect();
  process.exit(0);
} catch (error) {
  console.error('DB update failed:', error?.message || error);
  process.exit(1);
}
