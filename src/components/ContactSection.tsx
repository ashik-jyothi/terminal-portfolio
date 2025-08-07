import React from 'react';
import { Box, Text } from 'ink';
import { samplePortfolioData } from '../data/sample-portfolio.js';
import Section from './Section.js';

const ContactSection: React.FC = React.memo(() => {
  const { contact } = samplePortfolioData;

  return (
    <Section title="Contact Information">
      <Box flexDirection="column" gap={1}>
        {/* Email */}
        <Box flexDirection="column" marginBottom={2}>
          <Box marginBottom={1}>
            <Text color="green" bold>
              📧 Email
            </Text>
          </Box>
          <Box paddingLeft={2}>
            <Text color="cyan">
              {contact.email}
            </Text>
          </Box>
        </Box>

        {/* Website */}
        {contact.website && (
          <Box flexDirection="column" marginBottom={2}>
            <Box marginBottom={1}>
              <Text color="green" bold>
                🌐 Website
              </Text>
            </Box>
            <Box paddingLeft={2}>
              <Text color="cyan">
                {contact.website}
              </Text>
            </Box>
          </Box>
        )}

        {/* Social Media */}
        <Box flexDirection="column" marginBottom={2}>
          <Box marginBottom={1}>
            <Text color="green" bold>
              🔗 Social Media
            </Text>
          </Box>
          <Box flexDirection="column" paddingLeft={2}>
            {contact.social.map((social) => (
              <Box key={social.platform} marginBottom={1}>
                <Box flexDirection="row" alignItems="center">
                  <Box marginRight={2}>
                    <Text color="yellow" bold>
                      {social.platform}:
                    </Text>
                  </Box>
                  <Box>
                    <Text color="cyan">
                      @{social.username}
                    </Text>
                  </Box>
                </Box>
                <Box paddingLeft={4} marginTop={1}>
                  <Text color="gray" dimColor>
                    {social.url}
                  </Text>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Contact Instructions */}
        <Box marginTop={2}>
          <Text color="gray" dimColor>
            {'─'.repeat(40)}
          </Text>
        </Box>
        
        <Box flexDirection="column" marginTop={2}>
          <Box marginBottom={1}>
            <Text color="yellow" bold>
              💬 Let's Connect!
            </Text>
          </Box>
          <Box flexDirection="column" paddingLeft={2}>
            <Text wrap="wrap">
              Feel free to reach out via email or connect with me on social media.
            </Text>
            <Box marginTop={1}>
              <Text color="cyan" dimColor>
                All links above are copyable from your terminal!
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Section>
  );
});

ContactSection.displayName = 'ContactSection';

export default ContactSection;