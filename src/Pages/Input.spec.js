import React from 'react';
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import Input from './Input'

describe('Layout', () => {
    it('has input item', () => {
        const { container } = render(<Input />)
        const input = container.querySelector('input')
        expect(input).toBeInTheDocument()
    }),
    it('displays the label provided in props', () => {
        const { queryByText } = render(<Input label='test-label' />)
        const label = queryByText('test-label')
        expect(label).toBeInTheDocument()
    }),
    it('does not displays the label when the label is not provided in props', () => {
        const { container } = render(<Input />)
        const label = container.querySelector('label')
        expect(label).not.toBeInTheDocument()
    }),
    it('has text type for input when type is not provided in props', () => {
        const { container } = render(<Input />)
        const input = container.querySelector('input')
        expect(input.type).toBe('text')
    }), 
    it('has password type for input when password type is provided in props', () => {
        const { container } = render(<Input type='password' />)
        const input = container.querySelector('input')
        expect(input.type).toBe('password')
    }),
    it('has placeholder when it is provided in props', () => {
        const { queryByPlaceholderText } = render(<Input placeholder='test-display-name' />)
        const input = queryByPlaceholderText('test-display-name')
        expect(input.placeholder).toBe('test-display-name')
    }),
    it('doesn\'t have placeholder when it is not provided in props', () => {
        const { container } = render(<Input />)
        const input = container.querySelector('input')
        expect(input.placeholder).toBe('')
    }), 
    it('has value when it is provided in props', () => {
        const { container } = render(<Input value='test-value'/>)
        const input = container.querySelector('input')
        expect(input.value).toBe('test-value')
    }),
    it('has onChange callback when it is provided in props', () => {
        const onChange = jest.fn()
        const { container } = render(<Input onChange={onChange}/>)
        const input = container.querySelector('input')
        fireEvent.change(input, { target: { value: 'new-input' } })
        expect(onChange).toHaveBeenCalledTimes(1)
    }),
    it('has default style when this is no validation error or success', () => {
        const { container } = render(<Input />)
        const input = container.querySelector('input')
        expect(input.className).toBe('form-control')
    }), 
    it('has success style when hasError property is false', () => {
        const { container } = render(<Input hasError={false} />)
        const input = container.querySelector('input')
        expect(input.className).toBe('form-control is-valid')
    }),
    it('has error style when hasError property is true', () => {
        const { container } = render(<Input hasError={true} />)
        const input = container.querySelector('input')
        expect(input.className).toBe('form-control is-invalid')
    }),
    it('displays the error text when it is provided', () => {
        const { queryByText } = render(<Input hasError={true} error='error-text' />)
        expect(queryByText('error-text')).toBeInTheDocument();
    }),
    it('does not display error text when hasErorr is not provided', () => {
        const { queryByText } = render(<Input error='error-text' />)
        expect(queryByText('error-text')).not.toBeInTheDocument();
    })
})

