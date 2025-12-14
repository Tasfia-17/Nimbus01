'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewAgentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [agent, setAgent] = useState({
    name: '',
    description: '',
    instructions: '',
    model: 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo',
    triggers: [],
    tools: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agent),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/agents/${data.agent.id}`);
      } else {
        alert('Failed to create agent');
      }
    } catch (error) {
      console.error('Failed to create agent:', error);
      alert('Failed to create agent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Create New Agent</h1>
            <p className="text-gray-600 mt-2">
              Configure your AI agent to automate tasks and workflows
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Agent Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={agent.name}
                onChange={(e) => setAgent({ ...agent, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Competition Scanner, Code Reviewer"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={agent.description}
                onChange={(e) => setAgent({ ...agent, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe what your agent does and when it should run..."
              />
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructions <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={agent.instructions}
                onChange={(e) => setAgent({ ...agent, instructions: e.target.value })}
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder={`Enter detailed instructions for your agent. Example:

You are a competitive analysis agent. Your job is to:
1. Get a list of competitors from the database
2. Research each competitor's website using the web scraper tool
3. Extract key information: pricing, features, recent updates
4. Write a comprehensive competitive analysis report
5. Compare the findings with previous analyses
6. If materially different, save the new analysis

Always be thorough and data-driven in your analysis.`}
              />
              <p className="text-sm text-gray-500 mt-2">
                💡 Be specific about what the agent should do, what tools to use, and how to handle results
              </p>
            </div>

            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Model
              </label>
              <select
                value={agent.model}
                onChange={(e) => setAgent({ ...agent, model: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo">
                  Llama 3.1 405B (Recommended)
                </option>
                <option value="meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo">
                  Llama 3.1 70B (Faster)
                </option>
                <option value="meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo">
                  Llama 3.1 8B (Budget)
                </option>
              </select>
            </div>

            {/* Example Templates */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                💡 Quick Start Templates
              </h3>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setAgent({
                    ...agent,
                    name: 'Competition Scanner',
                    description: 'Analyzes competitors and generates reports',
                    instructions: `You are a competitive analysis agent. Your job is to:
1. Get competitor list from database
2. Scrape their websites for latest info
3. Analyze pricing, features, and positioning
4. Generate comprehensive report
5. Compare with previous analysis
6. Save if materially different`
                  })}
                  className="text-sm text-blue-700 hover:text-blue-900 underline"
                >
                  Use Competition Scanner template
                </button>
                <br />
                <button
                  type="button"
                  onClick={() => setAgent({
                    ...agent,
                    name: 'Code Reviewer',
                    description: 'Reviews pull requests and suggests improvements',
                    instructions: `You are a code review agent. For each PR:
1. Fetch the pull request diff
2. Analyze code quality and best practices
3. Check for potential bugs or security issues
4. Suggest improvements
5. Post detailed review as comment`
                  })}
                  className="text-sm text-blue-700 hover:text-blue-900 underline"
                >
                  Use Code Reviewer template
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Agent'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
