import { useState } from "react";

const useForm = (handleSubmitCallback, validateCallback, initialValues) => {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({}); //for validtion errors
  const [success, setSuccess] = useState(false); //set to true if form was submitted successfully
  const [submitting, setSubmitting] = useState(false); //set to true when first submitting the form to disable the submit button
  //below is a function that creates a touched variable from hte initial values of a form, setting all fields to false (not touched)
  const setInitialTouched = form => {
    const touchedInitial = {};
    //if the initial values aren't populated than return an empty object.
    if (!form) return {};
    //create a new object using the keys of the form object setting alll values to false.
    Object.keys(form).forEach(value => {
      touchedInitial[value] = false;
    });
    return touchedInitial;
  };
  const [touched, setTouched] = useState(setInitialTouched());
  const validate = () => {
    let e = validateCallback(form);
    setErrors(e);
    return e;
  };
  const handleChange = e => {
    const { name, value } = e.target; //use destructuring ot get name/value from target for ease of use
    setForm(c => {
      return { ...c, [name]: value };
    });
  };
  const handleBlur = e => {
    const { name } = e.target;
    if (!touched[name]) {
      setTouched(c => {
        return { ...c, [name]: true };
      });
    }
    validate();
  };
  const handleSubmit = async e => {
    setSubmitting(true);
    //set all fields to touched
    const touchedTrue = {};
    Object.keys(form).forEach(value => {
      touchedTrue[value] = true;
    });
    setTouched(touchedTrue);
    e.preventDefault();
    const err = validate();

    if (Object.keys(err).length === 0) {
      //if there are no errors, set submitting=false and submit form.
      //I am setting submit to false before calling handleSubmitCallback because in my calling component I am performing a redirect with react-router and if I wait until
      //after I get a warning about trying to set state on an unmounted component.
      setSubmitting(false);
      console.log("no errors.");
      handleSubmitCallback(form);
      setSuccess(true);
    } else {
      setSubmitting(false);
      setSuccess(false);
    }
  };

  return {
    handleChange,
    handleBlur,
    handleSubmit,
    dispatch,
    form,
    errors,
    touched,
    submitting,
    success
  };
};
export default useForm;
