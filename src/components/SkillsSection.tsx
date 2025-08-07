import React from 'react';
import { Box, Text } from 'ink';
import { samplePortfolioData } from '../data/sample-portfolio.js';
import Section from './Section.js';

const SkillsSection: React.FC = React.memo(() => {
  const { skills } = samplePortfolioData;

  return (
    <Section title="Technical Skills">
      <Box flexDirection="column" gap={1}>
        {skills.map((skillCategory, index) => (
          <Box key={skillCategory.category} flexDirection="column" marginBottom={2}>
            {/* Category Header */}
            <Box marginBottom={1}>
              <Text color="green" bold>
                🔧 {skillCategory.category}
              </Text>
            </Box>
            
            {/* Skills List */}
            <Box flexDirection="column" paddingLeft={2}>
              <Box flexWrap="wrap" flexDirection="row">
                {skillCategory.skills.map((skill) => (
                  <Box key={skill} marginRight={2} marginBottom={1}>
                    <Text color="blue">
                      • {skill}
                    </Text>
                  </Box>
                ))}
              </Box>
            </Box>
            
            {/* Visual separation between categories */}
            {index < skills.length - 1 && (
              <Box marginTop={1}>
                <Text color="gray" dimColor>
                  {'─'.repeat(30)}
                </Text>
              </Box>
            )}
          </Box>
        ))}
        
        {/* Footer message */}
        <Box marginTop={2}>
          <Text color="cyan" dimColor>
            💡 Always learning and exploring new technologies!
          </Text>
        </Box>
      </Box>
    </Section>
  );
});

SkillsSection.displayName = 'SkillsSection';

export default SkillsSection;