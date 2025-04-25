import React, { useState, useEffect, useRef } from 'react';
import { Grid, Button, Avatar, TextField, Alert } from '@mui/material';
import { InfoCard, InfoItem, EditableInfoForm } from '../../../components/profile';
import { Box } from '@mui/system';

const PersonalInfoTab = ({ profile, isReadOnly = false, onUpdateProfile, onUpdatePassword }) => {
  const [editMode, setEditMode] = useState(false);
  const [formValues, setFormValues] = useState({
    first_name: '',
    last_name: '',
    age: '',
    msu_email: '',
    move_in_date: '',
    bio: '',
    majors: '',
    gender: '',
    msu_id: ''
  });
  
  const [profileFormErrors, setProfileFormErrors] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // When profile prop changes, update the form state
  useEffect(() => {
    if (profile) {
      setFormValues({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        age: profile.age || '',
        msu_email: profile.msu_email || '',
        move_in_date: profile.move_in_date
          ? profile.move_in_date.split("T")[0]
          : '',
        bio: profile.bio || '',
        majors: profile.majors || '',
        gender: profile.gender || '',
        msu_id: profile.msu_id || ''
      });
      setPhotoFile(null);
      setProfileFormErrors({});
      setPhotoPreview(null);
    }
  }, [profile]);

  // Handle file selection for photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Handle password field changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear messages when user starts typing
    setPasswordError('');
    setPasswordSuccess('');
  };
  
  // Form validation
  const validateProfileForm = (values) => {
    const errors = {};
    if (!values.first_name) errors.first_name = "First name is required";
    if (!values.last_name) errors.last_name = "Last name is required";
    if (!values.age) errors.age = "Age is required";
    if (!values.gender) errors.gender = "Gender is required";
    if (!values.move_in_date) errors.move_in_date = "Move‑in date is required";
    if (!values.bio) errors.bio = "Bio is required";
    if (!values.majors) errors.majors = "Majors are required";
    if (!values.msu_email) errors.msu_email = "Email is required";
    if (!values.msu_id) errors.msu_id = "MSU Id is required";
    setProfileFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle password update submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    const updateData = {
      current_password: passwordData.currentPassword,
      new_password: passwordData.newPassword
    };
    
    const result = await onUpdatePassword(updateData);
    
    if (result.success) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordSuccess("Password updated successfully");
    } else {
      setPasswordError(result.error || "Failed to update password");
    }
  };

  // Submit handler for profile update
  const handleSave = async (updatedData) => {
    if (!validateProfileForm(updatedData)) return;

    const fd = new FormData();
    
    ["first_name", "last_name", "msu_email"].forEach(k =>
      fd.append(k, updatedData[k] || "")
    );
    ["age", "gender", "move_in_date", "bio", "majors", "msu_id"].forEach(k =>
      fd.append(k, updatedData[k] || "")
    );
    
    if (photoFile) {
      fd.append("profile_image", photoFile);
    }
  
    const result = await onUpdateProfile(fd);
    
    if (result.success) {
      setEditMode(false);
      setPhotoFile(null);
      setPhotoPreview(null);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    if (profile) {
      setFormValues({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        age: profile.age || '',
        msu_email: profile.msu_email || '',
        move_in_date: profile.move_in_date
          ? profile.move_in_date.split("T")[0]
          : '',
        bio: profile.bio || '',
        majors: profile.majors || '',
        gender: profile.gender || '',
        msu_id: profile.msu_id || '',
      });
      setPhotoPreview(null);
      setPhotoFile(null);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <InfoCard
          title="Personal Information"
          onEdit={isReadOnly ? undefined : () => setEditMode(true)}
          showEditButton={!isReadOnly}
        >
          {!editMode ? (
            <Grid container spacing={3}>
              <InfoItem label="First Name" value={formValues.first_name} />
              <InfoItem label="Last Name" value={formValues.last_name} />
              <InfoItem label="Age" value={formValues.age} />
              <InfoItem label="Email" value={formValues.msu_email} />
              <InfoItem label="Move In Date" value={formValues.move_in_date}/>
              <InfoItem label="Gender" value={formValues.gender} />
              <InfoItem label="MSU Id" value={formValues.msu_id} />
              <InfoItem label="Bio" value={formValues.bio} xs={12} />
              <InfoItem label="Majors" value={formValues.majors} />
            </Grid>
          ) : (
            <>
              {/* Photo upload section */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Button
                        variant="outlined"
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      >
                        Upload Profile Photo
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handlePhotoChange}
                      />
                    </Grid>
                    {photoPreview && (
                      <Grid item>
                        <Avatar
                          src={photoPreview}
                          alt="Photo Preview"
                          sx={{ width: 120, height: 120 }}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>

              {/* Editable info form for text fields */}
              <EditableInfoForm
                fields={[
                  { id: 'first_name', label: 'First Name', value: formValues.first_name, errTxt: profileFormErrors.first_name },
                  { id: 'last_name', label: 'Last Name', value: formValues.last_name, errTxt: profileFormErrors.last_name },
                  { id: 'age', label: 'Age', value: formValues.age, type: 'number', errTxt: profileFormErrors.age },
                  { id: 'msu_email', label: 'Email', value: formValues.msu_email, disabled: true, errTxt: profileFormErrors.msu_email },
                  { id: 'move_in_date', label: 'Move In Date', value: formValues.move_in_date, type: 'date', errTxt: profileFormErrors.move_in_date },
                  { id: 'gender', label: 'Gender', value: formValues.gender, errTxt: profileFormErrors.gender },
                  { id: 'bio', label: 'Bio', value: formValues.bio, multiline: true, rows: 4, xs: 12, errTxt: profileFormErrors.bio },
                  { id: 'majors', label: 'Majors', value: formValues.majors, errTxt: profileFormErrors.majors },
                  { id: 'msu_id', label: 'MSU Id', value: formValues.msu_id, errTxt: profileFormErrors.msu_id },
                ]}
                onSave={handleSave}
                onCancel={handleCancel}
                onFieldChange={(id, value) =>
                  setFormValues((prev) => ({ ...prev, [id]: value }))
                }
              />
            </>
          )}
        </InfoCard>
      </Grid>

      {/* Password Change Card */}
      {!isReadOnly && (
        <Grid item xs={12} sx={{ mt: 4 }}>
          <InfoCard title="Change Password">
            <Box component="form" onSubmit={handlePasswordSubmit} noValidate>
              <Grid container spacing={3}>
                {passwordError && (
                  <Grid item xs={12}>
                    <Alert severity="error">{passwordError}</Alert>
                  </Grid>
                )}
                
                {passwordSuccess && (
                  <Grid item xs={12}>
                    <Alert severity="success">{passwordSuccess}</Alert>
                  </Grid>
                )}
                
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    required
                    name="currentPassword"
                    label="Current Password"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    required
                    name="newPassword"
                    label="New Password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    helperText="Password must be at least 8 characters long"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    required
                    name="confirmPassword"
                    label="Confirm New Password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    type="submit"
                    disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  >
                    Update Password
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </InfoCard>
        </Grid>
      )}
    </Grid>
  );
};

export default PersonalInfoTab;