<?php
// La clase Response se utiliza para estructurar las respuestas de la API de manera consistente. El método payload recibe los datos, un mensaje y un código de estado, y devuelve un array con esta información organizada. Esto facilita la gestión de las respuestas en el frontend, ya que siempre se puede esperar una estructura uniforme en las respuestas de la API.
class Response {
    public static function payload($data, $message, Status $status_code): array {
        return [
            "status"  => $status_code->value,
            "success" => ($status_code->value >= 200 && $status_code->value < 300),
            "message" => $message,
            "data"    => $data
        ];
    }
}
?>