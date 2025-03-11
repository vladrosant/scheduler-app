import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useFormik } from 'formik';
import * as yup from 'yup';

interface NewAppointmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AppointmentFormValues) => void;
}

interface AppointmentFormValues {
  clientName: string;
  service: string;
  staffMember: string;
  date: Date | null;
  time: Date | null;
  notes: string;
}

const validationSchema = yup.object({
  clientName: yup.string().required('Client name is required'),
  service: yup.string().required('Service is required'),
  staffMember: yup.string().required('Staff member is required'),
  date: yup.date().required('Date is required').nullable(),
  time: yup.date().required('Time is required').nullable(),
  notes: yup.string(),
});

// Placeholder data - will be replaced with real data from API
const services = [
  { id: '1', name: 'Haircut' },
  { id: '2', name: 'Beard Trim' },
  { id: '3', name: 'Hair Color' },
];

const staffMembers = [
  { id: '1', name: 'John Smith' },
  { id: '2', name: 'Sarah Johnson' },
];

export const NewAppointmentDialog: React.FC<NewAppointmentDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const formik = useFormik({
    initialValues: {
      clientName: '',
      service: '',
      staffMember: '',
      date: null,
      time: null,
      notes: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
      onClose();
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>New Appointment</DialogTitle>
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="service"
                name="service"
                select
                label="Service"
                value={formik.values.service}
                onChange={formik.handleChange}
                error={formik.touched.service && Boolean(formik.errors.service)}
                helperText={formik.touched.service && formik.errors.service}
              >
                {services.map((service) => (
                  <MenuItem key={service.id} value={service.id}>
                    {service.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="staffMember"
                name="staffMember"
                select
                label="Staff Member"
                value={formik.values.staffMember}
                onChange={formik.handleChange}
                error={formik.touched.staffMember && Boolean(formik.errors.staffMember)}
                helperText={formik.touched.staffMember && formik.errors.staffMember}
              >
                {staffMembers.map((staff) => (
                  <MenuItem key={staff.id} value={staff.id}>
                    {staff.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Date"
                value={formik.values.date}
                onChange={(value) => formik.setFieldValue('date', value)}
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
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: formik.touched.time && Boolean(formik.errors.time),
                    helperText: formik.touched.time && formik.errors.time,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="notes"
                name="notes"
                label="Notes"
                multiline
                rows={4}
                value={formik.values.notes}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Create Appointment
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 