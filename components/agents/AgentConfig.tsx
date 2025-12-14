'use client';

import React, { useState } from 'react';

interface AgentConfigProps {
  initialData?: {
    name: string;
    description: string;
    instructions: string;
    model: string;
    triggers: any[];
    tools: any[];
  };
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

export default function AgentConfig({
  initialData,
  onSubmit,
  onCancel,
}: AgentConfigProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    instructions: initialData?.instructions || '',
    model: initialData?.model || 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo',
    triggers: initialData?.triggers || [],
    tools: initialData?.tools || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Agent Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., Competition Scanner"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Brief description of what this agent does..."
        />
      </div>

      {/* Instructions */}
      <div>
        <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
          Instructions *
        </label>
        <textarea
          id="instructions"
          required
          value={formData.instructions}
          onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
          rows={8}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
          placeholder="You are a helpful assistant that..."
        />
        <p className="mt-1 text-xs text-gray-500">
          Define the agent's behavior, capabilities, and objectives
        </p>
      </div>

      {/* Model Selection */}
      <div>
        <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
          Model
        </label>
        <select
          id="model"
          value={formData.model}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo">
            Meta Llama 3.1 405B (Recommended)
          </option>
          <option value="meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo">
            Meta Llama 3.1 70B
          </option>
          <option value="meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo">
            Meta Llama 3.1 8B (Fast)
          </option>
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
        </select>
      </div>

      {/* Triggers */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Triggers
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Chat</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Webhook</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Schedule</span>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Save Agent
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
