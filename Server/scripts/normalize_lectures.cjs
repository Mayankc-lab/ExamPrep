const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

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

  const normalized = (course.lectures || []).map((lec)=>{
    return {
      _id: new mongoose.Types.ObjectId(),
      title: lec.title || 'Untitled',
      description: lec.description || '',
      lecture: {
        secure_url: lec?.lecture?.secure_url || ''
      }
    }
  });

  await courses.updateOne({ _id: course._id }, { $set: { lectures: normalized, numberOfLectures: normalized.length, updatedAt: new Date() } });
  console.log(`Normalized ${normalized.length} lectures for course ${COURSE_ID}`);

  // update frontend constants to match new shape
  const constPath = path.resolve(__dirname, '..', '..', 'Client', 'src', 'Contants', 'importedLectures.js');
  const exportJs = `const importedLectures = ${JSON.stringify(normalized, null, 2)};\nexport default importedLectures;\n`;
  fs.writeFileSync(constPath, exportJs, 'utf8');
  console.log('Updated frontend constants at', constPath);

  await mongoose.disconnect();
}

main().catch(err=>{ console.error(err); process.exit(1); });
