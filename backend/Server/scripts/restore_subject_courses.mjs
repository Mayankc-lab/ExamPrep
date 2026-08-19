import connectionToDB from '../config/dbConnection.js';
import Course from '../models/course.model.js';

const courses = [
  {
    title: 'Physics',
    description: 'Learn the fundamentals of motion, energy, and scientific problem-solving with engaging lessons.',
    category: 'Science',
    createdBy: 'Dr. Asha Kumar',
    thumbnail: {
      public_id: 'dummy-physics',
      secure_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
    },
    lectures: [
      {
        title: 'Physics Intro',
        description: 'Start with an overview of motion, forces, and energy.',
        lecture: {
          public_id: 'dummy-physics-intro',
          secure_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
        }
      },
      {
        title: 'First Topic',
        description: 'motion',
        lecture: {
          public_id: 'dummy-physics-1',
          secure_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
        }
      },
      {
        title: 'topic',
        description: 'forces',
        lecture: {
          public_id: 'dummy-physics-2',
          secure_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
        }
      },
      {
        title: 'topic',
        description: 'energy',
        lecture: {
          public_id: 'dummy-physics-3',
          secure_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
        }
      }
    ],
    numberOfLectures: 4
  },
  {
    title: 'Chemistry',
    description: 'Explore atoms, reactions, and practical lab concepts through clear and structured modules.',
    category: 'Science',
    createdBy: 'Prof. Neha Singh',
    thumbnail: {
      public_id: 'dummy-chemistry',
      secure_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80'
    },
    lectures: [
      {
        title: 'Chemistry Intro',
        description: 'Get introduced to atoms, molecules, and chemical reactions.',
        lecture: {
          public_id: 'dummy-chemistry-intro',
          secure_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
        }
      },
      {
        title: 'topic',
        description: 'atoms',
        lecture: {
          public_id: 'dummy-chemistry-1',
          secure_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
        }
      },
      {
        title: 'topic',
        description: 'molecules',
        lecture: {
          public_id: 'dummy-chemistry-2',
          secure_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
        }
      },
      {
        title: 'topic',
        description: 'chemical reactions',
        lecture: {
          public_id: 'dummy-chemistry-3',
          secure_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4'
        }
      }
    ],
    numberOfLectures: 4
  },
  {
    title: 'Maths',
    description: 'Master algebra, geometry, and problem-solving techniques with step-by-step guidance.',
    category: 'Mathematics',
    createdBy: 'Mr. Rahul Verma',
    thumbnail: {
      public_id: 'dummy-maths',
      secure_url: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=800&q=80'
    },
    lectures: [
      {
        title: 'Maths Intro',
        description: 'Review core arithmetic and algebra concepts.',
        lecture: {
          public_id: 'dummy-maths-intro',
          secure_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
        }
      },
      {
        title: 'topic',
        description: 'core arithmetic',
        lecture: {
          public_id: 'dummy-maths-1',
          secure_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
        }
      },
      {
        title: 'topic',
        description: 'algebra concepts',
        lecture: {
          public_id: 'dummy-maths-2',
          secure_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
        }
      }
    ],
    numberOfLectures: 3
  },
  {
    title: 'General Awareness',
    description: 'Stay updated with current affairs, important events, and everyday knowledge topics.',
    category: 'General Studies',
    createdBy: 'Ms. Priya Sharma',
    thumbnail: {
      public_id: 'dummy-awareness',
      secure_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80'
    },
    lectures: [
      {
        title: 'Awareness Intro',
        description: 'Understand the basics of general knowledge and current events.',
        lecture: {
          public_id: 'dummy-awareness-intro',
          secure_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
        }
      },
      {
        title: 'topic',
        description: 'basics of general knowledge',
        lecture: {
          public_id: 'dummy-awareness-1',
          secure_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
        }
      },
      {
        title: 'topic',
        description: 'current events',
        lecture: {
          public_id: 'dummy-awareness-2',
          secure_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
        }
      }
    ],
    numberOfLectures: 3
  },
  {
    title: 'Quantitative Aptitude',
    description: 'Build strong calculation, data interpretation, and numerical reasoning skills.',
    category: 'Aptitude',
    createdBy: 'Mr. Sandeep Rao',
    thumbnail: {
      public_id: 'dummy-quant',
      secure_url: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=80'
    },
    lectures: [
      {
        title: 'Quantitative Aptitude Intro',
        description: 'Practice numerical and logical reasoning questions.',
        lecture: {
          public_id: 'dummy-quant-intro',
          secure_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
        }
      },
      {
        title: 'topic',
        description: 'Practice numerical and logical reasoning questions.',
        lecture: {
          public_id: 'dummy-quant-1',
          secure_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
        }
      },
      {
        title: 'topic',
        description: 'Practice numerical and logical reasoning questions.',
        lecture: {
          public_id: 'dummy-quant-2',
          secure_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4'
        }
      }
    ],
    numberOfLectures: 3
  },
  {
    title: 'Reasoning Ability',
    description: 'Improve puzzle-solving, logical deduction, and analytical thinking with practical lessons.',
    category: 'Reasoning',
    createdBy: 'Mrs. Kavita Mehra',
    thumbnail: {
      public_id: 'dummy-reasoning',
      secure_url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80'
    },
    lectures: [
      {
        title: 'Reasoning Intro',
        description: 'Develop analytical reasoning and critical thinking skills.',
        lecture: {
          public_id: 'dummy-reasoning-intro',
          secure_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4'
        }
      },
      {
        title: 'topic',
        description: 'Develop analytical reasoning',
        lecture: {
          public_id: 'dummy-reasoning-1',
          secure_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
        }
      },
      {
        title: 'topic',
        description: 'critical thinking skills',
        lecture: {
          public_id: 'dummy-reasoning-2',
          secure_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
        }
      }
    ],
    numberOfLectures: 3
  },
  {
    title: 'English Language',
    description: 'Enhance grammar, vocabulary, comprehension, and communication skills with guided practice.',
    category: 'Language',
    createdBy: 'Ms. Anjali Nair',
    thumbnail: {
      public_id: 'dummy-english',
      secure_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80'
    },
    lectures: [
      {
        title: 'English Intro',
        description: 'Strengthen vocabulary and grammar fundamentals.',
        lecture: {
          public_id: 'dummy-english-intro',
          secure_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
        }
      },
      {
        title: 'topic',
        description: 'Strengthen vocabulary',
        lecture: {
          public_id: 'dummy-english-1',
          secure_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
        }
      },
      {
        title: 'topic',
        description: 'grammar fundamentals.',
        lecture: {
          public_id: 'dummy-english-2',
          secure_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
        }
      }
    ],
    numberOfLectures: 3
  },
  {
    title: 'General Science',
    description: 'Understand core scientific principles across biology, chemistry, and physics in a simple format.',
    category: 'Science',
    createdBy: 'Dr. Raghav Iyer',
    thumbnail: {
      public_id: 'dummy-science',
      secure_url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80'
    },
    lectures: [
      {
        title: 'Science Intro',
        description: 'Overview of basic science concepts for everyday learners.',
        lecture: {
          public_id: 'dummy-science-intro',
          secure_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
        }
      },
      {
        title: 'topic',
        description: 'basic science',
        lecture: {
          public_id: 'dummy-science-1',
          secure_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
        }
      },
      {
        title: 'topic',
        description: 'concepts for everyday learners',
        lecture: {
          public_id: 'dummy-science-2',
          secure_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
        }
      }
    ],
    numberOfLectures: 3
  }
];

await connectionToDB();

const results = [];
for (const course of courses) {
  const existing = await Course.findOne({ title: course.title });
  if (existing) {
    existing.set(course);
    await existing.save();
    results.push({ action: 'updated', title: course.title });
  } else {
    const created = await Course.create(course);
    results.push({ action: 'created', title: created.title });
  }
}

console.log(JSON.stringify(results, null, 2));
process.exit(0);
