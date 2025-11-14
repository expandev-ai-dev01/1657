import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateTask } from '../../hooks';
import { taskCreateSchema, PRIORITIES } from '../../constants';
import type { TaskFormProps, TaskFormData } from './types';

/**
 * @component TaskForm
 * @summary Form for creating a new task with priority selection.
 * @domain task
 * @type domain-component
 * @category form
 */
export const TaskForm = ({ onSuccess, onCancel }: TaskFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskCreateSchema),
    defaultValues: {
      titulo: '',
      descricao: '',
      data_vencimento: '',
      prioridade: 'Média',
    },
  });

  const { mutate: createTask, isPending } = useCreateTask({
    onSuccess: (newTask) => {
      reset();
      onSuccess(newTask);
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const onSubmit = (data: TaskFormData) => {
    const payload = {
      ...data,
      descricao: data.descricao || null,
      data_vencimento: data.data_vencimento || null,
    };
    createTask(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          id="titulo"
          type="text"
          {...register('titulo')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.titulo && <p className="mt-1 text-sm text-red-600">{errors.titulo.message}</p>}
      </div>

      <div>
        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="descricao"
          {...register('descricao')}
          rows={4}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.descricao && (
          <p className="mt-1 text-sm text-red-600">{errors.descricao.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="data_vencimento" className="block text-sm font-medium text-gray-700">
          Due Date
        </label>
        <input
          id="data_vencimento"
          type="date"
          {...register('data_vencimento')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.data_vencimento && (
          <p className="mt-1 text-sm text-red-600">{errors.data_vencimento.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="prioridade" className="block text-sm font-medium text-gray-700">
          Priority
        </label>
        <select
          id="prioridade"
          {...register('prioridade')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        {errors.prioridade && (
          <p className="mt-1 text-sm text-red-600">{errors.prioridade.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isSubmitting || isPending ? 'Saving...' : 'Save Task'}
        </button>
      </div>
    </form>
  );
};
