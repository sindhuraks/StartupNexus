"use client";

import { useSession } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { City } from "country-state-city";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { isValidPhoneNumber } from "libphonenumber-js";
import styles from "./signup_form.module.css";

export default function SignupForm() {
  const { data: session } = useSession();
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm();
  const [linkedinError, setLinkedinError] = useState("");
  const [contactValid, setContactValid] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleLinkedInChange = (e) => {
    const url = e.target.value;
    const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/.+/;
    setLinkedinError(linkedinRegex.test(url) ? "" : "Invalid LinkedIn URL");
  };

  const loadCities = (inputValue, callback) => {
    const cityData = City.getAllCities() || [];
    const filteredCities = cityData
      .filter(city => city.name.toLowerCase().includes(inputValue.toLowerCase()))
      .slice(0, 50)
      .map(city => ({
        value: `${city.name}, ${city.stateCode}`,
        label: `${city.name}, ${city.stateCode}`
      }));
    callback(filteredCities);
  };

  const role = watch("role");
  const interests = ["AI", "Healthcare/Health Tech", "Cybersecurity", "Internet of Things (IoT)", "Fintech", "Clean Tech/Green Energy", "E-commerce/Retail Tech", "AgriTech", "Robotics and Automation", "Online Education/Skill Development", "Personalized Nutrition/Wellness"];
  const [selectedInterests, setSelectedInterests] = useState([]);

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const onSubmit = async (data) => {
    if (!isValidPhoneNumber(data.contact, "US")) {
      alert("Invalid phone number");
      return;
    }
    console.log("Form Data Submitted: ", { ...data, selectedInterests });
    setIsSubmitted(true);
  };
 
  const handlePhoneChange = (e) => {
    const phone = e.target.value;
    setContactValid(isValidPhoneNumber(phone, "US"));
  };

  return (
    <div className={styles.container}>
      {isSubmitted ? (
        <div className={styles.successMessage}>
          <p>Your application is under review.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div>
            <label className={styles.label}>Full Name</label>
            <input {...register("fullName", { required: "Full Name is required" })} defaultValue={session?.user?.name || ""} className={styles.input} placeholder="Enter your full name" />
            {errors.fullName && <span className={styles.error}>{errors.fullName.message}</span>}
          </div>

          <div>
            <label className={styles.label}>E-Mail</label>
            <input {...register("email", { required: "Email is required", pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: "Invalid email format" } })} defaultValue={session?.user?.email || ""} className={styles.input} type="email" placeholder="Enter your email" />
            {errors.email && <span className={styles.error}>{errors.email.message}</span>}
          </div>

          {/* Contact */}
          <div>
            <label className={styles.label}>Contact</label>
            <input
              {...register("contact", { required: "Contact number is required" })}
              className={styles.input}
              placeholder="Enter your contact number"
              onChange={handlePhoneChange}
            />
            {!contactValid && <span className={styles.error}>Invalid phone number</span>}
          </div>

          {/* LinkedIn Profile */}
          <div>
            <label className={styles.label}>LinkedIn Profile</label>
            <input
              {...register("linkedin")}
              className={styles.input}
              type="url"
              placeholder="Enter your LinkedIn URL"
              onChange={handleLinkedInChange}
            />
            {linkedinError && <span className={styles.error}>{linkedinError}</span>}
          </div>

            {/* Location Dropdown */}
<div>
  <label className={styles.label}>Location</label>
  <Controller
  control={control}
  name="location"
  render={({ field }) => (
    <AsyncSelect
      {...field}
      cacheOptions
      loadOptions={loadCities}
      defaultOptions
      className="select" // Using the CSS class for styling
      styles={{
        control: (base) => ({
          ...base,
          backgroundColor: "transparent", // Transparent background for the control
          borderColor: "#777", // Light gray border similar to input
          color: "#ffffff", // Dark text for readability
          borderWidth: "2px", // Same border width as input
          borderRadius: "8px", // Same border radius as input
          fontSize: "18px",
          height: "45px", // Set a fixed height to control vertical centering
          textAlign: "left",
          display: "flex",
          alignItems: "center", // Align items vertically in the center
          justifyContent: "flex-start", // Align text to the left
          boxShadow: "none", // Remove default shadow
          padding: "8px 12px", // Padding for better clickable area
          transition: "background-color 0.3s ease, border-color 0.3s ease", // Smooth transition on hover
          marginBottom: "20px", // Margin same as input box
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: "#f7f7f7", // Slightly darker background for the menu
          color: "#ffffff",
          border: "1px solid #cccccc", // Light gray border to separate from page content
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Soft shadow for dropdown
        }),
        option: (base, { isFocused, isSelected }) => ({
          ...base,
          backgroundColor: isSelected
            ? "#06d0ac" // Green for selected
            : isFocused
            ? "#f0f0f0" // Light gray for hover
            : "#ffffff", // White for default
          color: isSelected ? "#ffffff" : "#333333", // White for selected, black for other options
          padding: "10px", // Padding for better clickability
          transition: "background-color 0.3s ease", // Smooth transition on hover
        }),
        singleValue: (base) => ({
          ...base,
          color: "#ffffff", // Make the selected value in the control box appear white
        }),
        input: (base) => ({
          ...base,
          color: "#ffffff", // White text color while typing
        }),
      }}
    />
  )}
/>
  {errors.location && <span className={styles.error}>{errors.location.message}</span>}
</div>

{/* Role Dropdown */}
<div>
  <label className={styles.label}>Role</label>
  <Controller
  control={control}
  name="role"
  rules={{ required: "Please select a role" }}
  render={({ field }) => (
<Select
  {...field}
  options={["Entrepreneur", "Mentor", "Investor"].map(role => ({ value: role, label: role }))}
  className="select" // Using the CSS class for styling
  styles={{
    control: (base) => ({
      ...base,
      backgroundColor: "transparent", // Transparent background for the control
      borderColor: "#777", // Light gray border similar to input
      color: "#333", // Dark text for readability
      borderWidth: "2px", // Same border width as input
      borderRadius: "8px", // Same border radius as input
      boxShadow: "none", // Remove default shadow
      padding: "8px 12px", // Padding for better clickable area
      textAlign: "left",
      fontSize: "18px",
      height: "45px",
      transition: "background-color 0.3s ease, border-color 0.3s ease", // Smooth transition on hover
      marginBottom: "20px", // Margin same as input box
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#f7f7f7", // Slightly darker background for the menu
      border: "1px solid #cccccc", // Light gray border to separate from page content
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Soft shadow for dropdown
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected
        ? "#06d0ac" // Green for selected
        : isFocused
        ? "#f0f0f0" // Light gray for hover
        : "#ffffff", // White for default
      color: isSelected ? "#ffffff" : "#333333", // White text for selected, black for other options
      padding: "10px", // Padding for better clickability
      fontSize: "16px", // Set font size for the options
      transition: "background-color 0.3s ease", // Smooth transition on hover
    }),
    singleValue: (base) => ({
      ...base,
      color: "#ffffff", // Make the selected value in the control box appear white
    }),
    input: (base) => ({
        ...base,
        color: "#ffffff", // White text color while typing
      }),
  }}
/>
  )}
/>
  {errors.role && <span className={styles.error}>{errors.role.message}</span>}
</div>

          {role && (role.value === "Mentor" || role.value === "Investor") && (
            <>
              <div>
                <label className={styles.label}>Expertise</label>
                <input {...register("expertise", { required: "Expertise is required" })} className={styles.input} placeholder="Enter your expertise" />
                {errors.expertise && <span className={styles.error}>{errors.expertise.message}</span>}
              </div>
              {role.value === "Mentor" && (
                <>
                  <div>
                    <label className={styles.label}>Past Mentorships</label>
                    <input {...register("past_mentorships", { required: "Past mentorships are required" })} className={styles.input} placeholder="Enter past mentorships" />
                    {errors.past_mentorships && <span className={styles.error}>{errors.past_mentorships.message}</span>}
                  </div>
                  <div>
                    <label className={styles.label}>Years of Experience</label>
                    <input {...register("years_of_experience", { required: "Years of experience is required" })} className={styles.input} type="number" placeholder="Enter years of experience" />
                    {errors.years_of_experience && <span className={styles.error}>{errors.years_of_experience.message}</span>}
                  </div>
                </>
              )}
              {role.value === "Investor" && (
                <>
                  <div>
                    <label className={styles.label}>Investment Range</label>
                    <input {...register("investment_range", { required: "Investment range is required" })} className={styles.input} placeholder="Enter investment range" />
                    {errors.investment_range && <span className={styles.error}>{errors.investment_range.message}</span>}
                  </div>
                </>
              )}
              <div>
                <label className={styles.label}>Verification Proof (PDF)</label>
                <input {...register("verification_proof", { required: "Verification proof is required" })} className={styles.input} type="file" accept="application/pdf" />
                {errors.verification_proof && <span className={styles.error}>{errors.verification_proof.message}</span>}
              </div>
            </>
          )}
          <div>
            <label className={styles.label}>Select Interests</label>
            <div className={styles.interestButtons}>
              {interests.map(topic => (
                <button key={topic} type="button" className={selectedInterests.includes(topic) ? styles.selected : styles.unselected} onClick={() => toggleInterest(topic)}>
                  {topic} {selectedInterests.includes(topic) ? "✓" : "+"}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>Submit</button>
        </form>
      )}
    </div>
  );
}