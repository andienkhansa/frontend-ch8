import Swal from "sweetalert2";
import {GET_ALL_CARS, CARS_ERROR} from "./types";

const {REACT_APP_API_FILTER_CAR} = process.env;

export const getAllCars = (params) => async (dispatch) => {
    try {
        const {tanggal, jam, penumpang} = params;
        const response = await fetch(
            REACT_APP_API_FILTER_CAR +
                new URLSearchParams({
                    time: tanggal,
                    date: jam,
                    passenger: penumpang,
                }),
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        console.log("response", response);
        const data = await response.json();
        dispatch({
            type: GET_ALL_CARS,
            payload: data,
        });

        data.meta.count === 0
            ? Swal.fire({
                  position: "center",
                  icon: "error",
                  title: "No cars available",
                  showConfirmButton: false,
                  timer: 1500,
              })
            : Swal.fire({
                  position: "center",
                  icon: "success",
                  title: data.meta.count + " Cars available",
                  showConfirmButton: false,
                  timer: 1500,
              });
    } catch (error) {
        dispatch({
            type: CARS_ERROR,
            payload: error.response,
        });
        Swal.fire({
            position: "center",
            icon: "error",
            title: error.message,
            showConfirmButton: false,
            timer: 1500,
        });
    }
};
