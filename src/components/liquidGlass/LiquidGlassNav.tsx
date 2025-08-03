import React, { useRef } from 'react';
import { Box, Flex, Link, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useLiquidGlass } from '../../utils/liquidGlass';
import '../../styles/liquidGlass.css';

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface LiquidGlassNavProps {
  items: NavItem[];
  logo?: React.ReactNode;
}

const LiquidGlassNav: React.FC<LiquidGlassNavProps> = ({
  items,
  logo
}) => {
  const navRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  
  useLiquidGlass(navRef, {
    mouseTracking: true,
    waveEffect: false,
    adaptiveBlur: true,
    intensity: 0.9
  });

  const activeColor = useColorModeValue('rgba(0, 0, 0, 0.9)', 'rgba(255, 255, 255, 0.9)');
  const inactiveColor = useColorModeValue('rgba(0, 0, 0, 0.6)', 'rgba(255, 255, 255, 0.6)');

  return (
    <Box
      ref={navRef}
      className="liquid-glass-nav"
      position="fixed"
      top="20px"
      left="50%"
      transform="translateX(-50%)"
      zIndex="1000"
    >
      <Flex align="center" gap={6}>
        {logo && (
          <Box mr={4}>
            {logo}
          </Box>
        )}
        
        {items.map((item, index) => {
          const isActive = location.pathname === item.href;
          
          if (item.external) {
            return (
              <Link
                key={index}
                href={item.href}
                isExternal
                color={inactiveColor}
                fontWeight="500"
                fontSize="sm"
                textDecoration="none"
                position="relative"
                _hover={{
                  color: activeColor,
                  textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)'
                }}
                transition="all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
              >
                {item.label}
              </Link>
            );
          }

          return (
            <Link
              key={index}
              as={RouterLink}
              to={item.href}
              color={isActive ? activeColor : inactiveColor}
              fontWeight={isActive ? "600" : "500"}
              fontSize="sm"
              textDecoration="none"
              position="relative"
              _hover={{
                color: activeColor,
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)'
              }}
              _after={isActive ? {
                content: '""',
                position: 'absolute',
                bottom: '-4px',
                left: '0',
                right: '0',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, currentColor, transparent)',
                borderRadius: '1px',
                opacity: 0.8
              } : {}}
              transition="all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
            >
              {item.label}
            </Link>
          );
        })}
      </Flex>
    </Box>
  );
};

export default LiquidGlassNav;