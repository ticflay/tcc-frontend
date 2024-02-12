import { toast } from "react-toastify"

export const handleError = (err: any) => {
    console.log('err', err.response.datawww)
    if(err.response.data.error){
        toast(err.response.data.error, {type: 'error'})
    }
}