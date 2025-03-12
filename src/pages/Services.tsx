import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { Service } from '../types';
import { ServiceFormDialog } from '../components/services/ServiceFormDialog';

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

export const serviceCategories = [
  { value: 'haircuts', label: 'Haircuts' },
  { value: 'grooming', label: 'Grooming' },
  { value: 'color', label: 'Hair Color' },
  { value: 'styling', label: 'Styling' },
  { value: 'treatment', label: 'Treatment' },
];

const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    haircuts: '#4CAF50',
    grooming: '#2196F3',
    color: '#9C27B0',
    styling: '#FF9800',
    treatment: '#795548',
  };
  return colors[category] || '#757575';
};

type SortOption = {
  field: keyof Pick<Service, 'name' | 'price' | 'duration'>;
  direction: 'asc' | 'desc';
};

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | undefined>(undefined);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>({ field: 'name', direction: 'asc' });

  const handleAddService = (newService: Omit<Service, 'id'>) => {
    const service: Service = {
      ...newService,
      id: Date.now().toString(),
      active: true,
    };
    setServices([...services, service]);
  };

  const handleEditService = (updatedService: Omit<Service, 'id'>) => {
    if (selectedService) {
      const updatedServices = services.map((service) =>
        service.id === selectedService.id
          ? { ...updatedService, id: selectedService.id, active: service.active }
          : service
      );
      setServices(updatedServices);
    }
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter((service) => service.id !== id));
    setDeleteDialogOpen(false);
    setServiceToDelete(undefined);
  };

  const openEditDialog = (service: Service) => {
    setSelectedService(service);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedService(undefined);
    setDialogOpen(false);
  };

  const openDeleteDialog = (service: Service) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };

  const handleToggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleServiceStatus = (serviceId: string) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === serviceId
          ? { ...service, active: !service.active }
          : service
      )
    );
  };

  const getServiceStatistics = () => {
    const totalServices = services.length;
    const activeServices = services.filter(s => s.active).length;
    const averagePrice = services.reduce((acc, s) => acc + s.price, 0) / totalServices;
    
    const categoryCount: { [key: string]: number } = {};
    services.forEach(s => {
      categoryCount[s.category] = (categoryCount[s.category] || 0) + 1;
    });
    const mostPopularCategory = Object.entries(categoryCount)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0];

    return {
      totalServices,
      activeServices,
      averagePrice,
      mostPopularCategory: serviceCategories.find(c => c.value === mostPopularCategory)?.label || mostPopularCategory,
    };
  };

  const sortServices = (services: Service[]): Service[] => {
    return [...services].sort((a, b) => {
      const { field, direction } = sortOption;
      const modifier = direction === 'asc' ? 1 : -1;
      
      if (field === 'name') {
        return modifier * a.name.localeCompare(b.name);
      }
      return modifier * (a[field] - b[field]);
    });
  };

  const filteredServices = sortServices(
    services.filter((service) => {
      const matchesCategories =
        selectedCategories.length === 0 || selectedCategories.includes(service.category);
      const matchesSearch =
        searchQuery === '' ||
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategories && matchesSearch;
    })
  );

  const stats = getServiceStatistics();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Services
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setDialogOpen(true)}
        >
          Add Service
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">Total Services</Typography>
            <Typography variant="h4">{stats.totalServices}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">Active Services</Typography>
            <Typography variant="h4">{stats.activeServices}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">Average Price</Typography>
            <Typography variant="h4">${stats.averagePrice.toFixed(2)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">Popular Category</Typography>
            <Typography variant="h4">{stats.mostPopularCategory}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="sort-select-label">Sort By</InputLabel>
              <Select
                labelId="sort-select-label"
                value={`${sortOption.field}-${sortOption.direction}`}
                label="Sort By"
                onChange={(e) => {
                  const value = e.target.value;
                  const parts = value.split('-');
                  if (
                    parts.length === 2 &&
                    ['name', 'price', 'duration'].includes(parts[0]) &&
                    ['asc', 'desc'].includes(parts[1])
                  ) {
                    setSortOption({
                      field: parts[0] as 'name' | 'price' | 'duration',
                      direction: parts[1] as 'asc' | 'desc'
                    });
                  }
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <SortIcon />
                  </InputAdornment>
                }
              >
                <MenuItem value="name-asc">Name (A-Z)</MenuItem>
                <MenuItem value="name-desc">Name (Z-A)</MenuItem>
                <MenuItem value="price-asc">Price (Low-High)</MenuItem>
                <MenuItem value="price-desc">Price (High-Low)</MenuItem>
                <MenuItem value="duration-asc">Duration (Short-Long)</MenuItem>
                <MenuItem value="duration-desc">Duration (Long-Short)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
          {serviceCategories.map((category) => (
            <Chip
              key={category.value}
              label={category.label}
              onClick={() => handleToggleCategory(category.value)}
              color={selectedCategories.includes(category.value) ? "primary" : "default"}
              sx={{
                backgroundColor: selectedCategories.includes(category.value)
                  ? getCategoryColor(category.value)
                  : undefined,
                color: selectedCategories.includes(category.value) ? "white" : undefined,
                mb: 1,
              }}
            />
          ))}
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {filteredServices.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.id}>
            <Card sx={{ opacity: service.active ? 1 : 0.6 }}>
              <CardContent>
                <Box
                  sx={{
                    width: '100%',
                    height: 8,
                    backgroundColor: getCategoryColor(service.category),
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                />
                <Typography variant="h6" component="h2" gutterBottom>
                  {service.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {service.description}
                </Typography>
                <Typography variant="body1">
                  Duration: {service.duration} minutes
                </Typography>
                <Typography variant="body1">
                  Price: ${service.price.toFixed(2)}
                </Typography>
                <Chip
                  label={service.active ? "Active" : "Inactive"}
                  color={service.active ? "success" : "default"}
                  size="small"
                  onClick={() => toggleServiceStatus(service.id)}
                  sx={{ mt: 1 }}
                />
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => openEditDialog(service)}
                  aria-label="edit"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => openDeleteDialog(service)}
                  aria-label="delete"
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <ServiceFormDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={selectedService ? handleEditService : handleAddService}
        initialValues={selectedService}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the service "{serviceToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => serviceToDelete && handleDeleteService(serviceToDelete.id)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}; 