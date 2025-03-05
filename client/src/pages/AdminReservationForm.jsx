import React, { useState } from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  TextField,
} from "@mui/material";
import "./Reservation_Form.css";
import { updateFilledPDF } from "../utils/generatePDF";
import InputFileUpload from "../components/uploadFile";
import { useSelector } from "react-redux";
import { privateRequest } from "../utils/useFetch";
import { FileIcon, defaultStyles } from "react-file-icon";
import { Link, useNavigate } from "react-router-dom";
import ApplicantTable from "../components/ApplicantTable";
import NewWindow from "../components/NewWindow";
import { useEffect } from "react";

function ReservationForm() {
  const user = useSelector((state) => state.user);
  const http = privateRequest(user.accessToken, user.refreshToken);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [showTC, setShowTC] = useState(false);
  const [showCat, setShowCat] = useState(false);
  const [subRole, setSubRole] = useState([]);

  useEffect(() => {
    setShowCat(false);
    setShowTC(false);
  }, [showTC, showCat]);

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    guestName: "",
    address: "",
    numberOfGuests: "",
    numberOfRooms: "",
    roomType: "Single Occupancy",
    arrivalDate: "",
    arrivalTime: "",
    departureDate: "",
    departureTime: "",
    purpose: "",
    category: "A",
    source: "GUEST",
    applicant: {
      name: "",
      designation: "",
      department: "",
      code: "",
      mobile: "",
      email: "",
    },
  });

  const [errorText, setErrorText] = useState({
    guestName: "",
    address: "",
    numberOfGuests: "",
    numberOfRooms: "",
    roomType: "",
    arrivalDate: "",
    arrivalTime: "",
    departureDate: "",
    departureTime: "",
    purpose: "",
    category: "",
  });

  const requiredFields = {
    guestName: false,
    address: false,
    numberOfGuests: false,
    numberOfRooms: false,
    roomType: false,
    arrivalDate: true,
    arrivalTime: false,
    departureDate: true,
    departureTime: false,
    purpose: false,
    category: true,
    source: false,
    applicant: false,
  };

  const patterns = {
    guestName: /[a-zA-Z]+/,
    address: /[\s\S]*/,
    numberOfGuests: /[0-9]+/,
    numberOfRooms: /[0-9]+/,
    roomType: /[\s\S]*/,
    arrivalDate: /[\s\S]*/,
    arrivalTime: /[\s\S]*/,
    departureDate: /[\s\S]*/,
    departureTime: /[\s\S]*/,
    purpose: /[\s\S]*/,
    category: /[\s\S]*/,
  };

  const categoryInfo = {
    A: "Category A",
    B: "Category B",
    C: "Category C (For student's family only their parents are allowed)",
    D: "Category D (Guest and Department invited, etc.)",
  };

  const catAReviewers = ["DIRECTOR", "REGISTRAR", "ASSOCIATE DEAN", "DEAN"];

  const catBReviewers = ["HOD", "DEAN", "ASSOCIATE DEAN", "REGISTRAR"];

  const Hods = [
    "COMPUTER SCIENCE",
    "ELECTRICAL ENGINEERING",
    "MECHANICAL ENGINEERING",
    "CHEMISTRY",
    "MATHEMATICS",
    "PHYSICS",
    "HUMANITIES AND SOCIAL SCIENCES",
    "BIOMEDICAL ENGINEERING",
    "CHEMICAL ENGINEERING",
    "METALLURGICAL AND MATERIALS ENGINEERING",
  ];

  const AssociateDeans = [
    "HOSTEL MANAGEMENT",
    "INTERNATIONAL RELATIONS AND ALUMNI AFFAIRS",
    "CONTINUING EDUCATION AND OUTREACH ACTIVITIES",
    "INFRASTRUCTURE",
  ];

  const Deans = [
    "RESEARCH AND DEVELOPMENT",
    "STUDENT AFFAIRS",
    "FACULTY AFFAIRS AND ADMINISTRATION",
    "UNDER GRADUATE STUDIES",
    "POST GRADUATE STUDIES",
  ];

  const subroles = {
    HOD: Hods,
    "ASSOCIATE DEAN": AssociateDeans,
    DEAN: Deans,
  };

  const catCReviewers = ["CHAIRMAN"];
  const catDReviewers = ["CHAIRMAN"];

  const roomFareA = {
    "Single Occupancy": 0,
    "Double Occupancy": 0,
  };
  const roomFareB = {
    "Single Occupancy": 600,
    "Double Occupancy": 850,
  };
  const roomFareC = {
    "Single Occupancy": 900,
    "Double Occupancy": 1250,
  };
  const roomFareD = {
    "Single Occupancy": 1300,
    "Double Occupancy": 1800,
  };

  const catReviewers = {
    A: catAReviewers,
    B: catBReviewers,
    C: catCReviewers,
    D: catDReviewers,
  };

  const roomFare = {
    A: roomFareA,
    B: roomFareB,
    C: roomFareC,
    D: roomFareD,
  };

  const [checkedValues, setCheckedValues] = useState([]);

  console.log(checkedValues);
  console.log(subRole);
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    if (name === "category") {
      if (value === "C" || value === "D") {
        setCheckedValues(["CHAIRMAN"]);
        setSubRole(["Select"]);
      } else {
        setCheckedValues([]);
        setSubRole([]);
      }
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setCheckedValues((prevCheckedValues) => [...prevCheckedValues, value]);
      setSubRole((prevSubRole) => [...prevSubRole, "Select"]);
    } else {
      setCheckedValues((prevCheckedValues) => {
        const temp = [...prevCheckedValues];
        const index = temp.indexOf(value);

        console.log(index);
        temp.splice(index, 1);

        subRole.splice(index, 1);
        return temp;
      });
    }
  };

  console.log(checkedValues);

  const handleSubRoleChange = (event, reviewer) => {
    const index = checkedValues.indexOf(reviewer);
    const temp = [...subRole];
    temp[index] = event.target.value;
    setSubRole(temp);
  };

  const handleFileUpload = (files) => {
    setFiles(files);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const receipt = await updateFilledPDF(formData);

    //Handle form validation

    let passed = true;

    for (let [key, value] of Object.entries(formData)) {
      if (key === "files" || key === "receipt") {
        continue;
      }
      if (requiredFields[key] && value === "") {
        setErrorText((prev) => ({
          ...prev,
          [key]: "This field is required",
        }));
        passed = false;
      } else if (value !== "" && patterns[key] && !value.match(patterns[key])) {
        setErrorText((prev) => ({
          ...prev,
          [key]: "Invalid input",
        }));
        passed = false;
      } else {
        setErrorText((prev) => ({
          ...prev,
          [key]: "",
        }));
      }
    }

    const arrivalDateTime = new Date(
      `${formData.arrivalDate}T${formData.arrivalTime || "13:00"}`
    );
    const departureDateTime = new Date(
      `${formData.departureDate}T${formData.departureTime || "11:00"}`
    );


    // Check if departure is after arrival
    if (departureDateTime <= arrivalDateTime) {
      passed = false;
      setErrorText((prev) => ({
        ...prev,
        departureDate: "Departure date must be after arrival date",
        departureTime: "Departure time must be after arrival time",
      }));
      toast.error("Departure should be After Arrival");
      return;
    }


    for (let [index, reviewer] of checkedValues.entries()) {
      console.log(subroles[reviewer]);
      console.log(subRole[index]);
      if (
        subroles[reviewer] &&
        (subRole[index] === "" ||
          !subRole[index] ||
          subRole[index] === "Select")
      ) {
        toast.error("Please select subrole for each reviewer");
        return;
      }
    }

    if (!passed) {
      toast.error("Please Fill All Necessary Fields Correctly.");
      return;
    }

    // Handle form submission
    setLoading(true);

    const toast_id = toast.loading("Submitting form...");

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([fieldName, fieldValue]) => {
        if (fieldName === "applicant")
          formDataToSend.append(fieldName, JSON.stringify(fieldValue));
        formDataToSend.append(fieldName, fieldValue);
      });
      for (const file of files) {
        formDataToSend.append("files", file);
      }
      formDataToSend.append("reviewers", checkedValues);
      formDataToSend.append("subroles", subRole);
      formDataToSend.append("receipt", receipt);
      const res = await http.post("reservation/", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res.status);
      if (res.status === 200) {
        // toast.success("Form submitted successfully!");
        console.log("success1");
        toast.update(toast_id, {
          render: "Form submitted successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        setLoading(false);
        // navigate("..");
      } else {
        console.log("fail");

        toast.update(toast_id, {
          render: "Form submission failed.",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Form submission failed:", error);
      setLoading(false);

      if (error.response?.data?.message) {
        console.log("fail1");
        toast.update(toast_id, {
          render: error.response.data.message,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      } else {
        console.log("fail2");

        toast.update(toast_id, {
          render: "Form submission failed.",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
    }
  };

  const [showCheckbox, setShowCheckbox] = useState(false);

  useEffect(() => {
    // setShowCheckbox(false);
    setShowCheckbox(true);
  }, [formData.category]);

  return (
    <div className="w-full">
      <div className="reservation-container border shadow-xl rounded-lg  bg-white">
        <h2 className="py-2 mb-5">Guest House Reservation Form</h2>
        <FormControl className="w-full flex gap-4">
          <div>
            <TextField
              label="Name of Guest"
              error={errorText.guestName !== ""}
              required={requiredFields.guestName}
              helperText={errorText.guestName && errorText.guestName}
              fullWidth
              variant="outlined"
              name="guestName"
              value={formData.guestName}
              onChange={handleChange}
            />
          </div>

          <div>
            <TextField
              label="Address"
              error={errorText.address !== ""}
              helperText={errorText.address && errorText.address}
              fullWidth
              required={requiredFields.address}
              className="bg-white"
              variant="outlined"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <TextField
            label="Number of Guests"
            fullWidth
            error={errorText.numberOfGuests !== ""}
            required={requiredFields.numberOfGuests}
            helperText={errorText.numberOfGuests && errorText.numberOfGuests}
            className="bg-white"
            variant="outlined"
            name="numberOfGuests"
            value={formData.numberOfGuests}
            onChange={handleChange}
          />
          <TextField
            label="Number of Rooms Required"
            fullWidth
            error={errorText.numberOfRooms !== ""}
            required={requiredFields.numberOfRooms}
            helperText={errorText.numberOfRooms && errorText.numberOfRooms}
            className="bg-white"
            variant="outlined"
            name="numberOfRooms"
            value={formData.numberOfRooms}
            onChange={handleChange}
          />

          <div className="form-group">
            <label>Arrival Date*:</label>
            <input
              type="date"
              name="arrivalDate"
              value={formData.arrivalDate}
              onChange={handleChange}
              min={new Date(Date.now()).toISOString().split("T")[0]}
            />
          </div>

          <div className="form-group">
            <label>Arrival Time:</label>
            <input
              type="time"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Departure Date*:</label>
            <input
              type="date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleChange}
              min={new Date(Date.now()).toISOString().split("T")[0]}
            />
          </div>
          <div className="form-group">
            <label>
              Departure Time: (Departure time must be before 11:00 AM)
            </label>
            <input
              type="time"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleChange}
            />
          </div>

          {showCat && <NewWindow link="/forms/categories.pdf" />}
          {showTC && <NewWindow link="/forms/TermsAndConditions.pdf" />}

          <TextField
            label="Purpose of Booking"
            error={errorText.purpose !== ""}
            helperText={errorText.purpose && errorText.purpose}
            required={requiredFields.purpose}
            fullWidth
            className=""
            variant="outlined"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
          />

          <div className="form-group">
            <label>
              Category*: (Refer to{" "}
              <span
                className="underline cursor-pointer text-blue-800"
                onClick={() => {
                  setShowCat(true);
                }}
              >
                this
              </span>{" "}
              page for details of categories and tariff)
            </label>
            <select
              name="category"
              className="w-full h-12 border rounded-md border-gray-300 p-2 mb-5 whitespace-pre"
              onChange={handleChange}
              value={formData.category}
            >
              {Object.entries(categoryInfo).map(
                ([categoryCode, categoryName]) => (
                  <option key={categoryCode} value={categoryCode}>
                    {categoryName}
                  </option>
                )
              )}
            </select>
            <div className="form-group">
              <label>Room Type*</label>

              <select
                name="roomType"
                className="w-full h-12 border rounded-md border-gray-300 p-2 whitespace-pre"
                onChange={handleChange}
                value={formData.roomType}
              >
                <option className="" value="Single Occupancy">
                  {formData.category !== "A" && (
                    <span>
                      Single Occupancy (Rs.
                      {roomFare[formData.category]["Single Occupancy"]}/- only)
                    </span>
                  )}
                  {formData.category === "A" && (
                    <span>Single Occupancy (Free)</span>
                  )}
                </option>
                <option className="" value="Double Occupancy">
                  {formData.category !== "A" && (
                    <span>
                      Double Occupancy (Rs.
                      {roomFare[formData.category]["Double Occupancy"]}/- only)
                    </span>
                  )}
                  {formData.category === "A" && (
                    <span>Double Occupancy (Free)</span>
                  )}
                </option>
              </select>
            </div>
            {showCheckbox &&
              (formData.category === "A" || formData.category === "B") && (
                <div className="w-full p-2 mb-5">
                  <ul className="flex flex-col flex-wrap justify-start gap-1">
                    {catReviewers[formData.category].map((reviewer) => (
                      <li
                        key={reviewer}
                        className="flex justify-start gap-1 items-center"
                      >
                        <Checkbox
                          name="reviewers"
                          id={reviewer}
                          value={reviewer}
                          checked={checkedValues.includes(reviewer)}
                          onChange={handleCheckboxChange}
                          inputProps={{ "aria-label": reviewer }}
                        />
                        <label className="w-32" htmlFor={reviewer}>
                          {reviewer}
                        </label>
                        {reviewer === "ASSOCIATE DEAN" &&
                          checkedValues.includes("ASSOCIATE DEAN") && (
                            <FormControl>
                              <Select
                                labelId="sub-role-label"
                                id="sub-role-select"
                                value={
                                  subRole[
                                    checkedValues.indexOf("ASSOCIATE DEAN")
                                  ] || "Select"
                                }
                                onChange={(e) =>
                                  handleSubRoleChange(e, reviewer)
                                }
                              >
                                <MenuItem value="Select">Select</MenuItem>
                                <MenuItem value="HOSTEL MANAGEMENT">
                                  Hostel Management
                                </MenuItem>
                                <MenuItem value="CONTINUING EDUCATION AND OUTREACH ACTIVITIES">
                                  Continuing Education and Outreach Activities
                                </MenuItem>
                                <MenuItem value="INTERNATIONAL RELATIONS AND ALUMNI AFFAIRS">
                                  International Relations and Alumni Affairs
                                </MenuItem>
                                <MenuItem value="INFRASTRUCTURE">
                                  Infrastructure
                                </MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        {reviewer === "HOD" &&
                          checkedValues.includes("HOD") && (
                            <FormControl>
                              <Select
                                labelId="sub-role-label"
                                id="sub-role-select"
                                value={
                                  subRole[checkedValues.indexOf("HOD")] ||
                                  "Select"
                                }
                                onChange={(e) =>
                                  handleSubRoleChange(e, reviewer)
                                }
                              >
                                <MenuItem value="Select">Select</MenuItem>
                                <MenuItem value="COMPUTER SCIENCE">
                                  Computer Science
                                </MenuItem>
                                <MenuItem value="ELECTRICAL ENGINEERING">
                                  Electrical Engineering
                                </MenuItem>
                                <MenuItem value="MECHANICAL ENGINEERING">
                                  Mechanical Engineering
                                </MenuItem>
                                <MenuItem value="CHEMISTRY">Chemistry</MenuItem>
                                <MenuItem value="MATHEMATICS">
                                  Mathematics
                                </MenuItem>
                                <MenuItem value="PHYSICS">Physics</MenuItem>
                                <MenuItem value="HUMANITIES AND SOCIAL SCIENCES">
                                  Humanities and Social Sciences
                                </MenuItem>
                                <MenuItem value="BIOMEDICAL ENGINEERING">
                                  Biomedical Engineering
                                </MenuItem>
                                <MenuItem value="CIVIL ENGINEERING">
                                  Civil Engineering
                                </MenuItem>
                                <MenuItem value="CHEMICAL ENGINEERING">
                                  Chemical Engineering
                                </MenuItem>
                                <MenuItem value="METALLURGICAL AND MATERIALS ENGINEERING">
                                  Metallurgical & Materials Engineering
                                </MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        {reviewer === "DEAN" &&
                          checkedValues.includes("DEAN") && (
                            <FormControl>
                              <Select
                                labelId="sub-role-label"
                                id="sub-role-select"
                                value={
                                  subRole[checkedValues.indexOf("DEAN")] ||
                                  "Select"
                                }
                                onChange={(e) =>
                                  handleSubRoleChange(e, reviewer)
                                }
                              >
                                <MenuItem value="Select">Select</MenuItem>
                                <MenuItem value="RESEARCH AND DEVELOPMENT">
                                  Research and Development
                                </MenuItem>
                                <MenuItem value="STUDENT AFFAIRS">
                                  Student Affairs
                                </MenuItem>
                                <MenuItem value="FACULTY AFFAIRS AND ADMINISTRATION">
                                  Faculty Affairs & Administration
                                </MenuItem>
                                <MenuItem value="UNDER GRADUATE STUDIES">
                                  Under Graduate Studies
                                </MenuItem>
                                <MenuItem value="POST GRADUATE AND RESEARCH">
                                  Post Graduate & Research
                                </MenuItem>
                              </Select>
                            </FormControl>
                          )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            {(formData.category === "B" ||
              formData.category === "C" ||
              formData.category === "D") && (
              <>
                <label>Payment*:</label>

                <select
                  name="source"
                  className="w-full h-12 border rounded-md border-gray-300 p-2 mb-5 whitespace-pre"
                  onChange={handleChange}
                  value={formData.paymentType}
                >
                  <option value="GUEST">Paid by guest</option>
                  <option value="DEPARTMENT">Paid by department</option>
                  {formData.category === "B" && (
                    <option value="OTHERS">Paid by other sources</option>
                  )}
                </select>
              </>
            )}
            Add attachements for proof of category (if any):
            <div className="flex mt-2 gap-10">
              <div>
                <InputFileUpload className="" onFileUpload={handleFileUpload} />
              </div>

              {Array.from(files).length > 0 ? (
                <div className="flex flex-col  overflow-y-auto max-w-[30rem] h-16 gap-2 pr-2">
                  {Array.from(files).map((file, index) => {
                    const arr = file.name.split(".");
                    const ext = arr[arr.length - 1];
                    return (
                      <div className="flex gap-4 items-center">
                        <div className="w-7">
                          <FileIcon
                            className=""
                            extension={ext}
                            {...defaultStyles}
                          />
                        </div>
                        <div
                          onClick={() => {
                            window.open(window.URL.createObjectURL(file));
                          }}
                          className="text-sm text-gray-500 hover:text-blue-500 cursor-pointer"
                        >
                          {file.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : formData.category === "A" || formData.category === "B" ? (
                <div className="flex items-center text-gray-500">
                  *Uploading attachments is mandatory for category A and B (size
                  limit: 2MB)
                </div>
              ) : (
                <div className="flex items-center text-gray-500">
                  File size limit: 2MB
                </div>
              )}
            </div>
            <div className="mt-5 flex flex-col gap-2">
              <div>Applicant/Proposer Details:</div>
              <div>
                <ApplicantTable
                  entry={formData.applicant}
                  setEntry={(entry) =>
                    setFormData((prev) => ({ ...prev, applicant: entry }))
                  }
                />
              </div>
            </div>
          </div>

          <div>
            By clicking on Submit, you hereby agree to the{" "}
            <span
              className="underline cursor-pointer text-blue-800"
              onClick={() => {
                setShowTC(true);
              }}
            >
              Terms and Conditions
            </span>
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="submit-btn"
          >
            Submit
          </button>
          <button
            onClick={async () => {
              const blob = await updateFilledPDF(formData);
              const pdfUrl = URL.createObjectURL(blob);
              window.open(pdfUrl);
            }}
            className="convert-to-pdf-btn"
          >
            See Preview - PDF
          </button>
        </FormControl>
      </div>
    </div>
  );
}

export default ReservationForm;
