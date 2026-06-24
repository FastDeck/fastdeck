import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Button,
  Heading,
  Input,
  Icon,
  Spinner,
} from '@chakra-ui/react';
import { LuPlus, LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { ScreenLayout } from '../../components/layout';
import { DisconnectedScreen } from '../../components/DisconnectedScreen';
import { useDeckInfo, useSwitchProfile, useUpdateCell } from '@services';
import { ActionType, Cell, CellAction, Action, MediaCommand } from '@services';
import { useForm, useStore } from '@tanstack/react-form';

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
  background,
  isActive,
  isEmpty,
  onClick,
}: {
  icon?: any;
  label?: string;
  background?: string;
  isActive?: boolean;
  isEmpty?: boolean;
  onClick?: () => void;
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
        onClick={onClick}
      >
        <Icon as={LuPlus} boxSize={6} color="fg.subtle" />
      </Flex>
    );
  }

  const isEmoji = typeof icon === 'string';

  return (
    <VStack
      w="100px"
      h="100px"
      bg={background || 'bg.subtle'}
      borderRadius="2xl"
      justify="center"
      gap={3}
      cursor="pointer"
      boxShadow={
        isActive
          ? '0 0 0 2px var(--chakra-colors-primary), 0 0 20px var(--chakra-colors-primary)'
          : 'none'
      }
      _hover={{ opacity: 0.9 }}
      transition="all 0.2s"
      onClick={onClick}
    >
      {isEmoji ? (
        <Text fontSize="3xl">{icon}</Text>
      ) : (
        <Icon as={icon} boxSize={8} color="white" />
      )}
      <Text
        fontSize="xs"
        color="white"
        fontWeight="medium"
        textAlign="center"
        px={2}
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
        w="100%"
      >
        {label}
      </Text>
    </VStack>
  );
};

const buildActionDetails = (actionType: string, target: string) => {
  switch (actionType) {
    case 'Launch App':
      return {
        case: 'launchApp' as const,
        value: { pathOrName: target, args: [] },
      };
    case 'Open Website':
      return {
        case: 'openUrl' as const,
        value: { url: target },
      };
    case 'Run Command':
      return {
        case: 'runCommand' as const,
        value: { command: target },
      };
    case 'Create Folder':
      return {
        case: 'createFolder' as const,
        value: { path: target },
      };
    case 'Run Script':
      return {
        case: 'runScript' as const,
        value: { path: target },
      };
    case 'Media Control':
      return {
        case: 'mediaControl' as const,
        value: { command: parseInt(target, 10) || MediaCommand.PLAY },
      };
    case 'Key Binding':
      return {
        case: 'keyBinding' as const,
        value: { keys: target.split('+').map((k) => k.trim()).filter(Boolean) },
      };
    default:
      return { case: undefined };
  }
};

const getActionTypeValue = (actionType: string): ActionType => {
  switch (actionType) {
    case 'Launch App':
      return ActionType.LAUNCH_APP;
    case 'Open Website':
      return ActionType.OPEN_URL;
    case 'Run Command':
      return ActionType.RUN_COMMAND;
    case 'Media Control':
      return ActionType.MEDIA_CONTROL;
    case 'Create Folder':
      return ActionType.CREATE_FOLDER;
    case 'Run Script':
      return ActionType.RUN_SCRIPT;
    case 'Key Binding':
      return ActionType.KEY_BINDING;
    default:
      return ActionType.UNSPECIFIED;
  }
};

const getActionDefaultEmoji = (actionType: string): string => {
  switch (actionType) {
    case 'Launch App':
      return '💻';
    case 'Open Website':
      return '🌐';
    case 'Run Command':
      return '👋';
    case 'Create Folder':
      return '📁';
    default:
      return '✨';
  }
};

export const DeckConfigurator = () => {
  const { data: deckData, isLoading, refetch } = useDeckInfo();
  const switchProfileMutation = useSwitchProfile();
  const updateCellMutation = useUpdateCell();

  const serverInfo = deckData?.serverInfo;
  const activeProfile = deckData?.activeProfile;

  const [selectedCoord, setSelectedCoord] = useState<{
    row: number;
    col: number;
  } | null>({ row: 0, col: 0 });

  const [activePage, setActivePage] = useState(0);

  const availableProfileIds = serverInfo?.availableProfiles || [
    'default',
    'dev',
  ];

  // Derive total page count from all cells in the profile
  const allCells = activeProfile?.grid?.cells || [];
  const pageCount = Math.max(
    1,
    allCells.reduce((max, c) => Math.max(max, (c.page ?? 0) + 1), 1),
  );

  const getProfileName = (id: string) => {
    if (id === 'default') return 'Default Profile';
    if (id === 'dev') return 'Development';
    return id.charAt(0).toUpperCase() + id.slice(1);
  };

  const getProfileId = (name: string) => {
    if (name === 'Default Profile') return 'default';
    if (name === 'Development') return 'dev';
    return name.toLowerCase();
  };

  const tabs = availableProfileIds.map(getProfileName);
  const activeTabName = activeProfile
    ? getProfileName(activeProfile.id)
    : 'Default Profile';

  const cells = allCells.filter((c) => (c.page ?? 0) === activePage);
  const rows = activeProfile?.grid?.rows || 3;
  const cols = activeProfile?.grid?.cols || 5;

  const selectedCell = cells.find(
    (c) => c.row === selectedCoord?.row && c.col === selectedCoord?.col && (c.page ?? 0) === activePage,
  );

  const getCellActionTypeString = (cell?: Cell): string => {
    if (!cell?.action || cell.action.action.case !== 'singleAction')
      return 'None';
    const action = cell.action.action.value;
    switch (action.type) {
      case ActionType.LAUNCH_APP:
        return 'Launch App';
      case ActionType.OPEN_URL:
        return 'Open Website';
      case ActionType.RUN_COMMAND:
        return 'Run Command';
      case ActionType.MEDIA_CONTROL:
        return 'Media Control';
      case ActionType.CREATE_FOLDER:
        return 'Create Folder';
      case ActionType.RUN_SCRIPT:
        return 'Run Script';
      case ActionType.KEY_BINDING:
        return 'Key Binding';
      default:
        return 'None';
    }
  };

  const getCellActionTargetString = (cell?: Cell): string => {
    if (!cell?.action || cell.action.action.case !== 'singleAction') return '';
    const details = cell.action.action.value.actionDetails;
    if (!details) return '';
    switch (details.case) {
      case 'openUrl':
        return details.value.url;
      case 'launchApp':
        return details.value.pathOrName;
      case 'runCommand':
        return details.value.command;
      case 'createFolder':
        return details.value.path;
      case 'runScript':
        return details.value.path;
      case 'mediaControl':
        return details.value.command.toString();
      case 'keyBinding':
        return details.value.keys.join('+');
      default:
        return '';
    }
  };

  // Initialize TanStack Form
  const form = useForm({
    defaultValues: {
      label: '',
      actionType: 'None',
      target: '',
      background: '#2e3440',
    },
    onSubmit: async ({ value }) => {
      if (!selectedCoord || !activeProfile) return;

      const updatedCell = new Cell({
        row: selectedCoord.row,
        col: selectedCoord.col,
        page: activePage,
        label: value.label,
        background: value.background,
        isEnabled: true,
        icon: selectedCell?.icon || getActionDefaultEmoji(value.actionType),
      });

      if (value.actionType !== 'None') {
        const actionDetails = buildActionDetails(value.actionType, value.target);
        const action = new Action({
          id: selectedCell?.action?.action?.value?.id || `action_${Date.now()}`,
          name: `${value.actionType} Action`,
          type: getActionTypeValue(value.actionType),
          actionDetails,
        });

        updatedCell.action = new CellAction({
          action: {
            case: 'singleAction',
            value: action,
          },
        });
      } else {
        updatedCell.action = undefined;
      }

      await updateCellMutation.mutateAsync({
        profileId: activeProfile.id,
        cell: updatedCell,
      });
    },
  });

  const actionType = useStore(form.store, (state) => state.values.actionType);

  // Sync selected cell fields into form when selected cell changes
  useEffect(() => {
    if (selectedCell) {
      form.reset({
        label: selectedCell.label,
        actionType: getCellActionTypeString(selectedCell),
        target: getCellActionTargetString(selectedCell),
        background: selectedCell.background || '#2e3440',
      });
    } else {
      form.reset({
        label: '',
        actionType: 'None',
        target: '',
        background: '#2e3440',
      });
    }
  }, [selectedCoord, selectedCell, activeProfile?.id]);

  const handleTabClick = (tabName: string) => {
    const profileId = getProfileId(tabName);
    switchProfileMutation.mutate(profileId);
    setActivePage(0); // Reset to first page on profile switch
    setSelectedCoord({ row: 0, col: 0 });
  };

  const handleCellClick = (r: number, c: number) => {
    setSelectedCoord({ row: r, col: c });
  };

  // Render 2D grid matrix
  const gridRows = [];
  for (let r = 0; r < rows; r++) {
    const gridCols = [];
    for (let c = 0; c < cols; c++) {
      const cell = cells.find(
        (cellVal) => cellVal.row === r && cellVal.col === c,
      );
      gridCols.push(cell);
    }
    gridRows.push(gridCols);
  }

  if (isLoading) {
    return (
      <Flex flex={1} align="center" justify="center" bg="bg.default" h="full">
        <Spinner size="xl" color="primary" />
      </Flex>
    );
  }

  if (!deckData) {
    return <DisconnectedScreen onRetry={refetch} />;
  }

  return (
    <ScreenLayout
      tabs={tabs}
      activeTab={activeTabName}
      onTabClick={handleTabClick}
    >
      <Flex flex={1} overflow="hidden">
        {/* Main Content Area */}
        <Flex
          flex={1}
          bg="bg.default"
          align="center"
          justify="center"
          direction="column"
        >
          <Box
            bg="bg.panel"
            p={8}
            borderRadius="3xl"
            border="1px solid"
            borderColor="border.muted"
            boxShadow="xl"
          >
            {/* Page Navigator */}
            <HStack mb={4} gap={2} justify="center">
              {/* Prev arrow — only when >1 page */}
              {pageCount > 1 && (
                <Box
                  as="button"
                  type="button"
                  onClick={() => setActivePage((p) => Math.max(0, p - 1))}
                  opacity={activePage === 0 ? 0.3 : 1}
                  cursor={activePage === 0 ? 'not-allowed' : 'pointer'}
                  color="fg.subtle"
                  p={1}
                  borderRadius="md"
                  _hover={{ bg: 'bg.muted' }}
                  display="flex"
                  alignItems="center"
                >
                  <Icon as={LuChevronLeft} boxSize={4} />
                </Box>
              )}

              {Array.from({ length: pageCount }, (_, i) => (
                <Box
                  key={i}
                  as="button"
                  type="button"
                  onClick={() => {
                    setActivePage(i);
                    setSelectedCoord({ row: 0, col: 0 });
                  }}
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight={activePage === i ? 'bold' : 'medium'}
                  bg={activePage === i ? 'primary' : 'bg.subtle'}
                  color={activePage === i ? 'white' : 'fg.muted'}
                  border="1px solid"
                  borderColor={activePage === i ? 'primary' : 'border.muted'}
                  cursor="pointer"
                  transition="all 0.15s"
                  _hover={{ opacity: 0.85 }}
                >
                  Page {i + 1}
                </Box>
              ))}

              {/* Next arrow — only when >1 page */}
              {pageCount > 1 && (
                <Box
                  as="button"
                  type="button"
                  onClick={() => setActivePage((p) => Math.min(pageCount - 1, p + 1))}
                  opacity={activePage === pageCount - 1 ? 0.3 : 1}
                  cursor={activePage === pageCount - 1 ? 'not-allowed' : 'pointer'}
                  color="fg.subtle"
                  p={1}
                  borderRadius="md"
                  _hover={{ bg: 'bg.muted' }}
                  display="flex"
                  alignItems="center"
                >
                  <Icon as={LuChevronRight} boxSize={4} />
                </Box>
              )}

              {/* Add Page button */}
              <Box
                as="button"
                type="button"
                onClick={() => {
                  const newPage = pageCount;
                  setActivePage(newPage);
                  setSelectedCoord({ row: 0, col: 0 });
                }}
                px={3}
                py={1}
                borderRadius="full"
                fontSize="xs"
                fontWeight="medium"
                bg="bg.subtle"
                color="fg.muted"
                border="1px dashed"
                borderColor="border.muted"
                cursor="pointer"
                transition="all 0.15s"
                display="flex"
                alignItems="center"
                gap={1}
                _hover={{ bg: 'bg.muted', color: 'fg' }}
              >
                <Icon as={LuPlus} boxSize={3} />
                Add Page
              </Box>
            </HStack>
            <VStack gap={4}>
              {gridRows.map((rowCells, rIdx) => (
                <HStack key={rIdx} gap={4}>
                  {rowCells.map((cell, cIdx) => {
                    const isActive =
                      selectedCoord?.row === rIdx &&
                      selectedCoord?.col === cIdx;
                    return (
                      <GridButton
                        key={cIdx}
                        icon={cell?.icon || undefined}
                        label={cell?.label || undefined}
                        background={cell?.background || undefined}
                        isActive={isActive}
                        isEmpty={!cell}
                        onClick={() => handleCellClick(rIdx, cIdx)}
                      />
                    );
                  })}
                </HStack>
              ))}
            </VStack>
          </Box>
        </Flex>

        {/* Right Property Inspector */}
        <VStack
          as="form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
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
              Editing selected cell (R{(selectedCoord?.row ?? 0) + 1} C
              {(selectedCoord?.col ?? 0) + 1})
            </Text>
          </VStack>

          <VStack align="stretch" gap={6}>
            <form.Field
              name="label"
              children={(field) => (
                <VStack align="flex-start" gap={2}>
                  <Text fontSize="xs" fontWeight="semibold" color="fg.muted">
                    Action Label
                  </Text>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    bg="transparent"
                    border="1px solid"
                    borderColor="border"
                    fontSize="sm"
                    color="fg"
                    _focus={{ borderColor: 'primary', boxShadow: 'none' }}
                  />
                </VStack>
              )}
            />

            <form.Field
              name="actionType"
              children={(field) => (
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
                      width: '100%',
                    }}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  >
                    <option
                      value="None"
                      style={{
                        background: 'var(--chakra-colors-bg-panel)',
                        color: 'var(--chakra-colors-fg)',
                      }}
                    >
                      None
                    </option>
                    <option
                      value="Launch App"
                      style={{
                        background: 'var(--chakra-colors-bg-panel)',
                        color: 'var(--chakra-colors-fg)',
                      }}
                    >
                      Launch App
                    </option>
                    <option
                      value="Open Website"
                      style={{
                        background: 'var(--chakra-colors-bg-panel)',
                        color: 'var(--chakra-colors-fg)',
                      }}
                    >
                      Open Website
                    </option>
                    <option
                      value="Run Command"
                      style={{
                        background: 'var(--chakra-colors-bg-panel)',
                        color: 'var(--chakra-colors-fg)',
                      }}
                    >
                      Run Command
                    </option>
                    <option
                      value="Media Control"
                      style={{
                        background: 'var(--chakra-colors-bg-panel)',
                        color: 'var(--chakra-colors-fg)',
                      }}
                    >
                      Media Control
                    </option>
                    <option
                      value="Create Folder"
                      style={{
                        background: 'var(--chakra-colors-bg-panel)',
                        color: 'var(--chakra-colors-fg)',
                      }}
                    >
                      Create Folder
                    </option>
                    <option
                      value="Run Script"
                      style={{
                        background: 'var(--chakra-colors-bg-panel)',
                        color: 'var(--chakra-colors-fg)',
                      }}
                    >
                      Run Script
                    </option>
                    <option
                      value="Key Binding"
                      style={{
                        background: 'var(--chakra-colors-bg-panel)',
                        color: 'var(--chakra-colors-fg)',
                      }}
                    >
                      Key Binding
                    </option>
                  </select>
                </VStack>
              )}
            />

            {actionType !== 'None' && (
              <form.Field
                name="target"
                children={(field) => (
                  <VStack align="flex-start" gap={2} w="100%">
                    <Text fontSize="xs" fontWeight="semibold" color="fg.muted">
                      {actionType === 'Open Website'
                        ? 'Target URL'
                        : actionType === 'Launch App'
                          ? 'App Path or Name'
                          : actionType === 'Run Command'
                            ? 'Command Line'
                            : actionType === 'Create Folder'
                              ? 'Folder Path'
                              : actionType === 'Run Script'
                                ? 'Script Path'
                                : actionType === 'Media Control'
                                  ? 'Media Command'
                                  : actionType === 'Key Binding'
                                    ? 'Key Combination (e.g. Control+c)'
                                    : 'Target Path/Value'}
                    </Text>
                    {actionType === 'Media Control' ? (
                      <select
                        style={{
                          background: 'transparent',
                          border: '1px solid var(--chakra-colors-border)',
                          fontSize: '14px',
                          color: 'var(--chakra-colors-fg)',
                          padding: '8px',
                          borderRadius: '6px',
                          outline: 'none',
                          width: '100%',
                        }}
                        value={field.state.value || MediaCommand.PLAY.toString()}
                        onChange={(e) => field.handleChange(e.target.value)}
                      >
                        <option value={MediaCommand.PLAY.toString()} style={{ background: 'var(--chakra-colors-bg-panel)' }}>Play</option>
                        <option value={MediaCommand.PAUSE.toString()} style={{ background: 'var(--chakra-colors-bg-panel)' }}>Pause</option>
                        <option value={MediaCommand.PLAY_PAUSE.toString()} style={{ background: 'var(--chakra-colors-bg-panel)' }}>Play/Pause</option>
                        <option value={MediaCommand.STOP.toString()} style={{ background: 'var(--chakra-colors-bg-panel)' }}>Stop</option>
                        <option value={MediaCommand.NEXT.toString()} style={{ background: 'var(--chakra-colors-bg-panel)' }}>Next Track</option>
                        <option value={MediaCommand.PREVIOUS.toString()} style={{ background: 'var(--chakra-colors-bg-panel)' }}>Previous Track</option>
                        <option value={MediaCommand.MUTE.toString()} style={{ background: 'var(--chakra-colors-bg-panel)' }}>Mute</option>
                        <option value={MediaCommand.VOLUME_UP.toString()} style={{ background: 'var(--chakra-colors-bg-panel)' }}>Volume Up</option>
                        <option value={MediaCommand.VOLUME_DOWN.toString()} style={{ background: 'var(--chakra-colors-bg-panel)' }}>Volume Down</option>
                      </select>
                    ) : (
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder={
                          actionType === 'Key Binding'
                            ? 'e.g. Control+c'
                            : 'Enter action target...'
                        }
                        bg="transparent"
                        border="1px solid"
                        borderColor="border"
                        fontSize="sm"
                        color="fg"
                        _focus={{ borderColor: 'primary', boxShadow: 'none' }}
                      />
                    )}
                  </VStack>
                )}
              />
            )}

            <form.Field
              name="background"
              children={(field) => (
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
                    <input
                      type="color"
                      value={field.state.value || '#2e3440'}
                      onChange={(e) => field.handleChange(e.target.value)}
                      style={{
                        width: '24px',
                        height: '24px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        background: 'transparent',
                        padding: 0,
                      }}
                    />
                    <Input
                      border="none"
                      _focus={{ boxShadow: 'none' }}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      fontSize="sm"
                      color="fg.muted"
                      fontWeight="medium"
                      w="100px"
                    />
                  </HStack>
                </VStack>
              )}
            />

            <HStack justify="space-between">
              <Text fontSize="sm" color="fg.muted" fontWeight="medium">
                Show Icon
              </Text>
              <CustomSwitch isChecked={!!selectedCell?.icon} />
            </HStack>
          </VStack>

          <VStack align="stretch" gap={3} pt={4}>
            <Button
              type="submit"
              bg="blue.200"
              color="blue.900"
              _hover={{ bg: 'blue.300' }}
              size="md"
              fontWeight="bold"
              loading={updateCellMutation.isPending}
            >
              Save Changes
            </Button>
            <Button
              type="button"
              bg="bg.subtle"
              color="fg"
              _hover={{ bg: 'bg.muted' }}
              size="md"
              fontWeight="medium"
              onClick={() => refetch()}
            >
              Reset to Default
            </Button>
          </VStack>

          <Box
            mt="auto"
            borderRadius="xl"
            overflow="hidden"
            position="relative"
            border="1px solid"
            borderColor="border.muted"
          >
            <Box
              h="120px"
              backgroundImage="url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400')"
              backgroundSize="cover"
              backgroundPosition="center"
            />
            <Box
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              bg="blackAlpha.800"
              p={3}
              backdropFilter="blur(10px)"
            >
              <Text fontSize="2xs" color="whiteAlpha.600" fontWeight="medium">
                Connected Source
              </Text>
              <Text fontSize="sm" color="white" fontWeight="bold">
                {serverInfo?.name || 'Local Server'}
              </Text>
            </Box>
          </Box>
        </VStack>
      </Flex>
    </ScreenLayout>
  );
};
