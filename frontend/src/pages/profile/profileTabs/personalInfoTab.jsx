import React, { useState } from 'react';
import { Grid } from '@mui/material';
import {InfoCard,InfoItem, EditableInfoForm} from '../../../components/profile';


const personalInfoData = {
  fullName: "John Doe",
  age: "24",
  email: "jd@gmail.com",
  mobile: "+234810547345",
  hometown: "Wichita Falls",
  relationshipStatus: "Single",
  state: "Texas",
  moveInDate: "September 2024",
  about: "Nunc nulla tincidunt quis tincidunt tellus, tellus. Iaculis eu, convallis porttitor accumsan. Risus arcu, volutpat amet sit morbi. Integer arci ut faucibus eros, dignissim neque, consectetur. Sit sit purus vivamus dapibus. Aliquam morbi viverra nisl, nunc, nunc bibendum metus, platea."
};

const lifestyleData = {
  cleanliness: "Super Clean",
  workHours: "Full Time",
  sleepingHours: "8 hours",
  tobacco: "Non Smoker",
  alcohol: "No",
  cooking: "Very Good"
};

const PersonalInfoTab = () => {
  const [editMode, setEditMode] = useState(false);
  
  const personalInfoFields = [
    { id: 'fullName', label: 'Full Name', value: personalInfoData.fullName },
    { id: 'age', label: 'Age', value: personalInfoData.age },
    { id: 'email', label: 'Email Address', value: personalInfoData.email },
    { id: 'mobile', label: 'Mobile Number', value: personalInfoData.mobile },
    { id: 'hometown', label: 'Home Town', value: personalInfoData.hometown },
    { id: 'relationshipStatus', label: 'Relationship Status', value: personalInfoData.relationshipStatus },
    { id: 'state', label: 'State', value: personalInfoData.state },
    { id: 'moveInDate', label: 'Move in date', value: personalInfoData.moveInDate },
    { id: 'about', label: 'About yourself', value: personalInfoData.about, multiline: true, rows: 4, xs: 12 }
  ];

  return (
    <Grid container spacing={3}>
      {/* Personal Information */}
      <Grid item xs={12} md={6}>
        <InfoCard 
          title="Personal Information" 
          onEdit={() => setEditMode(!editMode)}
        >
          {!editMode ? (
            <Grid container spacing={3}>
              <InfoItem label="Full Name" value={personalInfoData.fullName} />
              <InfoItem label="Age" value={personalInfoData.age} />
              <InfoItem label="Email Address" value={personalInfoData.email} />
              <InfoItem label="Mobile Number" value={personalInfoData.mobile} />
              <InfoItem label="Home Town" value={personalInfoData.hometown} />
              <InfoItem label="Relationship Status" value={personalInfoData.relationshipStatus} />
              <InfoItem label="State" value={personalInfoData.state} />
              <InfoItem label="Move in date" value={personalInfoData.moveInDate} />
              <InfoItem label="Brief Information about yourself" value={personalInfoData.about} xs={12} />
            </Grid>
          ) : (
            <EditableInfoForm 
              fields={personalInfoFields} 
              onSave={() => setEditMode(false)} 
            />
          )}
        </InfoCard>
      </Grid>
      
      {/* Lifestyle Information */}
      <Grid item xs={12} md={6}>
        <InfoCard title="Lifestyle Information">
          <Grid container spacing={3}>
            <InfoItem label="How would you describe your cleanliness?" value={lifestyleData.cleanliness} xs={12} />
            <InfoItem label="How would you describe your school/work hours?" value={lifestyleData.workHours} xs={12} />
            <InfoItem label="How would you describe your sleeping hours?" value={lifestyleData.sleepingHours} xs={12} />
            <InfoItem label="How would you describe your relationship with tobacco?" value={lifestyleData.tobacco} xs={12} />
            <InfoItem label="How would you describe your relationship with alcohol?" value={lifestyleData.alcohol} xs={12} />
            <InfoItem label="How good are you in cooking?" value={lifestyleData.cooking} xs={12} />
          </Grid>
        </InfoCard>
      </Grid>
    </Grid>
  );
};

export default PersonalInfoTab;