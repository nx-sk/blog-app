import React, { useRef } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import { useLiquidGlass, LiquidGlassOptions } from '../../utils/liquidGlass';
import '../../styles/liquidGlass.css';

export interface LiquidGlassCardProps extends BoxProps {
  variant?: 'shallow' | 'medium' | 'deep';
  size?: 'small' | 'medium' | 'large';
  interactive?: boolean;
  glassOptions?: LiquidGlassOptions;
  children?: React.ReactNode;
}

const LiquidGlassCard = ({
  variant = 'medium',
  size = 'medium',
  interactive = true,
  glassOptions = {},
  children,
  className = '',
  ...boxProps
}: LiquidGlassCardProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  
  const defaultGlassOptions: LiquidGlassOptions = {
    mouseTracking: interactive,
    waveEffect: interactive,
    adaptiveBlur: true,
    ...glassOptions
  };

  const { triggerWave } = useLiquidGlass(cardRef, defaultGlassOptions);

  const getVariantClass = () => {
    switch (variant) {
      case 'shallow':
        return 'liquid-glass--shallow';
      case 'deep':
        return 'liquid-glass--deep';
      default:
        return '';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'liquid-glass--small';
      case 'large':
        return 'liquid-glass--large';
      default:
        return 'liquid-glass--medium';
    }
  };

  const cardClassName = [
    'liquid-glass-card',
    getVariantClass(),
    getSizeClass(),
    className
  ].filter(Boolean).join(' ');

  return (
    <Box
      ref={cardRef}
      className={cardClassName}
      onClick={interactive ? triggerWave : undefined}
      cursor={interactive ? 'pointer' : 'default'}
      {...boxProps}
    >
      <div className="liquid-glass-card__content">
        {children}
      </div>
    </Box>
  );
};

export default LiquidGlassCard;