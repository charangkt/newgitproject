interface Task {
  id: number;
  title: string;
  done: boolean;
  created_at: string;
}

type Filter = "all" | "active" | "done";

const API = "/api/tasks.php";

const form = document.querySelector<HTMLFormElement>("#task-form")!;
const input = document.querySelector<HTMLInputElement>("#task-input")!;
const list = document.querySelector<HTMLUListElement>("#task-list")!;
const counter = document.querySelector<HTMLSpanElement>("#counter")!;
const errorBox = document.querySelector<HTMLDivElement>("#error")!;
const filterButtons = document.querySelectorAll<HTMLButtonElement>("[data-filter]");

let tasks: Task[] = [];
let filter: Filter = "all";

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }
  return body as T;
}

function showError(message: string): void {
  errorBox.textContent = message;
  errorBox.hidden = false;
  setTimeout(() => (errorBox.hidden = true), 4000);
}

function render(): void {
  const visible = tasks.filter((t) =>
    filter === "all" ? true : filter === "done" ? t.done : !t.done
  );

  list.replaceChildren(
    ...visible.map((task) => {
      const li = document.createElement("li");
      li.className = task.done ? "task done" : "task";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.setAttribute("aria-label", `Mark "${task.title}" as done`);
      checkbox.addEventListener("change", () => toggleTask(task));

      const title = document.createElement("span");
      title.className = "title";
      title.textContent = task.title;

      const del = document.createElement("button");
      del.className = "delete";
      del.textContent = "×";
      del.setAttribute("aria-label", `Delete "${task.title}"`);
      del.addEventListener("click", () => deleteTask(task));

      li.append(checkbox, title, del);
      return li;
    })
  );

  if (visible.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = filter === "all" ? "No tasks yet — add one above." : "Nothing here.";
    list.append(empty);
  }

  const remaining = tasks.filter((t) => !t.done).length;
  counter.textContent = `${remaining} of ${tasks.length} remaining`;

  filterButtons.forEach((btn) =>
    btn.classList.toggle("active", btn.dataset.filter === filter)
  );
}

async function loadTasks(): Promise<void> {
  try {
    tasks = await request<Task[]>(API);
    render();
  } catch (e) {
    showError((e as Error).message);
  }
}

async function addTask(title: string): Promise<void> {
  try {
    const task = await request<Task>(API, {
      method: "POST",
      body: JSON.stringify({ title }),
    });
    tasks.unshift(task);
    render();
  } catch (e) {
    showError((e as Error).message);
  }
}

async function toggleTask(task: Task): Promise<void> {
  try {
    const updated = await request<Task>(`${API}?id=${task.id}`, {
      method: "PATCH",
      body: JSON.stringify({ done: !task.done }),
    });
    tasks = tasks.map((t) => (t.id === updated.id ? updated : t));
    render();
  } catch (e) {
    showError((e as Error).message);
  }
}

async function deleteTask(task: Task): Promise<void> {
  try {
    await request(`${API}?id=${task.id}`, { method: "DELETE" });
    tasks = tasks.filter((t) => t.id !== task.id);
    render();
  } catch (e) {
    showError((e as Error).message);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  input.value = "";
  addTask(title);
});

filterButtons.forEach((btn) =>
  btn.addEventListener("click", () => {
    filter = btn.dataset.filter as Filter;
    render();
  })
);

loadTasks();
