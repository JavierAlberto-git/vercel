package com.example.practica3room.apiclient

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitClient {

    /*
     * Si pruebas en EMULADOR:
     *  - Usa 10.0.2.2 en lugar de localhost
     * Tu API expone /api/tasks, así que dejamos la base en /api/tasks/
     */
    private const val BASE_URL = "http://192.168.1.71:3000/api/tasks/"


    // Si luego pruebas en CELULAR FÍSICO, cámbialo por la IP de tu PC:
    // private const val BASE_URL = "http://192.168.X.X:3000/api/tasks/"

    val api: TaskApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(TaskApiService::class.java)
    }
}


