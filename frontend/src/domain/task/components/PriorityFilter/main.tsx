import { useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { PRIORITIES } from '../../constants';
import type { PriorityFilterProps } from './types';
import type { Priority } from '../../types';

/**
 * @component PriorityFilter
 * @summary Filter component for selecting priority levels.
 * @domain task
 * @type domain-component
 * @category form
 */
export const PriorityFilter = ({
  selectedPriorities = [],
  onPrioritiesChange,
  ordenacao = 'decrescente',
  onOrdenacaoChange,
  agrupamento = false,
  onAgrupamentoChange,
  criterio_secundario = 'data_vencimento',
  onCriterioSecundarioChange,
}: PriorityFilterProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePriorityToggle = useCallback(
    (priority: Priority) => {
      const newPriorities = selectedPriorities.includes(priority)
        ? selectedPriorities.filter((p) => p !== priority)
        : [...selectedPriorities, priority];
      onPrioritiesChange(newPriorities);
    },
    [selectedPriorities, onPrioritiesChange]
  );

  const handleSelectAll = useCallback(() => {
    if (selectedPriorities.length === PRIORITIES.length) {
      onPrioritiesChange([]);
    } else {
      onPrioritiesChange(PRIORITIES.map((p) => p.value));
    }
  }, [selectedPriorities, onPrioritiesChange]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-600 hover:text-gray-800 transition-colors"
          aria-expanded={isExpanded}
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Priority Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority Levels</label>
            <div className="space-y-2">
              <button
                onClick={handleSelectAll}
                className="w-full text-left px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
              >
                {selectedPriorities.length === PRIORITIES.length ? 'Deselect All' : 'Select All'}
              </button>
              {PRIORITIES.map((priority) => (
                <label key={priority.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPriorities.includes(priority.value)}
                    onChange={() => handlePriorityToggle(priority.value)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: priority.color }}
                    title={priority.label}
                  />
                  <span className="text-sm text-gray-700">{priority.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort Order */}
          <div>
            <label htmlFor="ordenacao" className="block text-sm font-medium text-gray-700 mb-2">
              Sort Order
            </label>
            <select
              id="ordenacao"
              value={ordenacao}
              onChange={(e) => onOrdenacaoChange(e.target.value as 'crescente' | 'decrescente')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="decrescente">High to Low</option>
              <option value="crescente">Low to High</option>
            </select>
          </div>

          {/* Grouping */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agrupamento}
                onChange={(e) => onAgrupamentoChange(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Group by Priority</span>
            </label>
          </div>

          {/* Secondary Sort Criteria */}
          <div>
            <label htmlFor="criterio" className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Sort
            </label>
            <select
              id="criterio"
              value={criterio_secundario}
              onChange={(e) =>
                onCriterioSecundarioChange(
                  e.target.value as 'data_criacao' | 'data_vencimento' | 'titulo' | 'categoria'
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="data_vencimento">Due Date</option>
              <option value="data_criacao">Creation Date</option>
              <option value="titulo">Title</option>
              <option value="categoria">Category</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
