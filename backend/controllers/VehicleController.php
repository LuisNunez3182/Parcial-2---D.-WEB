<?php
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../enums/Status.php';
require_once __DIR__ . '/../storages/Vehicles.php';
require_once __DIR__ . '/../services/VehicleService.php';
// El controlador es solo un intermediario entre las rutas y la lógica de negocio, se encarga de recibir las solicitudes, procesar los datos y devolver las respuestas adecuadas.
// No hay mucho que decir de el todo lo que hace es recibir las solicitudes, delegar la lógica de negocio a los servicios y mandar el status.
class VehicleController
{
    private static function getRequestBody(): array
    {
        $input = file_get_contents("php://input");
        $data = json_decode($input, true);
        return is_array($data) ? $data : [];
    }

    public static function getAllVehicles()
    {
        return Response::payload(StorageVehicles::getVehicles(), "Vehiculos obtenidos exitosamente", Status::OK);
    }

    public static function getVehicleById($id)
    {
        $vehicle = StorageVehicles::getVehicleById($id);
        if (!$vehicle) {
            return Response::payload(null, "Vehiculo no encontrado", Status::NOT_FOUND);
        }

        return Response::payload($vehicle, "Vehiculo obtenido exitosamente", Status::OK);
    }

    public static function createVehicle($data = null)
    {
        $payload = is_array($data) ? $data : self::getRequestBody();
        if (empty($payload)) {
            return Response::payload(null, "Datos invalidos", Status::BAD_REQUEST);
        }

        try {
            $vehicle = CreateVehicle($payload);
            StorageVehicles::setVehicles($vehicle);
            return Response::payload($vehicle, "Vehiculo creado exitosamente", Status::CREATED);
        } catch (Exception $e) {
            return Response::payload(null, $e->getMessage(), Status::BAD_REQUEST);
        }
    }

    public static function updateVehicle($id)
    {
        $payload = self::getRequestBody();
        if (empty($payload)) {
            return Response::payload(null, "Datos invalidos", Status::BAD_REQUEST);
        }

        try {
            $vehicle = CreateVehicle($payload, $id);
            $updated = StorageVehicles::updateVehicle($id, $vehicle);
            if (!$updated) {
                return Response::payload(null, "Vehiculo no encontrado", Status::NOT_FOUND);
            }

            return Response::payload($vehicle, "Vehiculo actualizado exitosamente", Status::OK);
        } catch (Exception $e) {
            return Response::payload(null, $e->getMessage(), Status::BAD_REQUEST);
        }
    }

    public static function deleteVehicle($id)
    {
        $deleted = StorageVehicles::deleteVehicle($id);
        if (!$deleted) {
            return Response::payload(null, "Vehiculo no encontrado", Status::NOT_FOUND);
        }

        return Response::payload($deleted, "Vehiculo eliminado exitosamente", Status::OK);
    }
}
?>