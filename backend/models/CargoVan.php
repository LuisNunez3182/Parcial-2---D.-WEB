<?php
require_once __DIR__ . '/GasolineVehicle.php';

class CargoVan extends GasolineVehicle
{
    private $axles;

    public function __construct($id, $plate, $make, $model, $city, $year, $color, $axles, $capacity, $consumption, $fuelLevel, $tankCap, $fuelType)
    {
        parent::__construct($id, $plate, $make, $model, $city, $year, $color, $capacity, $consumption, $fuelLevel, $tankCap, $fuelType);
        $this->axles = $axles;
        $this->wheels = $axles * 2; // Cada eje tiene 2 ruedas
    }
    // Formula de consumo de energia basada en la capacidad y el numero de ejes, esto es solo un ejemplo y puede ser ajustada segun las necesidades del proyecto.
    public function getEnergyConsumption()
    {
        // Fórmula de consumo de combustible para furgonetas de carga
        return ($this->capacity * 0.15) + ($this->axles * 0.4);
    }
    // Formula de tarifa base basada en la capacidad y el numero de ejes, esto es solo un ejemplo y puede ser ajustada segun las necesidades del proyecto.
    public function getBaseRate()
    {
        // Fórmula de tarifa base para furgonetas de carga
        return ($this->capacity * 0.08) + ($this->axles * 0.25);
    }


    public function getAxles()
    {
        return $this->axles;
    }
}
?>