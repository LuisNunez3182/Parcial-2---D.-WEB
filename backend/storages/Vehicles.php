<?php 
class StorageVehicles{
    private static function ensureStorage(): void
    {
        if (!isset($_SESSION['vehicles']) || !is_array($_SESSION['vehicles'])) {
            $_SESSION['vehicles'] = [];
        }
    }

    public static function getVehicles(): array
    {
        self::ensureStorage();
        return $_SESSION['vehicles'];
    }

    public static function setVehicles(object $vehicle): void
    {
        self::ensureStorage();
        $_SESSION['vehicles'][] = $vehicle;
    }

    public static function setVehiclesList(array $vehicles): void
    {
        $_SESSION['vehicles'] = $vehicles;
    }

    public static function getVehicleById(string $id): ?object
    {
        self::ensureStorage();
        foreach ($_SESSION['vehicles'] as $vehicle) {
            if (method_exists($vehicle, 'getId') && $vehicle->getId() === $id) {
                return $vehicle;
            }
        }

        return null;
    }

    public static function updateVehicle(string $id, object $vehicle): bool
    {
        self::ensureStorage();
        foreach ($_SESSION['vehicles'] as $index => $item) {
            if (method_exists($item, 'getId') && $item->getId() === $id) {
                $_SESSION['vehicles'][$index] = $vehicle;
                return true;
            }
        }

        return false;
    }

    public static function deleteVehicle(string $id): ?object
    {
        self::ensureStorage();
        foreach ($_SESSION['vehicles'] as $index => $item) {
            if (method_exists($item, 'getId') && $item->getId() === $id) {
                $deleted = $item;
                array_splice($_SESSION['vehicles'], $index, 1);
                return $deleted;
            }
        }

        return null;
    }
}
?>