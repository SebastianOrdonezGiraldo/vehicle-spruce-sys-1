// src/pages/RateService.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Check, Star, Coffee, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  rateService,
  ServiceRating 
} from '@/api/serviceRatingApi';
import { 
  validateServiceRatingLink,
  ServiceRatingLinkValidation
} from '@/api/serviceRatingLinkApi';

const RateService: React.FC = () => {
  const { token } = useParams();  // Cambiar de serviceId a token
  const navigate = useNavigate();

  const [waitTimeRating, setWaitTimeRating] = useState(0);
  const [staffFriendlinessRating, setStaffFriendlinessRating] = useState(0);
  const [serviceQualityRating, setServiceQualityRating] = useState(0);
  const [comment, setComment] = useState('');
  const [serviceDetails, setServiceDetails] = useState<ServiceRatingLinkValidation | null>(null);

  // Validar enlace de calificación
  const { 
    data: validationData, 
    isLoading: isValidating, 
    isError: isValidationError 
  } = useQuery<ServiceRatingLinkValidation>({
    queryKey: ['validateServiceRatingLink', token],
    queryFn: () => token ? validateServiceRatingLink(token) : Promise.reject('Token no proporcionado'),
    enabled: !!token
  });

  useEffect(() => {
    if (validationData) {
      setServiceDetails(validationData);
    }
  }, [validationData]);

  // Rating mutation
  const ratingMutation = useMutation({
    mutationFn: (data: Omit<ServiceRating, 'id' | 'created_at'>) => 
      rateService(data.service_id, data),
    onSuccess: () => {
      toast.success('¡Gracias por tu calificación!', {
        description: 'Tu opinión nos ayuda a mejorar nuestro servicio.'
      });
      navigate('/');  // Redirigir al dashboard
    },
    onError: (error) => {
      toast.error('Error al enviar calificación', {
        description: error instanceof Error ? error.message : 'Intente nuevamente'
      });
    }
  });

  const handleSubmit = () => {
    // Validación de calificaciones
    if (!serviceDetails) {
      toast.warning('Información del servicio no disponible');
      return;
    }

    if (!waitTimeRating || !staffFriendlinessRating || !serviceQualityRating) {
      toast.warning('Por favor, complete todas las calificaciones');
      return;
    }

    ratingMutation.mutate({
      service_id: serviceDetails.serviceId,
      wait_time_rating: waitTimeRating,
      staff_friendliness_rating: staffFriendlinessRating,
      service_quality_rating: serviceQualityRating,
      customer_comment: comment
    });
  };

  const renderStarRating = (
    rating: number, 
    setRating: React.Dispatch<React.SetStateAction<number>>,
    label: string,
    icon: React.ReactNode
  ) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 cursor-pointer ${
              star <= rating 
                ? 'text-yellow-500 fill-yellow-500' 
                : 'text-gray-300'
            }`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
    </div>
  );

  // Estado de carga mientras se valida el enlace
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground animate-pulse" />
          <p className="mt-4 text-muted-foreground">Validando enlace de calificación...</p>
        </div>
      </div>
    );
  }

  // Error al validar el enlace
  if (isValidationError || !serviceDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-6 space-y-4">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
            <h2 className="text-xl font-semibold text-destructive">
              Enlace Inválido o Expirado
            </h2>
            <p className="text-muted-foreground">
              El enlace de calificación que has intentado acceder no es válido. 
              Puede que haya expirado o ya haya sido utilizado.
            </p>
            <Button onClick={() => navigate('/')} variant="outline">
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader>
          <CardTitle className="text-center">
            Califica tu Experiencia de Servicio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Detalles del servicio */}
          <div className="text-center space-y-2">
            <div className="flex justify-center items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span className="font-semibold">Servicio Completado</span>
            </div>
            <p className="text-muted-foreground">
              {serviceDetails.vehicleMake} {serviceDetails.vehicleModel} - Placa {serviceDetails.licensePlate}
            </p>
          </div>

          {/* Calificaciones */}
          <div className="space-y-4">
            {renderStarRating(
              waitTimeRating, 
              setWaitTimeRating, 
              'Tiempo de Espera', 
              <Clock className="h-5 w-5 text-muted-foreground" />
            )}

            {renderStarRating(
              staffFriendlinessRating, 
              setStaffFriendlinessRating, 
              'Amabilidad del Personal', 
              <Coffee className="h-5 w-5 text-muted-foreground" />
            )}

            {renderStarRating(
              serviceQualityRating, 
              setServiceQualityRating, 
              'Calidad del Servicio', 
              <Check className="h-5 w-5 text-muted-foreground" />
            )}
          </div>

          {/* Comentario adicional */}
          <div className="space-y-2">
            <label htmlFor="comment" className="block text-sm font-medium">
              Comentarios adicionales (opcional)
            </label>
            <Textarea
              id="comment"
              placeholder="Comparte más detalles sobre tu experiencia"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Botón de envío */}
          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={ratingMutation.isPending}
          >
            {ratingMutation.isPending ? 'Enviando...' : 'Enviar Calificación'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RateService;