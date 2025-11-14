import { z } from 'zod';

const validChannels = ['aplicacao', 'email', 'push'];
const validFrequencies = ['única', 'diária', 'a cada 12 horas', 'a cada 6 horas'];

export const notificationPreferenceUpdateSchema = z.object({
  body: z
    .object({
      canais_notificacao: z
        .array(z.string())
        .nonempty('Deve conter pelo menos um canal de notificação selecionado')
        .refine((items) => items.every((item) => validChannels.includes(item)), {
          message: "Opções válidas: 'aplicacao', 'email', 'push'",
        }),
      antecedencia_padrao: z.number().int().min(1).max(168),
      notificar_tarefas_vencidas: z.boolean(),
      frequencia_lembretes: z.string().refine((item) => validFrequencies.includes(item), {
        message: "Opções válidas: 'única', 'diária', 'a cada 12 horas', 'a cada 6 horas'",
      }),
      notificacoes_ativas: z.boolean(),
      horario_silencioso_inicio: z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido, use HH:MM')
        .optional()
        .nullable(),
      horario_silencioso_fim: z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido, use HH:MM')
        .optional()
        .nullable(),
      tempo_retencao_historico: z.number().int().min(7).max(365),
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
    ),
});

export const taskNotificationSettingUpdateSchema = z.object({
  body: z.object({
    usar_config_personalizada: z.boolean(),
    antecedencia_personalizada: z.number().int().min(1).max(168).optional().nullable(),
    canais_notificacao_tarefa: z
      .array(z.string())
      .nonempty('Deve conter pelo menos um canal de notificação selecionado')
      .refine((items) => items.every((item) => validChannels.includes(item)), {
        message: "Opções válidas: 'aplicacao', 'email', 'push'",
      })
      .optional()
      .nullable(),
    lembretes_adicionais: z
      .array(z.object({ date: z.coerce.date() }))
      .max(5, 'Máximo de 5 lembretes adicionais por tarefa')
      .optional()
      .nullable(),
    notificacoes_tarefa_ativas: z.boolean(),
  }),
});

export const notificationListSchema = z.object({
  query: z.object({
    readStatus: z.enum(['não lida', 'lida', 'descartada']).optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    pageSize: z.coerce.number().int().min(10).max(50).optional().default(20),
  }),
});

export const notificationUpdateStatusSchema = z.object({
  body: z.object({
    readStatus: z.enum(['lida', 'descartada'], {
      required_error: "O status de leitura é obrigatório e deve ser 'lida' ou 'descartada'",
    }),
  }),
});
