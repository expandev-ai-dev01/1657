import { z } from 'zod';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const notificationPreferenceSchema = z
  .object({
    canais_notificacao: z
      .array(z.enum(['aplicacao', 'email', 'push']))
      .min(1, 'Deve conter pelo menos um canal de notificação selecionado'),
    antecedencia_padrao: z
      .number()
      .int()
      .min(1, 'O tempo de antecedência deve ser no mínimo 1 hora')
      .max(168, 'O tempo de antecedência deve ser no máximo 168 horas (7 dias)'),
    notificar_tarefas_vencidas: z.boolean(),
    frequencia_lembretes: z.enum(['única', 'diária', 'a cada 12 horas', 'a cada 6 horas']),
    notificacoes_ativas: z.boolean(),
    horario_silencioso_inicio: z
      .string()
      .regex(timeRegex, 'Formato de hora inválido. Use HH:MM')
      .optional()
      .nullable(),
    horario_silencioso_fim: z
      .string()
      .regex(timeRegex, 'Formato de hora inválido. Use HH:MM')
      .optional()
      .nullable(),
    tempo_retencao_historico: z
      .number()
      .int()
      .min(7, 'O tempo de retenção deve ser no mínimo 7 dias')
      .max(365, 'O tempo de retenção deve ser no máximo 365 dias'),
  })
  .refine(
    (data) => {
      if (data.horario_silencioso_inicio && data.horario_silencioso_fim) {
        return data.horario_silencioso_fim > data.horario_silencioso_inicio;
      }
      return true;
    },
    {
      message: 'O horário de término deve ser posterior ao horário de início',
      path: ['horario_silencioso_fim'],
    }
  );

export type NotificationPreferences = z.infer<typeof notificationPreferenceSchema> & {
  id: number;
  id_usuario: number;
};

export type NotificationPreferenceUpdatePayload = z.infer<typeof notificationPreferenceSchema>;
