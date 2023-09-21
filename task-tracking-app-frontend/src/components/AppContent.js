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
        request(
            "POST",
            "/authenticate",
            {
                username: username,
                password: password
            }).then(
            (response) => {
                setAuthHeader(response.data.jwt);
                this.setState({componentToShow: "messages", error: null});
            }).catch(
            (error) => {
                setAuthHeader(null);
                this.setState({componentToShow: "login", error: "Invalid credentials"}); 
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
                this.setState({componentToShow: "login"});
            }).catch(
            (error) => {
                setAuthHeader(null);
                this.setState({componentToShow: "login", error: "Unable to register. Please try again and fill with valid email, username, and password"})
            }
        );
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
        {this.state.error && <div className="error-message">{this.state.error}</div>}
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