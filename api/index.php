<?php
//Usamos require_once para incluir los archivos necesarios para la inicialización de la aplicación, como modelos, servicios y almacenamiento. Esto asegura que todas las clases y funciones estén disponibles para manejar las solicitudes de la API.
require_once __DIR__ . '/../backend/config/init.php';
require_once __DIR__ . '/../backend/routes/api.php';
require_once __DIR__ . '/../backend/controllers/VehicleController.php';
require_once __DIR__ . '/../backend/controllers/AuthController.php';

/* CORS Headers que es importante para permitir que el frontend (que probablemente esté corriendo en un puerto diferente) pueda hacer solicitudes a esta API 
sin ser bloqueado por el navegador debido a políticas de seguridad. Aquí se permiten solicitudes desde localhost:5173, que es donde típicamente se ejecuta una aplicación frontend en desarrollo. 
También se manejan las solicitudes preflight (OPTIONS) para asegurar que los navegadores puedan verificar los permisos antes de enviar la solicitud real.*/
/* Las solicitudes preflight son solicitudes OPTIONS que el navegador envía automáticamente para verificar si el servidor permite la solicitud real. */
$allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173'
];
/* Se obtiene el origen de la solicitud y se verifica si está en la lista de orígenes permitidos. 
Si es así, se establece el encabezado Access-Control-Allow-Origin con ese origen específico. */
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
/* in_array se utiliza para verificar si el origen de la solicitud está en la lista de orígenes permitidos. 
Si el origen está permitido, se establece el encabezado Access-Control-Allow-Origin con ese origen específico. */
if (in_array($origin, $allowedOrigins, true)) {
    //los header son encabezados HTTP que se envían en la respuesta para controlar el acceso a la API desde diferentes orígenes.
    /* Access-Control-Allow-Origin se utiliza para especificar qué orígenes están permitidos para acceder a los recursos de la API.
    En este caso, se permite el acceso desde localhost:5173. */
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    /*sino se encuentra el origen en la lista de permitidos, se puede optar por no establecer 
    el encabezado o establecerlo con un valor específico que indique que no se permite el acceso. 
    En este caso, se establece con localhost:5173 como valor predeterminado. */
    header('Access-Control-Allow-Origin: http://localhost:5173');
}
/* Vary: Origin se utiliza para indicar a los proxies y navegadores que la respuesta puede variar según el origen de la solicitud, 
lo que es importante para el manejo adecuado de CORS.*/
header('Vary: Origin');
/* Access-Control-Allow-Credentials se establece en true para permitir que las cookies y otras credenciales se envíen con las solicitudes a la API, 
lo que es necesario para mantener sesiones de usuario autenticadas. */
header('Access-Control-Allow-Credentials: true');
/* Access-Control-Allow-Methods se utiliza para especificar qué métodos HTTP están permitidos para acceder a los recursos de la API. */
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
/* Access-Control-Allow-Headers se utiliza para especificar qué encabezados HTTP están permitidos para acceder a los recursos de la API. */
header('Access-Control-Allow-Headers: Content-Type, Authorization');
/* Access-Control-Max-Age se utiliza para especificar cuánto tiempo (en segundos) los navegadores pueden almacenar en caché las respuestas preflight. */
header('Access-Control-Max-Age: 3600');

/*Esto maneja las solicitudes preflight (OPTIONS) dandole una respuesta 200 */
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
/*Content-Type: application/json se establece el tipo de contenido de la respuesta como JSON, 
lo que es importante para que el frontend pueda interpretar correctamente los datos que recibe de la API.*/
header('Content-Type: application/json');
/* Usamos REQUEST_METHOD para obtener el método de la solicitud */
$method = $_SERVER['REQUEST_METHOD'];
/* Usamos parse_url para obtener la ruta de la solicitud con PHP_URL_PATH */
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
/* Con str_replace eliminamos la parte de la URL que corresponde al archivo index.php */
$uri = str_replace('/api/index.php', '', $uri);
/* Por ultimo hacemos un trim para eliminar los slashes al principio y al final */
$uri = trim($uri, '/');

/* Abrimos un try para manejar posibles excepciones */
try {
    $found = false;
    /* Verificamos si el método de la solicitud existe en las rutas definidas. Si es así, iteramos sobre las rutas correspondientes a ese método para encontrar una coincidencia con la URI de la solicitud.
    Para cada ruta, se convierte el patrón de la ruta en una expresión regular para manejar rutas dinámicas (como 'vehicles/{id}'). Si se encuentra una coincidencia, se extraen los parámetros de la URI 
    y se llama al controlador y acción correspondientes para manejar la solicitud. */
    if (isset($routes[$method])) {
        foreach ($routes[$method] as $route => $handler) {
            /* Usamos preg_replace para convertir las rutas con parámetros (como 'vehicles/{id}') en expresiones regulares que puedan coincidir con la URI de la solicitud.
            Ejemplo: 'vehicles/{id}' se convierte en '#^vehicles/([^\/]+)$#' */
            $pattern = preg_replace('/\{id\}/', '([^\/]+)', $route);
            $pattern = "#^" . $pattern . "$#";
            /* Con preg_match comprobamos si la URI coincide con el patrón */
            /* matches se vuelve un array con las coincidencias Ejemplo: ['123'] */
            if (preg_match($pattern, $uri, $matches)) {
                $found = true;
                /* array_shift se utiliza para eliminar el primer elemento del array de coincidencias, que es la cadena completa que coincide con la expresión regular. 
                Esto deja solo los parámetros extraídos de la URI en el array, que luego se pasan como argumentos a la acción del controlador. */
                array_shift($matches);
                [$controller, $action] = $handler;
                /*echo json_encode lo que hace es convertir el resultado del controlador en JSON */
                echo json_encode(
                    $controller::$action(...$matches)
                );
                exit;
            }
        }
    }
    /*Si falla mandamos 404 (NOT FOUND) */
    if (!$found) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Ruta no encontrada'
        ]);
    }

} catch (Exception $e) {
    /* Si ocurre una excepción, se captura y se devuelve una respuesta con un código de estado 500 (Internal Server Error) junto con un mensaje de error en formato JSON. */
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
