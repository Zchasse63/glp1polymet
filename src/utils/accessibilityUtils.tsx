
/**
 * Re-export all accessibility utilities for backward compatibility
 * This is a bridge file to maintain backward compatibility while
 * encouraging direct imports from the new structure
 */

export {
  useFocusTrap,
  ScreenReaderAnnouncement,
  useSkipLink,
  AccessibleButton,
  AccessibleLabel,
  useReducedMotion,
  AccessibleIcon,
  AccessibleDialog
} from './accessibility';
