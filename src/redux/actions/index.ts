import {GET_TOKEN,SET_TOKEN, API_ERROR} from './types'
import { Dispatch } from 'redux';
import axios from 'axios'
const BASE_URL = "https://blinddate.darksea.ir/"
export const registerAndGetCode = () => async (dispatch: Dispatch) => {
    
    try{
        // const res = await axios.post(`${BASE_URL}api/authorize/register`)
        const res = await axios.get(`http://jsonplaceholder.typicode.com/users`)
        dispatch( {
            type: SET_TOKEN,
            payload: res.data
        })
    }
    catch(e){
        dispatch( {
            type: API_ERROR,
            payload: console.log(e),
        })
    }

}