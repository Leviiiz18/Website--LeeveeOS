// ─── Static data used across the portfolio ───────────────────────────────────

export const PROJECTS = [
  {
    id: 1,
    name: 'Memory-Based NPC System',
    icon: '🧠',
    type: 'AI System',
    description: 'A persistent AI-powered NPC interaction system that enables game characters to remember past interactions and develop contextual awareness. Unlike traditional dialogue systems, this framework gives NPCs memory, personality, and continuity in conversations. The system stores interactions in a vector database and retrieves relevant memories to generate context-aware responses.',
    tech: ['Unity', 'FastAPI', 'OpenRouter', 'ChromaDB', 'Python'],
    github: 'https://github.com/Leviiiz18/PROJ--Memory-Based-AI-NPC-System-in-Unity',
    status: 'Beta',
  },
  {
    id: 2,
    name: 'SMARTCHASERAI',
    icon: '🤖',
    type: 'ML Research',
    description: 'A neural network–controlled agent operating inside a 3D Unity environment. The neural network is trained in Python using the NEAT algorithm and then deployed in Unity to visualize the learned behavior in real time.',
    tech: ['Unity', 'Python', 'NEAT', 'Neural Networks'],
    github: 'https://github.com/Leviiiz18/PROJ--SMARTCHASERAI',
    status: 'Production',
  },
  {
    id: 3,
    name: 'RAG Chatbot',
    icon: '📄',
    type: 'Question Answering',
    description: 'A Retrieval-Augmented Generation chatbot that allows users to upload PDF documents and ask questions about their contents. The system retrieves relevant sections from the document using vector similarity search and generates accurate responses using a Large Language Model.',
    tech: ['Python', 'FastAPI', 'Vector Search', 'OpenRouter'],
    github: 'https://github.com/Leviiiz18/PROJ--RAGCHATBOT',
    status: 'Production',
  },
  {
    id: 4,
    name: 'Self-Driving AI Cars',
    icon: '🏎️',
    type: 'Simulation',
    description: 'A racing simulation where AI agents learn to race using evolutionary algorithms instead of predefined rules. Agents evolve neural networks over multiple generations based on fitness scores, gradually improving their driving strategy.',
    tech: ['Python', 'NEAT', 'Neural Networks', 'Simulation'],
    github: 'https://github.com/Leviiiz18/PROJ---Self-driving-ai-cars',
    status: 'Beta',
  },
  {
    id: 5,
    name: 'ISL Translator',
    icon: '🤟',
    type: 'Computer Vision',
    description: 'An AI-powered system designed to translate Indian Sign Language (ISL) gestures into readable or spoken language. The goal of the project is to improve accessibility and communication for people who rely on sign language.',
    tech: ['Python', 'CV', 'ML', 'Deep Learning'],
    github: 'https://github.com/Leviiiz18/PROJ--ISL-TRanSalaatorrr',
    status: 'Production',
  },
  {
    id: 6,
    name: 'Supply Chain Optimizer',
    icon: '📦',
    type: 'Optimisation',
    description: 'A data-driven system designed to improve logistics and supply chain efficiency using optimization techniques. The system analyzes logistics data to determine optimal routes, distribution strategies, and inventory flows.',
    tech: ['Python', 'Optimization', 'Data Analysis'],
    github: 'https://github.com/Leviiiz18/code-smarsher-2k25',
    status: 'Beta',
  },
]

export const TRASH_PROJECTS = [
  { id: 1, name: 'BlockchainVoting.sol', icon: '🗳️', note: 'Deprecated — gas fees made it unusable' },
  { id: 2, name: 'CryptoPortfolio_v1',   icon: '📉', note: 'Deleted — bear market ate it' },
  { id: 3, name: 'SocialMediaClone.js',  icon: '👻', note: 'Tutorial project, moved on' },
  { id: 4, name: 'TodoApp_final_v7',     icon: '✅', note: 'The classic rite of passage' },
]

export const SKILL_TREE = {
  nodes: [
    // Tier 0: Root
    { id: 'python', name: 'Python', level: 95, tier: 0, x: 0, y: 0, icon: '🐍' },

    // Tier 1: Core Branches
    { id: 'git', name: 'Git', level: 80, tier: 1, x: -300, y: 150, icon: '🌿' },
    { id: 'dsa', name: 'DSA', level: 85, tier: 1, x: -100, y: 150, icon: '📊' },
    { id: 'ai', name: 'Artificial Intelligence', level: 92, tier: 1, x: 100, y: 150, icon: '🧠' },
    { id: 'unity', name: 'Unity', level: 88, tier: 1, x: 300, y: 150, icon: '🎮' },

    // Tier 2: Specializations
    { id: 'api', name: 'API Development', level: 82, tier: 2, x: -350, y: 300, icon: '🔌' },
    { id: 'problem-solving', name: 'Problem Solving', level: 90, tier: 2, x: -150, y: 300, icon: '🧩' },
    { id: 'ml', name: 'Machine Learning', level: 88, tier: 2, x: 100, y: 300, icon: '📉' },
    { id: 'unreal', name: 'Unreal Engine', level: 75, tier: 2, x: 350, y: 300, icon: '🎬' },

    // Tier 3: Deep Tech
    { id: 'dl', name: 'Deep Learning', level: 85, tier: 3, x: 100, y: 450, icon: '🕸️' },

    // Tier 4: Frameworks & Advanced AI
    { id: 'tensorflow', name: 'TensorFlow', level: 80, tier: 4, x: -50, y: 600, icon: '🔥' },
    { id: 'pytorch', name: 'PyTorch', level: 82, tier: 4, x: 100, y: 600, icon: '🔋' },
    { id: 'neural-networks', name: 'Neural Networks', level: 90, tier: 4, x: 250, y: 600, icon: '🤖' },

    // Tier 5: Research Topics
    { id: 'vision', name: 'Computer Vision', level: 84, tier: 5, x: 150, y: 750, icon: '👁️' },
    { id: 'neat', name: 'NEAT', level: 85, tier: 5, x: 350, y: 750, icon: '🧬' },

    // Tier 6: Evolution
    { id: 'evolutionary', name: 'Evolutionary Algorithms', level: 82, tier: 6, x: 350, y: 900, icon: '🔄' },
  ],
  links: [
    { from: 'python', to: 'dsa' },
    { from: 'python', to: 'git' },
    { from: 'python', to: 'ai' },
    { from: 'python', to: 'unity' },
    { from: 'dsa', to: 'problem-solving' },
    { from: 'git', to: 'api' },
    { from: 'ai', to: 'ml' },
    { from: 'ml', to: 'dl' },
    { from: 'dl', to: 'tensorflow' },
    { from: 'dl', to: 'pytorch' },
    { from: 'dl', to: 'neural-networks' },
    { from: 'neural-networks', to: 'vision' },
    { from: 'neural-networks', to: 'neat' },
    { from: 'neat', to: 'evolutionary' },
    { from: 'unity', to: 'unreal' },
  ]
}

export const ACHIEVEMENTS = [
  {
    id: 1,
    title: 'Atheriion 2K25',
    result: 'Winner',
    subtitle: 'Winner of the 24-hour hackathon.',
    date: '2025',
    type: 'Hackathon',
    icon: '🏆',
    image: '/h1.jpeg',
  },
  {
    id: 2,
    title: 'Code Sprint 2K45',
    result: 'Participant',
    subtitle: 'Participated in the 24-hour hackathon.',
    date: '2045',
    type: 'Hackathon',
    icon: '💻',
  },
  {
    id: 3,
    title: 'Code Sprint 2K25',
    result: 'Participant',
    subtitle: 'Participated in the 32-hour hackathon.',
    date: '2025',
    type: 'Hackathon',
    icon: '⏱️',
  },
  {
    id: 4,
    title: 'Solve-a-thon 2K26',
    result: 'Participant',
    subtitle: 'Participated in the Solve-a-thon 2K26.',
    date: '2026',
    type: 'Hackathon',
    icon: '🧩',
  },
  {
    id: 5,
    title: 'Mind of Dragons',
    result: 'Quiz Winner',
    subtitle: 'Winner of the Mind of Dragons Quiz Competition.',
    date: '2024',
    type: 'Competition',
    icon: '🧠',
    image: '/q1.jpeg',
  },
]

export const RESUME_DATA = {
  name: 'RUDRANARAYAN',
  contact: {
    location: 'Panambur, Mangalore',
    phone: '+91-6360671227',
    email: 'lluffy202005@gmail.com',
    linkedin: 'LinkedIn'
  },
  summary: 'Driven and adaptable aspiring AI engineer with hands-on experience in artificial intelligence projects, neural networks, and optimization systems. Passionate about solving real-world problems using AI-driven solutions. Experienced in hackathons, research-oriented internships, and collaborative development environments.',
  experience: [
    {
      title: 'Gen AI Engineer Intern',
      company: 'Akiyam Solutions Private Limited',
      date: 'Feb 2026 – Present',
      location: 'Remote',
      bullets: [
        'Researching and implementing Generative AI solutions.',
        'Working on AI-driven automation and intelligent system design.'
      ],
      tech: 'GenAI, LLMs, Automation, AI Engineering'
    },
    {
      title: 'Internship – NITK Surathkal',
      date: 'May 2025 – Aug 2025',
      location: 'Surathkal, Karnataka, India',
      bullets: [
        'Worked on Artificial Intelligence experiments in virtual labs.',
        'Built and tested deep learning models like CNN, ANN, and NEAT architectures.',
        'Learned full AI workflow: model design, training, testing, and evaluation.'
      ],
      tech: 'Python, TensorFlow, PyTorch, Neural Networks, AI'
    }
  ],
  academic: [
    {
      degree: 'Bachelor of Computer Applications (BCA)',
      spec: 'Artificial Intelligence',
      school: 'NITTE Institute of Professional Education'
    }
  ],
  certifications: [
    { name: 'Python', issuer: 'HackerRank' },
    { name: 'SQL & Databases', issuer: 'HackerRank' },
    { name: 'Computer Networks', issuer: 'Cisco' }
  ],
  skills: [
    'Python', 'Artificial Intelligence', 'Artificial Neural Networks (ANN)',
    'Convolutional Neural Networks (CNN)', 'NEAT (NeuroEvolution of Augmenting Topologies)',
    'Computer Vision', 'Evolutionary Algorithms'
  ],
  projects: [
    {
      name: 'Self-Driving AI Car',
      desc: 'Developed AI-based autonomous driving system with real-time decision making, navigation, and obstacle avoidance using Python and neural networks.'
    },
    {
      name: 'Self-Evolving Neural Network (Kingdom-Based)',
      desc: 'Designed self-evolving neural network with adaptive learning inspired by biological evolution using Python and evolutionary algorithms.'
    },
    {
      name: 'Sign Language Translator using CNN',
      desc: 'Built CNN-based sign language translator converting hand gestures to text using Python and computer vision.'
    },
    {
      name: 'Supply Chain Optimization Project',
      desc: 'Created AI-driven supply chain optimization system with predictive models and real-time dashboard using Python, machine learning, and Scikit-learn.'
    },
    {
      name: 'RAG Chatbot',
      desc: 'Developed a Retrieval-Augmented Generation (RAG) based chatbot enabling users to upload PDF documents and ask questions, using vector similarity search and a Large Language Model via OpenRouter for accurate answers.'
    }
  ]
}

export const TERMINAL_COMMANDS = {
  help: `Available commands:\n  about      — Who I am\n  skills     — Technical expertise\n  projects   — Things I've built\n  experience — Work history\n  contact    — Get in touch\n  clear      — Clear terminal\n  whoami     — Current user`,
  about: `> Rudranarayan\n> AI Developer · Game Developer · System Builder\n\n  Rudranarayan is a developer focused on building intelligent systems and experimental technology. His work combines generative AI, machine learning, and interactive systems.\n\n  He is interested in creating tools that automate tasks, simulate complex environments, and explore how AI can interact with digital worlds.\n\n  Along with AI development, he also works on game development and simulation systems, experimenting with Unreal Engine and AI-driven mechanics.`,
  experience: `> Work History Log:\n\n  01  Akiyam Solutions — Gen AI Engineer Intern (Current)\n  02  NITK Surathkal    — AI Research Intern (2025)\n\n  Type 'open experience' to view full terminal-styled dossier.`,
  skills: `> Core competencies (Node-base Analysis):\n\n  [██████████] Python AI      95%\n  [█████████░] Neural Systems 90%\n  [████████░░] Computer Vision 85%\n  [███████░░░] Game Dev       82%\n  \n  Type 'open skills' to view the interactive tree structure.`,
  projects: `> Recent work:\n\n  01  Memory NPC System — Vector-based AI persistence\n  02  Neural Agent      — NEAT-trained autonomous agents\n  03  ISL Translator    — Hand gesture to text (CNN)\n  04  Supply Optimizer  — AI Logistics & Forecasting\n  05  Self-Driving AI   — Computer Vision Navigation\n  06  RAG Chatbot       — PDF-based Knowledge Retrieval\n\n  Type 'open projects' to view immersive details`,
  contact: `> Reach me at:\n\n  Email     lluffy202005@gmail.com\n  Location  Panambur, Mangalore\n  LinkedIn  linkedin.com/in/rudranarayan`,
  whoami: `> admin@rudra-os ~ $ id\n  uid=0(root) gid=0(root)\n  groups=root,admin,ai-core`,
}


export const WINDOW_CONFIGS = {
  projects: { title: 'Projects',      icon: '📁', defaultSize: { w: 760, h: 500 }, defaultPos: { x: 120, y: 60 },  glowColor: '#00d4ff' },
  about:    { title: 'About.exe',     icon: '👾', defaultSize: { w: 620, h: 440 }, defaultPos: { x: 220, y: 100 }, glowColor: '#4ade80' },
  skills:   { title: 'Skills',        icon: '⚙️', defaultSize: { w: 660, h: 480 }, defaultPos: { x: 170, y: 80 },  glowColor: '#a78bfa' },
  achievements: { title: 'Achievements', icon: '🏆', defaultSize: { w: 680, h: 560 }, defaultPos: { x: 220, y: 80 },  glowColor: '#fbbf24' },
  resume:       { title: 'Resume',       icon: '📄', defaultSize: { w: 720, h: 600 }, defaultPos: { x: 150, y: 40 },  glowColor: '#00d4ff' },
  trash:        { title: 'Trash',         icon: '🗑️', defaultSize: { w: 520, h: 400 }, defaultPos: { x: 270, y: 130 }, glowColor: '#fb923c' },
  contact:  { title: 'Contact',       icon: '📨', defaultSize: { w: 580, h: 540 }, defaultPos: { x: 200, y: 70 },  glowColor: '#34d399' },
  game:     { title: 'Pathfinding AI',icon: '🧠', defaultSize: { w: 480, h: 620 }, defaultPos: { x: 300, y: 50 },  glowColor: '#00d4ff' },
  settings: { title: 'Settings',      icon: '⚙️', defaultSize: { w: 600, h: 500 }, defaultPos: { x: 250, y: 100 }, glowColor: '#e2e8f0' },
  explorer: { title: 'File System',   icon: '🗂️', defaultSize: { w: 700, h: 500 }, defaultPos: { x: 200, y: 60 },  glowColor: '#fbbf24' },
  experience: { title: 'Experience',   icon: '💼', defaultSize: { w: 700, h: 550 }, defaultPos: { x: 180, y: 50 },  glowColor: '#4ade80' },
}

export const DESKTOP_ICONS = [
  { key: 'projects', icon: '📁', label: 'Projects'     },
  { key: 'resume',       icon: '📄', label: 'Resume'       },
  { key: 'about',    icon: '👾', label: 'About.exe'    },
  { key: 'skills',   icon: '⚙️', label: 'Skills'       },
  { key: 'achievements', icon: '🏆', label: 'Achievements' },
  { key: 'trash',        icon: '🗑️', label: 'Trash'        },
  { key: 'contact',  icon: '📨', label: 'Contact'      },
  { key: 'game',     icon: '🧠', label: 'AI.exe'       },
  { key: 'settings', icon: '🛠️', label: 'Settings'     },
  { key: 'explorer', icon: '🗂️', label: 'Files'        },
  { key: 'experience', icon: '💼', label: 'Experience'   },
]
