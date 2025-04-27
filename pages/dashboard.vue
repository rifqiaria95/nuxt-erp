<template>
    <div class="content-wrapper container py-4">
        <div class="row">

            <!-- CARD JUMLAH USER LOGIN -->
            <div class="col-md-12 mb-4">
            <div class="card shadow-sm">
                <div class="card-body text-center">
                <h5 class="card-title">User Aktif</h5>
                <p class="card-text fs-4">
                    <span v-if="loadingActiveUsers">Loading...</span>
                    <span v-else>{{ activeUsers }} user login</span>
                </p>
                </div>
            </div>
            </div>
            
            <!-- MOTIVASI HARI INI -->
            <div class="col-md-12 mb-4">
                <div class="card shadow-sm">
                    <div class="card-body text-center">
                        <div>
                            <h2 class="text-2xl font-bold text-center">Motivasi Hari Ini</h2>
                            <div v-if="data" class="mt-3 text-center">
                            <blockquote>{{ data.quote }}</blockquote>
                            <p>- {{ data.author }}</p>
                            </div>
                            <div v-else-if="error">
                            Gagal mengambil kutipan 😞
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- TASK LIST -->
            <div class="col-md-12 mb-4 mt-5">
            <h2 class="text-center">Task List</h2>
            </div>

            <!-- Columns for Tasks -->
            <div v-for="(column, columnIndex) in columns" :key="columnIndex" class="col-md-4 mb-4">
            <div class="card h-100">
                <div class="card-header bg-primary text-white">
                <div class="d-flex justify-content-between">
                    <span>{{ column.title }}</span>
                    <button class="btn btn-primary btn-sm" @click="showAddTaskForm(columnIndex)">Add Task</button>
                </div>
                </div>
                <div class="card-body">
                <draggable
                    v-model="column.tasks"
                    :group="'tasks'"
                    item-key="_id"
                    class="min-vh-50"
                    ghost-class="bg-light"
                    :data-status="column.status"
                    @end="onDragEnd"
                >
                    <template #item="{ element }">
                    <div class="card mb-3 task-card" :data-id="element._id">
                        <div class="card-body p-2">
                        <h5 class="card-title mb-1">{{ element.title }}</h5>
                        <p class="card-text small text-muted">{{ element.description }}</p>
                        <div class="d-flex justify-content-start">
                            <button @click="editTask(columnIndex, element)" class="btn btn-sm btn-light">
                            <i class="menu-icon mdi mdi-pencil"></i>
                            </button>
                            <button @click="deleteTask(columnIndex, element._id)" class="btn btn-sm btn-light ms-2">
                            <i class="menu-icon mdi mdi-trash-can"></i>
                            </button>
                        </div>
                        </div>
                    </div>
                    </template>
                </draggable>
                </div>
            </div>
            </div>

            <!-- Modal Add Task -->
            <div v-if="showModal" class="modal fade show" tabindex="-1" style="display: block;" aria-modal="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ isEditing ? 'Edit Task' : 'Add New Task' }}</h5>
                    <button type="button" class="btn-close" @click="closeModal"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="saveTask">
                    <div class="mb-3">
                        <label for="taskTitle" class="form-label">Task Title</label>
                        <input type="text" id="taskTitle" v-model="newTask.title" class="form-control" required />
                    </div>
                    <div class="mb-3">
                        <label for="taskDescription" class="form-label">Task Description</label>
                        <textarea id="taskDescription" v-model="newTask.description" class="form-control"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">{{ isEditing ? 'Save Changes' : 'Add Task' }}</button>
                    </form>
                </div>
                </div>
            </div>
            </div>

        </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import draggable from 'vuedraggable';
import { useFetch } from '#app';

// Ambil Motivasi
const url = 'https://dummyjson.com/quotes/random';
const { data, error } = await useFetch(url);

if (error) {
  console.error('Error:', error);
} else {
  console.log('Data:', data);
}

// === [ BAGIAN BARU ] ===
// Data untuk jumlah user login
const activeUsers = ref(0)
const loadingActiveUsers = ref(true)

const fetchActiveUsers = async () => {
  try {
    const { data, error } = await useFetch('http://localhost:3001/auth/active-users')
    if (error.value) throw new Error(error.value)
    activeUsers.value = data.value.activeUsers
  } catch (err) {
    console.error('Gagal fetch active users:', err)
  } finally {
    loadingActiveUsers.value = false
  }
}
// === [ END BAGIAN BARU ] ===

const columns = ref([
  { title: 'To Do', status: 'todo', tasks: [] },
  { title: 'In Progress', status: 'in-progress', tasks: [] },
  { title: 'Done', status: 'done', tasks: [] }
]);

const showModal           = ref(false);
const newTask             = ref({ title: '', description: '' });
const selectedColumnIndex = ref(null);
const selectedTaskId      = ref(null);
const isEditing           = ref(false);

const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

// Menambah task baru ke backend dan frontend
const saveTask = async () => {
  try {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

    if (!token) {
      alert('Token is missing. Please log in again.');
      return;
    }

    if (isEditing.value) {
      const response = await axios.put(`http://localhost:3001/todos/${selectedTaskId.value}`, {
        title: newTask.value.title,
        description: newTask.value.description,
        status: 'todo',
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const column = columns.value.find(col => col.tasks.some(task => task._id === selectedTaskId.value));
      const taskIndex = column.tasks.findIndex(task => task._id === selectedTaskId.value);
      if (taskIndex !== -1) {
        column.tasks[taskIndex] = response.data;
      }
    } else {
      const response = await axios.post('http://localhost:3001/todos', {
        title: newTask.value.title,
        description: newTask.value.description,
        status: 'todo',
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const column = columns.value.find(col => col.title === 'To Do');
      column.tasks.push(response.data);
    }

    newTask.value = { title: '', description: '' };
    showModal.value = false;

  } catch (error) {
    console.error('Error saving task:', error);
    alert('Failed to save task. Please try again.');
  }
};

const showAddTaskForm = (columnIndex) => {
  selectedColumnIndex.value = columnIndex;
  isEditing.value = false;
  newTask.value = { title: '', description: '' };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  newTask.value = { title: '', description: '' };
};

const editTask = (columnIndex, task) => {
  selectedColumnIndex.value = columnIndex;
  selectedTaskId.value = task._id;
  newTask.value = { title: task.title, description: task.description };
  isEditing.value = true;
  showModal.value = true;
};

const deleteTask = async (columnIndex, taskId) => {
  const column = columns.value[columnIndex];
  const taskIndex = column.tasks.findIndex(task => task._id === taskId);
  if (taskIndex !== -1) {
    try {
      await axios.delete(`http://localhost:3001/todos/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      column.tasks.splice(taskIndex, 1);
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  }
};

const onDragEnd = async (event) => {
  const { to, item } = event;

  const todoId = item.dataset.id;
  const newStatus = to.closest('[data-status]')?.dataset.status;

  if (!newStatus || !todoId) {
    console.error('New status or todoId not found');
    return;
  }

  try {
    const token = localStorage.getItem('token');

    await axios.put(`http://localhost:3001/todos/${todoId}`, {
      status: newStatus
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Updated todo status successfully');
    await fetchTodos();
  } catch (err) {
    console.error('Failed to update todo status', err);
    if (err.response) {
      console.error('Server response:', err.response.data);
    }
  }
};

const fetchTodos = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3001/todos', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const todos = response.data;

    columns.value.forEach(col => col.tasks = []);

    const statusToColumnMap = columns.value.reduce((map, col) => {
      map[col.status] = col;
      return map;
    }, {});

    todos.forEach(todo => {
      const col = statusToColumnMap[todo.status];
      if (col) col.tasks.push(todo);
    });

  } catch (err) {
    console.error('Error fetching todos:', err);
  }
};

// Panggil fetchTodos & fetchActiveUsers ketika komponen di-mount
onMounted(() => {
  fetchTodos();
  fetchActiveUsers();
  setInterval(fetchActiveUsers, 5000);
});
</script>

  
  <style>
    .bg-light {
        opacity: 0.7;
    }
    .task-card {
    transition: background-color 0.2s;
    }

    .task-card:hover {
        cursor: pointer;
        background-color: #f0f0f0;
    }

  </style>
  