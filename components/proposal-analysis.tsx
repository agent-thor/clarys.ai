"use client";

import React from 'react';
import { Card } from './ui/card';

interface ProposalInfo {
  id: string;
  title: string;
  content: string;
  status: string;
  created_at: string;
  proposer: string;
  beneficiaries: Array<{
    address: string;
    amount: string;
    assetId: string;
    validFromBlock?: string;
  }>;
  vote_metrics: {
    nay: { count: number; value: string };
    aye: { count: number; value: string };
    support: { value: string };
    bareAyes: { value: string };
  };
  timeline: Array<{
    status: string;
    timestamp: string;
    block: number;
  }>;
  error: string | null;
}

interface ProposalAnalysisProps {
  data: {
    ids: string[];
    links: string[];
    proposals: ProposalInfo[];
    analysis: string;
  };
}

export function ProposalAnalysis({ data }: ProposalAnalysisProps) {
  const formatAmount = (amount: string) => {
    try {
      return (parseInt(amount) / 1e12).toFixed(2);
    } catch {
      return '0';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-4 rounded-lg border">
        <h2 className="text-xl font-bold mb-2 text-blue-900 dark:text-blue-100">
          📊 Proposal Analysis Results
        </h2>
        <div className="text-sm text-blue-700 dark:text-blue-300">
          Found {data.proposals.length} proposal{data.proposals.length !== 1 ? 's' : ''}
          {data.ids.length > 0 && (
            <span> • IDs: {data.ids.join(', ')}</span>
          )}
        </div>
      </div>

      {data.proposals.map((proposal, index) => (
        <Card key={proposal.id} className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {index + 1}. {proposal.title}
                </h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                    ID: {proposal.id}
                  </span>
                  <span className={`px-2 py-1 rounded ${
                    proposal.status === 'Deciding' 
                      ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}>
                    {proposal.status}
                  </span>
                  <span>Created: {formatDate(proposal.created_at)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">💰 Funding</h4>
                {proposal.beneficiaries && proposal.beneficiaries.length > 0 ? (
                  <div className="space-y-1">
                    {proposal.beneficiaries.map((beneficiary, idx) => (
                      <div key={idx} className="text-sm bg-green-50 dark:bg-green-950 p-2 rounded">
                        <div className="font-mono text-green-700 dark:text-green-300">
                          {formatAmount(beneficiary.amount)} USDC
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400 truncate">
                          {beneficiary.address}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No funding information</div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">🗳️ Voting Status</h4>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-green-600 dark:text-green-400">✓ Aye:</span>
                    <span className="font-mono">{proposal.vote_metrics?.aye?.count || 0} votes</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-red-600 dark:text-red-400">✗ Nay:</span>
                    <span className="font-mono">{proposal.vote_metrics?.nay?.count || 0} votes</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-blue-600 dark:text-blue-400">⬆ Support:</span>
                    <span className="font-mono">{proposal.vote_metrics?.support?.value || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">📋 Proposer</h4>
              <div className="text-sm font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded break-all">
                {proposal.proposer}
              </div>
            </div>

            {proposal.timeline && proposal.timeline.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">📅 Timeline</h4>
                <div className="space-y-1">
                  {proposal.timeline.slice(0, 3).map((event, idx) => (
                    <div key={idx} className="text-sm flex justify-between items-center">
                      <span className="capitalize">{event.status.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-gray-500">{formatDate(event.timestamp)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}

      {data.analysis && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            🔍 Analysis
          </h3>
          <div className="prose dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
              {data.analysis}
            </div>
          </div>
        </Card>
      )}

      {data.links && data.links.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            🔗 Related Links
          </h3>
          <div className="space-y-2">
            {data.links.map((link, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                {link}
              </a>
            ))}
          </div>
        </Card>
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400 text-center p-2">
        🤖 Data processed via NEW_BACKEND_API
      </div>
    </div>
  );
} 