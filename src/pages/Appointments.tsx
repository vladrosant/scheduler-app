import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { NewAppointmentDialog } from '../components/scheduling/NewAppointmentDialog';
import { Appointment, Service, AppointmentFormValues, AppointmentStatus, StaffMember } from '../types';
import { format, isSameDay, parseISO } from 'date-fns';

// This would come from an API in a real application
const initialServices: Service[] = [
  {
    id: '1',
    name: 'Men\'s Haircut',
    description: 'Classic men\'s haircut with styling',
    duration: 30,
    price: 25,
    category: 'haircuts',
    active: true,
  },
  {
    id: '2',
    name: 'Beard Trim',
    description: 'Professional beard trimming and shaping',
    duration: 20,
    price: 15,
    category: 'grooming',
    active: true,
  },
  {
    id: '3',
    name: 'Hair Color',
    description: 'Full hair coloring service',
    duration: 90,
    price: 75,
    category: 'color',
    active: true,
  },
];

const initialStaff: StaffMember[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    role: 'barber',
    serviceIds: ['1', '2'],
    schedule: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
    ],
    active: true,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 987-6543',
    role: 'stylist',
    serviceIds: ['1', '3'],
    schedule: [
      { dayOfWeek: 1, startTime: '10:00', endTime: '18:00' },
      { dayOfWeek: 2, startTime: '10:00', endTime: '18:00' },
      { dayOfWeek: 3, startTime: '10:00', endTime: '18:00' },
      { dayOfWeek: 4, startTime: '10:00', endTime: '18:00' },
      { dayOfWeek: 5, startTime: '10:00', endTime: '18:00' },
    ],
    active: true,
  },
];

const statusColors: Record<AppointmentStatus, 'primary' | 'success' | 'info' | 'error'> = {
  scheduled: 'primary',
  confirmed: 'success',
  'in-progress': 'info',
  completed: 'success',
  cancelled: 'error',
};

export const AppointmentsPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isNewAppointmentDialogOpen, setIsNewAppointmentDialogOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services] = useState<Service[]>(initialServices);
  const [staff] = useState<StaffMember[]>(initialStaff);

  const handleNewAppointment = (values: AppointmentFormValues) => {
    if (!values.date || !values.time) return;

    const service = services.find(s => s.id === values.serviceId);
    if (!service) return;

    const appointmentDate = new Date(values.date);
    appointmentDate.setHours(values.time.getHours());
    appointmentDate.setMinutes(values.time.getMinutes());

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      clientName: values.clientName,
      serviceId: values.serviceId,
      staffId: values.staffId,
      date: appointmentDate.toISOString(),
      duration: service.duration,
      status: 'scheduled',
      notes: values.notes,
    };

    setAppointments([...appointments, newAppointment]);
    setIsNewAppointmentDialogOpen(false);
  };

  const handleStatusChange = (appointmentId: string, newStatus: AppointmentStatus) => {
    setAppointments(appointments.map(appointment =>
      appointment.id === appointmentId
        ? { ...appointment, status: newStatus }
        : appointment
    ));
  };

  const getExistingAppointments = () => {
    return appointments.map(appointment => ({
      startTime: appointment.date,
      endTime: new Date(new Date(appointment.date).getTime() + appointment.duration * 60000).toISOString(),
    }));
  };

  const selectedDateAppointments = appointments.filter(appointment =>
    isSameDay(parseISO(appointment.date), selectedDate)
  );

  const getServiceById = (serviceId: string) =>
    services.find(service => service.id === serviceId);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Appointments</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsNewAppointmentDialogOpen(true)}
        >
          New Appointment
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <DateCalendar
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue || new Date())}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </Typography>
          {selectedDateAppointments.length === 0 ? (
            <Typography color="text.secondary">
              No appointments scheduled for this day.
            </Typography>
          ) : (
            selectedDateAppointments
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((appointment) => {
                const service = getServiceById(appointment.serviceId);
                return (
                  <Card key={appointment.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={3}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {format(parseISO(appointment.date), 'h:mm a')}
                          </Typography>
                          <Typography color="text.secondary">
                            {appointment.duration} min
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {appointment.clientName}
                          </Typography>
                          <Typography color="text.secondary">
                            {service?.name}
                          </Typography>
                          {appointment.notes && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              Note: {appointment.notes}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={appointment.status}
                              color={statusColors[appointment.status]}
                              size="small"
                            />
                            {appointment.status === 'scheduled' && (
                              <>
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                                >
                                  <CancelIcon />
                                </IconButton>
                              </>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                );
              })
          )}
        </Grid>
      </Grid>

      <NewAppointmentDialog
        open={isNewAppointmentDialogOpen}
        onClose={() => setIsNewAppointmentDialogOpen(false)}
        onSubmit={handleNewAppointment}
        services={services}
        staff={staff}
        existingAppointments={getExistingAppointments()}
      />
    </Box>
  );
}; 