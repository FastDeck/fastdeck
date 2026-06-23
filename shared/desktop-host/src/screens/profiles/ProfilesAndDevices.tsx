import { Box, Flex, HStack, VStack, Text, Button, Heading, Icon, SimpleGrid, Badge } from '@chakra-ui/react';
import {
  LuMonitorSmartphone,
  LuSmartphone,
  LuTablet,
  LuLink2Off,
  LuBluetooth,
  LuGamepad2,
  LuBriefcase,
  LuPalette,
  LuVideo,
  LuMic,
  LuChartColumn,
  LuMail,
  LuCalendar,
  LuPenTool,
  LuLayers,
  LuPlus,
} from 'react-icons/lu';
import { ScreenLayout } from '../../components/layout';

const ProfileCard = ({
  icon,
  title,
  description,
  toolIcons,
  isActive,
}: {
  icon: any;
  title: string;
  description: string;
  toolIcons: any[];
  isActive?: boolean;
}) => (
  <Flex
    direction="column"
    bg="bg.panel"
    border="1px solid"
    borderColor={isActive ? 'primary' : 'border.muted'}
    borderRadius="xl"
    p={6}
    position="relative"
    h="220px"
    justify="space-between"
    _hover={{ borderColor: isActive ? 'primary' : 'border' }}
    cursor="pointer"
  >
    <HStack justify="space-between" align="flex-start" w="100%">
      <Box bg="bg.subtle" p={3} borderRadius="lg">
        <Icon as={icon} boxSize={6} color="primary" />
      </Box>
      {isActive && (
        <Badge bg="blue.600" color="white" px={2} py={0.5} borderRadius="md" fontSize="2xs" letterSpacing="wider">
          ACTIVE
        </Badge>
      )}
    </HStack>

    <VStack align="flex-start" gap={1} mt={2}>
      <Text fontSize="md" fontWeight="bold" color="fg">
        {title}
      </Text>
      <Text fontSize="xs" color="fg.subtle" lineHeight="tall" lineClamp={3}>
        {description}
      </Text>
    </VStack>

    <HStack justify="space-between" align="flex-end" w="100%" mt={4}>
      <HStack gap={2}>
        {toolIcons.map((ToolIcon, i) => (
          <Flex key={i} bg="bg.subtle" p={1.5} borderRadius="md" align="center" justify="center">
            <Icon as={ToolIcon} boxSize={3.5} color="fg.muted" />
          </Flex>
        ))}
      </HStack>
      <Text fontSize="xs" fontWeight="bold" letterSpacing="wider" color="fg.muted" _hover={{ color: 'fg' }}>
        {isActive ? 'EDIT DECK' : 'ACTIVATE'}
      </Text>
    </HStack>
  </Flex>
);

const DeviceCard = ({ name, icon, isConnected }: { name: string; icon: any; isConnected: boolean }) => (
  <HStack
    w="100%"
    bg="transparent"
    border="1px solid"
    borderColor="border.muted"
    borderRadius="xl"
    p={4}
    justify="space-between"
  >
    <HStack gap={4}>
      <Box bg="bg.subtle" p={3} borderRadius="lg">
        <Icon as={icon} boxSize={5} color="fg.muted" />
      </Box>
      <VStack align="flex-start" gap={0}>
        <Text fontSize="sm" fontWeight="semibold" color="fg">
          {name}
        </Text>
        <HStack gap={1.5} mt={0.5}>
          <Box w={1.5} h={1.5} borderRadius="full" bg={isConnected ? 'green.400' : 'bg.muted'} />
          <Text fontSize="xs" fontWeight="medium" color="fg.subtle">
            {isConnected ? 'CONNECTED' : 'OFFLINE'}
          </Text>
        </HStack>
      </VStack>
    </HStack>
    <Icon as={LuLink2Off} boxSize={4} color="fg.subtle" cursor="pointer" _hover={{ color: 'red.400' }} />
  </HStack>
);

const MockQRCode = () => {
  const pattern = [
    1, 1, 0, 1, 1, 1,
    1, 0, 1, 0, 0, 1,
    0, 1, 1, 0, 1, 0,
    1, 0, 0, 1, 1, 1,
    1, 1, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 0,
  ];

  return (
    <Box bg="white" p={3} borderRadius="md" display="inline-block">
      <SimpleGrid columns={6} gap={1} w="80px" h="80px">
        {pattern.map((val, i) => (
          <Box key={i} bg={val ? 'black' : 'white'} w="100%" h="100%" />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export const ProfilesAndDevices = () => {
  return (
    <ScreenLayout
      title="Profiles & Devices"
      tabs={['Default Profile', 'Streaming', 'Development']}
      activeTab="Default Profile"
    >
      <Flex flex={1} overflow="hidden">
        
        {/* Left Column: User Profiles */}
        <Box flex={1} p={8} overflowY="auto">
          <VStack maxW="800px" gap={6} align="stretch">
            <HStack justify="space-between" align="flex-end">
              <VStack align="flex-start" gap={1}>
                <Heading size="md" fontWeight="bold" color="fg">
                  User Profiles
                </Heading>
                <Text fontSize="sm" color="fg.subtle">
                  Switch between your specialized deck configurations.
                </Text>
              </VStack>
              <Button
                bg="blue.100"
                color="blue.900"
                _hover={{ bg: 'blue.200' }}
                size="sm"
                fontWeight="bold"
                px={4}
              >
                <Icon as={LuPlus} boxSize={4} mr={1} />
                New Profile
              </Button>
            </HStack>

            <SimpleGrid columns={2} gap={6} mt={2}>
              <ProfileCard
                icon={LuGamepad2}
                title="Gaming"
                description="Optimized for OBS, Discord, and Twitch integration. Includes scene transitions and soundboard."
                toolIcons={[LuVideo, LuMic, LuChartColumn]}
                isActive
              />
              <ProfileCard
                icon={LuBriefcase}
                title="Work"
                description="Productivity shortcuts for Slack, Outlook, and Zoom. Focus timer and window management."
                toolIcons={[LuMail, LuCalendar]}
              />
              <ProfileCard
                icon={LuPalette}
                title="Creative"
                description="Adobe Suite macros, brush size toggles, and color picker automation. High-precision tools."
                toolIcons={[LuPenTool, LuLayers]}
              />
              
              {/* Create Profile Card */}
              <Flex
                direction="column"
                border="2px dashed"
                borderColor="border.muted"
                borderRadius="xl"
                p={6}
                h="220px"
                align="center"
                justify="center"
                cursor="pointer"
                _hover={{ bg: 'bg.subtle', borderColor: 'border' }}
                gap={3}
              >
                <Icon as={LuPlus} boxSize={8} color="fg.subtle" />
                <Text fontSize="sm" fontWeight="medium" color="fg.subtle">
                  Create Profile
                </Text>
              </Flex>
            </SimpleGrid>
          </VStack>
        </Box>

        {/* Right Column: Paired Devices */}
        <Flex
          w="340px"
          bg="bg.panel"
          borderLeft="1px solid"
          borderColor="border.muted"
          direction="column"
          justify="space-between"
        >
          <VStack p={6} gap={6} align="stretch" flex={1}>
            <HStack gap={3}>
              <Icon as={LuMonitorSmartphone} boxSize={5} color="fg" />
              <Text fontSize="md" fontWeight="bold" color="fg">
                Paired Devices
              </Text>
            </HStack>

            <VStack gap={3}>
              <DeviceCard name="iPhone 15 Pro" icon={LuSmartphone} isConnected={true} />
              <DeviceCard name="iPad Pro M2" icon={LuTablet} isConnected={false} />
            </VStack>

            {/* Connection Hub */}
            <VStack mt={6} gap={4}>
              <Text fontSize="sm" fontWeight="medium" color="fg.muted">
                Connection Hub
              </Text>
              
              <Flex
                w="100%"
                bg="bg.subtle"
                border="1px solid"
                borderColor="border.muted"
                borderRadius="xl"
                p={6}
                direction="column"
                align="center"
                gap={4}
              >
                <MockQRCode />
                <Text fontSize="xs" color="fg.subtle" textAlign="center" lineHeight="tall" px={2}>
                  Scan this QR code with the Fastdeck mobile app to pair instantly.
                </Text>
                <Button
                  w="100%"
                  variant="outline"
                  borderColor="border.muted"
                  color="primary"
                  _hover={{ bg: 'bg.muted', borderColor: 'border' }}
                  size="sm"
                  mt={2}
                >
                  <Icon as={LuBluetooth} boxSize={4} mr={2} />
                  Pair via LuBluetooth
                </Button>
              </Flex>
            </VStack>
          </VStack>

          {/* Cloud Storage Footer */}
          <VStack p={6} gap={2} align="stretch" borderTop="1px solid" borderColor="border.muted">
            <HStack justify="space-between">
              <Text fontSize="xs" fontWeight="semibold" color="fg.muted">
                Cloud Storage
              </Text>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted">
                82% Full
              </Text>
            </HStack>
            <Box w="100%" h="4px" bg="bg.subtle" borderRadius="full" overflow="hidden">
              <Box w="82%" h="100%" bg="primary" borderRadius="full" />
            </Box>
          </VStack>

        </Flex>

      </Flex>
    </ScreenLayout>
  );
};
