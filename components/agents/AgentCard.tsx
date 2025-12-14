import React from 'react';
import Link from 'next/link';

interface AgentCardProps {
  agent: {
    id: string;
    name: string;
    description?: string;
    status: 'ACTIVE' | 'PAUSED' | 'DELETED';
    model: string;
    updatedAt: Date | string;
  };
  onRun?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function AgentCard({ agent, onRun, onEdit, onDelete }: AgentCardProps) {
  const statusColors = {
    ACTIVE: 'bg-green-100 text-green-800',
    PAUSED: 'bg-yellow-100 text-yellow-800',
    DELETED: 'bg-red-100 text-red-800',
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link href={`/agents/${agent.id}`}>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
              {agent.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mt-1">
            {agent.description || 'No description provided'}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            statusColors[agent.status]
          }`}
        >
          {agent.status}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div className="flex items-center space-x-4">
          <div>
            <span className="text-gray-400">Model:</span>{' '}
            <span className="font-medium">{agent.model}</span>
          </div>
          <div>
            <span className="text-gray-400">Updated:</span>{' '}
            <span>{formatDate(agent.updatedAt)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
        {onRun && agent.status === 'ACTIVE' && (
          <button
            onClick={() => onRun(agent.id)}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            Run
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(agent.id)}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
          >
            Edit
          </button>
        )}
        <Link
          href={`/agents/${agent.id}`}
          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
        >
          View Details
        </Link>
        {onDelete && agent.status !== 'DELETED' && (
          <button
            onClick={() => onDelete(agent.id)}
            className="ml-auto px-4 py-2 bg-red-50 text-red-600 text-sm rounded-md hover:bg-red-100 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
