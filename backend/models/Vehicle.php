<?php
// Usamos JsonSerializable para poder convertir los objetos de las clases hijas a JSON fácilmente, lo que es útil para enviar respuestas desde la API
abstract class Vehicle implements JsonSerializable
{
    protected $id;
    protected $make;
    protected $model;
    protected $year;
    protected $color;
    protected $wheels;
    protected $capacity;
    protected $energyType; // 'electric' o 'gasoline'
    protected $plate;
    protected $city;
    protected $status;
    protected $load;
    protected $battery;
    protected $range;
    protected $consumption;
    protected $fuelLevel;
    protected $tankCap;
    protected $fuelType;
    protected $vehicleType;

    public function __construct($id, $plate, $make, $model, $city, $year, $color, $capacity, $consumption)
    {
        $this->id = $id;
        $this->plate = $plate;
        $this->make = $make;
        $this->model = $model;
        $this->city = $city;
        $this->year = $year;
        $this->color = $color;
        $this->capacity = $capacity;
        $this->consumption = $consumption;
    }

    abstract public function getEnergyConsumption();
    abstract public function getBaseRate();
    // Esto es para convertir el objeto a JSON, lo que es útil para enviar respuestas desde la API. Se incluyen todos los atributos relevantes del vehículo, como su ID, marca, modelo, año, color, capacidad, tipo de energía, placa, ciudad, estado, carga, batería, rango, consumo de energía y detalles del combustible.
    public function jsonSerialize(): mixed
    {
        return [
            'id' => $this->id,
            'make' => $this->make,
            'model' => $this->model,
            'year' => $this->year,
            'color' => $this->color,
            'capacity' => $this->capacity,
            'wheels' => $this->wheels,
            'energyType' => $this->energyType,
            'type' => $this->energyType === 'electric' ? 'electric' : 'combustion',
            'vehicleType' => $this->vehicleType,
            'plate' => $this->plate,
            'city' => $this->city,
            'status' => $this->status,
            'load' => $this->load,
            'battery' => $this->battery,
            'range' => $this->range,
            'consumption' => $this->consumption,
            'fuelLevel' => $this->fuelLevel,
            'tankCap' => $this->tankCap,
            'fuelType' => $this->fuelType
        ];
    }
    // Esto es para actualizar los campos del vehículo con los datos proporcionados en un array. Se asignan los valores a los atributos correspondientes del objeto, utilizando el operador de fusión de null (??) para manejar casos donde algunos datos puedan no estar presentes en el array.
    public function setClientFields(array $data): void
    {
        $this->plate = $data['plate'] ?? null;
        $this->city = $data['city'] ?? null;
        $this->status = $data['status'] ?? null;
        $this->load = $data['load'] ?? null;
        $this->battery = $data['battery'] ?? null;
        $this->range = $data['range'] ?? null;
        $this->consumption = $data['consumption'] ?? null;
        $this->fuelLevel = $data['fuelLevel'] ?? null;
        $this->tankCap = $data['tankCap'] ?? null;
        $this->fuelType = $data['fuelType'] ?? null;
        $this->vehicleType = $data['type'] ?? null;
    }

    public function getId()
    {
        return $this->id;
    }

    public function getMake()
    {
        return $this->make;
    }

    public function getModel()
    {
        return $this->model;
    }

    public function getYear()
    {
        return $this->year;
    }

    public function getColor()
    {
        return $this->color;
    }

    public function getCapacity()
    {
        return $this->capacity;
    }

    public function getWheels()
    {
        return $this->wheels;
    }

    public function getEnergyType()
    {
        return $this->energyType;
    }
}
?>
