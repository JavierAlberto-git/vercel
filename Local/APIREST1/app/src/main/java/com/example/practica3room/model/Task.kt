package com.example.practica3room.model

import com.google.gson.annotations.SerializedName

data class Task(
        val id: Int? = null,

        @SerializedName("nombre")
        val nombre: String,

        @SerializedName("estatus")
        val estatus: Int,   // 0 o 1

        @SerializedName("fecha_entrega")
        val fechaEntrega: String   // "2025-11-20"
)
