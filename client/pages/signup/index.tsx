import React from "react";

import styles from "./signup.module.css";
import { useAuthStore } from "@/stores/authStore";
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { authAPI } from "@/api/auth";

interface submitValues {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}
export default function SignUp() {
  const router = useRouter();
  const SignUpSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Please confirm your password"),
    confirmPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),
    phoneNumber: Yup.string()
      .min(10, "Phone number must be at least 10 charaters")
      .required("Phone number is required"),
  });

  const handleSubmit = async (values: submitValues) => {
    try {
      const payload = { ...values, isAdmin: false };
      await authAPI.signUp(payload);
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.signUpFormContainer}>
        <Formik
          initialValues={{
            email: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
          }}
          validationSchema={SignUpSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting, values }) => (
            <Form className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email
                </label>

                <Field
                  id="email"
                  name="email"
                  type="email"
                  className={styles.input}
                ></Field>
                {errors.email && touched.email && (
                  <div className={styles.error}>{errors.email}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>

                <Field
                  id="password"
                  name="password"
                  type="password"
                  className={styles.input}
                ></Field>
                {errors.password && touched.password && (
                  <div className={styles.error}>{errors.password}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  Confirm Password
                </label>

                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className={styles.input}
                ></Field>
                {errors.confirmPassword && touched.confirmPassword && (
                  <div className={styles.error}>{errors.confirmPassword}</div>
                )}
              </div>

              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName" className={styles.label}>
                    First Name
                  </label>

                  <Field
                    id="firstName"
                    name="firstName"
                    type="text"
                    className={styles.input}
                  ></Field>
                  {errors.firstName && touched.firstName && (
                    <div className={styles.error}>{errors.firstName}</div>
                  )}
                </div>
                {/*  */}
                <div className={styles.formGroup}>
                  <label htmlFor="lastName" className={styles.label}>
                    Last Name
                  </label>

                  <Field
                    id="lastName"
                    name="lastName"
                    type="text"
                    className={styles.input}
                  ></Field>
                  {errors.lastName && touched.lastName && (
                    <div className={styles.error}>{errors.lastName}</div>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phoneNumber" className={styles.label}>
                  Phone Number
                </label>

                <Field
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  className={styles.input}
                ></Field>
                {errors.phoneNumber && touched.phoneNumber && (
                  <div className={styles.error}>{errors.phoneNumber}</div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? "Creating account..." : "Create Account"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
