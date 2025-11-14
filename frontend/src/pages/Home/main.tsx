import { useState } from 'react';
import { Modal } from '@/core/components';
import { TaskForm, type Task } from '@/domain/task';

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
    handleCloseModal();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">My Tasks</h2>
        <button
          onClick={handleOpenModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create Task
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            You have no tasks. Create one to get started!
          </p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li key={task.id} className="p-3 border rounded-md flex justify-between items-center">
                <div>
                  <p className="font-medium">{task.titulo}</p>
                  {task.descricao && <p className="text-sm text-gray-600">{task.descricao}</p>}
                </div>
                <span className="text-sm font-semibold">{task.prioridade}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Create a New Task">
        <TaskForm onSuccess={handleTaskCreated} onCancel={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default HomePage;
