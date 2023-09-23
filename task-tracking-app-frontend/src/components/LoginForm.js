import * as React from 'react';
import classNames from 'classnames';
import '../LoginForm.css';


export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: "login",
      email: "",
      username: "",
      password: "",
      message: "", // Combined success and error message
      onLogin: props.onLogin,
      onRegister: props.onRegister,
      success: false, // Track registration success
    };
  }

  setMessage(message, success) {
    this.setState({ message, success });
  }

  onChangeHandler = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({ [name]: value, message: "" }); // Clear the message when input changes
  };

  onSubmitLogin = (e) => {
    e.preventDefault();

    this.state
      .onLogin(e, this.state.username, this.state.password)
      .then(() => {
        this.setMessage("Login successful", true);
      })
        .catch(() => {
        this.setMessage("Invalid credentials", false);
      });
  };

  onSubmitRegister = (e) => {
    e.preventDefault();

    this.state
      .onRegister(e, this.state.email, this.state.username, this.state.password)
      .then(() => {
        // Registration was successful, set the success message
        this.setMessage("Registration successful. You can now sign in.", true);
      })
      .catch(() => {
        // Registration failed, set the error message
        this.setMessage("Unable to register. Please try again.", false);
      });
  };

  render() {
    return (
      <div className="row justify-content-center">
        <div className="col-4">
          <ul
            className="nav nav-pills nav-justified mb-3"
            id="ex1"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <button
                className={classNames(
                  "nav-link",
                  this.state.active === "login" ? "active" : ""
                )}
                id="tab-login"
                onClick={() => this.setState({ active: "login" })}
              >
                Login
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={classNames(
                  "nav-link",
                  this.state.active === "register" ? "active" : ""
                )}
                id="tab-register"
                onClick={() => this.setState({ active: "register" })}
              >
                Register
              </button>
            </li>
          </ul>

          <div className="tab-content">
            <div
              className={classNames(
                "tab-pane",
                "fade",
                this.state.active === "login" ? "show active" : ""
              )}
              id="pills-login"
            >
              <form onSubmit={this.onSubmitLogin}>
                <div className="form-outline mb-4">
                  <input
                    type="username"
                    id="loginName"
                    name="username"
                    className="form-control"
                    onChange={this.onChangeHandler}
                  />
                  <label className="form-label" htmlFor="loginName">
                    Username
                  </label>
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="password"
                    id="loginPassword"
                    name="password"
                    className="form-control"
                    onChange={this.onChangeHandler}
                  />
                  <label className="form-label" htmlFor="loginPassword">
                    Password
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block mb-4"
                >
                  Sign in
                </button>
                {this.state.message && (
                  <div
                    className={classNames("message", {
                      success: this.state.success,
                      error: !this.state.success,
                    })}
                  >
                    {this.state.message}
                  </div>
                )}
              </form>
            </div>
            <div
              className={classNames(
                "tab-pane",
                "fade",
                this.state.active === "register" ? "show active" : ""
              )}
              id="pills-register"
            >
              <form onSubmit={this.onSubmitRegister}>
                <div className="form-outline mb-4">
                  <input
                    type="text"
                    id="email"
                    name="email"
                    className="form-control"
                    onChange={this.onChangeHandler}
                  />
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="text"
                    id="login"
                    name="username"
                    className="form-control"
                    onChange={this.onChangeHandler}
                  />
                  <label className="form-label" htmlFor="username">
                    Username
                  </label>
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="password"
                    id="registerPassword"
                    name="password"
                    className="form-control"
                    onChange={this.onChangeHandler}
                  />
                  <label className="form-label" htmlFor="registerPassword">
                    Password
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block mb-3"
                >
                  {this.state.active === "login" ? "Sign In" : "Register"}
                </button>
                {this.state.message && (
                  <div
                    className={classNames("message", {
                      success: this.state.success,
                      error: !this.state.success,
                    })}
                  >
                    {this.state.message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

