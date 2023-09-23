import * as React from 'react';


import { request, setAuthHeader } from '../axios_helper';

import Buttons from './Buttons';
import LoginForm from './LoginForm';

import WelcomeContent from './WelcomeContent';


import TaskForm from './TaskForm';
import TaskList from './TaskList';
import Pomodoro from './Pomodoro';

export default class AppContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            componentToShow: "welcome",
            tasks: [],
            error: null
        }
    };

    login = () => {
        this.setState({componentToShow: "login"})
    };

    logout = () => {
        this.setState({componentToShow: "welcome", error: null})
        setAuthHeader(null);
    
    };

    onLogin = (e, username, password) => {
        e.preventDefault();
        return new Promise((resolve, reject) => {
          request("POST", "/authenticate", {
            username: username,
            password: password,
          })
            .then((response) => {
              setAuthHeader(response.data.jwt);
              this.setState({ componentToShow: "messages"}); // Update the state here
              resolve();
            })
            .catch((error) => {
              setAuthHeader(null);
              this.setState({ componentToShow: "login" }); // Update the state for login failure
              reject(error);
            });
        });
      };

    onRegister = (event, email, username, password) => {
        event.preventDefault();

      
        return new Promise((resolve, reject) => {
          request("POST", "/user", {
            email: email,
            username: username,
            password: password,
            enabled: 1,
            role: "ROLE_USER",
          })
            .then((response) => {
              setAuthHeader(response.data.jwt);
              resolve(); // Resolve the promise when registration is successful
            })
            .catch((error) => {
              setAuthHeader(null);
              reject(error); // Reject the promise when registration fails
            });
        });
      };


    onTaskCreated = (newTask) => {
        // Update the state with the new task
        this.setState((prevState) => ({
          tasks: [...prevState.tasks, newTask],
        }));
      };

  render() {
    return (
      <>
        <Buttons
          login={this.login}
          logout={this.logout}
        />

        {this.state.componentToShow === "welcome" && <WelcomeContent /> }
        {this.state.error && <div className="messages">{this.state.error}</div>}
        {this.state.componentToShow === "login" && <LoginForm onLogin={this.onLogin} onRegister={this.onRegister} />}

        <div className='user-content-container'>
            <div>
            {this.state.componentToShow === 'messages' && (
            <TaskForm onTaskCreated={this.onTaskCreated} />
            )}
            </div>
            <div>
            {this.state.componentToShow === "messages" && <TaskList />}
            </div>
            <div>
            {this.state.componentToShow === "messages" && <Pomodoro />}
            </div>
        </div>

      </>
    );
  };
}