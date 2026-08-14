const mongoose = require('mongoose');

const uri = process.env.MONGODB_URL || 'mongodb://localhost:27017/my_database';

async function main() {
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const col = mongoose.connection.collection('courses');
  const courses = await col.find({}).project({ title: 1, createdBy: 1, numberOfLectures: 1 }).toArray();
  if (!courses || courses.length === 0) {
    console.log('No courses found in the database.');
    process.exit(0);
  }
  console.log('Courses:');
  courses.forEach((c, i) => {
    console.log(`${i + 1}. ${c.title} — id=${c._id} — createdBy=${c.createdBy || ''} — lectures=${c.numberOfLectures || 0}`);
  });
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Error listing courses:', err.message || err);
  process.exit(1);
});
