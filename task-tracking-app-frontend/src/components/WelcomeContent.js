import * as React from 'react';

export default class WelcomeContent extends React.Component{
    render(){
        return(
            <div className="row justify-content-md-center">
                <div className='jumbotron jumbotron-fluid'> 
                    <div className='container'>
                    <h1 className='display-4'>Welcome to Timeado</h1>
                    <p className='lead'>Simplify your task management and boost your focus. </p>
                    <p>Trust the process. Trust Timeado.</p>
                    </div>
                </div>
            </div>
        );
    };
}