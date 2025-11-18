@file:OptIn(ExperimentalMaterial3Api::class)

package com.example.practica3room.ui.screens

import android.annotation.SuppressLint
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.example.practica3room.model.Task
import com.example.practica3room.ui.theme.BackgroundCream
import com.example.practica3room.ui.theme.PrimaryBlue
import com.example.practica3room.viewmodel.TaskViewModel
import java.text.SimpleDateFormat
import java.util.*

@SuppressLint("UnusedMaterial3ScaffoldPaddingParameter")
@Composable
fun AddTaskScreen(navController: NavHostController, viewModel: TaskViewModel) {

    var taskName by remember { mutableStateOf("") }
    var plannedDate by remember { mutableStateOf("") }
    var showSuccessDialog by remember { mutableStateOf(false) }
    var showErrorDialog by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf("") }
    var showDatePicker by remember { mutableStateOf(false) }

    // 🕒 calcular "hoy" en UTC, a las 00:00
    val todayUtcMillis = remember {
        val cal = Calendar.getInstance(TimeZone.getTimeZone("UTC")).apply {
            set(Calendar.HOUR_OF_DAY, 0)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }
        cal.timeInMillis
    }

    // 📅 state del DatePicker, inicializado en hoy
    val datePickerState = rememberDatePickerState(
        initialSelectedDateMillis = todayUtcMillis
    )

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        text = "Agregar Nueva Tarea",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(
                            imageVector = Icons.Default.ArrowBack,
                            contentDescription = "Volver",
                            tint = BackgroundCream
                        )
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = PrimaryBlue,
                    titleContentColor = BackgroundCream,
                    navigationIconContentColor = BackgroundCream
                )
            )
        }
    ) { paddingValues ->

        Column(
            modifier = Modifier
                .padding(paddingValues)
                .fillMaxSize()
                .background(BackgroundCream)
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(24.dp))

            // Campo de nombre
            OutlinedTextField(
                value = taskName,
                onValueChange = { taskName = it },
                label = { Text("Nombre de la tarea") },
                placeholder = { Text("Ej: Estudiar Kotlin") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = PrimaryBlue,
                    focusedLabelColor = PrimaryBlue,
                    cursorColor = PrimaryBlue
                )
            )

            Spacer(modifier = Modifier.height(20.dp))

            // Campo de fecha planeada
            OutlinedTextField(
                value = plannedDate,
                onValueChange = { },
                label = { Text("Fecha de entrega") },
                placeholder = { Text("Selecciona una fecha") },
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { showDatePicker = true },
                singleLine = true,
                readOnly = true,
                enabled = false,
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    disabledBorderColor = PrimaryBlue,
                    disabledLabelColor = PrimaryBlue,
                    disabledTextColor = MaterialTheme.colorScheme.onSurface,
                    disabledPlaceholderColor = MaterialTheme.colorScheme.onSurfaceVariant
                ),
                trailingIcon = {
                    Icon(
                        imageVector = Icons.Default.DateRange,
                        contentDescription = "Seleccionar fecha",
                        tint = PrimaryBlue,
                        modifier = Modifier.clickable { showDatePicker = true }
                    )
                }
            )

            Spacer(modifier = Modifier.height(32.dp))

            // BOTÓN GUARDAR
            Button(
                onClick = {

                    if (taskName.isBlank()) {
                        errorMessage = "El nombre de la tarea no puede estar vacío"
                        showErrorDialog = true
                        return@Button
                    }

                    if (plannedDate.isBlank()) {
                        errorMessage = "Debe seleccionar una fecha"
                        showErrorDialog = true
                        return@Button
                    }

                    // Convertir dd/MM/yyyy → yyyy-MM-dd
                    val apiDate = try {
                        val inputFormat = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault())
                        val outputFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
                        val date = inputFormat.parse(plannedDate)
                        outputFormat.format(date!!)
                    } catch (e: Exception) {
                        plannedDate // fallback
                    }

                    val newTask = Task(
                        id = null,
                        nombre = taskName.trim(),
                        estatus = 0,
                        fechaEntrega = apiDate
                    )

                    viewModel.insertTask(newTask)
                    showSuccessDialog = true
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.CheckCircle,
                    contentDescription = null,
                    modifier = Modifier.size(24.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Guardar Tarea",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // BOTÓN CANCELAR
            OutlinedButton(
                onClick = { navController.popBackStack() },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = PrimaryBlue)
            ) {
                Text(
                    text = "Cancelar",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Medium
                )
            }
        }
    }

    // DatePicker Dialog
    if (showDatePicker) {
        DatePickerDialog(
            onDismissRequest = { showDatePicker = false },
            confirmButton = {
                TextButton(onClick = {
                    datePickerState.selectedDateMillis?.let { millis ->
                        // ✅ Formatear en UTC para evitar el "un día menos"
                        val formatter = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault()).apply {
                            timeZone = TimeZone.getTimeZone("UTC")
                        }
                        plannedDate = formatter.format(Date(millis))
                    }
                    showDatePicker = false
                }) {
                    Text("Aceptar", color = PrimaryBlue)
                }
            },
            dismissButton = {
                TextButton(onClick = { showDatePicker = false }) {
                    Text("Cancelar", color = PrimaryBlue)
                }
            }
        ) {
            // DatePicker Dialog
            if (showDatePicker) {
                DatePickerDialog(
                    onDismissRequest = { showDatePicker = false },
                    confirmButton = {
                        TextButton(onClick = {
                            val selectedMillis = datePickerState.selectedDateMillis

                            if (selectedMillis == null) {
                                // Nada seleccionado
                                errorMessage = "Debe seleccionar una fecha válida"
                                showErrorDialog = true
                                return@TextButton
                            }

                            // 🕒 Comparamos contra hoy (en UTC) para no permitir fechas pasadas
                            if (selectedMillis < todayUtcMillis) {
                                errorMessage = "No puedes seleccionar una fecha anterior a hoy"
                                showErrorDialog = true
                                // NO cerramos el diálogo
                                return@TextButton
                            }

                            // ✅ Formatear en UTC para evitar que se recorra un día
                            val formatter = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault()).apply {
                                timeZone = TimeZone.getTimeZone("UTC")
                            }
                            plannedDate = formatter.format(Date(selectedMillis))

                            showDatePicker = false
                        }) {
                            Text("Aceptar", color = PrimaryBlue)
                        }
                    },
                    dismissButton = {
                        TextButton(onClick = { showDatePicker = false }) {
                            Text("Cancelar", color = PrimaryBlue)
                        }
                    }
                ) {
                    DatePicker(
                        state = datePickerState,
                        colors = DatePickerDefaults.colors(
                            selectedDayContainerColor = PrimaryBlue,
                            todayContentColor = PrimaryBlue,
                            todayDateBorderColor = PrimaryBlue
                        )
                    )
                }
            }

        }
    }

    // ÉXITO
    if (showSuccessDialog) {
        AlertDialog(
            onDismissRequest = { },
            icon = {
                Icon(
                    imageVector = Icons.Default.CheckCircle,
                    contentDescription = null,
                    tint = PrimaryBlue,
                    modifier = Modifier.size(48.dp)
                )
            },
            title = { Text("¡Tarea Agregada!", fontWeight = FontWeight.Bold) },
            text = { Text("La tarea '$taskName' ha sido guardada exitosamente.") },
            confirmButton = {
                Button(
                    onClick = {
                        showSuccessDialog = false
                        navController.popBackStack()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue)
                ) {
                    Text("Aceptar")
                }
            }
        )
    }

    // ERROR
    if (showErrorDialog) {
        AlertDialog(
            onDismissRequest = { showErrorDialog = false },
            title = { Text("Error", fontWeight = FontWeight.Bold) },
            text = { Text(errorMessage) },
            confirmButton = {
                Button(
                    onClick = { showErrorDialog = false },
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue)
                ) {
                    Text("Entendido")
                }
            }
        )
    }
}
