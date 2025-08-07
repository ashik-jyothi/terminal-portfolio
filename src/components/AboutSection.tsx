import React from 'react';
import { Box, Text } from 'ink';
import { samplePortfolioData } from '../data/sample-portfolio.js';
import Section from './Section.js';

const AboutSection: React.FC = React.memo(() => {
  const { personal, education, certifications } = samplePortfolioData;

  return (
    <Section title="About Me">
      <Box flexDirection="column" gap={1}>
        {/* Name and Title */}
        <Box flexDirection="column" marginBottom={2}>
          <Box>
            <Text color="green" bold>
              👋 Hello, I'm {personal.name}
            </Text>
          </Box>
          <Box marginTop={1}>
            <Text color="blue" bold>
              {personal.title}
            </Text>
          </Box>
          <Box marginTop={1}>
            <Text color="gray">
              📍 {personal.location}
            </Text>
          </Box>
        </Box>

        {/* Bio Section */}
        <Box flexDirection="column" marginBottom={1}>
          <Box marginBottom={1}>
            <Text color="yellow" bold>
              About:
            </Text>
          </Box>
          <Box flexDirection="column" paddingLeft={2}>
            <Text wrap="wrap">
              {personal.bio}
            </Text>
          </Box>
        </Box>

        {/* Education Section */}
        <Box flexDirection="column" marginBottom={2}>
          <Box marginBottom={1}>
            <Text color="yellow" bold>
              🎓 Education:
            </Text>
          </Box>
          <Box flexDirection="column" paddingLeft={2}>
            {education.map((edu) => (
              <Box key={edu.institution} flexDirection="column" marginBottom={1}>
                <Text color="blue" bold>
                  {edu.degree}
                </Text>
                <Text color="gray">
                  {edu.institution} • {edu.duration}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Certifications Section */}
        <Box flexDirection="column" marginBottom={2}>
          <Box marginBottom={1}>
            <Text color="yellow" bold>
              📜 Certifications:
            </Text>
          </Box>
          <Box flexDirection="column" paddingLeft={2}>
            {certifications.map((cert) => (
              <Box key={cert.name} flexDirection="column" marginBottom={1}>
                <Text color="blue">
                  {cert.name}
                </Text>
                <Text color="gray">
                  {cert.issuer} • {cert.year}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Decorative footer */}
        <Box marginTop={2}>
          <Text color="cyan" dimColor>
            ✨ Welcome to my terminal portfolio! Navigate with arrow keys or numbers.
          </Text>
        </Box>
      </Box>
    </Section>
  );
});

AboutSection.displayName = 'AboutSection';

export default AboutSection;