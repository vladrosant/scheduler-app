import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { StaffMember, Service, WorkingHours } from '../types';
import { StaffFormDialog } from '../components/staff/StaffFormDialog';
import { StaffScheduleDialog } from '../components/staff/StaffScheduleDialog';

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
    serviceIds: ['1', '2'],  // Men's Haircut and Beard Trim
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
    serviceIds: ['1', '3'],  // Men's Haircut and Hair Color
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

const roleColors: Record<StaffMember['role'], string> = {
  barber: '#4CAF50',
  stylist: '#2196F3',
  colorist: '#9C27B0',
  assistant: '#FF9800',
};

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const StaffPage: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [services] = useState<Service[]>(initialServices);

  const handleAddStaff = (newStaff: Omit<StaffMember, 'id'>) => {
    const staffMember: StaffMember = {
      ...newStaff,
      id: Date.now().toString(),
    };
    setStaff([...staff, staffMember]);
  };

  const handleEditStaff = (updatedStaff: Omit<StaffMember, 'id'>) => {
    if (selectedStaff) {
      setStaff(prev =>
        prev.map(member =>
          member.id === selectedStaff.id
            ? { ...updatedStaff, id: selectedStaff.id }
            : member
        )
      );
    }
  };

  const handleDeleteStaff = (id: string) => {
    setStaff(prev => prev.filter(member => member.id !== id));
    setIsDeleteDialogOpen(false);
    setSelectedStaff(null);
  };

  const handleToggleActive = (id: string) => {
    setStaff(prev =>
      prev.map(member =>
        member.id === id ? { ...member, active: !member.active } : member
      )
    );
  };

  const handleUpdateSchedule = (schedule: WorkingHours[]) => {
    if (selectedStaff) {
      setStaff(prev =>
        prev.map(member =>
          member.id === selectedStaff.id
            ? { ...member, schedule }
            : member
        )
      );
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Staff Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedStaff(null);
            setIsFormDialogOpen(true);
          }}
        >
          Add Staff Member
        </Button>
      </Box>

      <Grid container spacing={3}>
        {staff.map((member) => (
          <Grid item xs={12} sm={6} md={4} key={member.id}>
            <Card sx={{ opacity: member.active ? 1 : 0.6 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    src={member.imageUrl}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  >
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{member.name}</Typography>
                    <Chip
                      label={member.role}
                      size="small"
                      sx={{
                        backgroundColor: roleColors[member.role],
                        color: 'white',
                      }}
                    />
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Email: {member.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Phone: {member.phone}
                </Typography>
                <Box mt={1}>
                  <Typography variant="body2" color="text.secondary">
                    Services:
                  </Typography>
                  <Box display="flex" gap={0.5} flexWrap="wrap" mt={0.5}>
                    {services
                      .filter(service => member.serviceIds.includes(service.id))
                      .map(service => (
                        <Chip
                          key={service.id}
                          label={service.name}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                  </Box>
                </Box>
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => {
                    setSelectedStaff(member);
                    setIsScheduleDialogOpen(true);
                  }}
                  title="Manage Schedule"
                >
                  <ScheduleIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => {
                    setSelectedStaff(member);
                    setIsFormDialogOpen(true);
                  }}
                  title="Edit Staff"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => {
                    setSelectedStaff(member);
                    setIsDeleteDialogOpen(true);
                  }}
                  title="Delete Staff"
                >
                  <DeleteIcon />
                </IconButton>
                <Button
                  size="small"
                  onClick={() => handleToggleActive(member.id)}
                >
                  {member.active ? 'Set Inactive' : 'Set Active'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <StaffFormDialog
        open={isFormDialogOpen}
        onClose={() => {
          setIsFormDialogOpen(false);
          setSelectedStaff(null);
        }}
        onSubmit={selectedStaff ? handleEditStaff : handleAddStaff}
        initialValues={selectedStaff || undefined}
        services={services}
      />

      {selectedStaff && (
        <StaffScheduleDialog
          open={isScheduleDialogOpen}
          onClose={() => {
            setIsScheduleDialogOpen(false);
            setSelectedStaff(null);
          }}
          onSubmit={handleUpdateSchedule}
          staff={selectedStaff}
        />
      )}

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedStaff(null);
        }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedStaff?.name}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsDeleteDialogOpen(false);
              setSelectedStaff(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => selectedStaff && handleDeleteStaff(selectedStaff.id)}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 