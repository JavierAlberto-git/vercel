package com.example.practica3room.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.practica3room.apiclient.RetrofitClient
import com.example.practica3room.model.Task
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class TaskViewModel : ViewModel() {

    private val api = RetrofitClient.api

    // Lista de tareas expuesta a la UI (antes venía de Room)
    private val _allTasks = MutableStateFlow<List<Task>>(emptyList())
    val allTasks: StateFlow<List<Task>> = _allTasks

    init {
        // Cargar tareas al iniciar
        loadTasks()
    }

    // Obtener todas las tareas desde la API
    fun loadTasks() {
        viewModelScope.launch {
            try {
                _allTasks.value = api.getTasks()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    // Crear tarea en la API
    fun insertTask(task: Task) {
        viewModelScope.launch {
            try {
                val created = api.createTask(task)
                _allTasks.value = _allTasks.value + created
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    // Actualizar tarea en la API
    fun updateTask(task: Task) {
        viewModelScope.launch {
            try {
                val id = task.id ?: return@launch
                api.updateTask(id, task)
                // Refrescar lista desde el servidor
                loadTasks()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    // Eliminar tarea por ID en la API
    fun deleteTask(taskId: Int) {
        viewModelScope.launch {
            try {
                api.deleteTask(taskId)
                _allTasks.value = _allTasks.value.filter { it.id != taskId }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    // Obtener tarea por ID desde la API
    suspend fun getTaskById(taskId: Int): Task? {
        return try {
            api.getTask(taskId)
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    // Actualizar solo el estatus (true/false -> 1/0)
    fun updateTaskStatus(taskId: Int, newStatus: Boolean) {
        viewModelScope.launch {
            try {
                val current = _allTasks.value.find { it.id == taskId } ?: return@launch
                val updated = current.copy(estatus = if (newStatus) 1 else 0)
                api.updateTask(taskId, updated)
                loadTasks()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    // Eliminar todas las tareas (no tienes endpoint, las borramos una por una)
    fun deleteAllTasks() {
        viewModelScope.launch {
            try {
                val tasks = _allTasks.value
                tasks.forEach { task ->
                    task.id?.let { api.deleteTask(it) }
                }
                _allTasks.value = emptyList()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    // Marcar tarea como completada (solo atajo)
    fun markTaskAsCompleted(taskId: Int) {
        updateTaskStatus(taskId, true)
    }
}
