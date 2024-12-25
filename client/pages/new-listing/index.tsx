import { listingAPI } from "@/api/listings";
import styles from "./newListing.module.css";
import Layout from "@/components/Layout/Layout";
import { CATEGORIES } from "@/helpers/categories";
import { Formik, Form, Field } from "formik";
import { ChangeEvent, useState } from "react";
import * as Yup from "yup";
import { json } from "stream/consumers";
import { useRouter } from "next/router";

const ListingSchema = Yup.object().shape({
  manufacturer: Yup.string()
    .max(20, "Manufacturer name must not exceed 20 characters")
    .required("Required"),
  model: Yup.string()
    .max(20, "Model name must not exceed 20 characters")
    .required("Required"),
  yearOfProduction: Yup.number()
    .min(1900, "Year of production must be a valid value")
    .required("Required"),
  mileage: Yup.number()
    .min(0, "Mileage must be positive")
    .integer("Must be a whole number")
    .required("Required"),
  firstYearOfRegistration: Yup.number()
    .min(1900, "Must be after 1900")
    .max(new Date().getFullYear(), `Must be before ${new Date().getFullYear()}`)
    .required("First year of registration is required"),
  description: Yup.string().max(
    500,
    "Description cannot exceed 500 characters"
  ),
  price: Yup.number()
    .min(1, "Price must be positive")
    .integer("Must be a whole number")
    .required("Price is required"),
  endBiddingAt: Yup.date()
    .min(new Date(), "End date must be in the future")
    .required("End bidding date is required"),
  category: Yup.number()
    .oneOf(Object.values(CATEGORIES), "Invalid category")
    .required("Category is required"),
});

interface submitValues {
  manufacturer: string;
  model: string;
  yearOfProduction: string;
  mileage: string;
  firstYearOfRegistration: string;
  description: string;
  price: string;
  endBiddingAt: string;
  category: string;
}

export default function NewListing() {
  const [images, setImages] = useState<File[]>([]);
  const router = useRouter();

  const handleSubmit = async (values: submitValues) => {
    try {
      const payload = new FormData();

      payload.append("manufacturer", values.manufacturer);
      payload.append("model", values.model);
      payload.append("yearOfProduction", values.yearOfProduction);
      payload.append("mileage", values.mileage);
      payload.append("firstYearOfRegistration", values.firstYearOfRegistration);
      payload.append("description", values.description);
      payload.append("price", values.price);
      payload.append("endBiddingAt", values.endBiddingAt);
      payload.append("category", values.category);

      images.forEach((el) => {
        payload.append("images", el);
      });

      for (const [key, value] of payload.entries()) {
        console.log(key, value);
      }
      const result = await listingAPI.create(payload);

      router.push("/listings");
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  const handleSelectImages = (e: ChangeEvent<HTMLInputElement>) => {
    const MAX_IMAGE_SIZE = 20 * 1024 * 1024;
    const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];
    const files = e.target.files;
    const validFiles: File[] = [];
    if (!files || files.length < 1) {
      alert("Please select at least one image.");
      return;
    }

    if (files.length > 5) {
      alert("A maximum of 5 images can be selected!");
      return;
    }

    for (const file of files) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        return;
      }
      validFiles.push(file);
    }

    setImages(validFiles);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <p className={styles.title}>Add a new listing</p>

        <Formik
          initialValues={{
            manufacturer: "",
            model: "",
            yearOfProduction: "",
            mileage: "",
            firstYearOfRegistration: "",
            description: "",
            price: "",
            endBiddingAt: "",
            category: "1",
            images: "",
          }}
          validationSchema={ListingSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="manufacturer" className={styles.label}>
                  Manufacturer
                </label>

                <Field
                  id="manufacturer"
                  name="manufacturer"
                  type="text"
                  className={styles.input}
                ></Field>
                {errors.manufacturer && touched.manufacturer && (
                  <div className={styles.error}>{errors.manufacturer}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="model" className={styles.label}>
                  Model
                </label>

                <Field
                  id="model"
                  name="model"
                  type="text"
                  className={styles.input}
                ></Field>
                {errors.model && touched.model && (
                  <div className={styles.error}>{errors.model}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="yearOfProduction" className={styles.label}>
                  Year of production
                </label>

                <Field
                  id="yearOfProduction"
                  name="yearOfProduction"
                  type="numeric"
                  className={styles.input}
                ></Field>
                {errors.yearOfProduction && touched.yearOfProduction && (
                  <div className={styles.error}>{errors.yearOfProduction}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="mileage" className={styles.label}>
                  Mileage
                </label>

                <Field
                  id="mileage"
                  name="mileage"
                  type="numeric"
                  className={styles.input}
                ></Field>
                {errors.mileage && touched.mileage && (
                  <div className={styles.error}>{errors.mileage}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label
                  htmlFor="firstYearOfRegistration"
                  className={styles.label}
                >
                  First year of registration
                </label>

                <Field
                  id="firstYearOfRegistration"
                  name="firstYearOfRegistration"
                  type="numeric"
                  className={styles.input}
                ></Field>
                {errors.firstYearOfRegistration &&
                  touched.firstYearOfRegistration && (
                    <div className={styles.error}>
                      {errors.firstYearOfRegistration}
                    </div>
                  )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>
                  Description
                </label>

                <Field
                  id="description"
                  name="description"
                  type="text"
                  className={styles.input}
                ></Field>
                {errors.description && touched.description && (
                  <div className={styles.error}>{errors.description}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="price" className={styles.label}>
                  Price
                </label>

                <Field
                  id="price"
                  name="price"
                  type="numeric"
                  className={styles.input}
                ></Field>
                {errors.price && touched.price && (
                  <div className={styles.error}>{errors.price}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="endBiddingAt" className={styles.label}>
                  End bidding at
                </label>

                <Field
                  id="endBiddingAt"
                  name="endBiddingAt"
                  type="date"
                  className={styles.input}
                ></Field>
                {errors.endBiddingAt && touched.endBiddingAt && (
                  <div className={styles.error}>{errors.endBiddingAt}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="category" className={styles.label}>
                  Category
                </label>

                <Field
                  id="category"
                  name="category"
                  type="select"
                  as="select"
                  className={styles.input}
                >
                  {Object.entries(CATEGORIES).map(([category, value]) => (
                    <option value={value} key={value}>
                      {category}
                    </option>
                  ))}
                </Field>
                {errors.category && touched.category && (
                  <div className={styles.error}>{errors.category}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="images" className={styles.label}>
                  Images
                </label>

                <Field
                  id="images"
                  name="images"
                  type="file"
                  accept="image/jpeg,image/png"
                  multiple
                  max={10}
                  className={styles.input}
                  onChange={handleSelectImages}
                ></Field>
                {errors.images && touched.images && (
                  <div className={styles.error}>{errors.images}</div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? "Creating listing..." : "Create Listing"}
              </button>

              <div className={styles.imageContainer}>
                {images
                  ? images.map((image, index) => {
                      return (
                        <img
                          src={URL.createObjectURL(image)}
                          className={styles.carImage}
                          key={index}
                        />
                      );
                    })
                  : ""}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
}
