import express from 'express';

const systemRouter = express.Router();

const REQUIRED_ENV_KEYS = [
  'MONGODB_URI',
  'JWT_SECRET',
  'GEMINI_API_KEY'
];

systemRouter.get('/runtime-status', (req, res) => {
  const missingKeys = REQUIRED_ENV_KEYS.filter((key) => !process.env[key]);

  res.json({
    prototypeMode: missingKeys.length > 0,
    missingKeys,
    message: missingKeys.length
      ? 'Some keys are not present currently. Prototype fallback mode is active.'
      : 'All required runtime keys are available.'
  });
});

systemRouter.get('/market-demo', (req, res) => {
  res.json({
    roleDemand: [
      { role: 'Frontend Developer', openings: 1320, growth: '+18%' },
      { role: 'Backend Developer', openings: 980, growth: '+14%' },
      { role: 'Data Analyst', openings: 760, growth: '+21%' },
      { role: 'AI/ML Intern', openings: 540, growth: '+26%' }
    ],
    topSkills: ['React', 'Node.js', 'SQL', 'Python', 'AWS', 'Docker'],
    avgCtcLpa: {
      fresher: 5.8,
      oneToThreeYears: 9.6,
      threePlusYears: 16.2
    },
    updatedAt: new Date().toISOString()
  });
});

export default systemRouter;
