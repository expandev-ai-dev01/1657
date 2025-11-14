import { useState } from 'react';
import { useTasksByPriority, usePriorityDistribution } from '@/domain/task/hooks';
import { PriorityFilter, PriorityDistributionChart, PriorityBadge } from '@/domain/task/components';
import { LoadingSpinner } from '@/core/components';
import type { Priority } from '@/domain/task/types';

/**
 * @page TaskPriorityPage
 * @summary Page for viewing and managing tasks by priority levels.
 * @domain task
 * @type detail-page
 * @category task-management
 */
const TaskPriorityPage = () => {
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>([]);
  const [ordenacao, setOrdenacao] = useState<'crescente' | 'decrescente'>('decrescente');
  const [agrupamento, setAgrupamento] = useState(false);
  const [criterio_secundario, setCriterioSecundario] = useState<
    'data_criacao' | 'data_vencimento' | 'titulo' | 'categoria'
  >('data_vencimento');

  const { tasks, isLoading: tasksLoading } = useTasksByPriority({
    prioridades: selectedPriorities.length > 0 ? selectedPriorities : undefined,
    ordenacao,
    agrupamento,
    criterio_secundario,
  });

  const { distribution, isLoading: distributionLoading } = usePriorityDistribution();

  const isLoading = tasksLoading || distributionLoading;

  const renderTasks = () => {
    if (!tasks) {
      return <div className="text-gray-500 text-center py-8">No tasks found</div>;
    }

    if (Array.isArray(tasks)) {
      return (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{task.titulo}</h4>
                  {task.descricao && <p className="text-sm text-gray-600 mt-1">{task.descricao}</p>}
                  {task.data_vencimento && (
                    <p className="text-xs text-gray-500 mt-2">Due: {task.data_vencimento}</p>
                  )}
                </div>
                <PriorityBadge priority={task.prioridade} size="md" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Grouped by priority
    const grouped = tasks as any;
    return (
      <div className="space-y-6">
        {Object.entries(grouped).map(([priority, priorityTasks]: [string, any]) => (
          <div key={priority}>
            <h4 className="font-semibold text-gray-800 mb-3 capitalize">{priority} Priority</h4>
            <div className="space-y-2">
              {priorityTasks.map((task: any) => (
                <div
                  key={task.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800">{task.titulo}</h5>
                      {task.descricao && (
                        <p className="text-sm text-gray-600 mt-1">{task.descricao}</p>
                      )}
                      {task.data_vencimento && (
                        <p className="text-xs text-gray-500 mt-2">Due: {task.data_vencimento}</p>
                      )}
                    </div>
                    <PriorityBadge priority={task.prioridade} size="md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Task Priority Management</h1>
        <p className="text-gray-600 mt-2">View and manage your tasks by priority levels</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <PriorityFilter
            selectedPriorities={selectedPriorities}
            onPrioritiesChange={setSelectedPriorities}
            ordenacao={ordenacao}
            onOrdenacaoChange={setOrdenacao}
            agrupamento={agrupamento}
            onAgrupamentoChange={setAgrupamento}
            criterio_secundario={criterio_secundario}
            onCriterioSecundarioChange={setCriterioSecundario}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Distribution Chart */}
          <PriorityDistributionChart distribution={distribution} />

          {/* Tasks List */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tasks</h3>
            {isLoading ? <LoadingSpinner /> : renderTasks()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPriorityPage;
