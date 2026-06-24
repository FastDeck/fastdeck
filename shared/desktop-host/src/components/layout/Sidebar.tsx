import { Box, HStack, VStack, Text, Heading, Icon } from '@chakra-ui/react';
import { LuLayoutGrid, LuPuzzle, LuUsers, LuCircleHelp } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';

const SidebarItem = ({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: any;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}) => (
  <HStack
    w="100%"
    px={4}
    py={3}
    borderRadius="xl"
    bg={isActive ? 'primary' : 'transparent'}
    color={isActive ? 'white' : 'fg.muted'}
    _hover={{ bg: isActive ? 'primary' : 'bg.subtle' }}
    cursor="pointer"
    gap={4}
    onClick={onClick}
  >
    <Icon as={icon} boxSize={5} />
    <Text fontWeight={isActive ? 'semibold' : 'medium'} fontSize="md">
      {label}
    </Text>
  </HStack>
);

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active item based on pathname
  const path = location.pathname;
  const isDeckActive = path === '/' || path.startsWith('/multi-action-editor');
  const isPluginsActive = path.startsWith('/plugins');
  const isProfilesActive = path.startsWith('/profiles');

  return (
    <VStack
      w="260px"
      bg="bg.default"
      borderRight="1px solid"
      borderColor="border.muted"
      py={6}
      px={4}
      justify="space-between"
      flexShrink={0}
    >
      <VStack w="100%" gap={8} align="flex-start">
        <HStack px={2} gap={3}>
          <Box w={8} h={8} bg="primary" borderRadius="md" alignContent="center" textAlign="center">
            <Icon as={LuLayoutGrid} boxSize={5} color="white" mt={1.5} />
          </Box>
          <VStack align="flex-start" gap={0}>
            <Heading size="md" fontWeight="bold" letterSpacing="tight" color="fg">
              Fastdeck
            </Heading>
            <Text fontSize="xs" color="fg.subtle" fontWeight="medium">
              Pro v2.4
            </Text>
          </VStack>
        </HStack>

        <VStack w="100%" gap={2}>
          <SidebarItem
            icon={LuLayoutGrid}
            label="Deck"
            isActive={isDeckActive}
            onClick={() => navigate('/')}
          />
          <SidebarItem
            icon={LuPuzzle}
            label="Plugins"
            isActive={isPluginsActive}
            onClick={() => navigate('/plugins')}
          />

          <SidebarItem
            icon={LuUsers}
            label="Profiles"
            isActive={isProfilesActive}
            onClick={() => navigate('/profiles')}
          />
        </VStack>
      </VStack>

      <VStack w="100%" gap={2} borderTop="1px solid" borderColor="border.muted" pt={6}>
        <SidebarItem icon={LuCircleHelp} label="Support" onClick={() => {}} />
      </VStack>
    </VStack>
  );
};
