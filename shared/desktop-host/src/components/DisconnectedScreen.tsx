import {
  Flex,
  VStack,
  Heading,
  Text,
  Button,
  Icon,
  Box,
} from '@chakra-ui/react';
import { LuWifiOff, LuRefreshCw } from 'react-icons/lu';
import { API_BASE_URL } from '@services';
import { useState } from 'react';

interface DisconnectedScreenProps {
  onRetry: () => void;
}

export const DisconnectedScreen = ({ onRetry }: DisconnectedScreenProps) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    await onRetry();
    // Short artificial delay to provide user feedback
    setTimeout(() => {
      setIsRetrying(false);
    }, 800);
  };

  return (
    <Flex
      flex={1}
      align="center"
      justify="center"
      bg="bg.default"
      h="full"
      p={6}
    >
      <VStack
        bg="bg.panel/80"
        backdropFilter="blur(16px)"
        border="1px solid"
        borderColor="border/30"
        borderRadius="3xl"
        p={10}
        gap={6}
        maxW="480px"
        textAlign="center"
        boxShadow="2xl"
        position="relative"
        overflow="hidden"
      >
        {/* Ambient background glow */}
        <Box
          position="absolute"
          top="-20%"
          left="-20%"
          w="140%"
          h="140%"
          bg="radial-gradient(circle, rgba(239, 68, 68, 0.08) 0%, rgba(0,0,0,0) 70%)"
          pointerEvents="none"
          zIndex={0}
        />

        {/* Offline Icon Container */}
        <Flex
          zIndex={1}
          w="80px"
          h="80px"
          bg="red.500/10"
          border="1px solid"
          borderColor="red.500/30"
          borderRadius="2xl"
          align="center"
          justify="center"
          boxShadow="0 0 20px rgba(239, 68, 68, 0.15)"
          className="pulse-glow"
        >
          <Icon as={LuWifiOff} boxSize={10} color="red.400" />
        </Flex>

        <VStack gap={2} zIndex={1}>
          <Heading size="md" color="fg" fontWeight="bold" letterSpacing="wide">
            FastDeck Server Disconnected
          </Heading>
          <Text fontSize="sm" color="fg.subtle" lineHeight="tall">
            We couldn't connect to the local FastDeck server. Please check if
            the server is running on{' '}
            <Text
              as="code"
              px={1.5}
              py={0.5}
              bg="bg.subtle"
              borderRadius="md"
              color="primary"
              fontSize="xs"
            >
              {API_BASE_URL}
            </Text>
          </Text>
        </VStack>

        <Button
          zIndex={1}
          onClick={handleRetry}
          loading={isRetrying}
          bg="red.500"
          color="white"
          _hover={{
            bg: 'red.600',
            boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)',
          }}
          _active={{ bg: 'red.700' }}
          size="lg"
          w="full"
          borderRadius="2xl"
          fontWeight="bold"
          transition="all 0.2s"
          gap={2}
        >
          <Icon as={LuRefreshCw} />
          Retry Connection
        </Button>

        <style>{`
          @keyframes pulseGlow {
            0% { transform: scale(1); box-shadow: 0 0 20px rgba(239, 68, 68, 0.15); }
            50% { transform: scale(1.03); box-shadow: 0 0 28px rgba(239, 68, 68, 0.3); }
            100% { transform: scale(1); box-shadow: 0 0 20px rgba(239, 68, 68, 0.15); }
          }
          .pulse-glow {
            animation: pulseGlow 2.5s infinite ease-in-out;
          }
        `}</style>
      </VStack>
    </Flex>
  );
};
