'use client';

import React, { useEffect, useState } from 'react';

interface Log {
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

interface LiveMonitorProps {
  agentId: string;
  executionId?: string;
}

export default function LiveMonitor({ agentId, executionId }: LiveMonitorProps) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [status, setStatus] = useState<'RUNNING' | 'SUCCESS' | 'FAILED' | 'IDLE'>('IDLE');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!executionId) return;

    // Connect to SSE endpoint for real-time logs
    const eventSource = new EventSource(`/api/agents/${agentId}/logs?executionId=${executionId}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.log) {
        setLogs((prev) => [...prev, data.log]);
      }
      
      if (data.status) {
        setStatus(data.status);
      }
      
      if (data.progress !== undefined) {
        setProgress(data.progress);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [agentId, executionId]);

  const logColors = {
    info: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
  };

  const statusColors = {
    IDLE: 'bg-gray-100 text-gray-800',
    RUNNING: 'bg-blue-100 text-blue-800',
    SUCCESS: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Live Execution Monitor</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status}
        </span>
      </div>

      {/* Progress Bar */}
      {status === 'RUNNING' && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Logs Container */}
      <div className="border border-gray-200 rounded-lg bg-gray-50">
        <div className="px-4 py-2 border-b border-gray-200 bg-gray-100">
          <span className="text-sm font-medium text-gray-700">Execution Logs</span>
        </div>
        <div className="p-4 h-96 overflow-y-auto font-mono text-sm space-y-2">
          {logs.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              {status === 'IDLE' ? 'Waiting for execution...' : 'No logs yet...'}
            </div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-gray-400 text-xs">{log.timestamp}</span>
                <span className={`flex-1 ${logColors[log.level]}`}>{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 mt-4">
        {status === 'RUNNING' && (
          <button className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors">
            Stop Execution
          </button>
        )}
        <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors">
          Download Logs
        </button>
        <button
          onClick={() => setLogs([])}
          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
