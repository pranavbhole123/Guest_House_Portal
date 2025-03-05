import React, { useEffect, useState } from "react";

import Checkbox from "@mui/material/Checkbox";
import { useSelector, useDispatch } from "react-redux";
import { privateRequest } from "../utils/useFetch";
import { useLocation, useNavigate } from "react-router-dom";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Button from "@mui/material/Button";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import TextField from "@mui/material/TextField";
import { getDate } from "../utils/handleDate";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import httpService from "../utils/httpService";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import { 
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import InputFileUpload from "../components/uploadFile";
import { FileIcon, defaultStyles } from "react-file-icon";

export default function RecordList({ status = "pending", desc }) {
  const [checked, setChecked] = useState([]);
  const [values, setValues] = useState([]);
  const user = useSelector((state) => state.user);
  const [records, setRecords] = useState([]);
  const [newRecords, setNewRecords] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState("Loading");
  const [sortType, setSortType] = useState("");
  const [sortToggle, setSortToggle] = useState(false);
  const location = useLocation();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [files, setFiles] = useState([]);

  const filterMap = {
    "Guest Name": "guestName",
    "Number of Rooms": "numberOfRooms",
    "Number of Guests": "numberOfGuests",
    Category: "category",
    "Arrival Date": "arrivalDate",
    "Departure Date": "departureDate",
    "Room Type": "roomType",
  };

  const navigate = useNavigate();

  const http = privateRequest(user.accessToken, user.refreshToken);

  const fetchRecords = async () => {
    try {
      let res;
      switch (desc) {
        case "current-requests":
          res = await http.get("/reservation/current");
          break;

        case "payment-pending":
          res = await http.get("/reservation/payment/pending");
          break;

        case "late-checkout":
          res = await http.get("/reservation/late");
          break;

        case "checked-out":
          res = await http.get("/reservation/checkedout");
          break;

        case "checkout-today":
          res = await http.get("/reservation/checkout/today");
          break;

        default:
          res = await http.get("/reservation/" + status);
          break;
      }
      const reservations = res.data;
      console.log(reservations);
      setValues(reservations.map((res) => res._id));
      setRecords(reservations);
      setNewRecords(reservations);
      setLoadingStatus("Success");
    } catch (err) {
      if (err.response?.data?.message) toast.error(err.response.data.message);
      else toast.error("Error fetching records");
      setLoadingStatus("Error");
    }
  };
  useEffect(() => {
    setLoadingStatus("Loading");
    fetchRecords();
  }, [status, desc]);

  const dispatch = useDispatch();
  console.log(checked);
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);

    if (value === "#") {
      if (currentIndex === -1) {
        setChecked([...values, "#"]);
      } else {
        setChecked([]);
      }

      return;
    }

    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [searchChoice, setSearchChoice] = useState("Filter");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filterRecords = () => {
    const tempRecords = records.filter((record) => {
      if (typeof record[filterMap[searchChoice]] === "string") {
        if (
          searchChoice === "Arrival Date" ||
          searchChoice === "Departure Date"
        ) {
          const date = new Date(record[filterMap[searchChoice]]);
          const formattedDate = getDate(date);

          return formattedDate.includes(searchTerm);
        } else {
          return record[filterMap[searchChoice]]
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        }
      } else {
        const inputNum = parseInt(searchTerm);
        const num = record[filterMap[searchChoice]];
        return num === inputNum;
      }
    });

    setNewRecords(tempRecords);
  };

  useEffect(() => {
    if (searchTerm) filterRecords();
    else setNewRecords(records);
  }, [searchTerm, searchChoice]);

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const options = [
    "Guest Name",
    "Number of Rooms",
    "Number of Guests",
    "Category",
    ...(user.role !== "USER" ? ["Arrival Date", "Departure Date"] : []),
    "Room Type",
  ];

  const handleSortToggle = (event) => {
    const type = event.target.outerText;
    setSortType(type);
    setSortToggle(!sortToggle);
  };

  useEffect(() => {
    const handleSort = () => {
      const tempRecords = [...newRecords];
      if (sortToggle) {
        if (sortType === "Number of Guests") {
          tempRecords.sort((a, b) => {
            return a.numberOfGuests - b.numberOfGuests;
          });
        } else if (sortType === "Number of Rooms") {
          tempRecords.sort((a, b) => {
            return a.numberOfRooms - b.numberOfRooms;
          });
        } else if (sortType === "Category") {
          tempRecords.sort((a, b) => {
            if (a.category > b.category) return 1;
            else return -1;
          });
        } else if (sortType === "Arrival Date") {
          tempRecords.sort((a, b) => {
            return new Date(a.arrivalDate) - new Date(b.arrivalDate);
          });
        } else if (sortType === "Departure Date") {
          tempRecords.sort((a, b) => {
            return new Date(b.departureDate) - new Date(a.departureDate);
          });
        }
      } else {
        if (sortType === "Number of Guests") {
          tempRecords.sort((a, b) => {
            return b.numberOfGuests - a.numberOfGuests;
          });
        } else if (sortType === "Number of Rooms") {
          tempRecords.sort((a, b) => {
            return b.numberOfRooms - a.numberOfRooms;
          });
        } else if (sortType === "Category") {
          tempRecords.sort((a, b) => {
            if (b.category > a.category) return 1;
            else return -1;
          });
        } else if (sortType === "Arrival Date") {
          tempRecords.sort((a, b) => {
            return new Date(b.arrivalDate) - new Date(a.arrivalDate);
          });
        } else if (sortType === "Departure Date") {
          tempRecords.sort((a, b) => {
            return new Date(b.departureDate) - new Date(a.departureDate);
          });
        }
      }
      setNewRecords(tempRecords);
    };
    handleSort();
  }, [sortToggle, sortType]);

  const handleEditClick = (record) => {
    setEditFormData(record); // Pre-fill the form with the record data
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async () => {
    try {
      // Create FormData object
      const formData = new FormData();
      
      // Append basic form data
      formData.append('guestName', editFormData.guestName);
      formData.append('category', editFormData.category);
      formData.append('arrivalDate', new Date(editFormData.arrivalDate).toISOString());
      formData.append('departureDate', new Date(editFormData.departureDate).toISOString());
      
      // Append mobile number if exists
      if (editFormData.applicant?.mobile) {
        formData.append('applicant[mobile]', editFormData.applicant.mobile);
      }

      // Append payment source if exists
      if (editFormData.source) {
        formData.append('source', editFormData.source);
      }

      // Append each file
      if (files && files.length > 0) {
        Array.from(files).forEach((file) => {
          formData.append('files', file);
        });
      }

      // Make API call with FormData
      await http.put(
        `/reservation/edit/${editFormData._id}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success("Reservation updated successfully");
      await fetchRecords(); // Refresh the records
      setOpenEditDialog(false);
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || "Error updating reservation");
    }
  };

  const categoryInfo = {
    A: "Category A",
    B: "Category B",
    C: "Category C (For student's family only their parents are allowed)",
    D: "Category D (Guest and Department invited, etc.)",
  };

  const handleFileUpload = (uploadedFiles) => {
    setFiles(uploadedFiles);
    // Update formData with new files
    setEditFormData(prev => ({
      ...prev,
      files: uploadedFiles
    }));
  };

  return (
    <div className="flex p-2 px-0 w-full flex-col">
      {/* Title Section */}
      <div className='text-center text-2xl font-["Dosis"] font-semibold py-2 uppercase'>
        {desc ? desc.toUpperCase().split("-").join(" ") : status + " requests"}
      </div>
  
      {/* Search & Dropdown */}
      <div className="grid grid-cols-12 gap-8 mb-4">
        <div className="h-10 col-span-2 flex flex-col justify-center relative">
          <Button
            variant="contained"
            size="small"
            onClick={toggleDropdown}
            endIcon={isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            style={{ backgroundColor: "#365899", color: "#FFF" }}
            className="h-full"
          >
            {searchChoice}
          </Button>
          {isOpen && (
            <div className="absolute top-12 z-10 mt-2 py-2 w-full bg-white border border-gray-300 rounded-md shadow-lg">
              {options.map((option) => (
                <button
                  key={option}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                  onClick={() => {
                    setSearchChoice(option);
                    setIsOpen(!isOpen);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
        <TextField
          label="Search items"
          variant="outlined"
          className="col-span-10 w-full"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
  
      {/* Table Container */}
      <div
        className="bg-gray-50 rounded-md overflow-hidden"
        style={{ width: "100%", padding: "0px" }}
      >
        {/* Header Row */}
        <div className="font-semibold border-b-2 text-[1.13vw] w-full h-15">
          <div className="p-1 px-4 flex gap-4 w-full items-center justify-around text-center">
            <div className="flex items-center gap-2 w-[15%] overflow-hidden">
              <Checkbox
                edge="start"
                color="secondary"
                checked={checked.indexOf("#") !== -1}
                tabIndex={-1}
                onClick={handleToggle("#")}
                disableRipple
              />
              <div onClick={handleSortToggle} className="w-full cursor-pointer">
                Name
              </div>
            </div>
            <div onClick={handleSortToggle} className="w-[8%] cursor-pointer">
              No. of Guests
            </div>
            <div onClick={handleSortToggle} className="w-[8%] cursor-pointer">
              No. of Rooms
            </div>
            <div onClick={handleSortToggle} className="w-[5%] cursor-pointer">
              Category
            </div>
            <div onClick={handleSortToggle} className="w-[10%] cursor-pointer">
              Arrival Date
            </div>
            <div onClick={handleSortToggle} className="w-[10%] cursor-pointer">
              Departure Date
            </div>
            <div onClick={handleSortToggle} className="w-[9%] cursor-pointer">
              Room Type
            </div>
            <div onClick={handleSortToggle} className="w-[10%] cursor-pointer">
              Room Assigned
            </div>
            <div className="flex justify-evenly gap-4 w-[8%]">
              <IconButton>
                <InsertDriveFileIcon color="black" />
              </IconButton>
              <IconButton>
                <DownloadIcon color="black" />
              </IconButton>
              {status === "rejected" && (
                <IconButton>
                  <EditIcon className="text-blue-500" />
                </IconButton>
              )}
            </div>
            <div />
          </div>
        </div>
  
        {/* Record Rows */}
        {loadingStatus === "Success" && newRecords.length > 0 && (
          <div className="h-96 overflow-y-auto">
            {newRecords.map((record) => {
              const labelId = `checkbox-list-label-${record._id}`;
              return (
                <div
                  key={record._id}
                  className="border-b border-gray-100 items-center flex gap-4 text-center justify-around px-4 p-1 text-[1vw]"
                >
                  <div className="flex items-center gap-2 w-[15%] overflow-hidden">
                    <Checkbox
                      edge="start"
                      checked={checked.indexOf(record._id) !== -1}
                      onClick={handleToggle(record._id)}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                    <div className="w-full">{record.guestName}</div>
                  </div>
                  <div className="w-[8%]">{record.numberOfGuests}</div>
                  <div className="w-[8%]">{record.numberOfRooms}</div>
                  <div className="w-[5%]">{record.category}</div>
                  <div className="w-[10%]">{getDate(record.arrivalDate)}</div>
                  <div className="w-[10%]">{getDate(record.departureDate)}</div>
                  <div className="w-[10%]">{record.roomType}</div>
                  {record.bookings?.length > 0 ? (
                    <div className="w-[10%]">Yes</div>
                  ) : (
                    <div className="w-[10%]">No</div>
                  )}
                  <div className="flex justify-evenly gap-4 w-[8%]">
                    <IconButton
                      onClick={() => {
                        location.pathname.split("/").length === 3
                          ? navigate(`${record._id}`)
                          : navigate(`../${record._id}`);
                      }}
                    >
                      <InsertDriveFileIcon color="black" />
                    </IconButton>
                    <IconButton
                      onClick={async () => {
                        try {
                          const res = await http.get(
                            "/reservation/documents/" + record._id,
                            { responseType: "blob" }
                          );
                          const file = window.URL.createObjectURL(res.data);
                          window.location.assign(file);
                        } catch (error) {
                          toast.error("Something went wrong");
                        }
                      }}
                    >
                      <DownloadIcon color="black" />
                    </IconButton>
                    {status === "rejected" && (
                      <IconButton onClick={() => handleEditClick(record)}>
                        <EditIcon className="text-blue-500" />
                      </IconButton>
                    )}
                  </div>
                  <div />
                </div>
              );
            })}
          </div>
        )}
      </div>
  
      {/* Status Messages */}
      {loadingStatus === "Loading" && (
        <div className="p-2 text-center pt-5 font-semibold">Loading...</div>
      )}
      {loadingStatus === "Success" && records.length === 0 && (
        <div className="p-2 text-center pt-5 font-semibold">
          No records found
        </div>
      )}
      {loadingStatus === "Error" && (
        <div className="p-2 text-center pt-5 font-semibold">
          Error fetching records!
        </div>
      )}
  
      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Reservation</DialogTitle>
        <DialogContent>
          {/* Basic Details Section */}
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Basic Details
          </Typography>
          <TextField
            label="Guest Name"
            value={editFormData.guestName || ""}
            onChange={(e) =>
              setEditFormData({ ...editFormData, guestName: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mobile Number"
            value={editFormData.applicant?.mobile || ""}
            onChange={(e) =>
              setEditFormData({
                ...editFormData,
                applicant: { ...editFormData.applicant, mobile: e.target.value },
              })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Arrival Date"
            type="date"
            value={editFormData.arrivalDate?.split("T")[0] || ""}
            onChange={(e) =>
              setEditFormData({ ...editFormData, arrivalDate: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Departure Date"
            type="date"
            value={editFormData.departureDate?.split("T")[0] || ""}
            onChange={(e) =>
              setEditFormData({ ...editFormData, departureDate: e.target.value })
            }
            fullWidth
            margin="normal"
          />
  
          {/* Category and Payment Section */}
          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
            Category and Payment Details
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={editFormData.category || "A"}
              onChange={(e) =>
                setEditFormData({ ...editFormData, category: e.target.value })
              }
            >
              {Object.entries(categoryInfo).map(([code, name]) => (
                <MenuItem key={code} value={code}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
  
          {/* Payment Options for categories B, C, D */}
          {(editFormData.category === "B" ||
            editFormData.category === "C" ||
            editFormData.category === "D") && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Payment Source</InputLabel>
              <Select
                value={editFormData.source || "GUEST"}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, source: e.target.value })
                }
              >
                <MenuItem value="GUEST">Paid by guest</MenuItem>
                <MenuItem value="DEPARTMENT">Paid by department</MenuItem>
                {editFormData.category === "B" && (
                  <MenuItem value="OTHERS">Paid by other sources</MenuItem>
                )}
              </Select>
            </FormControl>
          )}
  
          {/* File Upload Section */}
          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
            Category Proof Documents
          </Typography>
          <div className="flex mt-2 gap-10">
            <div>
              <InputFileUpload onFileUpload={handleFileUpload} />
            </div>
            {files.length > 0 ? (
              <div className="flex flex-col overflow-y-auto max-w-[30rem] h-16 gap-2 pr-2">
                {Array.from(files).map((file, index) => {
                  const arr = file.name.split(".");
                  const ext = arr[arr.length - 1];
                  return (
                    <div key={index} className="flex gap-4 items-center">
                      <div className="w-7">
                        <FileIcon extension={ext} {...defaultStyles} />
                      </div>
                      <div
                        className="text-sm text-gray-500 hover:text-blue-500 cursor-pointer"
                        onClick={() => {
                          window.open(window.URL.createObjectURL(file));
                        }}
                      >
                        {file.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center text-gray-500">
                {(editFormData.category === "A" || editFormData.category === "B")
                  ? "*Uploading attachments is mandatory for category A and B (size limit: 2MB)"
                  : "File size limit: 2MB"}
              </div>
            )}
          </div>
  
          {/* Existing Files Section */}
          {editFormData.documents && editFormData.documents.length > 0 && (
            <>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Previously Uploaded Files
              </Typography>
              <div className="flex flex-col gap-2">
                {editFormData.documents.map((doc, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <div className="w-7">
                      <FileIcon extension={doc.split('.').pop()} {...(defaultStyles || {})} />
                    </div>
                    <div
                      onClick={() => window.open(doc)}
                      className="text-sm text-gray-500 hover:text-blue-500 cursor-pointer"
                    >
                      {doc.split('/').pop()}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button
            onClick={handleEditSubmit}
            color="primary"
            disabled={
              (editFormData.category === "A" || editFormData.category === "B") &&
              files.length === 0 &&
              (!editFormData.documents || editFormData.documents.length === 0)
            }
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
  
}
