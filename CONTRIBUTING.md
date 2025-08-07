# Contributing to Terminal Portfolio

Thank you for your interest in contributing to Terminal Portfolio! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues
- Use the [GitHub Issues](https://github.com/ashik-jyothi/terminal-portfolio/issues) page
- Search existing issues before creating a new one
- Provide detailed information including:
  - Operating system and terminal type
  - Node.js version
  - Steps to reproduce
  - Expected vs actual behavior
  - Screenshots if applicable

### Suggesting Features
- Open an issue with the "enhancement" label
- Describe the feature and its use case
- Explain how it would benefit users
- Consider implementation complexity

### Code Contributions

#### Development Setup
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/terminal-portfolio.git
   cd terminal-portfolio
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

#### Development Workflow
1. Make your changes
2. Run tests:
   ```bash
   npm test
   ```
3. Check TypeScript types:
   ```bash
   npm run typecheck
   ```
4. Build the project:
   ```bash
   npm run build
   ```
5. Test the built version:
   ```bash
   npm start
   ```

#### Code Style Guidelines
- **TypeScript**: Use TypeScript for all new code
- **Formatting**: Code is automatically formatted with Prettier
- **Linting**: Follow ESLint rules
- **Components**: Use React.memo for performance optimization
- **Hooks**: Follow React hooks best practices
- **Testing**: Write tests for new functionality

#### Commit Guidelines
We follow conventional commits:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions or modifications
- `chore:` - Build process or auxiliary tool changes

Example:
```
feat: add new navigation shortcut for quick section access
fix: resolve terminal resize issue on Windows
docs: update README with installation instructions
```

#### Pull Request Process
1. Ensure your code follows the style guidelines
2. Update documentation if needed
3. Add tests for new functionality
4. Ensure all tests pass
5. Update the README if you've added features
6. Create a pull request with:
   - Clear title and description
   - Reference any related issues
   - Screenshots/demos if applicable

## 🏗️ Project Structure

```
terminal-portfolio/
├── src/
│   ├── components/          # React components
│   │   ├── __tests__/      # Component tests
│   │   └── *.tsx           # Component files
│   ├── hooks/              # Custom React hooks
│   │   ├── __tests__/      # Hook tests
│   │   └── *.ts            # Hook files
│   ├── utils/              # Utility functions
│   │   ├── __tests__/      # Utility tests
│   │   └── *.ts            # Utility files
│   ├── types/              # TypeScript definitions
│   ├── data/               # Portfolio data
│   └── index.tsx           # Entry point
├── scripts/                # Build scripts
├── __tests__/              # Integration tests
└── package.json
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test:run src/components/__tests__/Navigation.test.tsx

# Run tests with coverage
npm run test:coverage
```

### Test Types
- **Unit Tests**: Individual component/function testing
- **Integration Tests**: Component interaction testing
- **Performance Tests**: Optimization verification
- **Build Tests**: Production build validation

### Writing Tests
- Use Vitest for testing framework
- Use ink-testing-library for component testing
- Mock external dependencies appropriately
- Test both happy path and edge cases
- Maintain good test coverage

## 🎨 Design Guidelines

### Terminal UI Principles
- **Responsive**: Adapt to different terminal sizes
- **Accessible**: Work with various terminal capabilities
- **Performant**: Optimize for smooth navigation
- **Intuitive**: Clear navigation and feedback

### Color Usage
- Use semantic colors (green for success, red for errors)
- Provide fallbacks for terminals without color support
- Test with different terminal themes

### Typography
- Use Unicode characters with ASCII fallbacks
- Ensure readability in various terminal fonts
- Consider character width variations

## 🚀 Performance Guidelines

### Optimization Principles
- Use React.memo for component memoization
- Implement debounced state updates
- Optimize terminal redraws
- Monitor bundle size

### Performance Testing
- Test startup time
- Monitor memory usage
- Verify smooth navigation
- Check terminal responsiveness

## 📚 Documentation

### Code Documentation
- Use JSDoc comments for functions
- Document complex logic
- Explain performance optimizations
- Include usage examples

### README Updates
- Keep installation instructions current
- Update feature lists
- Maintain accurate screenshots
- Include troubleshooting tips

## 🐛 Debugging

### Common Issues
- Terminal compatibility problems
- Unicode rendering issues
- Performance bottlenecks
- Navigation glitches

### Debugging Tools
- Use performance monitoring utilities
- Enable development logging
- Test in different terminals
- Use React DevTools for Ink

## 📝 License

By contributing to Terminal Portfolio, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes for significant contributions
- README acknowledgments section

## 📞 Getting Help

- Open an issue for questions
- Join discussions in GitHub Discussions
- Contact maintainers for complex issues

Thank you for contributing to Terminal Portfolio! 🚀