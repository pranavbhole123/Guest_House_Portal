import React, { useEffect, useState } from "react";

import List from "@mui/material/List";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";

import { getDate } from "../utils/handleDate";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Button from "@mui/material/Button";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import TextField from "@mui/material/TextField";
import DownloadIcon from "@mui/icons-material/Download";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import { CircularProgress, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import http from "../utils/httpService";
import { useSelector } from "react-redux";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import JSZip from 'jszip';

export default function AdminRecordList({ status = "pending" }) {
  const [checked, setChecked] = useState([]);
  const [values, setValues] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState("Loading");
  const [records, setRecords] = useState([]);
  const [newRecords, setNewRecords] = useState([]);
  const [sortType, setSortType] = useState("");
  const [sortToggle, setSortToggle] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewFileName, setPreviewFileName] = useState("");
  const [zipContents, setZipContents] = useState([]);
  const [isZipFile, setIsZipFile] = useState(false);
  const [loadingZip, setLoadingZip] = useState(false);
  const [selectedZipContent, setSelectedZipContent] = useState(null);
  const [selectedContentData, setSelectedContentData] = useState(null);

  const user = useSelector((state) => state.user);
  const isAdminOrChairman = user.role === "ADMIN" || user.role === "CHAIRMAN";

  const filterMap = {
    "Guest Name": "guestName",
    "Number of Rooms": "numberOfRooms",
    "Number of Guests": "numberOfGuests",
    Category: "category",
    "Arrival Date": "arrivalDate",
    "Departure Date": "departureDate",
    "Room Type": "roomType"
  };

  const navigate = useNavigate();

  const fetchRecords = async () => {
    try {
      const res = await http.get("/reservation/" + status);
      const reservations = res?.data;
      setLoadingStatus("Success");
      setValues(reservations?.map((res) => res._id));
      setRecords(reservations || []);
      setNewRecords(reservations || []);
    } catch (error) {
      setLoadingStatus("Error");
    }
  };
  useEffect(() => {
    setLoadingStatus("Loading");
    fetchRecords();
  }, [status]);

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
    "Arrival Date",
    "Departure Date",
    "Room Type",
    "Room Assigned"
  ];

  const handleSortToggle = (event) => {
    const type = event.target.outerText;
    setSortType(type);
    setSortToggle(!sortToggle);
  };

  useEffect(() => {
    const handleSort = () => {
      // console.log("here11212");
      console.log(sortType);
      const tempRecords = [...newRecords];
      if (sortToggle) {
        if (sortType === "No. of Guests") {
          tempRecords.sort((a, b) => {
            return a.numberOfGuests - b.numberOfGuests;
          });
        } else if (sortType === "No. of Rooms") {
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
            return new Date(a.arrivalDate) - new Date(b.arrivalDate);
          });
        } else if (sortType === "Room Assigned") {
          tempRecords.sort((a, b) => {
            return a.bookings?.length - b.bookings?.length;
          });
        }
      } else {
        if (sortType === "No. of Guests") {
          tempRecords.sort((a, b) => {
            return b.numberOfGuests - a.numberOfGuests;
          });
        } else if (sortType === "No. of Rooms") {
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
            return new Date(b.arrivalDate) - new Date(a.arrivalDate);
          });
        } else if (sortType === "Room Assigned") {
          tempRecords.sort((a, b) => {
            return b.bookings?.length - a.bookings?.length;
          });
        }
      }
      setNewRecords(tempRecords);
    };
    handleSort();
  }, [sortToggle, sortType]);

  const handleRejectClick = (recordId) => {
    setSelectedRecordId(recordId);
    setOpenRejectDialog(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      if (selectedRecordId === null) {
        // Handle bulk rejection
        for (const record of checked) {
          if (record !== "#") {
            await http.put(`/reservation/reject/${record}`, { reason: rejectReason });
          }
        }
        toast.success("Requests Rejected");
      } else {
        // Handle single rejection
        await http.put(`/reservation/reject/${selectedRecordId}`, { reason: rejectReason });
        toast.success("Request Rejected");
      }
      window.location.reload();
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data);
      } else {
        toast.error("An error occurred");
      }
    }
    setOpenRejectDialog(false);
    setRejectReason("");
    setSelectedRecordId(null);
  };

  // Function to process zip file contents
  const processZipFile = async (blob) => {
    setLoadingZip(true);
    try {
      const zip = new JSZip();
      const zipData = await zip.loadAsync(blob);
      
      const contents = [];
      
      // Process files and folders
      for (const [path, file] of Object.entries(zipData.files)) {
        if (!file.dir) {
          const extension = path.split('.').pop().toLowerCase();
          const isViewable = ['txt', 'md', 'json', 'js', 'jsx', 'html', 'css', 'xml', 'csv', 'pdf', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension);
          
          contents.push({
            path,
            name: path.split('/').pop(),
            dir: file.dir,
            date: new Date(file.date).toLocaleString(),
            size: file.dir ? '-' : formatFileSize(file._data.uncompressedSize),
            isViewable
          });
        } else {
          // Add folder entry
          contents.push({
            path,
            name: path,
            dir: true,
            date: new Date(file.date).toLocaleString(),
            size: '-',
            isViewable: false
          });
        }
      }
      
      setZipContents(contents);
      setLoadingZip(false);
    } catch (error) {
      console.error("Error processing zip file:", error);
      toast.error("Failed to process zip file");
      setLoadingZip(false);
    }
  };

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Function to view content of a file within the zip
  const viewZipContent = async (item) => {
    setSelectedZipContent(item);
    setLoadingZip(true);
    
    try {
      const zip = new JSZip();
      const zipData = await zip.loadAsync(await fetch(previewUrl).then(res => res.blob()));
      
      // Get the file extension
      const fileExtension = item.path.split('.').pop().toLowerCase();
      
      if (fileExtension === 'pdf') {
        // For PDF files, extract as array buffer and create a blob URL
        const pdfData = await zipData.file(item.path).async("arraybuffer");
        const pdfBlob = new Blob([pdfData], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setSelectedContentData(pdfUrl);
      } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(fileExtension)) {
        // For image files, extract as base64 and create a data URL
        const imageData = await zipData.file(item.path).async("base64");
        const mimeType = `image/${fileExtension === 'svg' ? 'svg+xml' : fileExtension}`;
        setSelectedContentData(`data:${mimeType};base64,${imageData}`);
      } else if (item.isViewable) {
        // For text files, extract as string
        const fileData = await zipData.file(item.path).async("string");
        setSelectedContentData(fileData);
      } else {
        toast.info("This file type cannot be previewed");
      }
      
      setLoadingZip(false);
    } catch (error) {
      console.error("Error reading file from zip:", error);
      toast.error("Failed to read file");
      setLoadingZip(false);
    }
  };

  return (
    <div className="flex p-2 px-0 w-full flex-col">
      <div className='text-center text-2xl font-["Dosis"] font-semibold py-2 uppercase'>
        {status + " requests"}
      </div>
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
                  // key={option.value}
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
          size="small"
          className="col-span-10 w-full p-2.5 h-full"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <List
        sx={{ width: "100%", padding: "0px" }}
        className="bg-gray-50 border rounded-md  overflow-hidden"
      >
        <div className="font-semibold border-b-2 text-[1.13vw] w-full" key="#">
          <div className="p-1 px-4 flex gap-4 w-full items-center text-center justify-around">
            <div className="flex items-center gap-2 w-[15%]">
              <Checkbox
                edge="start"
                color="secondary"
                checked={checked.indexOf("#") !== -1}
                tabIndex={-1}
                className=" "
                onClick={handleToggle("#")}
                disableRipple
              />
              <div onClick={handleSortToggle} className="w-full">
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
            <div onClick={handleSortToggle} className="w-[10%] cursor-pointer">
              Room Type
            </div>
            <div onClick={handleSortToggle} className="w-[10%] cursor-pointer">
              Room Assigned
            </div>
            <div className="flex justify-evenly gap-4 w-[10%]">
              { checked.length === 0 && (
                <>
                  <IconButton>
                    <InsertDriveFileIcon />
                  </IconButton>
                  <IconButton>
                    <VisibilityIcon />
                  </IconButton>
                  { isAdminOrChairman && (
                    <>
                      <IconButton>
                        <DoneIcon className="text-green-500" />
                      </IconButton>
                      <IconButton>
                        <CloseIcon className="text-red-500" />
                      </IconButton>
                    </>
                  )}
                </>
              )}
              
              { checked.length > 0 && isAdminOrChairman && (
                <div className="flex">
                  <IconButton edge="end" aria-label="comments">
                    <DoneIcon
                      className="text-green-500 h-5 mr-2"
                      onClick={async () => {
                        try {
                          checked.forEach(async (record) => {
                            if (record !== "#") {
                              await http.put("/reservation/approve/" + record);
                            }
                          });
                          toast.success("Requests Approved");
                          window.location.reload();
                        } catch (error) {
                          console.log(error?.message);
                        }
                      }}
                    />
                  </IconButton>
                  <IconButton edge="end" aria-label="comments">
                    <CloseIcon
                      className="text-red-400 h-5 ml-2"
                      onClick={() => {
                        setSelectedRecordId(null);
                        setOpenRejectDialog(true);
                      }}
                    />
                  </IconButton>
                </div>
              )}
            </div>
          </div>
        </div>

        {loadingStatus === "Success" && newRecords.length > 0 && (
          <div className="max-h-96 overflow-y-auto">
            {newRecords.map((record) => {
              const labelId = `checkbox-list-label-${record._id}`;
              return (
                <div
                  key={record._id}
                  className="border-b-[1px] border-gray-100 items-center flex gap-4 text-center px-4 p-1 text-[1vw] justify-around"
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
                  {record.bookings?.length > 0 && <div className="w-[10%]">Yes</div>}
                  {record.bookings?.length <= 0 && <div className="w-[10%]">No</div>}
                  <div className="flex justify-evenly gap-4 w-[10%]">
                    <IconButton edge="end" aria-label="file">
                      <InsertDriveFileIcon
                        onClick={() => {
                          window.location.pathname.split("/").length === 3
                            ? navigate(`${record._id}`)
                            : navigate(`../${record._id}`);
                        }}
                        color="black"
                      />
                    </IconButton>
                    <IconButton edge="end" aria-label="preview">
                      <VisibilityIcon
                        onClick={async () => {
                          try {
                            setLoadingZip(true);
                            const res = await http.get(
                              "/reservation/documents/" + record._id,
                              { responseType: "blob" }
                            );
                            const fileName = record.name || "Document";
                            const contentType = res.headers["content-type"] || res.data.type;
                            
                            // Check if it's a zip file
                            const isZip = contentType && (
                              contentType.includes("zip") || 
                              contentType.includes("application/octet-stream")
                            );
                            setIsZipFile(isZip);
                            
                            const file = window.URL.createObjectURL(res.data);
                            setPreviewUrl(file);
                            setPreviewFileName(`${fileName} (${contentType})`);
                            
                            if (isZip) {
                              // Process zip file contents
                              await processZipFile(res.data);
                            }
                            
                            setPreviewOpen(true);
                            setLoadingZip(false);
                          } catch (error) {
                            setLoadingZip(false);
                            toast.error("Something went wrong");
                          }
                        }}
                        color="black"
                      />
                    </IconButton>
                    { status !== "approved" && isAdminOrChairman && (
                      <IconButton edge="end" aria-label="approve">
                        <DoneIcon
                          className="text-green-500"
                          onClick={async () => {
                            try {
                              await http.put("/reservation/approve/" + record._id);
                              toast.success("Reservation Approved");
                              window.location.reload();
                            } catch (error) {
                              if (error.response?.data?.message) {
                                toast.error(error.response.data);
                              } else {
                                toast.error("An error occurred");
                              }
                            }
                          }}
                        />
                      </IconButton>
                    )}
                    { status !== "rejected" && isAdminOrChairman && (
                      <IconButton edge="end" aria-label="reject">
                        <CloseIcon
                          className="text-red-500"
                          onClick={() => handleRejectClick(record._id)}
                        />
                      </IconButton>
                    )}
                  </div>

                  <div />
                </div>
              );
            })}
          </div>
        )}
      </List>
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

      <Dialog 
        open={openRejectDialog} 
        onClose={() => setOpenRejectDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: '12px',
            padding: '12px',
          },
        }}
      >
        <DialogTitle sx={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: '#365899',
          borderBottom: '1px solid #e5e7eb',
          padding: '16px 24px',
        }}>
          Reject Reservation
        </DialogTitle>
        <DialogContent sx={{ 
          padding: '24px',
          paddingTop: '24px !important',
        }}>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for Rejection"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#365899',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#365899',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#365899',
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ 
          padding: '16px 24px',
          borderTop: '1px solid #e5e7eb',
          gap: '12px'
        }}>
          <Button 
            onClick={() => setOpenRejectDialog(false)}
            sx={{
              textTransform: 'none',
              padding: '8px 20px',
              borderRadius: '6px',
              fontWeight: 500,
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleRejectConfirm} 
            variant="contained"
            color="error"
            sx={{
              textTransform: 'none',
              padding: '8px 20px',
              borderRadius: '6px',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#dc2626',
              },
            }}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => {
          setPreviewOpen(false);
          setSelectedZipContent(null);
          setSelectedContentData(null);
          setZipContents([]);
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {previewFileName}
          <IconButton
            aria-label="close"
            onClick={() => {
              setPreviewOpen(false);
              setSelectedZipContent(null);
              setSelectedContentData(null);
              setZipContents([]);
            }}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {loadingZip ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
              <CircularProgress />
            </div>
          ) : (
            <>
              {isZipFile ? (
                <div>
                  {selectedZipContent ? (
                    <div>
                      <Button 
                        variant="outlined" 
                        startIcon={<ArrowDropUpIcon />}
                        onClick={() => {
                          setSelectedZipContent(null);
                          setSelectedContentData(null);
                        }}
                        sx={{ mb: 2 }}
                      >
                        Back to file list
                      </Button>
                      <Typography variant="h6">
                        {selectedZipContent.name}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      
                      {selectedZipContent.path.toLowerCase().endsWith('.pdf') ? (
                        <iframe
                          src={selectedContentData}
                          style={{ width: '100%', height: '500px' }}
                          frameBorder="0"
                        />
                      ) : selectedZipContent.path.toLowerCase().match(/\.(jpe?g|png|gif|bmp|svg)$/i) ? (
                        <div style={{ textAlign: 'center', padding: '10px' }}>
                          <img 
                            src={selectedContentData} 
                            alt={selectedZipContent.name}
                            style={{ maxWidth: '100%', maxHeight: '500px' }}
                          />
                        </div>
                      ) : (
                        <div style={{ 
                          backgroundColor: '#f5f5f5', 
                          padding: '10px', 
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          whiteSpace: 'pre-wrap',
                          overflowX: 'auto',
                          maxHeight: '400px',
                          overflowY: 'auto'
                        }}>
                          {selectedContentData}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <Typography variant="h6" gutterBottom>
                        Zip File Contents
                      </Typography>
                      <List sx={{ width: '100%', bgcolor: 'background.paper', maxHeight: '400px', overflow: 'auto' }}>
                        {zipContents.map((item, index) => (
                          <ListItem
                            key={index}
                            button={item.isViewable}
                            onClick={() => item.isViewable && viewZipContent(item)}
                            sx={{ 
                              cursor: item.isViewable ? 'pointer' : 'default',
                              '&:hover': {
                                bgcolor: item.isViewable ? 'rgba(0, 0, 0, 0.04)' : 'transparent'
                              }
                            }}
                          >
                            <ListItemIcon>
                              {item.dir ? <FolderIcon color="primary" /> : <DescriptionIcon color="primary" />}
                            </ListItemIcon>
                            <ListItemText 
                              primary={item.name} 
                              secondary={`${item.size} | ${item.date}`}
                            />
                            {!item.dir && (
                              <div className="flex gap-2">
                                {item.isViewable && (
                                  <Button size="small" variant="outlined" onClick={(e) => {
                                    e.stopPropagation();
                                    viewZipContent(item);
                                  }}>
                                    VIEW
                                  </Button>
                                )}
                                <Button 
                                  size="small" 
                                  variant="outlined"
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    try {
                                      const zip = new JSZip();
                                      const zipData = await zip.loadAsync(await fetch(previewUrl).then(res => res.blob()));
                                      const fileData = await zipData.file(item.path).async("arraybuffer");
                                      const fileBlob = new Blob([fileData], { type: 'application/octet-stream' });
                                      const fileUrl = URL.createObjectURL(fileBlob);
                                      
                                      // Create a temporary link element and trigger download
                                      const a = document.createElement('a');
                                      a.href = fileUrl;
                                      a.download = item.name;
                                      document.body.appendChild(a);
                                      a.click();
                                      document.body.removeChild(a);
                                      URL.revokeObjectURL(fileUrl);
                                    } catch (error) {
                                      console.error("Error downloading file:", error);
                                      toast.error("Failed to download file");
                                    }
                                  }}
                                >
                                  DOWNLOAD
                                </Button>
                              </div>
                            )}
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}
                </div>
              ) : (
                <iframe
                  src={previewUrl}
                  style={{ width: '100%', height: '500px' }}
                  frameBorder="0"
                />
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setPreviewOpen(false);
              setSelectedZipContent(null);
              setSelectedContentData(null);
              setZipContents([]);
            }} 
            color="primary"
          >
            CLOSE
          </Button>
          {zipContents.length > 0 && (
            <Button 
              onClick={async () => {
                try {
                  // Create a temporary link element and trigger download of the full zip
                  const a = document.createElement('a');
                  a.href = previewUrl;
                  a.download = previewUrl.split('/').pop();
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                } catch (error) {
                  console.error("Error downloading ZIP file:", error);
                  toast.error("Failed to download ZIP file");
                }
              }} 
              color="primary"
            >
              DOWNLOAD AS ZIP
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}