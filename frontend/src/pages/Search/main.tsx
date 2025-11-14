import { useSearchTasks, TaskListItem } from '@/domain/task';
import { LoadingSpinner } from '@/core/components';

/**
 * @page SearchPage
 * @summary Page for searching, filtering, and displaying tasks.
 * @domain task
 * @type page-component
 * @category task-management
 */
const SearchPage = () => {
  const { searchTerm, setSearchTerm, result, isLoading, isFetching, error } = useSearchTasks();

  const tasks = result?.data ?? [];
  const metadata = result?.metadata;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Search Tasks</h1>
      <p className="text-gray-600 mb-6">Find tasks by title, description, or category.</p>

      {/* Search Input */}
      <div className="relative mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tasks... (at least 2 characters)"
          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
        />
        {(isLoading || isFetching) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-600"></div>
          </div>
        )}
      </div>

      {/* TODO: Add Filters and Sorting UI here */}

      {/* Results */}
      <div className="bg-gray-50 p-4 rounded-lg min-h-[300px]">
        {error && (
          <div className="text-center text-red-600 py-10">
            <p>Error: {error.message}</p>
          </div>
        )}

        {!error && isLoading && (
          <div className="flex justify-center items-center h-full py-10">
            <LoadingSpinner />
          </div>
        )}

        {!error && !isLoading && tasks.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            <p>No results found.</p>
            <p className="text-sm mt-1">Try adjusting your search or filters.</p>
          </div>
        )}

        {!error && !isLoading && tasks.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Showing {tasks.length} of {metadata?.total} results.
            </p>
            {tasks.map((task) => (
              <TaskListItem key={task.id} task={task} searchTerm={searchTerm} />
            ))}
          </div>
        )}
      </div>

      {/* TODO: Add Pagination UI here */}
    </div>
  );
};

export default SearchPage;
