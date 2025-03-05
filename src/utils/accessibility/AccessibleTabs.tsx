
import React, { useState, useEffect } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface AccessibleTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  orientation?: 'horizontal' | 'vertical';
  onChange?: (tabId: string) => void;
  className?: string;
}

/**
 * AccessibleTabs Component
 * 
 * Renders WAI-ARIA compliant tabs with keyboard navigation
 */
export function AccessibleTabs({
  tabs,
  defaultTab,
  orientation = 'horizontal',
  onChange,
  className
}: AccessibleTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0]?.id || '');
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const tabCount = tabs.length;
    let newIndex = index;
    
    // Handle arrow keys for navigation
    if (orientation === 'horizontal') {
      if (e.key === 'ArrowLeft') {
        newIndex = (index - 1 + tabCount) % tabCount;
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        newIndex = (index + 1) % tabCount;
        e.preventDefault();
      }
    } else {
      if (e.key === 'ArrowUp') {
        newIndex = (index - 1 + tabCount) % tabCount;
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        newIndex = (index + 1) % tabCount;
        e.preventDefault();
      }
    }
    
    // Handle Home and End keys
    if (e.key === 'Home') {
      newIndex = 0;
      e.preventDefault();
    } else if (e.key === 'End') {
      newIndex = tabCount - 1;
      e.preventDefault();
    }
    
    // If index changed, activate the new tab
    if (newIndex !== index) {
      const newTab = tabs[newIndex].id;
      setActiveTab(newTab);
      if (onChange) onChange(newTab);
    }
  };
  
  // Change active tab
  const activateTab = (tabId: string) => {
    setActiveTab(tabId);
    if (onChange) onChange(tabId);
  };
  
  // Ensure a valid tab is selected
  useEffect(() => {
    if (tabs.length > 0 && !tabs.some(tab => tab.id === activeTab)) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);
  
  return (
    <div className={className}>
      <div
        role="tablist"
        aria-orientation={orientation}
        className={`flex ${orientation === 'vertical' ? 'flex-col' : ''} border-b`}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            className={`px-4 py-2 font-medium ${
              activeTab === tab.id 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => activateTab(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {tabs.map(tab => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`tabpanel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeTab !== tab.id}
          tabIndex={0}
          className="p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
