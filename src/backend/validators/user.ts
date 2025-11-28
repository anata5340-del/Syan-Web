import * as yup from "yup";

const userSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email().required("Email is required"),
  password: yup.string().required("Password is required"),
  phone: yup.string().required("Phone is required"),
  cnic: yup.string().required("CNIC is required"),
  cnicFront: yup.string(),
  cnicBack: yup.string(),
  jobStatus: yup.string(),
  jobLocation: yup.string(),
  yearOfGraduation: yup.string(),
  institute: yup.string(),
  address: yup.string(),
  city: yup.string(),
  country: yup.string(),
  image: yup.string(),
  active: yup.boolean(),
  packages: yup.array().of(
    yup.object().shape({
      package: yup.string().required("Package is required"),
      startDate: yup.string().required("Start date is required"),
      endDate: yup.string().required("End date is required"),
      active: yup.boolean().required("Active is required"),
    })
  ),
});

const addUserPackageSchema = yup.object().shape({
  packages: yup.array().of(
    yup.object().shape({
      package: yup.string().required("Package is required"),
      startDate: yup.string().required("Start date is required"),
      endDate: yup.string().required("End date is required"),
      active: yup.boolean().required("Active is required"),
    })
  ),
});

export const createUserValidator = (data: unknown) =>
  yup
    .object()
    .shape({
      user: userSchema,
    })
    .validate(data);

export const updateUserValidator = (data: unknown) =>
  yup
    .object()
    .shape({
      // id: yup.string().required("Id is required"),
      user: userSchema,
    })
    .validate(data);

export const addUserPackageValidator = (data: unknown) =>
  yup
    .object()
    .shape({
      // id: yup.string().required("Id is required"),
      user: addUserPackageSchema,
    })
    .validate(data);
