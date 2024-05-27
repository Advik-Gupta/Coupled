import React, { useState, useEffect } from "react";
import "../css/EditProfile.css";
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import db from "../firebase";
import { storage } from "../firebase";
import { useNavigate } from "react-router-dom";

function EditProfile({ user, showData, setUser }) {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "Please enter your name",
    age: 15,
    gender: "Male",
    school: "Please enter your school",
    city: "Please enter your city",
    address: "Please enter your address",
    insta: "Please enter your Insta",
    twitter: "Please enter your Twitter",
  });
  const [showError, setshowError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showprogress, setshowProgress] = useState(false);
  const [images, setImages] = useState([]);
  const [imagesNotSelected, setImagesNotSelected] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  useEffect(() => {
    if (showData) {
      setValues({
        name: user.name,
        age: 15,
        gender: user.gender,
        school: user.school,
        city: user.city,
        address: user.address,
        insta: user.insta.replace("https://www.instagram.com/", ""),
        twitter: user.twitter.replace("https://twitter.com/", ""),
        shortDesc: user.shortDesc,
      });
      setImageUrls(user.images);
    } else {
      setValues({
        name: user.name,
        age: 15,
        gender: "Male",
        school: "Please enter your school",
        city: "Please enter your city",
        address: "Please enter your address",
        insta: "Please enter your Insta",
        twitter: "Please enter your Twitter",
        shortDesc: "Please enter your short description",
      });
    }
  }, []);

  const setProfileImages = async () => {
    if (images.length === 3) {
      images.map(async (image) => {
        const storageRef = await storage().ref();
        const storageRefChild = await storageRef.child(
          `userImages/${user.userId}/${image.name}`
        );

        storageRefChild.put(image).on(
          "state_changed",
          async (snapshot) => {
            let progress =
              (await (snapshot.bytesTransferred / snapshot.totalBytes)) * 100;
            setProgress(progress);
            setshowProgress(true);
          },
          (error) => {
            console.log(error);
          },
          async () => {
            const url = await storageRefChild.getDownloadURL();
            setImageUrls((imageUrls) => [...imageUrls, url]);
          }
        );
      });
    } else {
      setImagesNotSelected(true);
      setshowError(true);
      return;
    }
  };

  const updateUserData = async () => {
    const userData = {
      ...values,
      insta: `${
        values.insta === "Please enter your Insta"
          ? "Not Set"
          : `https://www.instagram.com/${values.insta}`
      }`,
      twitter: `${
        values.twitter === "Please enter your Twitter"
          ? "Not Set"
          : `https://twitter.com/${values.twitter}`
      }`,
      address: `${
        values.address === "Please enter your address"
          ? "Not Set"
          : values.address
      }`,
      images: imageUrls,
      userId: user.userId,
    };

    if (
      values.name &&
      values.age &&
      values.gender &&
      values.school &&
      values.city &&
      values.shortDesc &&
      values.school !== "Please enter your school" &&
      values.city !== "Please enter your city" &&
      values.shortDesc !== "Please enter your short description"
    ) {
      setshowError(false);
      await db.collection("users").doc(user.userId).update(userData);
      setUser(userData);
      navigate("/");
    } else {
      setshowError(true);
    }
  };

  const imageUploaderFunction = async () => {
    const files = document.getElementById("contained-button-file").files;
    if (files) {
      setImages([...files]);
    }
  };

  return (
    <div className="editProfile">
      <h1 className="editProfile_header">Set your profile data</h1>
      <div className="editProfile_inputBox">
        <TextField
          value={values.name}
          id="outlined-basic"
          label="Name"
          variant="outlined"
          className="editProfile_input editProfile_name"
          onChange={handleChange("name")}
        />
        <p className="editProfile_input_text">*Necessary</p>
      </div>
      <div className="editProfile_inputBox">
        <div className="editProfile_age">
          <Slider
            aria-label="Age"
            defaultValue={values.age}
            color="secondary"
            className="age_slider"
            onChange={handleChange("age")}
            min={12}
            max={20}
          />
          <p className="age_text">Age ({values.age})</p>
        </div>
        {user && user.age && (
          <p className="editProfile_input_text editProfile_input_text_age">
            *Please reselect your age before saving
          </p>
        )}
      </div>
      <div className="editProfile_inputBox">
        <div className="editProfile_gender">
          <FormControl fullWidth className="gender_picker">
            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              defaultValue={values.gender}
              label="Gender"
              onChange={handleChange("gender")}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Gay">Gay</MenuItem>
              <MenuItem value="Lesbian">Lesbian</MenuItem>
              <MenuItem value="Bisexual">Bisexual</MenuItem>
              <MenuItem value="Rather Not Say">Rather Not Say</MenuItem>
            </Select>
          </FormControl>
        </div>
        <p className="editProfile_input_text">*Necessary</p>
        {user && user.gender && (
          <>
            <p className="editProfile_input_text">
              *The select might show a wrong value
            </p>
            <p className="editProfile_input_text">*Ignore if it does</p>
          </>
        )}
      </div>
      <div className="editProfile_inputBox">
        <TextField
          id="outlined-basic"
          label="School"
          variant="outlined"
          className="editProfile_input editProfile_school"
          onChange={handleChange("school")}
          value={values.school}
        />
        <p className="editProfile_input_text">*Necessary</p>
      </div>
      <div className="editProfile_inputBox">
        <TextField
          id="outlined-basic"
          label="City"
          variant="outlined"
          className="editProfile_input editProfile_city"
          onChange={handleChange("city")}
          value={values.city}
        />
        <p className="editProfile_input_text">*Necessary</p>
      </div>
      <div className="editProfile_inputBox">
        <TextField
          id="outlined-basic"
          label="Description"
          variant="outlined"
          className="editProfile_input editProfile_description"
          onChange={handleChange("shortDesc")}
          value={values.shortDesc}
          inputProps={{ maxLength: 116 }}
        />
        <p className="editProfile_input_text">*Necessary</p>
        <p className="editProfile_input_text">*Max 116 characters</p>
      </div>
      <div className="editProfile_inputBox">
        <TextField
          id="outlined-basic"
          label="Address"
          variant="outlined"
          className="editProfile_input editProfile_address"
          onChange={handleChange("address")}
          value={values.address}
        />
        <p className="editProfile_input_text">*Optional</p>
      </div>
      <div className="editProfile_inputBox">
        <TextField
          id="outlined-basic"
          label="Insta"
          variant="outlined"
          className="editProfile_input editProfile_address"
          onChange={handleChange("insta")}
          value={values.insta}
        />
        <p className="editProfile_input_text">*Optional</p>
        <p className="editProfile_input_text">*Only username</p>
      </div>
      <div className="editProfile_inputBox">
        <TextField
          id="outlined-basic"
          label="Twitter"
          variant="outlined"
          className="editProfile_input editProfile_address"
          onChange={handleChange("twitter")}
          value={values.twitter}
        />
        <p className="editProfile_input_text">*Optional</p>
        <p className="editProfile_input_text">*Only username</p>
      </div>
      <div
        className={`editProfile_inputBox ${
          imageUrls.length !== 0 ? "hiddenUploader" : ""
        }`}
      >
        <div className="editProfile_uploadBox">
          <label
            className="editProfile_uploadButton"
            htmlFor="contained-button-file"
          >
            <input
              accept="image/jpeg,image/jpg,image/png"
              id="contained-button-file"
              multiple
              type="file"
              onChange={imageUploaderFunction}
            />
            <Button variant="contained" component="span">
              Upload
            </Button>
          </label>
          <p className="editProfile_upload_text">Upload Images</p>
        </div>
        <p className="editProfile_input_text">*Exactly 3 images</p>
        <p className="editProfile_input_text">
          *Once uploaded these cannot be changed
        </p>
        <p className="editProfile_input_text">*Select Carefully</p>
      </div>
      <p
        className={`editProfile_errorMessage ${
          showError ? "showErrorMsg" : ""
        }`}
      >
        {imagesNotSelected
          ? "**Please select 3 images**"
          : "**Please fill all necessary details**"}
      </p>
      <button
        className={`editProfile_saveButton ${
          images.length === 3 &&
          user.images.length === 1 &&
          imageUrls.length !== 3
            ? ""
            : "hiddenSaveImages"
        }`}
        onClick={setProfileImages}
      >
        Save Images
      </button>
      <p
        className={`editProfile_errorMessage ${
          progress !== 100 && showprogress ? "showErrorMsg" : ""
        }`}
      >
        **Uploading Images**
      </p>
      <button
        className={`editProfile_saveButton ${
          imageUrls.length > 2 ? "" : "hiddenSaveImages"
        }`}
        onClick={updateUserData}
      >
        Save Profile Data
      </button>
    </div>
  );
}

export default EditProfile;
