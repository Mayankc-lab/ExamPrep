const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URL || 'mongodb://localhost:27017/my_database';
const COURSE_ID = process.argv[2] || '6a6b4dcfeba7c2531ac2dcce';

async function main(){
  await mongoose.connect(MONGO_URI);
  const courses = mongoose.connection.collection('courses');
  const course = await courses.findOne({ _id: new mongoose.Types.ObjectId(COURSE_ID) });
  if(!course){
    console.error('Course not found:', COURSE_ID);
    process.exit(2);
  }
  console.log('Course:', course.title);
  console.log('Thumbnail:', course.thumbnail);
  console.log('NumberOfLectures:', course.numberOfLectures);
  console.log('First lecture (sample):', course.lectures && course.lectures[0]);
  await mongoose.disconnect();
}

main().catch(err=>{ console.error(err); process.exit(1); });
