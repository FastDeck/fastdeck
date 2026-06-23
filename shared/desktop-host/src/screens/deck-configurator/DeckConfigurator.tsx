import { useState } from 'react';
import { Box, Flex, HStack, VStack, Text, Button, Heading, Input, Icon } from '@chakra-ui/react';
import {
  LuMonitor,
  LuSearch,
  LuCode,
  LuSquarePlay,
  LuGlobe,
  LuMessageSquare,
  LuChartColumn,
  LuVolume2,
  LuMicOff,
  LuVideo,
  LuLightbulb,
  LuMail,
  LuSkipBack,
  LuPause,
  LuSkipForward,
  LuPlus,
} from 'react-icons/lu';
import { ScreenLayout } from '../../components/layout';

const CustomSwitch = ({ isChecked }: { isChecked?: boolean }) => (
  <Box
    w="36px"
    h="20px"
    bg={isChecked ? 'primary' : 'bg.muted'}
    borderRadius="full"
    position="relative"
    cursor="pointer"
    transition="all 0.2s"
  >
    <Box
      w="16px"
      h="16px"
      bg="white"
      borderRadius="full"
      position="absolute"
      top="2px"
      left={isChecked ? '18px' : '2px'}
      transition="all 0.2s"
      boxShadow="sm"
    />
  </Box>
);

const GridButton = ({
  icon,
  label,
  isActive,
  isEmpty,
}: {
  icon?: any;
  label?: string;
  isActive?: boolean;
  isEmpty?: boolean;
}) => {
  if (isEmpty) {
    return (
      <Flex
        w="100px"
        h="100px"
        bg="bg.subtle"
        border="1px dashed"
        borderColor="border.muted"
        borderRadius="2xl"
        align="center"
        justify="center"
        cursor="pointer"
        _hover={{ bg: 'bg.muted' }}
      >
        <Icon as={LuPlus} boxSize={6} color="fg.subtle" />
      </Flex>
    );
  }

  return (
    <VStack
      w="100px"
      h="100px"
      bg={isActive ? 'primary' : 'bg.subtle'}
      borderRadius="2xl"
      justify="center"
      gap={3}
      cursor="pointer"
      boxShadow={isActive ? '0 0 0 2px var(--chakra-colors-primary), 0 0 20px var(--chakra-colors-primary)' : 'none'}
      _hover={{ bg: isActive ? 'blue.400' : 'bg.muted' }}
      transition="all 0.2s"
    >
      <Icon as={icon} boxSize={8} color="white" />
      <Text fontSize="xs" color="white" fontWeight="medium">
        {label}
      </Text>
    </VStack>
  );
};

export const DeckConfigurator = () => {
  const [activeCell, setActiveCell] = useState(2);

  const LeftStatusComponent = (
    <HStack>
      <Icon as={LuMonitor} color="fg.muted" boxSize={5} />
      <Text fontSize="sm" color="fg.muted" fontWeight="medium">
        Status:{' '}
        <Text as="span" color="primary" fontWeight="semibold">
          Connected to iPad Pro
        </Text>
      </Text>
    </HStack>
  );

  const RightSearchComponent = (
    <HStack
      bg="bg.subtle"
      px={3}
      py={1.5}
      borderRadius="md"
      border="1px solid"
      borderColor="border.muted"
      w="240px"
    >
      <Icon as={LuSearch} boxSize={4} color="fg.subtle" />
      <Input
        border="none"
        outline="none"
        _focus={{ boxShadow: 'none' }}
        placeholder="LuSearch commands..."
        fontSize="sm"
        color="fg"
        _placeholder={{ color: 'fg.subtle' }}
      />
    </HStack>
  );

  return (
    <ScreenLayout
      leftComponent={LeftStatusComponent}
      rightComponent={RightSearchComponent}
      tabs={['Streaming', 'Development', 'Default Profile']}
      activeTab="Default Profile"
    >
      <Flex flex={1}>
        {/* Main Content Area */}
        <Flex flex={1} bg="bg.default" align="center" justify="center" direction="column">
          <Box bg="bg.panel" p={8} borderRadius="3xl" border="1px solid" borderColor="border.muted" boxShadow="xl">
            <VStack gap={4}>
              <HStack gap={4}>
                <GridButton icon={LuCode} label="VS Code" />
                <GridButton icon={LuSquarePlay} label="Media Play" />
                <GridButton icon={LuGlobe} label="Chrome" isActive={activeCell === 2} />
                <GridButton icon={LuMessageSquare} label="Discord" />
                <GridButton icon={LuChartColumn} label="Stats" />
              </HStack>
              <HStack gap={4}>
                <GridButton icon={LuVolume2} label="Main Vol" />
                <GridButton icon={LuMicOff} label="Mute" />
                <GridButton icon={LuVideo} label="Camera" />
                <GridButton icon={LuLightbulb} label="Lights" />
                <GridButton icon={LuMail} label="Email" />
              </HStack>
              <HStack gap={4}>
                <GridButton icon={LuSkipBack} label="Prev" />
                <GridButton icon={LuPause} label="LuPause" />
                <GridButton icon={LuSkipForward} label="Next" />
                <GridButton isEmpty />
                <GridButton isEmpty />
              </HStack>
            </VStack>
          </Box>

          <Box mt={8} bg="bg.subtle" px={4} py={2} borderRadius="full" border="1px solid" borderColor="border.muted">
            <HStack gap={2}>
              <Box w={2} h={2} bg="primary" borderRadius="full" />
              <Text fontSize="xs" fontWeight="bold" letterSpacing="wide" color="fg.muted">
                ACTIVE LAYOUT: OBS CONTROL DECK (5X3)
              </Text>
            </HStack>
          </Box>
        </Flex>

        {/* Right Property Inspector */}
        <VStack
          w="300px"
          bg="bg.panel"
          borderLeft="1px solid"
          borderColor="border.muted"
          p={6}
          align="stretch"
          gap={8}
          overflowY="auto"
        >
          <VStack align="flex-start" gap={1}>
            <Heading size="sm" fontWeight="bold" color="fg">
              Property Inspector
            </Heading>
            <Text fontSize="xs" color="fg.subtle">
              Editing selected cell (C3)
            </Text>
          </VStack>

          <VStack align="stretch" gap={6}>
            <VStack align="flex-start" gap={2}>
              <Text fontSize="xs" fontWeight="semibold" color="fg.muted">
                Action Label
              </Text>
              <Input
                value="Chrome"
                bg="transparent"
                border="1px solid"
                borderColor="border"
                fontSize="sm"
                color="fg"
                _focus={{ borderColor: 'primary', boxShadow: 'none' }}
              />
            </VStack>

            <VStack align="flex-start" gap={2} w="100%">
              <Text fontSize="xs" fontWeight="semibold" color="fg.muted">
                Action Type
              </Text>
              <select
                style={{
                  background: 'transparent',
                  border: '1px solid var(--chakra-colors-border)',
                  fontSize: '14px',
                  color: 'var(--chakra-colors-fg)',
                  padding: '8px',
                  borderRadius: '6px',
                  outline: 'none',
                  width: '100%'
                }}
                defaultValue="Open Website"
              >
                <option value="Open Website" style={{ background: 'var(--chakra-colors-bg-panel)', color: 'var(--chakra-colors-fg)' }}>
                  Open Website
                </option>
                <option value="Run Command" style={{ background: 'var(--chakra-colors-bg-panel)', color: 'var(--chakra-colors-fg)' }}>
                  Run Command
                </option>
              </select>
            </VStack>

            <VStack align="flex-start" gap={2}>
              <Text fontSize="xs" fontWeight="semibold" color="fg.muted">
                Target URL
              </Text>
              <Input
                placeholder="https://..."
                bg="transparent"
                border="1px solid"
                borderColor="border"
                fontSize="sm"
                color="fg"
                _focus={{ borderColor: 'primary', boxShadow: 'none' }}
              />
            </VStack>

            <VStack align="flex-start" gap={2}>
              <Text fontSize="xs" fontWeight="semibold" color="fg.muted">
                Background Color
              </Text>
              <HStack
                w="100%"
                border="1px solid"
                borderColor="border"
                borderRadius="md"
                p={2}
                gap={3}
              >
                <Box w={6} h={6} bg="primary" borderRadius="sm" />
                <Text fontSize="sm" color="fg.muted" fontWeight="medium">
                  #4B8EFF
                </Text>
              </HStack>
            </VStack>

            <HStack justify="space-between">
              <Text fontSize="sm" color="fg.muted" fontWeight="medium">
                Show Icon
              </Text>
              <CustomSwitch isChecked />
            </HStack>
          </VStack>

          <VStack align="stretch" gap={3} pt={4}>
            <Button bg="blue.200" color="blue.900" _hover={{ bg: 'blue.300' }} size="md" fontWeight="bold">
              Save Changes
            </Button>
            <Button bg="bg.subtle" color="fg" _hover={{ bg: 'bg.muted' }} size="md" fontWeight="medium">
              Reset to Default
            </Button>
          </VStack>

          <Box mt="auto" borderRadius="xl" overflow="hidden" position="relative" border="1px solid" borderColor="border.muted">
            <Box
              h="120px"
              backgroundImage="url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400')"
              backgroundSize="cover"
              backgroundPosition="center"
            />
            <Box position="absolute" bottom={0} left={0} right={0} bg="blackAlpha.800" p={3} backdropFilter="blur(10px)">
              <Text fontSize="2xs" color="whiteAlpha.600" fontWeight="medium">
                Connected Source
              </Text>
              <Text fontSize="sm" color="white" fontWeight="bold">
                Main Display 01
              </Text>
            </Box>
          </Box>
        </VStack>
      </Flex>
    </ScreenLayout>
  );
};
