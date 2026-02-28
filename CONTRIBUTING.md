# Contributing to Sofinlearn

Thank you for your interest in contributing to Sofinlearn! 🎉

## How to Contribute

### Reporting Bugs 🐛

If you find a bug, please create an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser/device information

### Suggesting Features 💡

We welcome feature suggestions! Please:
- Check if the feature already exists
- Describe the feature clearly
- Explain why it would be useful
- Provide examples if possible

### Code Contributions 🔧

1. **Fork the repository**
   ```bash
   git clone https://github.com/sofinco/sofinlearn.git
   cd sofinlearn
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Make your changes**
   - Follow the existing code style
   - Write clean, readable code
   - Test your changes thoroughly

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

6. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Guidelines

Use conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### Adding New Quiz Questions

To add questions to existing topics:

1. Edit `src/lib/quizData.ts`
2. Add questions to both `en` and `id` languages
3. Follow the existing format:
   ```typescript
   {
     question: 'Your question?',
     options: ['Option A', 'Option B', 'Option C', 'Option D'],
     correctIndex: 0 // Index of correct answer (0-3)
   }
   ```

### Adding New Topics/Levels

1. Update `src/lib/gameState.ts` - Add to LEVELS array
2. Update `src/lib/quizData.ts` - Add topic to TopicKey and questions
3. Update `src/lib/i18n.ts` - Add translations for topic name

### Code Style

- Use TypeScript
- Use functional components with hooks
- Follow existing naming conventions
- Keep components small and focused
- Add comments for complex logic

### Testing

Before submitting:
- Test all features work correctly
- Test on different screen sizes
- Test in different browsers
- Check console for errors
- Verify no TypeScript errors: `npm run build`

### Translation Contributions

Help us translate to more languages:
1. Copy existing translations in `src/lib/i18n.ts`
2. Add new language code
3. Translate all strings
4. Update Language type

### Need Help?

- Check existing issues and discussions
- Ask questions in issues
- Be respectful and patient

## Code of Conduct

- Be respectful and inclusive
- No harassment or discrimination
- Focus on constructive feedback
- Help create a welcoming environment

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for making Sofinlearn better! 🚀**

Made with ❤️ by Sofinco
