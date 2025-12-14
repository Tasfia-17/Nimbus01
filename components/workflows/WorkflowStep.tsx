import React from 'react';

interface Step {
  id: string;
  name: string;
  type: string;
  status?: 'pending' | 'running' | 'completed' | 'failed';
}

interface WorkflowStepProps {
  step: Step;
  index: number;
  onRemove?: () => void;
  onEdit?: () => void;
}

export default function WorkflowStep({ step, index, onRemove, onEdit }: WorkflowStepProps) {
  const statusColors = {
    pending: 'bg-gray-100 text-gray-600',
    running: 'bg-blue-100 text-blue-600',
    completed: 'bg-green-100 text-green-600',
    failed: 'bg-red-100 text-red-600',
  };

  const statusIcons = {
    pending: '⏳',
    running: '▶️',
    completed: '✅',
    failed: '❌',
  };

  return (
    <div className="flex items-center space-x-4 bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
        {index}
      </div>
      
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{step.name}</h4>
        <p className="text-sm text-gray-500">{step.type}</p>
      </div>

      {step.status && (
        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${statusColors[step.status]}`}>
          <span>{statusIcons[step.status]}</span>
          <span>{step.status.toUpperCase()}</span>
        </span>
      )}

      <div className="flex items-center space-x-2">
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Edit step"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
        {onRemove && (
          <button
            onClick={onRemove}
            className="p-2 text-red-400 hover:text-red-600 transition-colors"
            title="Remove step"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
