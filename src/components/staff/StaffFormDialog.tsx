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
  FormControl,
  InputLabel,
  Select,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { StaffMember, Service } from '../../types';

interface StaffFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<StaffMember, 'id'>) => void;
  initialValues?: StaffMember;
  services: Service[];
}

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup
    .string()
    .matches(
      /^\(\d{3}\) \d{3}-\d{4}$/,
      'Phone number must be in format (XXX) XXX-XXXX'
    )
    .required('Phone number is required'),
  role: yup
    .string()
    .oneOf(['barber', 'stylist', 'colorist', 'assistant'])
    .required('Role is required'),
  serviceIds: yup
    .array()
    .of(yup.string())
    .min(1, 'At least one service must be selected'),
  schedule: yup
    .array()
    .of(
      yup.object({
        dayOfWeek: yup.number().required(),
        startTime: yup.string().required(),
        endTime: yup.string().required(),
      })
    )
    .required(),
  active: yup.boolean(),
  imageUrl: yup.string().url('Must be a valid URL').optional(),
});

export const StaffFormDialog: React.FC<StaffFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  services,
}) => {
  const formik = useFormik({
    initialValues: initialValues || {
      name: '',
      email: '',
      phone: '',
      role: 'barber' as const,
      serviceIds: [],
      schedule: [
        { dayOfWeek: 1 as const, startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 2 as const, startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 3 as const, startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 4 as const, startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 5 as const, startTime: '09:00', endTime: '17:00' },
      ],
      active: true,
      imageUrl: '',
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
      onClose();
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          {initialValues ? 'Edit Staff Member' : 'Add Staff Member'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Phone"
                placeholder="(XXX) XXX-XXXX"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  error={formik.touched.role && Boolean(formik.errors.role)}
                  label="Role"
                >
                  <MenuItem value="barber">Barber</MenuItem>
                  <MenuItem value="stylist">Stylist</MenuItem>
                  <MenuItem value="colorist">Colorist</MenuItem>
                  <MenuItem value="assistant">Assistant</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="services-label">Services</InputLabel>
                <Select
                  labelId="services-label"
                  id="serviceIds"
                  name="serviceIds"
                  multiple
                  value={formik.values.serviceIds}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.serviceIds && Boolean(formik.errors.serviceIds)
                  }
                  label="Services"
                >
                  {services
                    .filter((service) => service.active)
                    .map((service) => (
                      <MenuItem key={service.id} value={service.id}>
                        {service.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="imageUrl"
                name="imageUrl"
                label="Profile Image URL"
                value={formik.values.imageUrl}
                onChange={formik.handleChange}
                error={formik.touched.imageUrl && Boolean(formik.errors.imageUrl)}
                helperText={formik.touched.imageUrl && formik.errors.imageUrl}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialValues ? 'Save Changes' : 'Add Staff'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 