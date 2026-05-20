<?php
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../enums/Status.php';

class AuthController
{
    // Reciclado pero mas bonito con un static y dentro de un objeto
    private static $USERS = [
        [
            'usuario' => 'admin',
            'contrasena' => '1234',
            'nombre' => 'Administrador',
            'rol' => 'admin'
        ],
        [
            'usuario' => 'operador',
            'contrasena' => '1234',
            'nombre' => 'Operador',
            'rol' => 'operador'
        ]
    ];
    /* Esta funcion se encarga de obtener el cuerpo de la solicitud HTTP, decodificarlo desde JSON y 
    devolverlo como un array asociativo. Si el cuerpo no es un JSON válido o no es un array, devuelve un array vacío.
     Esto es útil para manejar las solicitudes POST o PUT donde se espera que los datos se envíen en formato JSON.*/
    private static function getRequestBody(): array
    {
        // file_get_contents("php://input") se utiliza para leer el cuerpo de la solicitud HTTP, que generalmente contiene los datos enviados por el cliente en una solicitud POST o PUT.
        $input = file_get_contents("php://input");
        // json_decode se utiliza para convertir el JSON recibido en un array asociativo de PHP. El segundo parámetro true indica que queremos un array asociativo en lugar de un objeto.
        $data = json_decode($input, true);
        /* return con ternario se utiliza para verificar si el resultado de json_decode es un array. Si es así, se devuelve el array; de lo contrario, se devuelve un array vacío. 
        Esto ayuda a evitar errores en caso de que el JSON no sea válido o no contenga un objeto o array.*/
        return is_array($data) ? $data : [];
    }

    public static function login()
    {
        /*Usamos self:: y no $this porque son métodos estáticos */
        // se llama payload porque es el cuerpo de la solicitud que contiene los datos enviados por el cliente, en este caso, las credenciales de inicio de sesión (usuario y contraseña).
        $payload = self::getRequestBody();
        // Se intenta obtener el nombre de usuario y la contraseña del payload, permitiendo tanto 'usuario' como 'username' para el nombre de usuario, y 'contrasena' o 'password' para la contraseña. Si no se proporcionan, se asigna una cadena vacía.
        $usuario = trim($payload['usuario'] ?? '') ?: trim($payload['username'] ?? '');
        // Se hace lo mismo para la contraseña, permitiendo tanto 'contrasena' como 'password' como claves posibles en el payload. Si no se proporcionan, se asigna una cadena vacía.
        $contrasena = $payload['contrasena'] ?? $payload['password'] ?? '';
        // Si estan vacíos, se devuelve una respuesta con un mensaje de error indicando que se requieren el usuario y la contraseña, junto con un código de estado 400 (Bad Request).
        if (empty($usuario) || empty($contrasena)) {
            return Response::payload(null, "Usuario y contraseña requeridos", Status::BAD_REQUEST);
        }
        /* Se itera sobre el array de usuarios para verificar si las credenciales proporcionadas coinciden con alguna de las entradas. Si se encuentra una coincidencia, se inicia 
        una sesión y se almacena la información del usuario en la sesión. Luego, se devuelve una respuesta con los detalles del usuario y un mensaje de éxito. Si no se encuentra 
        ninguna coincidencia después de iterar por todos los usuarios, se devuelve una respuesta indicando que las credenciales son inválidas, junto con un código de estado 401 (Unauthorized). */
        foreach (self::$USERS as $user) {
            if ($user['usuario'] === $usuario && $user['contrasena'] === $contrasena) {
                // Iniciar sesión
                session_start();
                $_SESSION['usuario'] = [
                    'usuario' => $user['usuario'],
                    'nombre' => $user['nombre'],
                    'rol' => $user['rol']
                ];
                // retornamos el usuario sin la contraseña y con un mensaje de éxito, junto con un código de estado 200 (OK).
                return Response::payload([
                    'usuario' => $user['usuario'],
                    'nombre' => $user['nombre'],
                    'rol' => $user['rol']
                ], "Sesión iniciada exitosamente", Status::OK);
            }
        }
        // Si no se encuentra una coincidencia, se devuelve una respuesta indicando que las credenciales son inválidas, junto con un código de estado 401 (Unauthorized).
        return Response::payload(null, "Credenciales inválidas", Status::UNAUTHORIZED);
    }
    // Cerrar sesion esto es casi reciclado.
    public static function logout()
    {
        session_start();
        session_destroy();
        
        return Response::payload(null, "Sesión cerrada exitosamente", Status::OK);
    }
    // Obtener el usuario actual 
    public static function getCurrentUser()
    {
        session_start();
        
        if (!isset($_SESSION['usuario'])) {
            return Response::payload(null, "No hay sesión activa", Status::UNAUTHORIZED);
        }

        return Response::payload($_SESSION['usuario'], "Usuario obtenido exitosamente", Status::OK);
    }
}
?>
