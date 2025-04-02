
import React from 'react';
import VehicleForm from '@/components/VehicleForm';

const VehicleRegistration = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Registro de Vehículos</h1>
        <p className="text-muted-foreground mt-1">
          Registre los vehículos que ingresan al servicio de lavado.
        </p>
      </div>
      
      <VehicleForm />
    </div>
  );
};

export default VehicleRegistration;
