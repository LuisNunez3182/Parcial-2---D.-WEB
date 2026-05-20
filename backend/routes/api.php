<?php
// Las rutas de la API se definen en este archivo, donde se especifica qué controlador y método manejará cada tipo de solicitud (GET, POST, PUT, DELETE) para las diferentes rutas. Esto permite organizar la lógica de la aplicación de manera clara y estructurada, facilitando el mantenimiento y la escalabilidad del código.
// PUT y DELETE son métodos HTTP que se utilizan para actualizar y eliminar recursos respectivamente. En este caso, se utilizan para actualizar y eliminar vehículos específicos identificados por su ID en la ruta 'vehicles/{id}'.
$routes = [

    'GET' => [
        'vehicles' => ['VehicleController', 'getAllVehicles'],
        'vehicles/{id}' => ['VehicleController', 'getVehicleById'],
        'auth/current-user' => ['AuthController', 'getCurrentUser']
    ],

    'POST' => [
        'vehicles' => ['VehicleController', 'createVehicle'],
        'auth/login' => ['AuthController', 'login'],
        'auth/logout' => ['AuthController', 'logout']
    ],
    // PUT es para actualizar un recurso existente, en este caso un vehículo específico identificado por su ID. La ruta 'vehicles/{id}' indica que se espera un ID de vehículo en la URL, y el controlador 'VehicleController' manejará la lógica para actualizar ese vehículo con los datos proporcionados en la solicitud.
    'PUT' => [
        'vehicles/{id}' => ['VehicleController', 'updateVehicle']
    ],
    // DELETE se utiliza para eliminar un recurso específico, en este caso un vehículo identificado por su ID. La ruta 'vehicles/{id}' indica que se espera un ID de vehículo en la URL, y el controlador 'VehicleController' manejará la lógica para eliminar ese vehículo de la base de datos o del almacenamiento donde se mantengan los registros de los vehículos.
    'DELETE' => [
        'vehicles/{id}' => ['VehicleController', 'deleteVehicle']
    ]
];
?>