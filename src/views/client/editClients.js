import React,{ useState,useEffect }  from 'react'
import { useHistory } from 'react-router-dom'
import { CCard, 
    CCardBody, 
    CCardHeader, 
    CCol, 
    CRow,
    CButton,
    CForm,
    CFormGroup,
    CFormText,
    CInput,
    CLabel,
    CSelect,
    CAlert } from '@coreui/react'
import axios from "axios";
import * as myConstClass from '../../constants';
const api_url = myConstClass.api_url;

const Client = ({match}) => {
  const history = useHistory()
  const [newfullname, setnewfullname] = useState('')
  const [newStatus, setnewStatus] = useState('')
  const [NameError, setNameError] = useState(false)
  const [submitMessage, setsubmitMessage] = useState("")

  useEffect(()=>{
    axios.get(`${api_url}api.php?type=singleClientData&id=`+match.params.id)
    .then((response) => { 
        const userddData = response.data;
        const UserDetails = userddData[0];
        setnewfullname(UserDetails.FullName);
        setnewStatus(UserDetails.status_code);
    }).catch(err => {
        console.log('Error: ', err);
    })
    },[match.params.id])

    const addUser = (event) =>{
        event.preventDefault();

        if(newfullname === ''){
            setNameError(true);
            return false;
        }else{
            setNameError(false);
        }

        axios.post(`${api_url}api.php?type=updateClient`, {
            "user_id":match.params.id,
            "name":newfullname,
            "status":newStatus
        },{
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
        }
        ).then((response) => { 
            const user_response = response.data;
            setsubmitMessage(user_response.message);
            
           
        }).catch(err => {
            console.log('Error: ', err);
        })
  }
  

  return (
    <CRow>
      <CCol lg={12}>
        <CCard>
          <CCardHeader>
            User id: {match.params.id}
          </CCardHeader>
          <CCardBody>
          <CRow>
          <CForm onSubmit={addUser} className="form-horizontal col-md-12">
                    <CCol xs="12" md="12">
                    <CCard>
                        <CCardBody>
                            {submitMessage !== '' &&
                                <CAlert color="secondary">{submitMessage}</CAlert>
                            }
                            <CFormGroup row>
                            <CCol md="3">
                                <CLabel>User ID</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <p className="form-control-static">{match.params.id}</p>
                            </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                            
                            <CCol md="3">
                                <CLabel htmlFor="text-input">Full Name</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CInput id="text-input-name" name="text-input" placeholder="Full Name" value={newfullname} onChange={(event) =>{setnewfullname(event.target.value)} } />
                                {NameError && <CFormText>Please Enter Full Name</CFormText>}
                            </CCol>
                            </CFormGroup>
                           
                            <CFormGroup row>
                            <CCol md="3">
                                <CLabel htmlFor="select">Status</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CSelect custom name="Status" id="Status" value={newStatus} onChange={(event) =>{setnewStatus(event.target.value)}}>
                                <option value="">Please Select Status</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                                </CSelect>
                            </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                            <CButton type="submit" size="sm" color="primary"> Submit</CButton>&nbsp;
                            <CButton onClick={() => history.push(`/clients`)} size="sm" color="danger"> Cancel</CButton>
                            </CFormGroup>
                        </CCardBody>
                    </CCard>
                    </CCol>
                    </CForm>
                 </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Client
