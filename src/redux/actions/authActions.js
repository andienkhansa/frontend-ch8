import Swal from "sweetalert2";
import {AUTH_ERROR, LOGIN, LOGOUT, REGISTER} from "./types";

export const loginViaForm = (data) => async (dispatch) => {
    try {
        const response = await fetch("http://localhost:8000/api/v1/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();

        const userInfo = JSON.parse(JSON.stringify(result.user));

        if (result.token) {
            dispatch({
                type: LOGIN,
                payload: result.token,
                user: userInfo,
            });
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Login Successful",
                showConfirmButton: false,
                timer: 1000,
            });
        } else {
            authError(result.error);
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Login Failed",
                showConfirmButton: false,
                timer: 1000,
            });
        }
    } catch (error) {
        authError(error);
        Swal.fire({
            position: "center",
            icon: "error",
            title: "Email or Password is incorrect",
            showConfirmButton: false,
            timer: 1000,
        });
    }
};

export const registerViaForm = (data) => async (dispatch) => {
    try {
        const response = await fetch("http://localhost:8000/api/v1/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        dispatch({
            type: REGISTER,
            payload: result.user,
        });

        Swal.fire({
            position: "center",
            icon: "success",
            title: "Registration Successful",
            showConfirmButton: false,
            timer: 1500,
        });
    } catch (error) {
        authError(error);
        Swal.fire({
            position: "center",
            icon: "error",
            title: "Registration Failed",
            showConfirmButton: false,
            timer: 1500,
        });
    }
};

const authError = (error) => async (dispatch) => {
    dispatch({
        type: AUTH_ERROR,
        payload: error.message,
    });

    setTimeout(() => {
        dispatch({
            type: AUTH_ERROR,
            payload: null,
        });
    }, 5000);
};

export const logout = () => async (dispatch) => {
    dispatch({
        type: LOGOUT,
    });
    Swal.fire({
        position: "center",
        icon: "info",
        title: "Logout Successful",
        showConfirmButton: false,
        timer: 1500,
    });
};

export const loginWithGoogle = (accessToken) => async (dispatch) => {
    try {
        const data = {
            access_token: accessToken,
        };
        const response = await fetch("http://localhost:8000/api/v1/auth/google", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();

        const userInfo = await fetch("http://localhost:8000/api/v1/auth/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${result.token}`,
            },
        });
        const user = JSON.parse(JSON.stringify(await userInfo.json()));

        if (result.token) {
            dispatch({
                type: LOGIN,
                payload: result.token,
                user: user,
            });
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Login Successful",
                showConfirmButton: false,
                timer: 1500,
            });
        } else {
            authError(result.error);
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Login Failed",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    } catch (error) {
        authError(error);
        Swal.fire({
            position: "center",
            icon: "error",
            title: "Login Failed",
            showConfirmButton: false,
            timer: 1500,
        });
    }
};

export const cekTokenExp = () => async (dispatch) => {
    try {
        const response = await fetch("http://localhost:8000/api/v1/auth/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const result = await response.json();
        const userInfo = JSON.parse(JSON.stringify(result.user));

        dispatch({
            type: LOGIN,
            payload: localStorage.getItem("token"),
            user: userInfo,
        });
    } catch (error) {
        dispatch({
            type: LOGOUT,
        });
        Swal.fire({
            position: "center",
            icon: "error",
            title: "Session Expired, Please Login Again",
            showConfirmButton: false,
            timer: 1500,
        });
    }
};
