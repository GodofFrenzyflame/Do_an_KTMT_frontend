// import React, { useState, useEffect } from 'react';
// import { Box, Typography, Paper, Button, TextField } from '@mui/material';
// import axios from 'axios';

// export default function Profile() {
//   const [userInfo, setUserInfo] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     bio: ''
//   });

//   const [editing, setEditing] = useState(false);
//   const [newName, setNewName] = useState('');
//   const [newEmail, setNewEmail] = useState('');
//   const [newPhone, setNewPhone] = useState('');
//   const [newAddress, setNewAddress] = useState('');
//   const [newBio, setNewBio] = useState('');

//   useEffect(() => {
//     // Fetch user profile from API
//     axios.get('/api/user/profile')
//       .then(response => {
//         setUserInfo(response.data);
//       })
//       .catch(error => {
//         console.error(error);
//       });
//   }, []);

//   const handleSave = () => {
//     // Update user profile via API
//     axios.post('/api/user/profile/update', {
//       id: userInfo._id,
//       name: newName,
//       email: newEmail,
//       phone: newPhone,
//       address: newAddress,
//       bio: newBio
//     })
//       .then(response => {
//         setUserInfo(response.data);
//         setEditing(false);
//       })
//       .catch(error => {
//         console.error(error);
//       });
//   };

//   // ... rest of the code remains the same ...
//   return (
//     <Box sx={{ maxWidth: '80%', mx: 'auto', mt: 5 }}>
//       <Paper elevation={3} sx={{ p: 4 }}>
//         <Typography variant="h5" component="h1" gutterBottom>
//           Profile
//         </Typography>
//         {editing ? (
//           <>
//             <TextField
//               label="Name"
//               fullWidth
//               margin="normal"
//               value={newName}
//               onChange={(e) => setNewName(e.target.value)}
//             />
//             <TextField
//               label="Email"
//               fullWidth
//               margin="normal"
//               value={newEmail}
//               onChange={(e) => setNewEmail(e.target.value)}
//             />
//             <TextField
//               label="Phone num"
//               fullWidth
//               margin="normal"
//               value={newPhone}
//               onChange={(e) => setNewPhone(e.target.value)}
//             />
//             <TextField
//               label="Address"
//               fullWidth
//               margin="normal"
//               value={newAddress}
//               onChange={(e) => setNewAddress(e.target.value)}
//             />
//             <TextField
//               label="Profession"
//               fullWidth
//               margin="normal"
//               value={newBio}
//               onChange={(e) => setNewBio(e.target.value)}
//             />
//             <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
//               Save
//             </Button>
//             <Button variant="outlined" color="secondary" onClick={() => setEditing(false)} sx={{ mt: 2, ml: 2 }}>
//               Cancel
//             </Button>
//           </>
//         ) : (
//           <>
//             <Typography variant="body1">Name: {userInfo.name}</Typography>
//             <Typography variant="body1">Email: {userInfo.email}</Typography>
//             <Typography variant="body1">Phone num: {userInfo.phone}</Typography>
//             <Typography variant="body1">Address: {userInfo.address}</Typography>
//             <Typography variant="body1">Profession: {userInfo.bio}</Typography>
//             <Button variant="contained" color="primary" onClick={() => setEditing(true)} sx={{ mt: 2 }}>
//               Edit
//             </Button>
//           </>
//         )}
//       </Paper>
//     </Box>
//   );
// }