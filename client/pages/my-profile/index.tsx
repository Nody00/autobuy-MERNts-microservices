import styles from "./myProfile.module.css";
import Layout from "@/components/Layout/Layout";
export default function MyProfile() {
  return (
    <Layout>
      <div className={styles.container}>my profile</div>
    </Layout>
  );
}
