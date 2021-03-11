import {useEffect }  from 'react'
import axios from "axios";
import * as myConstClass from '../../constants';
const api_url = myConstClass.api_url;

const Client = ({match}) => {
  useEffect(()=>{
    axios.get(`${api_url}api.php?type=deleteUser&id=`+match.params.id)
    .then(() => { 
        window.open("#/users","_self");
    }).catch(err => {
        console.log('Error: ', err);
    })
    },[match.params.id])


  return null;
}

export default Client
