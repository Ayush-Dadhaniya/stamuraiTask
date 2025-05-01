export default function TaskCard({ task, isOverdue }) {
  return (
    <div className={`border p-4 my-2 rounded ${isOverdue ? 'bg-red-100' : 'bg-white'}`}>
      <h3 className="font-bold text-lg">{task.title}</h3>
      <p>{task.description}</p>
      <p>{task.assignedTo}</p>
      <p>Status: {task.status}</p>
      <p>Priority: {task.priority}</p>
      <p>Due: {task.dueDate.slice(0, 10)}</p>
      {isOverdue && <span className="text-red-600 font-semibold">Overdue</span>}
    </div>
  );
}
