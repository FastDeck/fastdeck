import { Box, Flex, HStack, VStack, Text, Button, Heading, Input, Icon, SimpleGrid, Badge } from '@chakra-ui/react';
import { LuSearch, LuDownload, LuStar, LuVideo, LuCode, LuPenTool, LuMusic, LuMessageSquare, LuRadio, LuHouse, LuBox as BoxIcon, LuTrendingUp } from 'react-icons/lu';
import { ScreenLayout } from '../../components/layout';

const PluginCard = ({
  icon,
  iconBg,
  iconColor,
  title,
  description,
  badgeType,
  badgeText,
  isInstalled,
}: {
  icon: any;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  badgeType?: 'star' | 'installs' | 'new' | 'popular';
  badgeText?: string;
  isInstalled?: boolean;
}) => (
  <Box
    bg="bg.panel"
    border="1px solid"
    borderColor="border.muted"
    borderRadius="xl"
    p={5}
    position="relative"
    overflow="hidden"
  >
    {badgeType === 'new' && (
      <Box position="absolute" top={3} right={-7} bg="orange.500" transform="rotate(45deg)" px={8} py={0.5}>
        <Text fontSize="10px" fontWeight="bold" color="white">
          NEW
        </Text>
      </Box>
    )}

    <VStack align="flex-start" gap={4} h="100%" justify="space-between">
      <VStack align="flex-start" gap={4} w="100%">
        <HStack justify="space-between" w="100%" align="flex-start">
          <Box bg={iconBg} p={2.5} borderRadius="lg">
            <Icon as={icon} boxSize={5} color={iconColor} />
          </Box>

          {badgeType === 'star' && (
            <HStack gap={1}>
              <Icon as={LuStar} boxSize={3} color="yellow.400" fill="var(--chakra-colors-yellow-400)" />
              <Text fontSize="xs" fontWeight="bold" color="yellow.400">
                {badgeText}
              </Text>
            </HStack>
          )}
          {badgeType === 'installs' && (
            <Box bg="bg.subtle" px={2} py={0.5} borderRadius="md">
              <Text fontSize="10px" fontWeight="bold" color="fg.muted">
                {badgeText}
              </Text>
            </Box>
          )}
          {badgeType === 'popular' && (
            <HStack gap={1}>
              <Icon as={LuTrendingUp} boxSize={3} color="blue.300" />
              <Text fontSize="10px" fontWeight="bold" color="blue.300" letterSpacing="wide">
                POPULAR
              </Text>
            </HStack>
          )}
        </HStack>

        <VStack align="flex-start" gap={1}>
          <Text fontSize="md" fontWeight="bold" color="fg">
            {title}
          </Text>
          <Text fontSize="xs" color="fg.subtle" lineHeight="tall">
            {description}
          </Text>
        </VStack>
      </VStack>

      <Button
        w="100%"
        size="sm"
        bg={isInstalled ? 'blue.200' : 'bg.subtle'}
        color={isInstalled ? 'blue.900' : 'fg'}
        _hover={{ bg: isInstalled ? 'blue.300' : 'bg.muted' }}
        fontWeight="bold"
        fontSize="xs"
      >
        {isInstalled ? 'Installed' : 'Install'}
      </Button>
    </VStack>
  </Box>
);

const CategoryBanner = ({ title, gradient }: { title: string; gradient: string }) => (
  <Flex
    flex={1}
    h="140px"
    borderRadius="xl"
    bgGradient={gradient}
    position="relative"
    overflow="hidden"
    align="center"
    justify="center"
    border="1px solid"
    borderColor="border.muted"
  >
    <Box position="absolute" inset={0} bg="blackAlpha.600" />
    <Text
      position="relative"
      fontSize="2xl"
      fontWeight="black"
      letterSpacing="widest"
      color="white"
      textTransform="uppercase"
      textShadow="0px 2px 10px rgba(0,0,0,0.5)"
    >
      {title}
    </Text>
  </Flex>
);

export const PluginsMarketplace = () => {
  const RightSearchComponent = (
    <HStack
      w="280px"
      bg="bg.default"
      border="1px solid"
      borderColor="border.muted"
      borderRadius="full"
      px={3}
      py={1.5}
      gap={2}
    >
      <Icon as={LuSearch} color="fg.subtle" boxSize={4} />
      <Input
        placeholder="LuSearch for plugins..."
        size="sm"
        color="fg"
        _placeholder={{ color: 'fg.subtle' }}
        flex={1}
      />
    </HStack>
  );

  return (
    <ScreenLayout
      title="Marketplace"
      tabs={['Streaming', 'Development', 'Productivity']}
      activeTab="Streaming"
      rightComponent={RightSearchComponent}
    >
      <Box flex={1} overflowY="auto" p={8}>
        <VStack maxW="1200px" mx="auto" gap={8} align="stretch" pb={10}>
          
          <Flex
            w="100%"
            h="260px"
            borderRadius="2xl"
            bg="bg.panel"
            border="1px solid"
            borderColor="border.muted"
            position="relative"
            overflow="hidden"
            p={8}
            direction="column"
            justify="center"
            bgGradient="linear(to-r, var(--chakra-colors-bg-panel) 40%, transparent 100%)"
          >
            <Box 
              position="absolute" 
              top={0} right={0} bottom={0} left="40%" 
              bgGradient="radial(circle at top right, blue.900 0%, transparent 70%)" 
              opacity={0.3} 
              zIndex={0} 
            />
            
            <VStack align="flex-start" gap={4} maxW="500px" position="relative" zIndex={1}>
              <Badge bg="bg.subtle" color="blue.200" px={3} py={1} borderRadius="full" fontSize="10px" letterSpacing="widest">
                FEATURED PLUGIN
              </Badge>
              
              <Heading size="xl" fontWeight="black" letterSpacing="tight" color="fg">
                OBS Studio Pro v4.0
              </Heading>
              
              <Text fontSize="md" color="fg.muted" lineHeight="tall">
                Take full control of your streams with granular audio mapping and real-time transition previews directly on your deck.
              </Text>
              
              <HStack gap={4} pt={2}>
                <Button bg="blue.200" color="blue.900" _hover={{ bg: 'blue.300' }} size="md" px={6} fontWeight="bold">
                  <Icon as={LuDownload} boxSize={4} mr={2} />
                  Install Plugin
                </Button>
                <Button bg="bg.subtle" color="fg" _hover={{ bg: 'bg.muted' }} size="md" px={6} fontWeight="bold">
                  View Details
                </Button>
              </HStack>
            </VStack>
          </Flex>

          <SimpleGrid columns={4} gap={6}>
            <PluginCard
              icon={LuCode} iconBg="blue.900" iconColor="blue.300"
              title="VS LuCode Integration"
              description="Control your IDE, run scripts, and manage extensions with one tap."
              badgeType="star" badgeText="4.8"
            />
            <PluginCard
              icon={LuVideo} iconBg="gray.700" iconColor="white"
              title="OBS Studio Pro"
              description="Advanced scene switching, source toggling and audio levels."
              badgeType="installs" badgeText="10k+ Installs"
              isInstalled
            />
            <PluginCard
              icon={LuPenTool} iconBg="purple.900" iconColor="purple.300"
              title="Figma Navigator"
              description="Fast jump between pages, layers, and components within Figma."
              badgeType="new"
            />
            <PluginCard
              icon={LuMusic} iconBg="green.900" iconColor="green.400"
              title="Spotify Controller"
              description="Media playback, playlist switching, and dynamic album art display."
              badgeType="popular"
            />
            <PluginCard
              icon={LuMessageSquare} iconBg="indigo.900" iconColor="indigo.300"
              title="Discord Voice Control"
              description="Mute, deafen, and move channels with physical deck buttons."
              badgeType="star" badgeText="4.9"
            />
            <PluginCard
              icon={LuRadio} iconBg="purple.900" iconColor="purple.400"
              title="Twitch Broadcaster"
              description="Monitor chat, clip moments, and run ads without leaving your game."
            />
            <PluginCard
              icon={LuHouse} iconBg="bg.subtle" iconColor="fg"
              title="Home Automation"
              description="Turn off lights, check security cameras, and set scenes via Home Assistant."
            />
            <PluginCard
              icon={BoxIcon} iconBg="cyan.900" iconColor="cyan.400"
              title="Docker Container Pro"
              description="Start, stop, and restart containers. View logs on deck keys."
            />
          </SimpleGrid>

          <HStack gap={6} pt={4}>
            <CategoryBanner title="STREAMING" gradient="linear(to-r, purple.800, blue.800)" />
            <CategoryBanner title="DEVELOPMENT" gradient="linear(to-r, teal.800, green.800)" />
            <CategoryBanner title="PRODUCTIVITY" gradient="linear(to-r, orange.800, red.800)" />
          </HStack>

        </VStack>
      </Box>
    </ScreenLayout>
  );
};
