import axios from "axios";
import { message } from 'antd'

export const userLogin = (reqObj) => async dispatch => {

    dispatch({ type: 'LOADING', payload: true })

    try {
        const response = await axios.post('/api/users/login', reqObj)
        localStorage.setItem('user', JSON.stringify(response.data))
        message.success('Login success')
        dispatch({ type: 'LOADING', payload: false })
        setTimeout(() => {
            window.location.href = '/'
        }, 500);
    } catch (error) {
        console.log(error)
        message.error('Incorrect email or password. Please try again.')
        dispatch({ type: 'LOADING', payload: false })
    }
}
// ////////////////////////////////////////////////////////////////

export const userRegister = (reqObj) => async dispatch => {

    dispatch({ type: 'LOADING', payload: true })

    let email_phone = true

    try {
        if (reqObj.password === reqObj.conPassword) {

            const response2 = await axios.get('/api/getAllUsers/getallusers')
            response2.data.map((arr) => {
                if (arr.email == reqObj.email || arr.phoneNumber == reqObj.phoneNumber) {    // email and phonenumber 
                    message.error('Email or phone already exist')
                    return email_phone = false
                }
            })

            if (email_phone == true) {
                const response = await axios.post('/api/users/register', reqObj)
                // console.log(response);
                message.success('Registration successfully')
                setTimeout(() => {
                    window.location.href = '/login'
                }, 500);
            }

        } else {
            message.error("password don't match with configPassword")
        }

        dispatch({ type: 'LOADING', payload: false })

    } catch (error) {
        console.log(error)
        message.error('Something went wrong')
        dispatch({ type: 'LOADING', payload: false })
    }
}