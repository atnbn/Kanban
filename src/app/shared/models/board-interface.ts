export interface Board {
  title: String;
  columns: Columns[];
  id: string;
  userId?: string;
}

export interface Columns {
  columnName: string;
  id: string;
  tasks: Task[];
}

export interface Task {
  title: string;
  description: string;
  subtasks?: Subtask[];
  status: Status[];
  id: string;
}

export interface Status {
  columnName: string;
  id: string;
}

export interface Subtask {
  name: string;
  done: boolean;
  id: string;
}
