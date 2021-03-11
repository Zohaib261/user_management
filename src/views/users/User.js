import React,{ useState,useEffect }  from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import axios from "axios";
import * as myConstClass from '../../constants';
const api_url = myConstClass.api_url;

const User = ({match}) => {
  const [userDa, setUserDa] = useState([])
  useEffect(()=>{
      console.log(match.params.id);
    axios.get(`${api_url}api.php?type=singleuserData&id=`+match.params.id)
    .then((response) => { 
        const userddData = response.data;
        setUserDa(userddData[0]);
    }).catch(err => {
        console.log('Error: ', err);
    })
    },[match.params.id])
  const userDetails = userDa ? Object.entries(userDa) : 
    [['id', (<span><CIcon className="text-muted" name="cui-icon-ban" /> Not found</span>)]]

  return (
    <CRow>
      <CCol lg={12}>
        <CCard>
          <CCardHeader>
            User id: {match.params.id}
          </CCardHeader>
          <CCardBody>
              <table className="table table-striped table-hover">
                <tbody>
                  {
                    userDetails.map(([key, value], index) => {
                      return (
                        <tr key={index.toString()}>
                          <td>{`${key}:`}</td>
                          <td><strong>{value}</strong></td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default User
