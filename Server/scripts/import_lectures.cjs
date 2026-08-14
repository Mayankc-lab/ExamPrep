const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGO_URI = process.env.MONGODB_URL || 'mongodb://localhost:27017/my_database';

function readCsvLinks(csvPath) {
  const csv = fs.readFileSync(csvPath, 'utf8');
  const lines = csv.split('\n').map(l => l.trim()).filter(Boolean);
  // expect header then rows: sheet,cell,link
  const rows = lines.slice(1).map(l => {
    // simple CSV split, handles quoted fields
    const cols = l.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
    const link = cols[2] ? cols[2].replace(/^"|"$/g, '') : null;
    return link;
  }).filter(Boolean);
  return rows;
}

async function main() {
  const createdBy = process.argv[2] || 'imported';
  const csvPath = path.resolve(__dirname, '..', '..', 'Client', 'src', 'Assets', 'extracted_links.csv');
  if (!fs.existsSync(csvPath)) {
    console.error('CSV file not found at', csvPath);
    process.exit(2);
  }

  const links = readCsvLinks(csvPath);
  if (!links.length) {
    console.error('No links found in CSV');
    process.exit(0);
  }

  await mongoose.connect(MONGO_URI);
  const courses = mongoose.connection.collection('courses');

  const courseDoc = {
    title: 'Imported Lectures',
    description: 'Course auto-created by import script',
    category: 'Imported',
    thumbnail: { public_id: 'imported_thumbnail', secure_url: 'imported_thumbnail' },
    lectures: [],
    numberOfLectures: 0,
    createdBy,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const insertRes = await courses.insertOne(courseDoc);
  const courseId = insertRes.insertedId;
  console.log('Created course id:', courseId.toString());

  const lectures = links.map((link, idx) => ({
    title: `Lecture ${idx + 1}`,
    description: `Auto-imported lecture ${idx + 1} from spreadsheet. Source: ${link}`,
    lecture: {
      public_id: `external_${idx + 1}`,
      secure_url: link,
    }
  }));

  await courses.updateOne({ _id: courseId }, { $set: { lectures, numberOfLectures: lectures.length, updatedAt: new Date() } });

  console.log(`Imported ${lectures.length} lectures into course ${courseId.toString()}`);
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Import failed:', err.message || err);
  process.exit(1);
});
