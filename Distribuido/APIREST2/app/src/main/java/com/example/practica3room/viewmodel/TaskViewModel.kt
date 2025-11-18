package com.example.practica3room.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.practica3room.apiclient.RetrofitClient
import com.example.practica3room.model.DeleteRequest
import com.example.practica3room.model.Task
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class TaskViewModel : ViewModel() {

    private val api = RetrofitClient.api

    private val _allTasks = MutableStateFlow<List<Task>>(emptyList())
    val allTasks: StateFlow<List<Task>> = _allTasks

    init {
        loadTasks()
    }

    // GET /api/tasks
    fun loadTasks() {
        viewModelScope.launch {
            try {
                val tareas = api.getTasks()
                _allTasks.value = tareas
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    // POST /api/tasks
    fun insertTask(task: Task) {
        viewModelScope.launch {
            try {
                api.createTask(task)
                // recargar desde el servidor para traer el id correcto
                loadTasks()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    // PUT /api/tasks  (el Task YA debe traer id)
    fun updateTask(task: Task) {
        viewModelScope.launch {
            try {
                val id = task.id ?: return@launch
                val resp = api.updateTask(task)
                if (resp.isSuccessful) {
                    loadTasks()
                } else {
                    println("Error updateTask: ${resp.code()} ${resp.message()}")
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    // DELETE /api/tasks  con body { "id": taskId }
    fun deleteTask(taskId: Int) {
        viewModelScope.launch {
            try {
                val resp = api.deleteTask(DeleteRequest(taskId))
                if (resp.isSuccessful) {
                    loadTasks()
                } else {
                    println("Error deleteTask: ${resp.code()} ${resp.message()}")
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    // Cambiar solo estatus (true/false -> 1/0)
    fun updateTaskStatus(taskId: Int, newStatus: Boolean) {
        viewModelScope.launch {
            try {
                val current = _allTasks.value.find { it.id == taskId } ?: return@launch
                val updated = current.copy(
                    estatus = if (newStatus) 1 else 0
                )
                val resp = api.updateTask(updated)
                if (resp.isSuccessful) {
                    loadTasks()
                } else {
                    println("Error updateTaskStatus: ${resp.code()} ${resp.message()}")
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    // Eliminar todas (borrando una por una)
    fun deleteAllTasks() {
        viewModelScope.launch {
            try {
                val tasks = _allTasks.value
                tasks.forEach { task ->
                    task.id?.let { id ->
                        api.deleteTask(DeleteRequest(id))
                    }
                }
                loadTasks()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun markTaskAsCompleted(taskId: Int) {
        updateTaskStatus(taskId, true)
    }
}
