import React from 'react';
import { render, fireEvent, waitForElementToBeRemoved, waitFor, queryByText} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import { UserSignupPage } from './UserSignupPage'

describe('UserSignupPage', () => {
    describe('Layout', () => {
        it('has header of Sign Up', () => {
            const { container } = render(<UserSignupPage />)
            const header = container.querySelector('h1')
            expect(header).toHaveTextContent('Sign Up');
        });
        it('has input for display name', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />)
            const displayNameInput = queryByPlaceholderText('Your display name')
            expect(displayNameInput).toBeInTheDocument()
        });
        it('has input for username', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />)
            const usernameInput = queryByPlaceholderText('Your username')
            expect(usernameInput).toBeInTheDocument()
        });
        it('has input for password', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />)
            const passwordInput = queryByPlaceholderText('Your password')
            expect(passwordInput).toBeInTheDocument()
        });
        it('has password type for input for password', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />)
            const passwordInput = queryByPlaceholderText('Your password')
            expect(passwordInput.type).toBe('password')
        });
        it('has input for password repeat', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />)
            const passwordRepeatInput = queryByPlaceholderText('Repeat your password')
            expect(passwordRepeatInput).toBeInTheDocument()
        });
        it('has password type for input for password repeat', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />)
            const passwordRepeatInput = queryByPlaceholderText('Repeat your password')
            expect(passwordRepeatInput.type).toBe('password')
        });
        it('has submit button', () => {
            const { container } = render(<UserSignupPage />)
            const submitButton = container.querySelector('button')
            expect(submitButton).toBeInTheDocument()
        });
    }),
    describe('Interactions', () => {
        const changeEvent = (content) => {
            return {
                target: {
                    value: content
                }
            }
        }

        let button, displayNameInput, usernameInput, passwordInput, passwordRepeatInput
        const setupForSubmit = (props) => {
            const rendered = render(<UserSignupPage {...props} />)
            const { container, queryByPlaceholderText } = rendered
            displayNameInput = queryByPlaceholderText('Your display name')
            usernameInput = queryByPlaceholderText('Your username')
            passwordInput = queryByPlaceholderText('Your password')
            passwordRepeatInput = queryByPlaceholderText('Repeat your password')
            fireEvent.change(displayNameInput, changeEvent('display-name'))
            fireEvent.change(usernameInput, changeEvent('username'))
            fireEvent.change(passwordInput, changeEvent('password'))
            fireEvent.change(passwordRepeatInput, changeEvent('password'))
            button = container.querySelector('button')
            return rendered
        }

        const mockAsyncDelayedSuccess = () => {
            return jest.fn().mockImplementation(() => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve({})
                    }, 300)
                })
            })
        }

        const mockAsyncDelayedNotSuccess = () => {
            return jest.fn().mockImplementation(() => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        reject({
                            response: {
                                date: {}
                            }
                        })
                    }, 300)
                })
            })
        }

        it('set the display name into a state', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />)
            const displayNameInput = queryByPlaceholderText('Your display name')
            fireEvent.change(displayNameInput, changeEvent('display-name'))
            expect(displayNameInput).toHaveValue('display-name')
        }),
        it('set the username into a state', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />)
            const usernameInput = queryByPlaceholderText('Your username')
            fireEvent.change(usernameInput, changeEvent('username'))
            expect(usernameInput).toHaveValue('username')
        }),
        it('set the password into a state', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />)
            const passwordInput = queryByPlaceholderText('Your password')
            fireEvent.change(passwordInput, changeEvent('password'))
            expect(passwordInput).toHaveValue('password')
        }),
        it('set the repeat password into a state', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />)
            const passwordRepeatInput = queryByPlaceholderText('Repeat your password')
            fireEvent.change(passwordRepeatInput, changeEvent('password-repeat'))
            expect(passwordRepeatInput).toHaveValue('password-repeat')
        }),
        it('calls postSignup when the fields are valid and the actions are provided in props', () => {
            const actions = {
                postSignup: jest.fn().mockResolvedValueOnce({})
            }
            setupForSubmit({ actions })
            fireEvent.click(button)
            expect(actions.postSignup).toHaveBeenCalledTimes(1)
        }),
        it('does not throw an exception when clicking signup button when actions not provided in props', () => {
            setupForSubmit()
            expect(() => fireEvent.click(button)).not.toThrow()
        }),
        it('calls post with user body when the fields are valid', () => {
            const actions = {
                postSignup: jest.fn().mockResolvedValueOnce({})
            }
            setupForSubmit({ actions })
            fireEvent.click(button)
            const expectedUserObject = {
                displayName: 'display-name',
                username: 'username',
                password: 'password'
            }
            expect(actions.postSignup).toHaveBeenCalledWith(expectedUserObject)
        }),
        it('does not allow user to click the SignUp button when there is an ongoing api call', () => {
            const actions = {
                postSignup: mockAsyncDelayedSuccess()
            }
            setupForSubmit({ actions })
            fireEvent.click(button)
            fireEvent.click(button)
            expect(actions.postSignup).toHaveBeenCalledTimes(1)
        }),
        it('displays a spinner when there is an ongoing api call', () => {
            const actions = {
                postSignup: mockAsyncDelayedSuccess()
            }
            const { queryByText } = setupForSubmit({ actions })
            fireEvent.click(button)
            const spinner = queryByText('Loading...')
            expect(spinner).toBeInTheDocument()
        }),
        it('hide spinner when api call is finished successfully', async () => {
            const actions = {
                postSignup: mockAsyncDelayedSuccess()
            };
            const { queryByText } = setupForSubmit({ actions });
            fireEvent.click(button);
            await waitForElementToBeRemoved(() => queryByText('Loading...'))
            const spinner = queryByText('Loading...');
            expect(spinner).not.toBeInTheDocument();
        }),
        it('hide spinner when api call is finished unsuccessfully', async () => {
            const actions = {
                postSignup: mockAsyncDelayedNotSuccess()
            };
            const { queryByText } = setupForSubmit({ actions });
            fireEvent.click(button);
            await waitForElementToBeRemoved(() => queryByText('Loading...'))
            const spinner = queryByText('Loading...');
            expect(spinner).not.toBeInTheDocument();
        }),
        it('displays error for display name when error is received for the field', async () => {
            const actions = {
                postSignup: jest.fn().mockRejectedValue({
                    response: {
                        data: {
                            validationErrors: {
                                displayName: 'Display name cannot be null'
                            }
                        }
                    }
                })
            }
            const { queryByText } = setupForSubmit({ actions });
            fireEvent.click(button);
            await waitFor(() => {
                expect(queryByText('Display name cannot be null')).toBeInTheDocument();
            })    
        })
        it('enables signup button when password repeat is equal to password', async () => {
            setupForSubmit()
            expect(button).not.toBeDisabled()
        }),
        it('disables signup button when password repeat is not equal to password', async () => {
            setupForSubmit()
            fireEvent.change(passwordRepeatInput,changeEvent('abcde'))
            expect(button).toBeDisabled()
        }),
        it('disables signup button when password is not equal to passwordRepeat', async () => {
            setupForSubmit()
            fireEvent.change(passwordInput,changeEvent('abcde'))
            expect(button).toBeDisabled()
        }),
        it('displays error message when password is not equal to passwordRepeat', async () => {
            const { queryByText } = setupForSubmit()
            fireEvent.change(passwordRepeatInput,changeEvent('abcde'))
            expect(queryByText('Does not match to password')).toBeInTheDocument()
        }),
        it('displays error message when password repeat is not equal to password', async () => {
            const { queryByText } = setupForSubmit()
            fireEvent.change(passwordInput,changeEvent('abcde'))
            expect(queryByText('Does not match to password')).toBeInTheDocument()
        }),
        it('hide validation errors when user change content of display name', async () => {
            const actions = {
                postSignup: jest.fn().mockRejectedValue({
                    response: {
                        data: {
                            validationErrors: {
                                displayName: 'Display name cannot be null'
                            }
                        }
                    }
                })
            }
            const { queryByText } = setupForSubmit({ actions });
            fireEvent.click(button)
            fireEvent.change(displayNameInput,changeEvent('abcde'))
            await waitFor(() => {
                expect(queryByText('Display name cannot be null')).not.toBeInTheDocument()
            })    
        })
    })
})

console.error = () => {}