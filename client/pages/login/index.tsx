import React, { SyntheticEvent, useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import styles from "./login.module.css";
import { authAPI } from "@/api/auth";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
export default function login() {
  const { setUser } = useAuthStore();
  const router = useRouter();
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const res = await authAPI.signIn({
        email: values.email,
        password: values.password,
      });
      setUser(res.user);
      router.push("/home");
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateAccount = (e: SyntheticEvent) => {
    e.preventDefault();
    router.push("/signup");
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginFormContainer}>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={LoginSchema}
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

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>

              {/* <p className={styles.text}>No account?</p> */}
              <button
                disabled={isSubmitting}
                className={styles.signUpButton}
                onClick={handleCreateAccount}
                type="button"
              >
                Create account
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}