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
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Service } from '../../types';

interface ServiceFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (service: Omit<Service, 'id'>) => void;
  initialValues?: Service;
}

const serviceCategories = [
  { value: 'haircuts', label: 'Haircuts' },
  { value: 'grooming', label: 'Grooming' },
  { value: 'color', label: 'Hair Color' },
  { value: 'styling', label: 'Styling' },
  { value: 'treatment', label: 'Treatment' },
];

const validationSchema = yup.object({
  name: yup.string().required('Service name is required'),
  description: yup.string().required('Description is required'),
  duration: yup
    .number()
    .required('Duration is required')
    .positive('Duration must be positive')
    .integer('Duration must be a whole number'),
  price: yup
    .number()
    .required('Price is required')
    .positive('Price must be positive')
    .test('decimals', 'Price can have max 2 decimal places', (value) => {
      if (!value) return true;
      return /^\d+(\.\d{0,2})?$/.test(value.toString());
    }),
  category: yup.string().required('Category is required'),
  active: yup.boolean(),
});

export const ServiceFormDialog: React.FC<ServiceFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
}) => {
  const formik = useFormik({
    initialValues: initialValues || {
      name: '',
      description: '',
      duration: 30,
      price: 0,
      category: '',
      active: true,
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
        <DialogTitle>
          {initialValues ? 'Edit Service' : 'Add New Service'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Service Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                multiline
                rows={3}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={
                  formik.touched.description && Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="duration"
                name="duration"
                label="Duration (minutes)"
                type="number"
                value={formik.values.duration}
                onChange={formik.handleChange}
                error={formik.touched.duration && Boolean(formik.errors.duration)}
                helperText={formik.touched.duration && formik.errors.duration}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="price"
                name="price"
                label="Price ($)"
                type="number"
                value={formik.values.price}
                onChange={formik.handleChange}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
                inputProps={{ step: '0.01' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="category"
                name="category"
                select
                label="Category"
                value={formik.values.category}
                onChange={formik.handleChange}
                error={formik.touched.category && Boolean(formik.errors.category)}
                helperText={formik.touched.category && formik.errors.category}
              >
                {serviceCategories.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    id="active"
                    name="active"
                    checked={formik.values.active}
                    onChange={formik.handleChange}
                  />
                }
                label="Service Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialValues ? 'Save Changes' : 'Add Service'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 