import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import EmailIcon from "@mui/icons-material/Email";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";

import { useDispatch, useSelector } from "react-redux";
import { updateUserDetails } from "../redux/userSlice";
import { privateRequest } from "../utils/useFetch";
import { toast } from "react-toastify";

const UserProfileDialog = ({ openDialog, setOpenDialog }) => {
  const user = useSelector((state) => state.user);
  const [editableName, setEditableName] = useState(user.name);
  const [editableContact, setEditableContact] = useState(user.contact || "");
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();

  const http = privateRequest(user.accessToken, user.refreshToken);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleUpdateUserDetails = async () => {
    dispatch(
      updateUserDetails({ name: editableName, contact: editableContact })
    );
    try {
      await http.put(`/user/${user.id}`, {
        name: editableName,
        contact: editableContact,
      });
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data);
      } else {
        toast.error("An error occurred");
      }
    }

    setIsEditing(false); // Exit editing mode after updating
    setOpenDialog(false);
  };

  const handleEnableEditing = () => {
    setIsEditing(true); // Enable editing mode
  };

  return (
    <>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>User Information</DialogTitle>
        <DialogContent>
          {isEditing ? (
            <>
              <TextField
                margin="dense"
                id="name"
                label="Name"
                type="text"
                fullWidth
                variant="outlined"
                value={editableName}
                onChange={(e) => setEditableName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                  ),
                }}
              />
              <TextField
                margin="dense"
                id="email"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                value={user.email}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                  ),
                }}
              />
              <TextField
                margin="dense"
                id="contact"
                label="Contact"
                type="text"
                fullWidth
                variant="outlined"
                value={editableContact}
                onChange={(e) => setEditableContact(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <ListItemIcon>
                      <ContactPhoneIcon />
                    </ListItemIcon>
                  ),
                }}
              />
            </>
          ) : (
            <DialogContent>
              <TextField
                margin="dense"
                id="name"
                label="Name"
                type="text"
                fullWidth
                variant="outlined"
                value={user.name}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                  ),
                }}
              />
              <TextField
                margin="dense"
                id="email"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                value={user.email}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                  ),
                }}
              />
              <TextField
                margin="dense"
                id="contact"
                label="Contact"
                type="text"
                fullWidth
                variant="outlined"
                value={user.contact}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <ListItemIcon>
                      <ContactPhoneIcon />
                    </ListItemIcon>
                  ),
                }}
              />
            </DialogContent>
          )}
        </DialogContent>
        <DialogActions>
          {isEditing ? (
            <>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleUpdateUserDetails}>Save Changes</Button>
            </>
          ) : (
            <>
              <IconButton onClick={handleEnableEditing} size="small">
                <EditIcon />
              </IconButton>
              <Button onClick={handleCloseDialog}>Close</Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserProfileDialog;
