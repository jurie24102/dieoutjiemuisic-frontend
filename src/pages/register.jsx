import { useRouter } from "next/router";
import { useState } from "react";
import { register } from "../services/api";
import styles from "../styles/Signup.module.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await register(username, password);
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    // <div>
    //   <h1>Register</h1>
    //   <form onSubmit={handleSubmit}>
    //     <input
    //       type="text"
    //       placeholder="Username"
    //       value={username}
    //       onChange={(e) => setUsername(e.target.value)}
    //     />
    //     <input
    //       type="password"
    //       placeholder="Password"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //     />
    //     <button type="submit">Register</button>
    //   </form>
    //   {error && <p style={{ color: "red" }}>{error}</p>}
    // </div>
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
      />

      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.title}>
            <h2>Sign Up</h2>
          </div>
          <div className={styles.formContainer}>
            <div className={styles.div}>
              <div className={styles.inputGroup}>
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  className={styles.inputField}
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              {/* <div className={styles.inputGroup}>
                <i className="fas fa-user"></i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  className={styles.inputField}
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div> */}
              <div className={styles.inputGroup}>
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  className={styles.inputField}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className={styles.buttonContainer}>
                <button type="submit" className={styles.submitButton}>
                  Sign In
                </button>
              </div>
            </div>
          </div>
          <div className={styles.additionalInfo}>
            Already have an account? <a href="/login">Sign In</a>
          </div>
        </form>
      </div>
    </>
  );
}
