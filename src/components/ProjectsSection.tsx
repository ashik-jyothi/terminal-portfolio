import React from 'react';
import { Box, Text } from 'ink';
import { samplePortfolioData } from '../data/sample-portfolio.js';
import Section from './Section.js';

const ProjectsSection: React.FC = React.memo(() => {
  const { projects } = samplePortfolioData;

  return (
    <Section title="Projects">
      <Box flexDirection="column" gap={1}>
        {projects.map((project, index) => (
          <Box key={project.name} flexDirection="column" marginBottom={3}>
            {/* Project Header */}
            <Box flexDirection="column" marginBottom={1}>
              <Box>
                <Text color="green" bold>
                  🚀 {project.name}
                </Text>
              </Box>
              <Box marginTop={1} paddingLeft={2}>
                <Text wrap="wrap">
                  {project.description}
                </Text>
              </Box>
            </Box>

            {/* Technologies */}
            <Box flexDirection="column" marginBottom={1} paddingLeft={2}>
              <Box marginBottom={1}>
                <Text color="yellow" bold>
                  Technologies:
                </Text>
              </Box>
              <Box flexWrap="wrap" flexDirection="row">
                {project.technologies.map((tech) => (
                  <Box key={tech} marginRight={2} marginBottom={1}>
                    <Text color="blue">
                      [{tech}]
                    </Text>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Highlights */}
            <Box flexDirection="column" marginBottom={1} paddingLeft={2}>
              <Box marginBottom={1}>
                <Text color="yellow" bold>
                  Key Features:
                </Text>
              </Box>
              <Box flexDirection="column">
                {project.highlights.map((highlight) => (
                  <Box key={highlight} marginBottom={1}>
                    <Text color="gray">
                      ✓ {highlight}
                    </Text>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Links */}
            <Box flexDirection="column" paddingLeft={2}>
              <Box marginBottom={1}>
                <Text color="yellow" bold>
                  Links:
                </Text>
              </Box>
              <Box flexDirection="column">
                {project.githubUrl && (
                  <Box marginBottom={1}>
                    <Text color="cyan">
                      📂 Repository: {project.githubUrl}
                    </Text>
                  </Box>
                )}
                {project.liveUrl && (
                  <Box marginBottom={1}>
                    <Text color="cyan">
                      🌐 Live Demo: {project.liveUrl}
                    </Text>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Visual separation between projects */}
            {index < projects.length - 1 && (
              <Box marginTop={2}>
                <Text color="gray" dimColor>
                  {'═'.repeat(50)}
                </Text>
              </Box>
            )}
          </Box>
        ))}
        
        {/* Footer message */}
        <Box marginTop={2}>
          <Text color="cyan" dimColor>
            🔗 Links are copyable from your terminal for easy access!
          </Text>
        </Box>
      </Box>
    </Section>
  );
});

ProjectsSection.displayName = 'ProjectsSection';

export default ProjectsSection;