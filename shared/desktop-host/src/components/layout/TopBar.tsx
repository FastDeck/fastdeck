import { Box, HStack, Heading, Text, Icon, IconButton } from '@chakra-ui/react';
import { LuMonitorPlay, LuRotateCw, LuBell, LuArrowLeft } from 'react-icons/lu';
import React from 'react';

export type TopBarProps = {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  tabs?: string[];
  activeTab?: string;
  onTabClick?: (tab: string) => void;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
};

export const TopBar = ({
  title,
  showBackButton,
  onBack,
  tabs,
  activeTab,
  onTabClick,
  rightComponent,
  leftComponent,
}: TopBarProps) => (
  <HStack
    w="100%"
    px={8}
    py={5}
    borderBottom="1px solid"
    borderColor="border.muted"
    justify="space-between"
    bg="bg.panel"
    flexShrink={0}
  >
    <HStack gap={8}>
      <HStack gap={4}>
        {showBackButton && (
          <IconButton
            aria-label="Go back"
            variant="ghost"
            size="sm"
            onClick={onBack}
            _hover={{ bg: 'bg.subtle' }}
          >
            <Icon as={LuArrowLeft} boxSize={5} color="fg.muted" />
          </IconButton>
        )}
        {leftComponent ? (
          leftComponent
        ) : (
          <Heading size="md" fontWeight="bold" letterSpacing="tight" color="fg">
            {title}
          </Heading>
        )}
      </HStack>

      {tabs && tabs.length > 0 && (
        <HStack gap={6}>
          {tabs.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <Text
                key={tab}
                fontSize="sm"
                color={isActive ? 'fg' : 'fg.muted'}
                fontWeight={isActive ? 'semibold' : 'medium'}
                cursor="pointer"
                borderBottom={isActive ? '2px solid' : 'none'}
                borderColor="primary"
                pb={isActive ? 1 : 0}
                onClick={() => onTabClick?.(tab)}
              >
                {tab}
              </Text>
            );
          })}
        </HStack>
      )}
    </HStack>

    <HStack gap={8}>
      {rightComponent}

      <HStack gap={4}>
        <Icon as={LuMonitorPlay} boxSize={5} color="fg.muted" cursor="pointer" _hover={{ color: 'fg' }} />
        <Icon as={LuRotateCw} boxSize={5} color="fg.muted" cursor="pointer" _hover={{ color: 'fg' }} />
        <Icon as={LuBell} boxSize={5} color="fg.muted" cursor="pointer" _hover={{ color: 'fg' }} />
        <Box
          w={8}
          h={8}
          borderRadius="full"
          backgroundImage="url('https://bit.ly/dan-abramov')"
          backgroundSize="cover"
          backgroundPosition="center"
        />
      </HStack>
    </HStack>
  </HStack>
);
