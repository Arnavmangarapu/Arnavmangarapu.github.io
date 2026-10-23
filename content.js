// Add a project object to this array to create another scroll-through project.
// Use null for missing links. They are displayed as explicit placeholders.
window.portfolio = {
  projects: [
    {
      id: 'helivision', title: 'HELIVISION', year: '2025', category: 'Computer vision / Embedded systems',
      headline: 'A second set of eyes.\nA new sense of direction.',
      description: 'A smart helmet for partially visually impaired riders, bringing real-time vehicle detection and directional assistance to a Raspberry Pi.',
      tags: ['Raspberry Pi', 'TensorFlow Lite', 'Picamera2'],
      repository: 'https://github.com/Arnavmangarapu/helivision', demo: null,
      details: ['Developed an embedded computer vision pipeline using TensorFlow Lite for real-time vehicle detection and directional assistance.', 'Integrated Raspberry Pi, I2C OLED displays and optimised models for low-latency inference on resource-constrained hardware.', 'Migrated the camera pipeline to Picamera2, resolving OS compatibility issues and restoring reliable real-time inference.'],
      visual: 'vision', image: null
    },
    {
      id: 'streamwatch', title: 'STREAMWATCH', year: '2025', category: 'Full-stack / Infrastructure',
      headline: 'See the system.\nUnderstand the signal.',
      description: 'A database workspace combining natural-language MongoDB queries, secure account access and system monitoring.',
      tags: ['React', 'FastAPI', 'MongoDB', 'Gemini', 'Prometheus', 'Grafana'],
      repository: 'https://github.com/Arnavmangarapu/streamwatch', demo: null,
      details: ['Built a full-stack observability platform with React, Node.js, Express, Prometheus and Grafana.', 'Configured Prometheus scrape pipelines and MongoDB Exporters on Linux to collect, aggregate and visualise operational metrics.', 'Diagnosed and resolved distributed service communication failures across the observability stack.'],
      visual: 'monitor', image: null
    },
    {
      id: 'srdc', title: 'SRDC', year: '2026', category: 'Cybersecurity / Machine learning',
      headline: 'Understanding behaviour.\nDetecting the threat.',
      description: 'Semantics-based ransomware detection using GPT-2, translating system behaviour into language for transformer-based learning.',
      tags: ['Python', 'GPT-2', 'Hugging Face Transformers'],
      repository: 'https://github.com/Arnavmangarapu/SRDC-Ransomware-Detection', demo: null,
      details: ['Converted Windows API, registry, file-system and behavioural logs into semantic text for transformer-based learning.', 'Implemented preprocessing and feature engineering workflows in Python for behaviour-based malware analysis.', 'Fine-tuned GPT-2 with Hugging Face Transformers to generate semantic representations for ransomware classification.'],
      visual: 'security', image: null
    }
  ],
  skills: [
    ['Languages', ['Python', 'Java', 'C++', 'JavaScript', 'SQL']],
    ['Web & backend', ['React', 'Node.js', 'Express', 'FastAPI']],
    ['AI & machine learning', ['TensorFlow', 'CNN', 'ANN']],
    ['Data & observability', ['MongoDB', 'Prometheus', 'Grafana']],
    ['Developer tools', ['Git', 'GitHub', 'Docker', 'Linux']],
    ['Embedded systems', ['Raspberry Pi', 'Picamera2']],
    ['CS foundations', ['Data Structures', 'OOP', 'Operating Systems', 'DBMS', 'Computer Networks']]
  ]
};
