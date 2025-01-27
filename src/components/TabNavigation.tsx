import React, { useState } from 'react';

const tabs = ['Primary', 'Secondary', 'Farm-out Costs'];

export function TabNavigation() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="mb-6">
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            className={`px-4 py-2 ${
              activeTab === index
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}