// Apple Liquid Glass Dynamic Effects System
import React from 'react';

export interface LiquidGlassOptions {
  intensity?: number;
  viscosity?: number;
  dispersion?: boolean;
  mouseTracking?: boolean;
  waveEffect?: boolean;
  adaptiveBlur?: boolean;
  performanceMode?: 'high' | 'medium' | 'low';
}

export interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

class LiquidGlassManager {
  private elements: Map<HTMLElement, LiquidGlassOptions> = new Map();
  private mousePosition: MousePosition = { x: 0, y: 0, normalizedX: 0.5, normalizedY: 0.5 };
  private animationFrame: number | null = null;
  private time: number = 0;
  private performanceLevel: 'high' | 'medium' | 'low' = 'high';

  constructor() {
    this.init();
  }

  private init() {
    this.detectPerformanceLevel();
    this.setupEventListeners();
    this.startAnimationLoop();
  }

  private detectPerformanceLevel() {
    // Detect device capabilities
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const hasWebGL = !!gl;
    const hasGPUAcceleration = window.CSS?.supports?.('backdrop-filter', 'blur(10px)') || false;
    const deviceMemory = (navigator as any).deviceMemory || 4;
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;

    if (hasWebGL && hasGPUAcceleration && deviceMemory >= 8 && hardwareConcurrency >= 8) {
      this.performanceLevel = 'high';
    } else if (hasGPUAcceleration && deviceMemory >= 4) {
      this.performanceLevel = 'medium';
    } else {
      this.performanceLevel = 'low';
    }

    // Respect user preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.performanceLevel = 'low';
    }
  }

  private setupEventListeners() {
    document.addEventListener('mousemove', this.handleMouseMove.bind(this), { passive: true });
    document.addEventListener('click', this.handleClick.bind(this), { passive: true });
    window.addEventListener('resize', this.handleResize.bind(this), { passive: true });
    
    // Handle visibility change for performance
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAnimations();
      } else {
        this.resumeAnimations();
      }
    });
  }

  private handleMouseMove(event: MouseEvent) {
    this.mousePosition = {
      x: event.clientX,
      y: event.clientY,
      normalizedX: event.clientX / window.innerWidth,
      normalizedY: event.clientY / window.innerHeight
    };

    // Update CSS custom properties for mouse tracking
    this.updateMouseVariables();
  }

  private handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const liquidGlassElement = target.closest('.liquid-glass');
    
    if (liquidGlassElement) {
      this.triggerWaveEffect(liquidGlassElement as HTMLElement, event);
    }
  }

  private handleResize() {
    // Recalculate normalized mouse position
    this.mousePosition = {
      ...this.mousePosition,
      normalizedX: this.mousePosition.x / window.innerWidth,
      normalizedY: this.mousePosition.y / window.innerHeight
    };
  }

  private updateMouseVariables() {
    const root = document.documentElement;
    root.style.setProperty('--glass-mouse-x', `${this.mousePosition.normalizedX * 100}%`);
    root.style.setProperty('--glass-mouse-y', `${this.mousePosition.normalizedY * 100}%`);
  }

  private triggerWaveEffect(element: HTMLElement, event: MouseEvent) {
    const options = this.elements.get(element);
    if (!options?.waveEffect) return;

    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    element.style.setProperty('--glass-click-x', `${x}%`);
    element.style.setProperty('--glass-click-y', `${y}%`);
    
    element.classList.add('wave-effect');
    
    setTimeout(() => {
      element.classList.remove('wave-effect');
    }, 1500);
  }

  private startAnimationLoop() {
    const animate = (timestamp: number) => {
      this.time = timestamp * 0.001; // Convert to seconds
      
      // Update time-based animations with enhanced glass effects
      document.documentElement.style.setProperty('--glass-time', this.time.toString());
      document.documentElement.style.setProperty('--glass-angle', `${this.time * 20}deg`);
      
      // Update adaptive blur based on movement
      this.updateAdaptiveEffects();
      
      this.animationFrame = requestAnimationFrame(animate);
    };
    
    this.animationFrame = requestAnimationFrame(animate);
  }

  private updateAdaptiveEffects() {
    if (this.performanceLevel === 'low') return;

    this.elements.forEach((options, element) => {
      if (!options.adaptiveBlur) return;

      // Calculate distance from mouse
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(this.mousePosition.x - centerX, 2) + 
        Math.pow(this.mousePosition.y - centerY, 2)
      );
      
      // Enhanced adaptive blur based on distance with glass-specific ranges
      const maxDistance = Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2));
      const normalizedDistance = Math.min(distance / maxDistance, 1);
      const baseBlur = 16;
      const maxBlurIncrease = 32;
      const blurIntensity = baseBlur + (maxBlurIncrease * (1 - normalizedDistance));
      
      element.style.setProperty('--glass-blur-primary', `${blurIntensity}px`);
      element.style.setProperty('--glass-blur-secondary', `${blurIntensity * 0.75}px`);
      element.style.setProperty('--glass-blur-tertiary', `${blurIntensity * 0.5}px`);
    });
  }

  private pauseAnimations() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  private resumeAnimations() {
    if (!this.animationFrame) {
      this.startAnimationLoop();
    }
  }

  // Public methods
  public registerElement(element: HTMLElement, options: LiquidGlassOptions = {}) {
    const defaultOptions: LiquidGlassOptions = {
      intensity: 1,
      viscosity: 0.3,
      dispersion: true,
      mouseTracking: true,
      waveEffect: true,
      adaptiveBlur: this.performanceLevel !== 'low',
      performanceMode: this.performanceLevel
    };

    const finalOptions = { ...defaultOptions, ...options };
    this.elements.set(element, finalOptions);

    // Apply performance-based optimizations
    this.applyPerformanceOptimizations(element, finalOptions);
  }

  private applyPerformanceOptimizations(element: HTMLElement, options: LiquidGlassOptions) {
    element.classList.add('liquid-glass-optimized');

    switch (options.performanceMode) {
      case 'low':
        element.style.setProperty('--glass-blur-primary', '12px');
        element.style.setProperty('--glass-blur-secondary', '8px');
        element.style.setProperty('--glass-blur-tertiary', '6px');
        element.style.setProperty('--glass-saturation', '140%');
        element.style.setProperty('--glass-brightness', '1.1');
        break;
      
      case 'medium':
        element.style.setProperty('--glass-blur-primary', '20px');
        element.style.setProperty('--glass-blur-secondary', '16px');
        element.style.setProperty('--glass-blur-tertiary', '12px');
        element.style.setProperty('--glass-saturation', '200%');
        element.style.setProperty('--glass-brightness', '1.2');
        break;
      
      case 'high':
      default:
        // Use full glass effect with maximum quality
        element.style.setProperty('--glass-blur-primary', '32px');
        element.style.setProperty('--glass-blur-secondary', '24px');
        element.style.setProperty('--glass-blur-tertiary', '16px');
        element.style.setProperty('--glass-saturation', '280%');
        element.style.setProperty('--glass-brightness', '1.4');
        element.style.setProperty('--glass-contrast', '1.2');
        break;
    }
  }

  public unregisterElement(element: HTMLElement) {
    this.elements.delete(element);
    element.classList.remove('liquid-glass-optimized', 'wave-effect');
  }

  public updateOptions(element: HTMLElement, options: Partial<LiquidGlassOptions>) {
    const currentOptions = this.elements.get(element);
    if (currentOptions) {
      const newOptions = { ...currentOptions, ...options };
      this.elements.set(element, newOptions);
      this.applyPerformanceOptimizations(element, newOptions);
    }
  }

  public setGlobalPerformanceMode(mode: 'high' | 'medium' | 'low') {
    this.performanceLevel = mode;
    
    // Update all registered elements
    this.elements.forEach((options, element) => {
      const newOptions = { ...options, performanceMode: mode };
      this.elements.set(element, newOptions);
      this.applyPerformanceOptimizations(element, newOptions);
    });
  }

  public destroy() {
    this.pauseAnimations();
    this.elements.clear();
    
    // Remove event listeners
    document.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    document.removeEventListener('click', this.handleClick.bind(this));
    window.removeEventListener('resize', this.handleResize.bind(this));
  }
}

// Global instance
export const liquidGlassManager = new LiquidGlassManager();

// React Hook for Liquid Glass effects
export const useLiquidGlass = (
  elementRef: React.RefObject<HTMLElement | null>,
  options: LiquidGlassOptions = {}
) => {
  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    liquidGlassManager.registerElement(element, options);

    return () => {
      liquidGlassManager.unregisterElement(element);
    };
  }, [elementRef, options]);

  return {
    triggerWave: (event: React.MouseEvent) => {
      const element = elementRef.current;
      if (element) {
        liquidGlassManager['triggerWaveEffect'](element, event.nativeEvent);
      }
    },
    updateOptions: (newOptions: Partial<LiquidGlassOptions>) => {
      const element = elementRef.current;
      if (element) {
        liquidGlassManager.updateOptions(element, newOptions);
      }
    }
  };
};

// Utility functions for background analysis
export const analyzeBackgroundLuminance = (element: HTMLElement): number => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return 0.5;

  const rect = element.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  // Capture background content (simplified)
  try {
    // This is a simplified approach - in practice, you'd need to capture the actual background
    const computedStyle = getComputedStyle(element.parentElement || document.body);
    const bgColor = computedStyle.backgroundColor;
    
    // Parse RGB values and calculate luminance
    const rgb = bgColor.match(/\d+/g);
    if (rgb && rgb.length >= 3) {
      const [r, g, b] = rgb.map(Number);
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    }
  } catch (error) {
    console.warn('Background luminance analysis failed:', error);
  }

  return 0.5; // Default middle luminance
};

export const adjustContrastForReadability = (
  element: HTMLElement,
  targetContrast: number = 4.5
) => {
  const backgroundLuminance = analyzeBackgroundLuminance(element);
  const textColor = backgroundLuminance > 0.5 ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.95)';
  const glassOpacity = backgroundLuminance > 0.5 ? 0.3 : 0.7;
  
  // Enhanced glass properties based on background
  const glassSaturation = backgroundLuminance > 0.5 ? '280%' : '320%';
  const glassBrightness = backgroundLuminance > 0.5 ? '1.4' : '1.6';

  element.style.setProperty('color', textColor);
  element.style.setProperty('--glass-opacity', glassOpacity.toString());
  element.style.setProperty('--glass-saturation', glassSaturation);
  element.style.setProperty('--glass-brightness', glassBrightness);
};