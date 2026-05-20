<?php
// El enum Status se utiliza para definir códigos de estado HTTP que se pueden usar en las respuestas de la API. Esto ayuda a mantener el código limpio y consistente al manejar diferentes tipos de respuestas, como éxitos, redirecciones, errores del cliente y errores del servidor.
enum Status: int {
    // Respuestas Exitosas (2xx)
    case OK = 200;
    case CREATED = 201;

    // Redirecciones (3xx)
    case MOVED_PERMANENTLY = 301;

    // Errores del Cliente (4xx)
    case BAD_REQUEST = 400;
    case UNAUTHORIZED = 401;
    case NOT_FOUND = 404;
    case CONFLICT = 409;

    // Errores del Servidor (5xx)
    case INTERNAL_SERVER_ERROR = 500;
}
?>