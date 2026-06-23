import React from 'react';
import { Flex } from '@chakra-ui/react';
import { Sidebar } from './Sidebar';
import { TopBar, TopBarProps } from './TopBar';

type ScreenLayoutProps = TopBarProps & {
  children: React.ReactNode;
};

export const ScreenLayout = ({
  children,
  ...topBarProps
}: ScreenLayoutProps) => {
  return (
    <Flex h="full" w="full" bg="bg.default" color="fg" overflow="hidden">
      <Sidebar />
      <Flex flex={1} direction="column" overflow="hidden">
        <TopBar {...topBarProps} />
        {children}
      </Flex>
    </Flex>
  );
};
