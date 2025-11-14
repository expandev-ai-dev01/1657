import { PRIORITY_MAP } from '../../constants';
import type { PriorityDistributionChartProps } from './types';

/**
 * @component PriorityDistributionChart
 * @summary Chart component displaying priority distribution statistics.
 * @domain task
 * @type domain-component
 * @category display
 */
export const PriorityDistributionChart = ({ distribution }: PriorityDistributionChartProps) => {
  if (!distribution) {
    return <div className="text-gray-500 text-center py-8">No data available</div>;
  }

  const { alta, media, baixa, total } = distribution;

  const getPercentage = (value: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  const altaPercent = getPercentage(alta);
  const mediaPercent = getPercentage(media);
  const baixaPercent = getPercentage(baixa);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Priority Distribution</h3>

      {/* Bar Chart */}
      <div className="space-y-4">
        {[
          { label: 'High', value: alta, percent: altaPercent, color: PRIORITY_MAP['Alta'].color },
          {
            label: 'Medium',
            value: media,
            percent: mediaPercent,
            color: PRIORITY_MAP['Média'].color,
          },
          { label: 'Low', value: baixa, percent: baixaPercent, color: PRIORITY_MAP['Baixa'].color },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
              <span className="text-sm text-gray-600">
                {item.value} ({item.percent}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${item.percent}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800">{alta}</p>
          <p className="text-xs text-gray-600 mt-1">High Priority</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800">{media}</p>
          <p className="text-xs text-gray-600 mt-1">Medium Priority</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800">{baixa}</p>
          <p className="text-xs text-gray-600 mt-1">Low Priority</p>
        </div>
      </div>

      <div className="text-center pt-2 border-t">
        <p className="text-sm text-gray-600">
          Total Tasks: <span className="font-semibold text-gray-800">{total}</span>
        </p>
      </div>
    </div>
  );
};
