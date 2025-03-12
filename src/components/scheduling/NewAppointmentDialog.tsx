import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Service, AppointmentFormValues, StaffMember } from '../../types';
import { addMinutes, setHours, setMinutes, isBefore, isAfter } from 'date-fns';

interface NewAppointmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AppointmentFormValues) => void;
  services: Service[];
  staff: StaffMember[];
  existingAppointments: { startTime: string; endTime: string; }[];
}

const validationSchema = yup.object({
  clientName: yup.string().required('Client name is required'),
  serviceId: yup.string().required('Service is required'),
  staffId: yup.string().required('Staff member is required'),
  date: yup.date().required('Date is required'),
  time: yup.date().required('Time is required'),
  notes: yup.string(),
});

const BUSINESS_HOURS = {
  start: 9, // 9 AM
  end: 17, // 5 PM
};

export const NewAppointmentDialog: React.FC<NewAppointmentDialogProps> = ({
  open,
  onClose,
  onSubmit,
  services,
  staff,
  existingAppointments,
}) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const formik = useFormik({
    initialValues: {
      clientName: '',
      serviceId: '',
      staffId: '',
      date: null,
      time: null,
      notes: '',
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
      onClose();
    },
  });

  useEffect(() => {
    const service = services.find(s => s.id === formik.values.serviceId);
    setSelectedService(service || null);
  }, [formik.values.serviceId, services]);

  const isTimeSlotAvailable = (date: Date): boolean => {
    if (!date) return false;

    // Check if within business hours
    const hours = date.getHours();
    if (hours < BUSINESS_HOURS.start || hours >= BUSINESS_HOURS.end) {
      return false;
    }

    // Check if slot overlaps with existing appointments
    const slotEnd = addMinutes(date, selectedService?.duration || 0);
    
    return !existingAppointments.some(appointment => {
      const appointmentStart = new Date(appointment.startTime);
      const appointmentEnd = new Date(appointment.endTime);
      
      return (
        (isBefore(date, appointmentEnd) && isAfter(slotEnd, appointmentStart)) ||
        (isAfter(date, appointmentStart) && isBefore(date, appointmentEnd))
      );
    });
  };

  const getTimePickerMinMax = () => {
    if (!formik.values.date) return { minTime: null, maxTime: null };

    const selectedDate = formik.values.date;
    const minTime = setMinutes(setHours(selectedDate, BUSINESS_HOURS.start), 0);
    const maxTime = setMinutes(
      setHours(selectedDate, BUSINESS_HOURS.end - (selectedService?.duration || 0) / 60),
      0
    );

    return { minTime, maxTime };
  };

  const { minTime, maxTime } = getTimePickerMinMax();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Schedule New Appointment</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="clientName"
                name="clientName"
                label="Client Name"
                value={formik.values.clientName}
                onChange={formik.handleChange}
                error={formik.touched.clientName && Boolean(formik.errors.clientName)}
                helperText={formik.touched.clientName && formik.errors.clientName}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Service</InputLabel>
                <Select
                  id="serviceId"
                  name="serviceId"
                  value={formik.values.serviceId}
                  onChange={formik.handleChange}
                  error={formik.touched.serviceId && Boolean(formik.errors.serviceId)}
                  label="Service"
                >
                  {services.map((service) => (
                    <MenuItem key={service.id} value={service.id}>
                      {service.name} - ${service.price}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Staff Member</InputLabel>
                <Select
                  id="staffId"
                  name="staffId"
                  value={formik.values.staffId}
                  onChange={formik.handleChange}
                  error={formik.touched.staffId && Boolean(formik.errors.staffId)}
                  label="Staff Member"
                >
                  {staff
                    .filter((member) => member.active)
                    .map((member) => (
                      <MenuItem key={member.id} value={member.id}>
                        {member.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Date"
                value={formik.values.date}
                onChange={(value) => formik.setFieldValue('date', value)}
                disablePast
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: formik.touched.date && Boolean(formik.errors.date),
                    helperText: formik.touched.date && formik.errors.date,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TimePicker
                label="Time"
                value={formik.values.time}
                onChange={(value) => formik.setFieldValue('time', value)}
                minTime={minTime}
                maxTime={maxTime}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: formik.touched.time && Boolean(formik.errors.time),
                    helperText: formik.touched.time && formik.errors.time,
                  },
                }}
                shouldDisableTime={(timeValue: Date | null) => 
                  timeValue ? !isTimeSlotAvailable(timeValue) : true
                }
              />
            </Grid>
            {selectedService && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Duration: {selectedService.duration} minutes
                </Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="notes"
                name="notes"
                label="Notes"
                multiline
                rows={3}
                value={formik.values.notes}
                onChange={formik.handleChange}
                error={formik.touched.notes && Boolean(formik.errors.notes)}
                helperText={formik.touched.notes && formik.errors.notes}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Schedule
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 