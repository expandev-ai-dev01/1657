import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notificationPreferenceSchema } from '../../types';
import type { NotificationSettingsFormProps, NotificationPreferencesFormData } from './types';
import { useEffect } from 'react';

/**
 * @component NotificationSettingsForm
 * @summary Form for managing user notification preferences.
 * @domain notification
 * @type domain-component
 * @category form
 */
export const NotificationSettingsForm = ({
  preferences,
  onSave,
  isLoading,
}: NotificationSettingsFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<NotificationPreferencesFormData>({
    resolver: zodResolver(notificationPreferenceSchema),
    defaultValues: preferences,
  });

  useEffect(() => {
    if (preferences) {
      reset(preferences);
    }
  }, [preferences, reset]);

  const onSubmit = (data: NotificationPreferencesFormData) => {
    onSave(data);
  };

  const channelOptions = ['aplicacao', 'email', 'push'];
  const frequencyOptions = ['única', 'diária', 'a cada 12 horas', 'a cada 6 horas'];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Global Switch */}
      <div className="p-4 border rounded-lg">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="font-semibold text-gray-800">Enable Notifications</span>
          <input type="checkbox" {...register('notificacoes_ativas')} className="sr-only peer" />
          <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
        {errors.notificacoes_ativas && (
          <p className="mt-2 text-sm text-red-600">{errors.notificacoes_ativas.message}</p>
        )}
      </div>

      {/* Notification Channels */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Notification Channels</label>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {channelOptions.map((channel) => (
            <label key={channel} className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register('canais_notificacao')}
                value={channel}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm capitalize">{channel}</span>
            </label>
          ))}
        </div>
        {errors.canais_notificacao && (
          <p className="mt-2 text-sm text-red-600">{errors.canais_notificacao.message}</p>
        )}
      </div>

      {/* Default Reminder Time */}
      <div>
        <label htmlFor="antecedencia_padrao" className="block text-sm font-medium text-gray-700">
          Default Reminder Time (hours before due)
        </label>
        <input
          id="antecedencia_padrao"
          type="number"
          {...register('antecedencia_padrao', { valueAsNumber: true })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.antecedencia_padrao && (
          <p className="mt-2 text-sm text-red-600">{errors.antecedencia_padrao.message}</p>
        )}
      </div>

      {/* Reminder Frequency */}
      <div>
        <label htmlFor="frequencia_lembretes" className="block text-sm font-medium text-gray-700">
          Reminder Frequency for Uncompleted Tasks
        </label>
        <select
          id="frequencia_lembretes"
          {...register('frequencia_lembretes')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {frequencyOptions.map((freq) => (
            <option key={freq} value={freq} className="capitalize">
              {freq}
            </option>
          ))}
        </select>
        {errors.frequencia_lembretes && (
          <p className="mt-2 text-sm text-red-600">{errors.frequencia_lembretes.message}</p>
        )}
      </div>

      {/* Overdue Tasks Notification */}
      <div className="flex items-center gap-2">
        <input
          id="notificar_tarefas_vencidas"
          type="checkbox"
          {...register('notificar_tarefas_vencidas')}
          className="w-4 h-4 rounded border-gray-300"
        />
        <label htmlFor="notificar_tarefas_vencidas" className="text-sm font-medium text-gray-700">
          Notify about overdue tasks
        </label>
      </div>

      {/* Silent Hours */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="horario_silencioso_inicio"
            className="block text-sm font-medium text-gray-700"
          >
            Silent Hours Start
          </label>
          <input
            id="horario_silencioso_inicio"
            type="time"
            {...register('horario_silencioso_inicio')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.horario_silencioso_inicio && (
            <p className="mt-2 text-sm text-red-600">{errors.horario_silencioso_inicio.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="horario_silencioso_fim"
            className="block text-sm font-medium text-gray-700"
          >
            Silent Hours End
          </label>
          <input
            id="horario_silencioso_fim"
            type="time"
            {...register('horario_silencioso_fim')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.horario_silencioso_fim && (
            <p className="mt-2 text-sm text-red-600">{errors.horario_silencioso_fim.message}</p>
          )}
        </div>
      </div>

      {/* History Retention */}
      <div>
        <label
          htmlFor="tempo_retencao_historico"
          className="block text-sm font-medium text-gray-700"
        >
          Notification History Retention (days)
        </label>
        <input
          id="tempo_retencao_historico"
          type="number"
          {...register('tempo_retencao_historico', { valueAsNumber: true })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.tempo_retencao_historico && (
          <p className="mt-2 text-sm text-red-600">{errors.tempo_retencao_historico.message}</p>
        )}
      </div>

      <div className="flex justify-end pt-4 border-t">
        <button
          type="submit"
          disabled={isLoading || !isDirty}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </form>
  );
};
