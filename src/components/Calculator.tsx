import React, { useState } from 'react';
import { Calculator as CalcIcon } from 'lucide-react';
import { useCalculator } from '../hooks/useCalculator';
import { CustomerInfoTab } from './tabs/CustomerInfoTab';
import { TripDetailsTab } from './tabs/TripDetailsTab';
import { PrimaryTab } from './tabs/PrimaryTab';
import { TripInfoTab } from './tabs/TripInfoTab';
import { FarmOutTab } from './tabs/FarmOutTab';

const tabs = ['Customer Info', 'Trip Details', 'Trip Cost', 'Trip Info', 'Farm-Out Info'];

export default function Calculator() {
  const [activeTab, setActiveTab] = useState(0);
  const {
    costs,
    calculations,
    handleInputChange,
    calculateAll,
    resetCalculator,
    handleEmailInvoice,
    saveCalculations
  } = useCalculator();

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <CustomerInfoTab />;
      case 1:
        return <TripDetailsTab />;
      case 2:
        return (
          <PrimaryTab
            costs={costs}
            calculations={calculations}
            onInputChange={handleInputChange}
            onCurrencyChange={(value) => handleInputChange('currency', value)}
            onSave={saveCalculations}
            onReset={resetCalculator}
            onCalculate={calculateAll}
          />
        );
      case 3:
        return <TripInfoTab />;
      case 4:
        return <FarmOutTab />;
      default:
        return <div>Tab content coming soon</div>;
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg transition-colors duration-200
      dark:bg-dark-bg-secondary dark:text-dark-text-primary">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalcIcon className="h-6 w-6" />
          Trip Cost Calculator
        </h1>
      </div>

      <div className="mb-6">
        <div className="flex gap-2 border-b border-gray-200 dark:border-dark-border-default">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              className={`px-4 py-2 ${
                activeTab === index
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:border-dark-brand-blue dark:text-dark-brand-blue'
                  : 'text-gray-500 dark:text-dark-text-secondary'
              }`}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {renderTabContent()}
    </div>
  );
}