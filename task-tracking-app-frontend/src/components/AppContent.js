import * as React from 'react';


import { request, setAuthHeader } from '../axios_helper';

import Buttons from './Buttons';
import AuthContent from './AuthContent';
import LoginForm from './LoginForm';
import WelcomeContent from './WelcomeContent'
import TaskForm from './TaskForm';
//import Login from './Login';
export default class AppContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            componentToShow: "welcome"
        }
    };

    login = () => {
        this.setState({componentToShow: "login"})
    };

    logout = () => {
        this.setState({componentToShow: "welcome"})
        setAuthHeader(null);
    };

    onLogin = (e, username, password) => {
        e.preventDefault();
        request(
            "POST",
            "/authenticate",
            {
                username: username,
                password: password
            }).then(
            (response) => {
                setAuthHeader(response.data.jwt);
                this.setState({componentToShow: "messages"});
            }).catch(
            (error) => {
                setAuthHeader(null);
                this.setState({componentToShow: "welcome"})
            }
        );
    };

    onRegister = (event, email, username, password) => {
        event.preventDefault();
        request(
            "POST",
            "/user",
            {
                email: email,
                username: username,
                password: password,
                enabled: 1,
                role: "ROLE_USER"
            }).then(
            (response) => {
                setAuthHeader(response.data.jwt);
                this.setState({componentToShow: "messages"});
            }).catch(
            (error) => {
                setAuthHeader(null);
                this.setState({componentToShow: "welcome"})
            }
        );
    };

  render() {
    return (
      <>
        <Buttons
          login={this.login}
          logout={this.logout}
        />

        {this.state.componentToShow === "welcome" && <WelcomeContent /> }
        {this.state.componentToShow === "login" && <LoginForm onLogin={this.onLogin} onRegister={this.onRegister} />}
        {this.state.componentToShow === "messages" && <AuthContent />}
        {this.state.componentToShow === "messages" && <TaskForm />}


      </>
    );
  };
}