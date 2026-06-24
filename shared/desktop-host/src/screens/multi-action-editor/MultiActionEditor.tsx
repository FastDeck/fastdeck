import { Box, Flex, HStack, VStack, Text, Button, Heading, Input, Icon, Textarea } from '@chakra-ui/react';
import {
  LuCode,
  LuGlobe,
  LuPlus,
  LuSquarePlay,
  LuClock,
  LuGripVertical,
  LuTrash2,
  LuChevronRight,
  LuTerminal,
} from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { ScreenLayout } from '../../components/layout';

const ActionCard = ({
  icon,
  iconBg,
  iconColor,
  title,
  children,
}: {
  icon: any;
  iconBg: string;
  iconColor: string;
  title: string;
  children?: React.ReactNode;
}) => (
  <HStack w="100%" bg="bg.panel" border="1px solid" borderColor="border.muted" borderRadius="xl" p={4} gap={4} align="flex-start" position="relative" _hover={{ borderColor: 'border' }}>
    <Icon as={LuGripVertical} boxSize={5} color="fg.subtle" mt={2} cursor="grab" />
    <Box bg={iconBg} p={2.5} borderRadius="lg">
      <Icon as={icon} boxSize={5} color={iconColor} />
    </Box>
    <VStack flex={1} align="stretch" gap={3}>
      <Text fontSize="sm" fontWeight="bold" color="fg">
        {title}
      </Text>
      {children}
    </VStack>
    <IconButton icon={LuTrash2} color="fg.subtle" hoverColor="red.400" />
  </HStack>
);

const IconButton = ({ icon, color, hoverColor }: { icon: any; color: string; hoverColor?: string }) => (
  <Flex
    p={2}
    borderRadius="md"
    cursor="pointer"
    _hover={{ bg: 'bg.subtle', color: hoverColor || 'fg' }}
    color={color}
    transition="all 0.2s"
  >
    <Icon as={icon} boxSize={4} />
  </Flex>
);

const SliderMockup = () => (
  <Box w="100%" position="relative" py={2}>
    <Box w="100%" h={2} bg="bg.subtle" borderRadius="full" overflow="hidden">
      <Box w="40%" h="100%" bg="primary" borderRadius="full" />
    </Box>
    <Box
      w={4}
      h={4}
      bg="white"
      border="2px solid"
      borderColor="primary"
      borderRadius="full"
      position="absolute"
      top="4px"
      left="40%"
      transform="translateX(-50%)"
      boxShadow="md"
      cursor="pointer"
    />
  </Box>
);

export const MultiActionEditor = () => {
  const navigate = useNavigate();

  return (
    <ScreenLayout
      title="Edit Multi-Action: Start Dev Session"
      showBackButton
      onBack={() => navigate('/')}
      tabs={['Streaming', 'Development']}
      activeTab="Development"
    >
      <Box flex={1} overflowY="auto" position="relative">
        <VStack maxW="800px" mx="auto" p={8} pb={32} gap={6} align="stretch">
          
          <ActionCard icon={LuCode} iconBg="blue.900" iconColor="blue.300" title="Launch Application">
            <VStack align="stretch" gap={4}>
              <HStack gap={4}>
                <VStack align="flex-start" gap={1} flex={1}>
                  <Text fontSize="xs" fontWeight="semibold" color="fg.muted">
                    Application Name
                  </Text>
                  <Input
                    defaultValue="Visual Studio LuCode"
                    bg="transparent"
                    border="1px solid"
                    borderColor="border"
                    fontSize="sm"
                    color="fg"
                    _focus={{ borderColor: 'primary', boxShadow: 'none' }}
                  />
                </VStack>
                <VStack align="flex-start" gap={1} flex={1}>
                  <Text fontSize="xs" fontWeight="semibold" color="fg.muted">
                    Launch Arguments (Optional)
                  </Text>
                  <Input
                    placeholder="e.g. --new-window"
                    bg="transparent"
                    border="1px solid"
                    borderColor="border"
                    fontSize="sm"
                    color="fg"
                    _focus={{ borderColor: 'primary', boxShadow: 'none' }}
                  />
                </VStack>
              </HStack>
            </VStack>
          </ActionCard>

          <ActionCard icon={LuTerminal} iconBg="green.900" iconColor="green.400" title="Run Command">
            <VStack align="stretch" gap={2}>
              <Text fontSize="xs" fontWeight="semibold" color="fg.muted">
                LuTerminal Command
              </Text>
              <Textarea
                defaultValue="cd ~/projects/fastdeck && yarn dev"
                bg="bg.default"
                border="1px solid"
                borderColor="border"
                fontSize="sm"
                color="fg"
                fontFamily="mono"
                minH="80px"
                _focus={{ borderColor: 'primary', boxShadow: 'none' }}
              />
            </VStack>
          </ActionCard>

          <ActionCard icon={LuClock} iconBg="orange.900" iconColor="orange.300" title="Delay">
            <VStack align="stretch" gap={4} pt={2}>
              <HStack justify="space-between">
                <Text fontSize="xs" fontWeight="semibold" color="fg.muted">
                  Duration
                </Text>
                <Text fontSize="sm" fontWeight="bold" color="fg">
                  2000 ms (2s)
                </Text>
              </HStack>
              <SliderMockup />
            </VStack>
          </ActionCard>

          <ActionCard icon={LuGlobe} iconBg="purple.900" iconColor="purple.300" title="Open URL">
            <VStack align="flex-start" gap={1} w="100%">
              <Text fontSize="xs" fontWeight="semibold" color="fg.muted">
                Browser URL
              </Text>
              <HStack w="100%">
                <Input
                  defaultValue="http://localhost:3000"
                  bg="transparent"
                  border="1px solid"
                  borderColor="border"
                  fontSize="sm"
                  color="fg"
                  _focus={{ borderColor: 'primary', boxShadow: 'none' }}
                />
                <Button size="md" variant="outline" borderColor="border" color="fg" px={4}>
                  Test
                </Button>
              </HStack>
            </VStack>
          </ActionCard>

          <Flex
            w="100%"
            border="2px dashed"
            borderColor="border.muted"
            borderRadius="xl"
            p={6}
            align="center"
            justify="center"
            cursor="pointer"
            _hover={{ bg: 'bg.subtle', borderColor: 'border' }}
            gap={3}
            transition="all 0.2s"
          >
            <Icon as={LuPlus} boxSize={5} color="fg.muted" />
            <Text fontSize="sm" fontWeight="semibold" color="fg.muted">
              Add New Action Step
            </Text>
          </Flex>
        </VStack>
      </Box>

      {/* Fixed Bottom Footer */}
      <HStack
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        bg="bg.panel"
        borderTop="1px solid"
        borderColor="border.muted"
        px={8}
        py={4}
        justify="space-between"
        zIndex={10}
      >
        <HStack gap={2}>
          <Icon as={LuSquarePlay} boxSize={5} color="primary" />
          <Text fontSize="sm" fontWeight="medium" color="fg.muted">
            <Text as="span" color="fg" fontWeight="bold">4 Actions</Text> configured
          </Text>
        </HStack>
        <HStack gap={4}>
          <Button
            variant="outline"
            borderColor="border"
            color="fg"
            _hover={{ bg: 'bg.subtle' }}
            size="md"
            fontWeight="bold"
            px={6}
          >
            <Icon as={LuChevronRight} boxSize={4} mr={1} />
            Test Action
          </Button>
          <Button
            bg="blue.200"
            color="blue.900"
            _hover={{ bg: 'blue.300' }}
            size="md"
            fontWeight="bold"
            px={6}
          >
            Save Changes
          </Button>
        </HStack>
      </HStack>
    </ScreenLayout>
  );
};
