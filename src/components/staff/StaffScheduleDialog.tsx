import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Box,
  Paper,
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { StaffMember, WorkingHours } from '../../types';
import { parse, format } from 'date-fns';

interface StaffScheduleDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (schedule: WorkingHours[]) => void;
  staff: StaffMember;
}

const daysOfWeek = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export const StaffScheduleDialog: React.FC<StaffScheduleDialogProps> = ({
  open,
  onClose,
  onSubmit,
  staff,
}) => {
  const [schedule, setSchedule] = useState<WorkingHours[]>(staff.schedule);

  const handleAddSchedule = () => {
    const availableDays = daysOfWeek
      .map(day => day.value)
      .filter(day => !schedule.some(s => s.dayOfWeek === day));

    if (availableDays.length > 0) {
      setSchedule([
        ...schedule,
        {
          dayOfWeek: availableDays[0] as 0 | 1 | 2 | 3 | 4 | 5 | 6,
          startTime: '09:00',
          endTime: '17:00',
        },
      ]);
    }
  };

  const handleRemoveSchedule = (dayOfWeek: number) => {
    setSchedule(schedule.filter(s => s.dayOfWeek !== dayOfWeek));
  };

  const handleTimeChange = (
    dayOfWeek: number,
    field: 'startTime' | 'endTime',
    value: Date | null
  ) => {
    if (!value) return;

    setSchedule(
      schedule.map(s =>
        s.dayOfWeek === dayOfWeek
          ? { ...s, [field]: format(value, 'HH:mm') }
          : s
      )
    );
  };

  const handleDayChange = (oldDayOfWeek: number, newDayOfWeek: number) => {
    setSchedule(
      schedule.map(s =>
        s.dayOfWeek === oldDayOfWeek
          ? { ...s, dayOfWeek: newDayOfWeek as 0 | 1 | 2 | 3 | 4 | 5 | 6 }
          : s
      )
    );
  };

  const createTimeDate = (timeString: string) => {
    return parse(timeString, 'HH:mm', new Date());
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Manage Schedule - {staff.name}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddSchedule}
            disabled={schedule.length === 7}
          >
            Add Working Day
          </Button>
        </Box>
        <Grid container spacing={2}>
          {schedule
            .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
            .map((workingHours) => (
              <Grid item xs={12} key={workingHours.dayOfWeek}>
                <Paper sx={{ p: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth>
                        <InputLabel>Day</InputLabel>
                        <Select
                          value={workingHours.dayOfWeek}
                          onChange={(e) =>
                            handleDayChange(
                              workingHours.dayOfWeek,
                              e.target.value as number
                            )
                          }
                          label="Day"
                        >
                          {daysOfWeek
                            .filter(
                              (day) =>
                                day.value === workingHours.dayOfWeek ||
                                !schedule.some((s) => s.dayOfWeek === day.value)
                            )
                            .map((day) => (
                              <MenuItem key={day.value} value={day.value}>
                                {day.label}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TimePicker
                        label="Start Time"
                        value={createTimeDate(workingHours.startTime)}
                        onChange={(newValue) =>
                          handleTimeChange(
                            workingHours.dayOfWeek,
                            'startTime',
                            newValue
                          )
                        }
                        slotProps={{
                          textField: { fullWidth: true },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TimePicker
                        label="End Time"
                        value={createTimeDate(workingHours.endTime)}
                        onChange={(newValue) =>
                          handleTimeChange(
                            workingHours.dayOfWeek,
                            'endTime',
                            newValue
                          )
                        }
                        slotProps={{
                          textField: { fullWidth: true },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveSchedule(workingHours.dayOfWeek)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            onSubmit(schedule);
            onClose();
          }}
        >
          Save Schedule
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 