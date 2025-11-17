package com.example.practica3room.apiclient

import com.example.practica3room.model.Task
import retrofit2.http.*

interface TaskApiService {

    // GET http://.../api/tasks/
    @GET(".")
    suspend fun getTasks(): List<Task>

    // GET http://.../api/tasks/{id}
    @GET("{id}")
    suspend fun getTask(
        @Path("id") id: Int
    ): Task

    // POST http://.../api/tasks/
    @POST(".")
    suspend fun createTask(
        @Body task: Task
    ): Task

    // PUT http://.../api/tasks/{id}
    @PUT("{id}")
    suspend fun updateTask(
        @Path("id") id: Int,
        @Body task: Task
    )

    // DELETE http://.../api/tasks/{id}
    @DELETE("{id}")
    suspend fun deleteTask(
        @Path("id") id: Int
    )
}
