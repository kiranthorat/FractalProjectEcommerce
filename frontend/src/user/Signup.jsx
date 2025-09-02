import React, { useState } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { signup } from "../auth";

const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: false,
  });

  const { name, email, password, error, success } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false });
    signup({ name, email, password })
      .then((data) => {
        console.log("DATA", data);
        if (data && data.email === email) {
          setValues({ 
            ...values, 
            name: "", 
            email: "", 
            password: "", 
            error: "", 
            success: true 
          });
        } else {
          setValues({ 
            ...values, 
            error: data?.error || "Something went wrong", 
            success: false 
          });
        }
      })
      .catch(err => {
        console.log(err);
        setValues({ 
          ...values, 
          error: "Network error. Please try again.", 
          success: false 
        });
      });
  };

  const successMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-md-3 text-start"> {/* Fixed: offset-sm-3 → offset-md-3 */}
          <div
            className="alert alert-success"
            style={{ display: success ? "" : "none" }}>
            New account created successfully. Please <Link to="/user/signin">login now</Link>!
          </div>
        </div>
      </div>
    );
  };

  const errorMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-md-3 text-start"> {/* Fixed: offset-sm-3 → offset-md-3 */}
          <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}>
            {error || "Check all fields again!"}
          </div>
        </div>
      </div>
    );
  };

  const signUpForm = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-md-3 text-start"> {/* Fixed: offset sm-3 → offset-md-3 */}
          <form>
            <div className="mb-3"> {/* Fixed: form-group → mb-3 for Bootstrap 5 */}
              <label className="form-label text-light">Name</label> {/* Fixed: Added form-label */}
              <input
                className="form-control"
                value={name}
                onChange={handleChange("name")}
                type="text"
                required
              />
            </div>
            <div className="mb-3"> {/* Fixed: form-group → mb-3 */}
              <label className="form-label text-light">Email</label> {/* Fixed: Added form-label */}
              <input
                className="form-control"
                value={email}
                onChange={handleChange("email")}
                type="email" 
                required
              />
            </div>
            <div className="mb-3"> {/* Fixed: form-group → mb-3 */}
              <label className="form-label text-light">Password</label> {/* Fixed: Added form-label */}
              <input
                className="form-control"
                value={password}
                onChange={handleChange("password")}
                type="password" 
                required
              />
            </div>
            <button
              onClick={onSubmit}
              className="btn btn-success w-100"> 
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <Base title="Sign Up Page" description="A signup for E-commerce user">
      {successMessage()}
      {errorMessage()}
      {signUpForm()}
    </Base>
  );
};

export default Signup;