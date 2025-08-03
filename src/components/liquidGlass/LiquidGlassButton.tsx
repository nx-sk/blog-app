import React, { useRef } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import { useLiquidGlass, LiquidGlassOptions } from '../../utils/liquidGlass';
import '../../styles/liquidGlass.css';

export interface LiquidGlassButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'glass' | 'primary' | 'secondary';
  glassOptions?: LiquidGlassOptions;
  to?: string;
}

const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({
  variant = 'glass',
  glassOptions = {},
  children,
  className = '',
  onClick,
  to,
  ...buttonProps
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  
  const defaultGlassOptions: LiquidGlassOptions = {
    mouseTracking: true,
    waveEffect: true,
    adaptiveBlur: false,
    intensity: 0.8,
    ...glassOptions
  };

  const { triggerWave } = useLiquidGlass(buttonRef, defaultGlassOptions);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    triggerWave(event);
    if (onClick) {
      onClick(event);
    }
  };

  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'liquid-glass-button--primary';
      case 'secondary':
        return 'liquid-glass-button--secondary';
      default:
        return '';
    }
  };

  const buttonClassName = [
    'liquid-glass-button',
    getVariantClass(),
    className
  ].filter(Boolean).join(' ');

  return (
    <Button
      ref={buttonRef}
      className={buttonClassName}
      onClick={handleClick}
      bg="transparent"
      border="none"
      _hover={{
        bg: 'transparent',
        transform: 'translateY(-2px)',
      }}
      _active={{
        bg: 'transparent',
        transform: 'translateY(-1px) scale(0.98)',
      }}
      _focus={{
        boxShadow: 'none',
      }}
      to={to}
      {...buttonProps}
    >
      {children}
    </Button>
  );
};

export default LiquidGlassButton;