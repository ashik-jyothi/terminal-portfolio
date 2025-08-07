/**
 * Sample portfolio data
 * Demonstrates the portfolio data structure and serves as a template
 */

import type { PortfolioData } from '../types/portfolio.js';

export const samplePortfolioData: PortfolioData = {
  personal: {
    name: 'Ashik Jyothi',
    title: 'Lead Full Stack Engineer',
    bio: 'Lead Full Stack Engineer with 8+ years of experience building scalable enterprise applications using Javascript frameworks. Specialized in React, Angular, Node.js, NestJS, and Express. Proven leadership in delivering high-performance solutions, with strong expertise in cloud architecture and microservices.',
    location: 'Kozhikode, Kerala'
  },
  experience: [
    {
      company: 'QBurst',
      position: 'Lead Engineer',
      duration: 'January 2022 - Present',
      location: 'Kozhikode, Kerala',
      description: 'Leading development of the CAT (Config Automation Tool) module in the SMARTShip platform for maritime enterprises, streamlining onboarding of new vessels by automating tag configuration—reducing manual effort by 70%.',
      achievements: [
        'Leading development of CAT module reducing manual effort by 70%',
        'Built interactive Angular-based map UI using OpenLayers for vessel route visualization',
        'Developed NodeJS backend APIs for voyage lifecycle management',
        'Created dynamic formula editor with real-time validation',
        'Architected microservices using NodeJS and NestJS with Apache Cassandra',
        'Integrated Keycloak for authentication and role-based authorization',
        'Collaborated with cross-functional teams in Agile sprints'
      ],
      technologies: ['Angular', 'NodeJS', 'NestJS', 'Apache Cassandra', 'OpenLayers', 'Keycloak']
    },
    {
      company: 'VIZRU (Invigo Softwares Pvt Ltd)',
      position: 'Senior Software Engineer',
      duration: 'August 2017 - January 2022',
      location: 'Kozhikode, Kerala',
      description: 'Developed scalable microservices and real-time systems for Vizru\'s low-code/no-code platform, including PDF generation services, chat systems, and form builders.',
      achievements: [
        'Built scalable NodeJS microservice for automated PDF generation using Puppeteer',
        'Architected real-time chat system using Socket.io and Redis clustering',
        'Developed dynamic form builder with drag-and-drop functionality',
        'Created centralized real-time communication infrastructure',
        'Implemented multi-tenant architecture with JWT authentication',
        'Built enterprise-grade PDF processing pipeline with advanced features'
      ],
      technologies: ['NodeJS', 'ReactJS', 'Socket.io', 'Redis', 'Puppeteer', 'JWT', 'Multi-tenant Architecture']
    },
    {
      company: 'Irisind',
      position: 'Software Engineer',
      duration: 'January 2017 - July 2017',
      location: 'Muvattupuzha, Kerala',
      description: 'Developed client-side applications and marketing websites for CRM platforms, focusing on dynamic dashboards and interactive interfaces.',
      achievements: [
        'Built AngularJS controllers and services for dynamic dashboards',
        'Created interactive agent interfaces with call progress monitoring',
        'Developed live campaign management and call disposition workflows',
        'Built full-stack marketing website for AVOS CRM platform',
        'Developed corporate website for 4Amigos IT services company',
        'Ensured seamless data flow between frontend and backend systems'
      ],
      technologies: ['AngularJS', 'NodeJS', 'MySQL', 'HTML5', 'CSS3', 'Javascript', 'Express']
    }
  ],
  education: [
    {
      institution: 'HMS Institute of Technology',
      degree: 'Bachelor of Engineering (Computer Science)',
      duration: 'March 2010 - March 2016'
    }
  ],
  certifications: [
    {
      name: 'Kubernetes Administration and Implementation',
      issuer: 'Udemy',
      year: '2022'
    }
  ],
  skills: [
    {
      category: 'Programming Languages',
      skills: ['Javascript', 'Typescript', 'Python']
    },
    {
      category: 'Libraries/Frameworks',
      skills: ['Node.js', 'NestJS', 'Express', 'Next.js', 'React', 'Redux', 'Angular', 'Tailwind CSS', 'Bootstrap', 'Jest', 'GraphQL']
    },
    {
      category: 'Tools',
      skills: ['Docker', 'Kubernetes', 'Helm', 'Terraform', 'Git', 'Vite', 'Webpack', 'Jira', 'Agile methodologies']
    },
    {
      category: 'Database',
      skills: ['Cassandra', 'MongoDB', 'SQL', 'Redis']
    },
    {
      category: 'Cloud Services',
      skills: ['AWS (S3, EC2, Lambda, SQS)', 'GCP']
    },
    {
      category: 'Operating Systems',
      skills: ['Linux']
    }
  ],
  projects: [
    {
      name: 'SMARTShip CAT Module',
      description: 'Leading development of the CAT (Config Automation Tool) module in the SMARTShip platform for maritime enterprises, streamlining onboarding of new vessels by automating tag configuration—reducing manual effort by 70%.',
      technologies: ['Angular', 'NodeJS', 'NestJS', 'Apache Cassandra', 'Keycloak'],
      highlights: [
        'Automated vessel onboarding reducing manual effort by 70%',
        'Dynamic formula editor with real-time validation',
        'Microservices architecture with scalable data storage',
        'Integration with Keycloak for authentication and authorization',
        'Collaborative development within Agile sprints'
      ]
    },
    {
      name: 'TFOC Interactive Map UI',
      description: 'Designed and built an interactive Angular-based map UI using OpenLayers to visualize vessel routes (planned vs forecasted) for the TFOC (Total Fuel Oil Consumption) module.',
      technologies: ['Angular', 'OpenLayers', 'NodeJS', 'Apache Cassandra'],
      highlights: [
        'Interactive map visualization for vessel routes',
        'Real-time comparison of planned vs forecasted routes',
        'Integration with voyage lifecycle management APIs',
        'Optimized performance for maritime data visualization',
        'Enhanced user experience for maritime operations'
      ]
    },
    {
      name: 'Vizru PDF Generation Service',
      description: 'Developed a scalable NodeJS microservice for automated PDF generation from Vizru dashboards using Puppeteer and Redis-based job queuing, processing complex multi-tab visualizations.',
      technologies: ['NodeJS', 'Puppeteer', 'Redis', 'PDF Processing'],
      highlights: [
        'Automated PDF generation from complex dashboards',
        'Redis-based job queuing for scalable processing',
        'Advanced features: pagination, watermarking, merge functionality',
        'Cloud file upload integration',
        'Comprehensive error handling and debugging support'
      ]
    },
    {
      name: 'Real-time Chat System',
      description: 'Architected and developed a scalable real-time chat system using Socket.io, Redis clustering, and JWT authentication for Vizru\'s low-code/no-code workflow builder platform.',
      technologies: ['Socket.io', 'Redis', 'JWT', 'NodeJS', 'Multi-tenant Architecture'],
      highlights: [
        'Real-time communication with Socket.io and Redis clustering',
        'Multi-tenant architecture with guest-admin interactions',
        'Pluggable chatbot integration capabilities',
        'Automated workflow triggering from chat interactions',
        'Centralized infrastructure for platform-wide real-time features'
      ]
    },
    {
      name: 'Dynamic Form Builder',
      description: 'Built a dynamic form builder using ReactJS for Vizru\'s low-code/no-code platform, enabling drag-and-drop form construction with multi-layout templates and wizard workflows.',
      technologies: ['ReactJS', 'Drag-and-Drop', 'Form Validation', 'Workflow Engine'],
      highlights: [
        'Drag-and-drop form construction interface',
        'Multi-layout templates and wizard workflows',
        'Real-time validation and conditional field rendering',
        'Workflow-driven form behavior',
        'Integration with low-code/no-code platform ecosystem'
      ]
    },
    {
      name: 'AVOS CRM Marketing Platform',
      description: 'Developed AngularJS controllers and services for dynamic dashboards and interactive agent interfaces, including call progress monitoring and campaign management.',
      technologies: ['AngularJS', 'NodeJS', 'MySQL', 'Real-time APIs'],
      highlights: [
        'Dynamic dashboards with real-time call monitoring',
        'Interactive agent interfaces for campaign management',
        'Call disposition submission workflows',
        'Seamless data flow between frontend and backend',
        'Agile development practices for rapid feature delivery'
      ]
    }
  ],
  contact: {
    email: 'ashikjyothi@gmail.com',
    website: 'https://dev.ashikjyothi.in',
    social: [
      {
        platform: 'LinkedIn',
        url: 'https://linkedin.com/in/ashikjyothi',
        username: 'ashikjyothi'
      },
      {
        platform: 'GitHub',
        url: 'https://github.com/ashik-jyothi',
        username: 'ashik-jyothi'
      },
      {
        platform: 'Portfolio',
        url: 'https://dev.ashikjyothi.in',
        username: 'dev.ashikjyothi.in'
      },
      {
        platform: 'Phone',
        url: 'tel:+919846764778',
        username: '+91 9846764778'
      }
    ]
  }
};