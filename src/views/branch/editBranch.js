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
import User from '../users/User';
const api_url = myConstClass.api_url;

const Branch = ({match}) => {
  const history = useHistory()
  const [newfullname, setnewfullname] = useState('')
  const [newClient, setnewClient] = useState('')
  const [newStatus, setnewStatus] = useState('')
  const [NameError, setNameError] = useState(false)
  const [submitMessage, setsubmitMessage] = useState("")
  const [ClientDa, setClientDa] = useState([])
  const [newState, setnewState] = useState('')
  const [newAddress1, setnewAddress1] = useState('')
  const [newAddress2, setnewAddress2] = useState('')
  const [newZip, setnewZip] = useState('')
  const [newCountry, setnewCountry] = useState('')
  const [newContact, setnewContact] = useState('')

  useEffect(()=>{
    axios.get(`${api_url}api.php?type=singleBranchData&id=`+match.params.id)
    .then((response) => { 
        const userddData = response.data;
        const UserDetails = userddData[0];
        console.log(UserDetails);
        setnewState(UserDetails.State);
        setnewAddress1(UserDetails.Address1);
        setnewAddress2(UserDetails.Address2);
        setnewZip(UserDetails.Zip);
        setnewCountry(UserDetails.Country);
        setnewContact(UserDetails.Contact);
        setnewfullname(UserDetails.FullName);
        setnewClient(UserDetails.ClientID);
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

        axios.post(`${api_url}api.php?type=updateBranch`, {
            "user_id":match.params.id,
            "name":newfullname,
            "client":newClient,
            "state":newState,
            "address1":newAddress1,
            "address2":newAddress2,
            "zip":newZip,
            "country":newCountry,
            "contact":newContact,
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
  
  useEffect(()=>{
    axios.get(`${api_url}api.php?type=clientData`)
    .then((response) => { 
        const clientData = response.data;
        setClientDa(clientData);
    }).catch(err => {
        console.log('Error: ', err);
    })
  },[])

  return (
    <CRow>
      <CCol lg={12}>
        <CCard>
          <CCardHeader>
            Branch id: {match.params.id}
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
                                <CLabel htmlFor="select">Client</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CSelect custom name="Client" id="Client" value={newClient} onChange={(event) =>{setnewClient(event.target.value)}}>
                                <option value="0">Please select Client</option>
                                {ClientDa.map((e, key) => {   
                                    return <option key={key} value={e.UserID}>{e.FullName}</option>;
                                })}
                                </CSelect>
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
                                <CLabel htmlFor="text-input">Address Line 1</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CInput id="text-input-name" name="text-input" placeholder="Address Line 1" value={newAddress1} onChange={(event) =>{setnewAddress1(event.target.value)} } />
                            </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                            
                            <CCol md="3">
                                <CLabel htmlFor="text-input">Address Line 2</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CInput id="text-input-name" name="text-input" placeholder="Address Line 2" value={newAddress2} onChange={(event) =>{setnewAddress2(event.target.value)} } />
                            </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                            
                            <CCol md="3">
                                <CLabel htmlFor="text-input">State/Province</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CInput id="text-input-name" name="text-input" placeholder="State/Province" value={newState} onChange={(event) =>{setnewState(event.target.value)} } />
                            </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                            
                            <CCol md="3">
                                <CLabel htmlFor="text-input">Zip/Postal code</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CInput id="text-input-name" name="text-input" placeholder="Zip/Postal code" value={newZip} onChange={(event) =>{setnewZip(event.target.value)} } />
                                {NameError && <CFormText>Please Enter Branch Name</CFormText>}
                            </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                            
                            <CCol md="3">
                                <CLabel htmlFor="text-input">Country</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CInput id="text-input-name" name="text-input" placeholder="Country" value={newCountry} onChange={(event) =>{setnewCountry(event.target.value)} } />
                            </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                            <CCol md="3">
                                <CLabel htmlFor="text-input">Contact Number</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CInput id="text-input-name" name="text-input" placeholder="Contact Number" value={newContact} onChange={(event) =>{setnewContact(event.target.value)} } />
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
                            <CButton onClick={() => history.push(`/branches`)} size="sm" color="danger"> Cancel</CButton>
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

export default Branch
