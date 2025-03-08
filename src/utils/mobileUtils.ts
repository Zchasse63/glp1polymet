
/**
 * Mobile Utils
 * 
 * Following CodeFarm Development Methodology:
 * - Single Responsibility: Focused on mobile-specific functionality
 * - Sustainable Code: Consistent mobile integration
 */
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

/**
 * Check if app is running on a mobile device via Capacitor
 */
export const isMobileApp = (): boolean => {
  return Capacitor.isNativePlatform() && (Capacitor.getPlatform() === 'ios' || Capacitor.getPlatform() === 'android');
};

/**
 * Initialize mobile-specific event listeners
 */
export const initMobileListeners = (): void => {
  if (!isMobileApp()) return;
  
  // Handle app state changes
  App.addListener('appStateChange', ({ isActive }) => {
    console.log('App state changed. Is active?', isActive);
    
    // Handle app going to background or returning to foreground
    if (isActive) {
      // App returned to foreground
      console.log('App returned to foreground');
    } else {
      // App went to background
      console.log('App went to background');
    }
  });

  // Handle back button (Android)
  App.addListener('backButton', () => {
    console.log('Back button pressed');
    // Custom back button handling can be implemented here
  });
};

/**
 * Get mobile device info
 */
export const getMobileInfo = async (): Promise<any> => {
  if (!isMobileApp()) return null;
  
  try {
    const { Device } = await import('@capacitor/device');
    const info = await Device.getInfo();
    return info;
  } catch (error) {
    console.error('Error getting device info:', error);
    return null;
  }
};
