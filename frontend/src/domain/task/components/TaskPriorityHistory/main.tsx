import { format } from 'date-fns';
import { PRIORITY_MAP } from '../../constants';
import type { TaskPriorityHistoryProps } from './types';

/**
 * @component TaskPriorityHistory
 * @summary Component displaying the history of priority changes for a task.
 * @domain task
 * @type domain-component
 * @category display
 */
export const TaskPriorityHistory = ({ history, isLoading }: TaskPriorityHistoryProps) => {
  if (isLoading) {
    return <div className="text-gray-500 text-center py-4">Loading history...</div>;
  }

  if (!history || history.length === 0) {
    return <div className="text-gray-500 text-center py-4">No priority changes recorded</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h4 className="text-sm font-semibold text-gray-800 mb-4">Priority Change History</h4>
      <div className="space-y-3">
        {history.map((entry) => {
          const oldConfig = PRIORITY_MAP[entry.prioridade_anterior];
          const newConfig = PRIORITY_MAP[entry.prioridade_nova];

          return (
            <div key={entry.id} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: oldConfig.color }}
                  />
                  <span className="text-xs font-medium text-gray-600">{oldConfig.label}</span>
                  <span className="text-gray-400">→</span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: newConfig.color }}
                  />
                  <span className="text-xs font-medium text-gray-600">{newConfig.label}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {format(new Date(entry.data_alteracao), 'MMM dd, yyyy HH:mm')}
                </p>
                {entry.motivo_alteracao && (
                  <p className="text-xs text-gray-600 mt-1 italic">
                    Reason: {entry.motivo_alteracao}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
