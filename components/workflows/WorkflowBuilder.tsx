'use client';

import React from 'react';
import WorkflowStep from './WorkflowStep';

interface Step {
  id: string;
  name: string;
  type: string;
  status?: 'pending' | 'running' | 'completed' | 'failed';
}

interface WorkflowBuilderProps {
  steps: Step[];
  onAddStep?: () => void;
  onRemoveStep?: (id: string) => void;
  onEditStep?: (id: string) => void;
}

export default function WorkflowBuilder({
  steps,
  onAddStep,
  onRemoveStep,
  onEditStep,
}: WorkflowBuilderProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Workflow Steps</h3>
        {onAddStep && (
          <button
            onClick={onAddStep}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            + Add Step
          </button>
        )}
      </div>

      {steps.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <svg
            className="mx-auto h-12 w-12 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p>No workflow steps defined yet</p>
          <p className="text-sm mt-2">Add steps to build your agent workflow</p>
        </div>
      ) : (
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              <WorkflowStep
                step={step}
                index={index + 1}
                onRemove={onRemoveStep ? () => onRemoveStep(step.id) : undefined}
                onEdit={onEditStep ? () => onEditStep(step.id) : undefined}
              />
              {index < steps.length - 1 && (
                <div className="flex justify-center my-2">
                  <svg
                    className="h-6 w-6 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
