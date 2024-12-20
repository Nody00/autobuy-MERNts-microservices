import styles from "./newListing.module.css";
import Layout from "@/components/Layout/Layout";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
export default function NewListing() {
  return (
    <Layout>
      <div className={styles.container}>
        <p className={styles.title}>Add a new listing</p>

        {/* <Formik initialValues={{}}></Formik> */}
      </div>
    </Layout>
  );
}
