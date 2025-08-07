import React from 'react';
import { Box, Text } from 'ink';
import { samplePortfolioData } from '../data/sample-portfolio.js';
import Section from './Section.js';

const SkillsSection: React.FC = React.memo(() => {
  const { skills } = samplePortfolioData;

  return (
    <Section title="Technical Skills">
      <Box flexDirection="column" gap={1} alignItems="center">
        {skills.map((skillCategory, index) => (
          <Box key={skillCategory.category} flexDirection="column" marginBottom={2} alignItems="center">
            {/* Category Header */}
            <Box marginBottom={1}>
              <Text color="green" bold>
                🔧 {skillCategory.category}
              </Text>
            </Box>
            
            {/* Skills List */}
            <Box flexDirection="column" alignItems="center">
              <Box flexWrap="wrap" flexDirection="row" justifyContent="center">
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
              <Box marginTop={1} justifyContent="center">
                <Text color="gray" dimColor>
                  {'─'.repeat(30)}
                </Text>
              </Box>
            )}
          </Box>
        ))}
        
        {/* Footer message */}
        <Box marginTop={2} justifyContent="center">
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