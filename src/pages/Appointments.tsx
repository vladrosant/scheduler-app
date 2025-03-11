import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Add as AddIcon } from '@mui/icons-material';
import { NewAppointmentDialog } from '../components/scheduling/NewAppointmentDialog';

export const AppointmentsPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isNewAppointmentDialogOpen, setIsNewAppointmentDialogOpen] = useState(false);
  
  // Placeholder appointments data
  const appointments = [
    {
      id: '1',
      clientName: 'John Doe',
      service: 'Haircut',
      time: '09:00 AM',
      duration: '30 min',
    },
    {
      id: '2',
      clientName: 'Jane Smith',
      service: 'Beard Trim',
      time: '10:00 AM',
      duration: '20 min',
    },
  ];

  const handleNewAppointment = (values: any) => {
    // TODO: Implement appointment creation
    console.log('New appointment values:', values);
  };

  return (
    <Box>
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
              onChange={(newValue) => setSelectedDate(newValue)}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {selectedDate?.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
          {appointments.map((appointment) => (
            <Card key={appointment.id} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {appointment.time}
                    </Typography>
                    <Typography color="text.secondary">
                      {appointment.duration}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {appointment.clientName}
                    </Typography>
                    <Typography color="text.secondary">
                      {appointment.service}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>

      <NewAppointmentDialog
        open={isNewAppointmentDialogOpen}
        onClose={() => setIsNewAppointmentDialogOpen(false)}
        onSubmit={handleNewAppointment}
      />
    </Box>
  );
}; 