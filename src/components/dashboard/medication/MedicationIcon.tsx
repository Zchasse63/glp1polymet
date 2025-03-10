
import React from "react";
import { 
  PillIcon, 
  HeartPulseIcon, 
  BrainIcon, 
  ActivityIcon, 
  TabletIcon 
} from "lucide-react";

interface MedicationIconProps {
  medicationId: string;
  color: string;
  size?: number;
  className?: string;
}

/**
 * MedicationIcon component that selects an appropriate icon based on medication ID
 * and applies consistent styling
 */
export const MedicationIcon = ({ 
  medicationId, 
  color, 
  size = 5, 
  className = "" 
}: MedicationIconProps) => {
  // Function to generate a gradient background based on medication color
  const generateGradientStyle = (color: string) => {
    return {
      background: `linear-gradient(135deg, ${color}30, ${color}60)`,
      borderRadius: '50%',
      padding: '12px',
      boxShadow: `0 4px 10px ${color}40`,
    };
  };

  // Function to generate pill icon style
  const generatePillStyle = (color: string) => {
    return {
      color: color,
      filter: 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2))',
    };
  };

  // Function to get appropriate icon based on medication ID
  const getMedicationIcon = (medicationId: string) => {
    // Use different icons based on the first character of medication ID for demo variation
    const firstChar = medicationId.charAt(0).toLowerCase();
    
    switch(true) {
      case firstChar <= 'd':
        return <PillIcon className={`h-${size} w-${size} transition-all animate-pulse-subtle ${className}`} />;
      case firstChar <= 'h':
        return <HeartPulseIcon className={`h-${size} w-${size} transition-all animate-pulse-subtle ${className}`} />;
      case firstChar <= 'l':
        return <BrainIcon className={`h-${size} w-${size} transition-all animate-pulse-subtle ${className}`} />;
      case firstChar <= 'p':
        return <TabletIcon className={`h-${size} w-${size} transition-all animate-pulse-subtle ${className}`} />;
      default:
        return <ActivityIcon className={`h-${size} w-${size} transition-all animate-pulse-subtle ${className}`} />;
    }
  };

  return (
    <div
      className="flex items-center justify-center"
      style={generateGradientStyle(color)}
    >
      {React.cloneElement(getMedicationIcon(medicationId), {
        style: generatePillStyle(color)
      })}
    </div>
  );
};

export default MedicationIcon;
