import Swal from "sweetalert2";
import {GET_ALL_CARS, CARS_ERROR} from "./types";

export const getAllCars = (params) => async (dispatch) => {
    try {
        const {tanggal, jam, penumpang} = params;
        const response = await fetch(
            "http://localhost:8000/api/v1/cars?" +
                new URLSearchParams({
                    time: tanggal,
                    date: jam,
                    passenger: penumpang,
                })
        );
        const data = await response.json();

        dispatch({
            type: GET_ALL_CARS,
            payload: data,
        });

        data.data.length === 0
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
                  title: data.data.length + " Cars available",
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
            title: "Something went wrong",
            showConfirmButton: false,
            timer: 1500,
        });
    }
};
