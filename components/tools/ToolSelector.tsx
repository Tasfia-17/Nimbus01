'use client';

import React, { useState } from 'react';

interface Tool {
  id: string;
  name: string;
  description: string;
  type: 'API' | 'CLI' | 'FUNCTION' | 'DATABASE';
}

interface ToolSelectorProps {
  availableTools: Tool[];
  selectedTools: string[];
  onSelectionChange: (toolIds: string[]) => void;
}

export default function ToolSelector({
  availableTools,
  selectedTools,
  onSelectionChange,
}: ToolSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredTools = availableTools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || tool.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleToggleTool = (toolId: string) => {
    if (selectedTools.includes(toolId)) {
      onSelectionChange(selectedTools.filter((id) => id !== toolId));
    } else {
      onSelectionChange([...selectedTools, toolId]);
    }
  };

  const toolTypeColors = {
    API: 'bg-blue-100 text-blue-700',
    CLI: 'bg-green-100 text-green-700',
    FUNCTION: 'bg-purple-100 text-purple-700',
    DATABASE: 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Tools</h3>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="ALL">All Types</option>
          <option value="API">API</option>
          <option value="CLI">CLI</option>
          <option value="FUNCTION">Function</option>
          <option value="DATABASE">Database</option>
        </select>
      </div>

      {/* Selected Count */}
      <div className="mb-4 text-sm text-gray-600">
        {selectedTools.length} tool{selectedTools.length !== 1 ? 's' : ''} selected
      </div>

      {/* Tools Grid */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredTools.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No tools found matching your criteria</p>
          </div>
        ) : (
          filteredTools.map((tool) => (
            <label
              key={tool.id}
              className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedTools.includes(tool.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedTools.includes(tool.id)}
                onChange={() => handleToggleTool(tool.id)}
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-900">{tool.name}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${toolTypeColors[tool.type]}`}>
                    {tool.type}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{tool.description}</p>
              </div>
            </label>
          ))
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={() => onSelectionChange(availableTools.map((t) => t.id))}
          className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Select All
        </button>
        <button
          onClick={() => onSelectionChange([])}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700 font-medium"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
