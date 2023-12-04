export interface Board {
  title: String;
  columns: Columns[];
  id: string;
}

export interface Columns {
  columnName: string;
  tasks: Task[];
}

export interface Task {
  title: string;
  description: string;
  subtasks?: string[];
  status: string;
  id: string;
}
