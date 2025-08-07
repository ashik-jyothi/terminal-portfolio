# 🚀 Terminal Portfolio

An interactive terminal-based portfolio application built with React Ink. Experience a unique way to explore professional information through a beautiful command-line interface.

![Terminal Portfolio Demo](https://img.shields.io/badge/Terminal-Portfolio-brightgreen?style=for-the-badge&logo=terminal)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

## ✨ Features

- 🖥️ **Interactive Terminal UI** - Navigate through sections using keyboard shortcuts
- ⚡ **Performance Optimized** - Built with React.memo and optimized rendering
- 🎨 **Terminal Adaptive** - Responsive design that adapts to terminal dimensions
- 🔧 **Cross-Platform** - Works on Linux, macOS, and Windows
- 📱 **Responsive** - Adapts to different terminal sizes and capabilities
- 🎯 **Keyboard Navigation** - Full keyboard support with vim-style navigation
- 🚀 **Fast Startup** - Optimized for quick loading and smooth performance
- 🛡️ **Type Safe** - Built with TypeScript for reliability

## 🎮 Navigation

### Keyboard Shortcuts
- **Arrow Keys** or **HJKL (Vim)** - Navigate between sections
- **Numbers 1-6** - Quick section access
  - `1` - Home
  - `2` - About
  - `3` - Experience
  - `4` - Skills
  - `5` - Projects
  - `6` - Contact
- **G** - Jump to first section (Home)
- **Shift+G** - Jump to last section (Contact)
- **Q / ESC / Ctrl+C** - Exit application

## 📋 Sections

### 🏠 Home
Welcome screen with navigation overview and terminal capabilities information.

### 👨‍💻 About
Personal introduction, education, and certifications.

### 💼 Experience
Detailed work history including:
- **QBurst** - Lead Engineer (2022-Present)
- **VIZRU** - Senior Software Engineer (2017-2022)
- **Irisind** - Software Engineer (2017)

### 🛠️ Skills
Technical expertise organized by categories:
- Programming Languages
- Libraries/Frameworks
- Tools & Technologies
- Databases
- Cloud Services

### 🚀 Projects
Portfolio of professional projects and achievements from enterprise work.

### 📞 Contact
Contact information and social media links.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Terminal with Unicode support (recommended)

### Installation & Usage

```bash
# Clone the repository
git clone https://github.com/ashik-jyothi/terminal-portfolio.git
cd terminal-portfolio

# Install dependencies
npm install

# Run in development mode
npm run dev

# Or build and run production version
npm run build
npm start
```

### Global Installation

```bash
# Install globally
npm install -g terminal-portfolio

# Run from anywhere
terminal-portfolio
```

### NPX Usage

```bash
# Run directly without installation
npx terminal-portfolio
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm test             # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:build   # Test the build

# Type Checking
npm run typecheck    # Check TypeScript types

# Utilities
npm run clean        # Clean build directory
```

### Project Structure

```
terminal-portfolio/
├── src/
│   ├── components/          # React components
│   │   ├── AboutSection.tsx
│   │   ├── ExperienceSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── ContactSection.tsx
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── data/               # Portfolio data
│   └── index.tsx           # Application entry point
├── scripts/                # Build and deployment scripts
└── package.json
```

## 🎨 Customization

### Portfolio Data
Edit `src/data/sample-portfolio.ts` to customize the portfolio content:

```typescript
export const samplePortfolioData: PortfolioData = {
  personal: {
    name: 'Your Name',
    title: 'Your Title',
    bio: 'Your bio...',
    location: 'Your Location'
  },
  experience: [
    // Your work experience
  ],
  skills: [
    // Your skills
  ],
  projects: [
    // Your projects
  ],
  contact: {
    // Your contact info
  }
};
```

### Styling
The application uses Ink's built-in styling. Colors and layouts can be customized in individual components.

### Terminal Capabilities
The app automatically detects and adapts to terminal capabilities:
- Unicode support
- Color support
- Terminal dimensions
- Resize handling

## 🏗️ Architecture

### Performance Optimizations
- **React.memo** - Prevents unnecessary re-renders
- **Debounced State Updates** - Smooth navigation experience
- **Optimized Terminal Redraws** - Efficient screen updates
- **Lazy Loading** - Components loaded on demand
- **Performance Monitoring** - Built-in performance tracking

### Key Technologies
- **React Ink** - React for terminal interfaces
- **TypeScript** - Type safety and better DX
- **Vite** - Fast build tool and dev server
- **Vitest** - Testing framework
- **Node.js** - Runtime environment

## 🧪 Testing

The project includes comprehensive tests:

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:run src/__tests__/PerformanceOptimization.test.tsx
npm run test:run src/components/__tests__/
```

### Test Coverage
- Component rendering tests
- Navigation functionality tests
- Performance optimization tests
- Integration tests
- Terminal responsiveness tests

## 📦 Build & Deployment

### Building for Production

```bash
npm run build
```

This creates optimized bundles in the `dist/` directory:
- `dist/index.js` - Main application entry point
- Optimized for Node.js runtime
- Minified and tree-shaken

### Bundle Analysis
- **Main Bundle**: ~45KB (9.7KB gzipped)
- **Startup Time**: <300ms
- **Memory Usage**: Optimized for terminal environments

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/amazing-feature`
5. Make your changes
6. Run tests: `npm test`
7. Build: `npm run build`
8. Commit: `git commit -m 'Add amazing feature'`
9. Push: `git push origin feature/amazing-feature`
10. Open a Pull Request

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Conventional commits preferred

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ashik Jyothi**
- Lead Full Stack Engineer
- 8+ years of experience in enterprise applications
- Specialized in React, Angular, Node.js, and cloud architecture

### Connect with me:
- 🌐 **Website**: [dev.ashikjyothi.in](https://dev.ashikjyothi.in)
- 💼 **LinkedIn**: [linkedin.com/in/ashikjyothi](https://linkedin.com/in/ashikjyothi)
- 🐙 **GitHub**: [github.com/ashik-jyothi](https://github.com/ashik-jyothi)
- 📧 **Email**: ashikjyothi@gmail.com
- 📱 **Phone**: +91 9846764778

## 🙏 Acknowledgments

- [React Ink](https://github.com/vadimdemedes/ink) - For making React work in terminals
- [Vite](https://vitejs.dev/) - For the amazing build tool
- [TypeScript](https://www.typescriptlang.org/) - For type safety
- The open source community for inspiration and tools

## 🌟 Show Your Support

If you found this project interesting or useful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🤝 Contributing to the code
- 📢 Sharing with others

---

<div align="center">

**Built with ❤️ using React Ink and TypeScript**

*Experience the future of terminal-based portfolios*

</div>