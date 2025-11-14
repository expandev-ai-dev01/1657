import type { Priority } from '../../types';

export interface PriorityFilterProps {
  selectedPriorities?: Priority[];
  onPrioritiesChange: (priorities: Priority[]) => void;
  ordenacao?: 'crescente' | 'decrescente';
  onOrdenacaoChange: (ordenacao: 'crescente' | 'decrescente') => void;
  agrupamento?: boolean;
  onAgrupamentoChange: (agrupamento: boolean) => void;
  criterio_secundario?: 'data_criacao' | 'data_vencimento' | 'titulo' | 'categoria';
  onCriterioSecundarioChange: (
    criterio: 'data_criacao' | 'data_vencimento' | 'titulo' | 'categoria'
  ) => void;
}
