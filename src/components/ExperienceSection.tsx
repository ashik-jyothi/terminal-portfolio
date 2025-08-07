import React from 'react';
import { Box, Text } from 'ink';
import { samplePortfolioData } from '../data/sample-portfolio.js';
import Section from './Section.js';

const ExperienceSection: React.FC = React.memo(() => {
  const { experience } = samplePortfolioData;

  return (
    <Section title="Work Experience">
      <Box flexDirection="column" gap={1}>
        {experience.map((job, index) => (
          <Box key={`${job.company}-${job.position}`} flexDirection="column" marginBottom={3}>
            {/* Job Header */}
            <Box flexDirection="column" marginBottom={1}>
              <Box>
                <Text color="green" bold>
                  💼 {job.position}
                </Text>
              </Box>
              <Box marginTop={1}>
                <Text color="blue" bold>
                  {job.company} • {job.duration}
                </Text>
              </Box>
              <Box marginTop={1}>
                <Text color="gray">
                  📍 {job.location}
                </Text>
              </Box>
            </Box>

            {/* Job Description */}
            <Box flexDirection="column" marginBottom={1} paddingLeft={2}>
              <Box marginBottom={1}>
                <Text color="yellow" bold>
                  Overview:
                </Text>
              </Box>
              <Box>
                <Text wrap="wrap">
                  {job.description}
                </Text>
              </Box>
            </Box>

            {/* Key Achievements */}
            <Box flexDirection="column" marginBottom={1} paddingLeft={2}>
              <Box marginBottom={1}>
                <Text color="yellow" bold>
                  Key Achievements:
                </Text>
              </Box>
              <Box flexDirection="column">
                {job.achievements.map((achievement) => (
                  <Box key={achievement} marginBottom={1}>
                    <Text color="gray">
                      ✓ {achievement}
                    </Text>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Technologies Used */}
            {job.technologies && job.technologies.length > 0 && (
              <Box flexDirection="column" paddingLeft={2}>
                <Box marginBottom={1}>
                  <Text color="yellow" bold>
                    Technologies:
                  </Text>
                </Box>
                <Box flexWrap="wrap" flexDirection="row">
                  {job.technologies.map((tech) => (
                    <Box key={tech} marginRight={2} marginBottom={1}>
                      <Text color="blue">
                        [{tech}]
                      </Text>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Visual separation between jobs */}
            {index < experience.length - 1 && (
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
            🚀 8+ years of experience building scalable enterprise applications
          </Text>
        </Box>
      </Box>
    </Section>
  );
});

ExperienceSection.displayName = 'ExperienceSection';

export default ExperienceSection;