import axios from 'axios';
import React from 'react';

import Input from './Input'

export class UserSignupPage extends React.Component {

    state = {
        displayName: '',
        username: '',
        password: '',
        passwordRepeat: '',
        pendingApiCall: false,
        errors: {},
        passwordRepeatConfirmed: true
    }

    onChangeDisplayName = (event) => {
        const value = event.target.value
        const errors = {...this.state.errors}
        delete errors.displayName
        this.setState({ displayName: value, errors: errors })
    }

    onChangeUsername = (event) => {
        const value = event.target.value
        const errors = {...this.state.errors}
        delete errors.username
        this.setState({ username: value, errors: errors })
    }

    onChangePassword = (event) => {
        const value = event.target.value
        const errors =  {...this.state.errors}
        delete errors.password
        const passwordRepeatConfirmed = this.state.password === value
        errors.passwordRepeat = passwordRepeatConfirmed ? '' : 'Does not match to password'
        this.setState({ password: value, passwordRepeatConfirmed: passwordRepeatConfirmed, errors: errors})
    }

    onChangePasswordRepeat = (event) => {
        const value = event.target.value
        const errors =  {...this.state.errors}
        const passwordRepeatConfirmed = this.state.password === value
        errors.passwordRepeat = passwordRepeatConfirmed ? '' : 'Does not match to password'
        this.setState({ passwordRepeat: value, passwordRepeatConfirmed: passwordRepeatConfirmed, errors: errors})
    }

    onClickSignup = () => {
        const user = {
            displayName: this.state.displayName,
            username: this.state.username,
            password: this.state.password
        }
        this.setState({ pendingApiCall: true })
        this.props.actions.postSignup(user)
        .then((response) => {
            this.setState({ pendingApiCall: false })
        })
        .catch((apiErrors) => {
            let errors = {...this.state.errors}
            if(apiErrors.response.data && apiErrors.response.data.validationErrors) {
                errors = {...apiErrors.response.data.validationErrors}
            }
            this.setState({ pendingApiCall: false, errors: errors })
        })
    }

    render() {
        return (
            <div className='container'>
                <h1 className='text-center'>Sign Up</h1>
                <div className='col-12 mb-3'>
                    <Input 
                    label='Display Name' 
                    placeholder='Your display name' 
                    value={this.state.displayName}
                    onChange={this.onChangeDisplayName}
                    hasError={this.state.errors.displayName && true}
                    error={this.state.errors.displayName} />
                </div>
                
                <div className='col-12 mb-3'>
                <Input 
                    label='Username' 
                    placeholder='Your username' 
                    value={this.state.username}
                    onChange={this.onChangeUsername}
                    hasError={this.state.errors.username && true}
                    error={this.state.errors.username} />
                </div>
                <div className='col-12 mb-3'>
                    <Input 
                        label='Password' 
                        placeholder='Your password' 
                        value={this.state.password}
                        type='password'
                        onChange={this.onChangePassword}
                        hasError={this.state.errors.password && true}
                        error={this.state.errors.password} />
                </div>
                <div className='col-12 mb-3'>
                    <Input 
                        label='Repeat your password' 
                        placeholder='Repeat your password' 
                        value={ this.state.passwordRepeat }
                        type='password'
                        onChange={ this.onChangePasswordRepeat }
                        hasError={ this.state.errors.passwordRepeat && true }
                        error={ this.state.errors.passwordRepeat } />
                </div>
                <div className='text-center'>
                    <button
                        className='btn btn-primary'
                        onClick={this.onClickSignup}
                        disabled={this.state.pendingApiCall || !this.state.passwordRepeatConfirmed} >
                        {this.state.pendingApiCall && (
                            <div className="spinner-border text-light spinner-border-sm mr-1" >
                                <span className="sr-only">Loading...</span>
                            </div>
                        )}
                        Sign up
                    </button>
                </div>
            </div>
        )
    }
}

UserSignupPage.defaultProps = {
    actions: {
        postSignup: () => {
            return new Promise((resolve, reject) => {
                resolve({})
            })
        }
    }
}
export default UserSignupPage;