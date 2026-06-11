import { FormEvent, useState } from 'react';
import { DEFAULT_TASKS, TASK_CATEGORIES } from '../data/planner';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { PlannerTask } from '../types';
import { usePlanner } from '../context/PlannerContext';

type Filter = 'offen' | 'dringend' | 'erledigt';

export default function Aufgaben() {
  const { planner } = usePlanner();
  const [tasks, setTasks] = useLocalStorage<PlannerTask[]>(`${planner.storagePrefix}.tasks`, DEFAULT_TASKS);
  const [filter, setFilter] = useState<Filter>('offen');
  const [showForm, setShowForm] = useState(false);

  const visibleTasks = tasks.filter((task) => {
    if (filter === 'erledigt') return task.completed;
    if (filter === 'dringend') return !task.completed && task.priority === 'hoch';
    return !task.completed;
  });

  const addTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get('title') ?? '').trim();
    if (!title) return;

    setTasks((current) => [...current, {
      id: crypto.randomUUID(),
      title,
      details: String(data.get('details') ?? '').trim(),
      category: String(data.get('category')) as PlannerTask['category'],
      priority: String(data.get('priority')) as PlannerTask['priority'],
      dueDate: String(data.get('dueDate') ?? ''),
      completed: false,
    }]);
    event.currentTarget.reset();
    setShowForm(false);
  };

  const updateTask = (id: string, update: Partial<PlannerTask>) => {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, ...update } : task));
  };

  return (
    <div className="p-6 md:p-margin-desktop max-w-[1440px] mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-lg">
        <div>
          <span className="text-xs font-bold text-primary tracking-widest uppercase mb-1 block">Planer Board</span>
          <h1 className="font-headline-lg text-3xl font-extrabold text-on-surface">Aufgaben & To-Dos</h1>
          <p className="text-sm text-on-surface-variant mt-1">{tasks.filter((task) => !task.completed).length} offene Aufgaben, automatisch gespeichert</p>
        </div>
        <button type="button" onClick={() => setShowForm((visible) => !visible)} className="px-5 py-2.5 rounded-2xl bg-primary text-on-primary font-bold hover:opacity-90">
          + Neue Aufgabe
        </button>
      </div>

      {showForm && (
        <form onSubmit={addTask} className="mb-6 bg-white border border-outline-variant rounded-3xl p-5 grid grid-cols-1 md:grid-cols-5 gap-3 shadow-sm">
          <input name="title" required placeholder="Aufgabe" aria-label="Titel der Aufgabe" className="md:col-span-2 px-3 py-2 rounded-xl border border-outline-variant" />
          <input name="details" placeholder="Details" aria-label="Details zur Aufgabe" className="px-3 py-2 rounded-xl border border-outline-variant" />
          <select name="category" aria-label="Kategorie" className="px-3 py-2 rounded-xl border border-outline-variant bg-white">
            {TASK_CATEGORIES.map((category) => <option key={category}>{category}</option>)}
          </select>
          <div className="flex gap-2">
            <select name="priority" aria-label="Priorität" className="min-w-0 flex-1 px-3 py-2 rounded-xl border border-outline-variant bg-white">
              <option value="normal">Normal</option>
              <option value="mittel">Mittel</option>
              <option value="hoch">Hoch</option>
            </select>
            <button className="px-4 py-2 rounded-xl bg-primary text-white font-bold" type="submit">Anlegen</button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Aufgaben filtern">
        {(['offen', 'dringend', 'erledigt'] as Filter[]).map((item) => (
          <button key={item} type="button" onClick={() => setFilter(item)} aria-pressed={filter === item} className={`px-5 py-2.5 rounded-2xl border font-semibold capitalize ${filter === item ? 'bg-primary text-white border-primary' : 'bg-white border-outline-variant text-on-surface-variant'}`}>
            {item}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter">
        {TASK_CATEGORIES.map((category) => {
          const categoryTasks = visibleTasks.filter((task) => task.category === category);
          return (
            <section key={category} className="flex flex-col gap-4 min-h-[360px] bg-slate-50/50 p-4 rounded-3xl border border-slate-200">
              <header className="flex items-center justify-between px-2">
                <h2 className="font-bold text-on-surface">{category}</h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200">{categoryTasks.length}</span>
              </header>
              {categoryTasks.map((task) => (
                <article key={task.id} className="bg-white border border-outline-variant p-5 rounded-2xl sheet-shadow">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-md ${task.priority === 'hoch' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}>{task.priority}</span>
                    <button type="button" onClick={() => setTasks((current) => current.filter((item) => item.id !== task.id))} aria-label={`${task.title} löschen`} className="material-symbols-outlined text-outline hover:text-error">delete</button>
                  </div>
                  <h3 className={`font-semibold text-on-surface ${task.completed ? 'line-through opacity-60' : ''}`}>{task.title}</h3>
                  {task.details && <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">{task.details}</p>}
                  <label className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 text-xs font-bold cursor-pointer">
                    <input type="checkbox" checked={task.completed} onChange={(event) => updateTask(task.id, { completed: event.target.checked })} />
                    {task.completed ? 'Erledigt' : 'Als erledigt markieren'}
                  </label>
                </article>
              ))}
              {categoryTasks.length === 0 && <p className="m-auto text-xs font-bold text-outline">Keine Aufgaben</p>}
            </section>
          );
        })}
      </div>
    </div>
  );
}
