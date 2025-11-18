package com.example.practica3room.apiclient

import com.example.practica3room.model.Task
import com.example.practica3room.model.DeleteRequest
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.HTTP
import retrofit2.http.POST
import retrofit2.http.PUT

interface TaskApiService {

    // GET https://.../api/tasks
    @GET(".")
    suspend fun getTasks(): List<Task>

    // POST https://.../api/tasks
    @POST(".")
    suspend fun createTask(
        @Body task: Task
    ): Task

    // PUT https://.../api/tasks
    @PUT(".")
    suspend fun updateTask(
        @Body task: Task
    ): Response<Unit>

    // DELETE https://.../api/tasks  (con body { "id": X })
    @HTTP(method = "DELETE", path = ".", hasBody = true)
    suspend fun deleteTask(
        @Body request: DeleteRequest
    ): Response<Unit>
}
