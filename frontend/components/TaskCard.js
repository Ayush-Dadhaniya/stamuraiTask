export default function TaskCard({
  task,
  isOverdue = () => false,
  onEdit = () => {},
  onDelete = () => {},
}) {
  const assignedName = task.assignedTo?.name || 'Unassigned';

  return (
    <div className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-all">
      <h3 className="text-lg font-bold text-gray-800">{task.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
      <p className="text-sm">👤 {assignedName}</p>
      <p className={`text-sm ${isOverdue(task.dueDate, task.status) ? 'text-red-600' : ''}`}>
        {task.status}
      </p>
      <p className="text-sm">Priority: {task.priority}</p>
      <p className="text-sm">Due: {task.dueDate?.slice(0, 10)}</p>

      <div className="mt-3 flex gap-3">
        <button onClick={() => onEdit(task)} className="text-blue-500 text-sm hover:underline">
          Edit
        </button>
        <button onClick={() => onDelete(task._id)} className="text-red-500 text-sm hover:underline">
          Delete
        </button>
      </div>
    </div>
  );
}
