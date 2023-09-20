import React, { Component } from 'react';
import '../pomodoro.css'; // Import the CSS file

class Pomodoro extends Component {
    constructor(props) {
        super(props);
        this.state = {
          workTime: 25 * 60,      // Initial work time in seconds (25 minutes)
          breakTime: 5 * 60,      // Initial break time in seconds (5 minutes)
          intervals: 4,           // Initial number of intervals (sessions)
          currentInterval: 1,     // Current interval in the session
          isWorking: true,        // Indicates whether it's work time or break time
          isRunning: false,
          time: 25 * 60,          // Initial time in seconds
          showMessage: false,     // Flag to display the finished message
        };
      }
    
      // Function to start or stop the timer
      toggleTimer = () => {
        this.setState((prevState) => ({
          isRunning: !prevState.isRunning,
        }), () => {
          if (this.state.isRunning) {
            this.timerInterval = setInterval(this.tick, 1000);
          } else {
            clearInterval(this.timerInterval);
          }
        });
      };
    
      // Function to update the timer every second
      tick = () => {
        if (this.state.time > 0) {
          this.setState((prevState) => ({
            time: prevState.time - 1,
          }));
        } else {
          // Timer has reached 0, switch between work and break times
          this.switchTimer();
        }
      };
    
      // Function to switch between work and break times
      switchTimer = () => {
        const { isWorking, currentInterval, intervals } = this.state;
    
        if (isWorking) {
          if (currentInterval < intervals) {
            this.setState({
              isWorking: false,
              time: this.state.breakTime,
              currentInterval: currentInterval + 1,
            });
          } else {
            // All intervals are completed, show finished message
            this.setState({
              isRunning: false,
              showMessage: true,
            });
            clearInterval(this.timerInterval);
          }
        } else {
          this.setState({
            isWorking: true,
            time: this.state.workTime,
          });
        }
      };
    
      // Function to reset the session and start a new one
      startNewSession = () => {
        this.setState({
          isWorking: true,
          time: this.state.workTime,
          currentInterval: 1,
          showMessage: false,
        });
      };
    
      // Function to reset the timer
      resetTimer = () => {
        clearInterval(this.timerInterval);
        this.setState({
          workTime: 25 * 60,
          breakTime: 5 * 60,
          intervals: 4,
          currentInterval: 1,
          isWorking: true,
          isRunning: false,
          time: 25 * 60,
          showMessage: false,
        });
      };
    
      // Function to update work time
      updateWorkTime = (minutes) => {
        this.setState({
          workTime: minutes * 60,
          time: this.state.isWorking ? minutes * 60 : this.state.time,
        });
      };
    
      // Function to update break time
      updateBreakTime = (minutes) => {
        this.setState({
          breakTime: minutes * 60,
          time: !this.state.isWorking ? minutes * 60 : this.state.time,
        });
      };
    
      // Function to update the number of intervals
      updateIntervals = (count) => {
        this.setState({
          intervals: count,
        });
      };
    
      render() {
        const {
          isWorking,
          time,
          isRunning,
          workTime,
          breakTime,
          intervals,
          currentInterval,
          showMessage,
        } = this.state;
        const timerType = isWorking ? 'Work' : 'Break';
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        const timerDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
        return (
          <div className="custom-pomodoro-timer">
            <h1>Custom Pomodoro Timer</h1>
            {showMessage ? (
              <>
                <div className="finished-message">All sessions completed!</div>
                <button onClick={this.startNewSession}>Start New Session</button>
              </>
            ) : (
              <>
                <h2>{timerType} Time</h2>
                <div className="timer-display">{timerDisplay}</div>
                <button onClick={this.toggleTimer}>
                  {isRunning ? 'Pause' : 'Start'}
                </button>
                <button onClick={this.resetTimer}>Reset</button>
                <div>
                  <label>Work Time (minutes):</label>
                  <input type="number" value={workTime / 60} onChange={(e) => this.updateWorkTime(e.target.value)} />
                </div>
                <div>
                  <label>Break Time (minutes):</label>
                  <input type="number" value={breakTime / 60} onChange={(e) => this.updateBreakTime(e.target.value)} />
                </div>
                <div>
                  <label>Intervals:</label>
                  <input type="number" value={intervals} onChange={(e) => this.updateIntervals(e.target.value)} />
                </div>
                <p>Interval: {currentInterval}/{intervals}</p>
              </>
            )}
          </div>
        );
      }
    }
    
export default Pomodoro;
