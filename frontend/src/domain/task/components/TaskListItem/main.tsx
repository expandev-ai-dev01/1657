import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { PriorityBadge } from '../PriorityBadge';
import type { TaskListItemProps } from './types';

const HighlightedText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-200 px-0.5 rounded">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

/**
 * @component TaskListItem
 * @summary Displays a single task item in a list, with search term highlighting.
 * @domain task
 * @type domain-component
 * @category display
 */
export const TaskListItem = ({ task, searchTerm }: TaskListItemProps) => {
  const formattedDueDate = useMemo(() => {
    if (!task.data_vencimento) return null;
    try {
      return format(parseISO(task.data_vencimento), 'MMM dd, yyyy');
    } catch (e) {
      return 'Invalid Date';
    }
  }, [task.data_vencimento]);

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">
            <HighlightedText text={task.titulo} highlight={searchTerm} />
          </h3>
          {task.descricao && (
            <p className="text-sm text-gray-600 mt-1">
              <HighlightedText text={task.descricao} highlight={searchTerm} />
            </p>
          )}
        </div>
        <div className="flex-shrink-0">
          <PriorityBadge priority={task.prioridade} size="sm" />
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
        <span>Created: {format(parseISO(task.data_criacao), 'MMM dd, yyyy')}</span>
        {formattedDueDate && <span>Due: {formattedDueDate}</span>}
      </div>
    </div>
  );
};
