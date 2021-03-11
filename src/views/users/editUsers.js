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
    CSelect
} from '@coreui/react'
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';    
import axios from "axios";
import * as myConstClass from '../../constants';
const api_url = myConstClass.api_url;

const User = ({match}) => {
  const history = useHistory()
  const [newfullname, setnewfullname] = useState('')
  const [newEmail, setnewEmail] = useState('')
  const [newPassword, setnewPassword] = useState('')
  const [newJobTitle, setnewJobTitle] = useState('')
  const [newStartDate, setnewStartDate] = useState('')
  const [newEndDate, setnewEndDate] = useState('')
  const [newRole, setnewRole] = useState('')
  const [newBranch, setnewBranch] = useState('')
  const [newClient, setnewClient] = useState('')
  const [newStatus, setnewStatus] = useState('')
  const [NameError, setNameError] = useState(false)
  const [EmailError, setEmailError] = useState(false)
  const [passwordError, setpasswordError] = useState(false)
  const [jobtitleError, setjobtitleError] = useState(false)
  const [alertError, setalertError] = useState(false)
  const [submitMessage, setsubmitMessage] = useState("")
  const [ClientDa, setClientDa] = useState([])
  const [BranchDa, setBranchDa] = useState([])
  const [roleDa, setRoleDa] = useState([])

  useEffect(()=>{
    axios.get(`${api_url}api.php?type=singleuserData&id=`+match.params.id)
    .then((response) => { 
        const userddData = response.data;
        const UserDetails = userddData[0];
        console.log(UserDetails);
        setnewfullname(UserDetails.FullName);
        setnewEmail(UserDetails.Email);
        setnewPassword(UserDetails.password);
        setnewJobTitle(UserDetails.JobTitle);
        setnewStartDate(UserDetails.ActivationStartDate);
        setnewEndDate(UserDetails.ActivationEndDate);
        setnewRole(UserDetails.RoleID);
        setnewClient(UserDetails.ClientID);
        setnewStatus(UserDetails.status_code);
        setnewBranch(UserDetails.BranchID);
    }).catch(err => {
        console.log('Error: ', err);
    })
    },[match.params.id])

    const closeAlert = () =>{
        setalertError(false);
        setsubmitMessage("");
    }

    const addUser = (event) =>{
        event.preventDefault();

        if(newfullname === ''){
            setNameError(true);
            return false;
        }else{
            setNameError(false);
        }

        if(newEmail === ''){
            setEmailError(true);
            return false;
        }else{
            setEmailError(false);
        }

        if(newPassword === ''){
            setpasswordError(true);
            return false;
        }else{
            setpasswordError(false);
        }

        if(newJobTitle === ''){
            setjobtitleError(true);
            return false;
        }else{
            setjobtitleError(false);
        }

        axios.post(`${api_url}api.php?type=updateUser`, {
            "user_id":match.params.id,
            "name":newfullname,
            "email":newEmail,
            "password":newPassword,
            "job_title":newJobTitle,
            "start_date":newStartDate,
            "end_date":newEndDate,
            "role":newRole,
            "branch":newBranch,
            "client":newClient,
            "status":newStatus
        },{
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
        }
        ).then((response) => { 
            setalertError(true);
            const user_response = response.data;
            console.log(user_response);
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

    useEffect(()=>{
        axios.get(`${api_url}api.php?type=branchData`)
        .then((response) => { 
            const branchddData = response.data;
            setBranchDa(branchddData);
        }).catch(err => {
            console.log('Error: ', err);
        })
    },[])

    useEffect(()=>{
        axios.get(`${api_url}api.php?type=roleData`)
        .then((response) => { 
            const branchddData = response.data;
            setRoleDa(branchddData);
        }).catch(err => {
            console.log('Error: ', err);
        })
    },[])

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
                                <SweetAlert
                                show={alertError}
                                title="Alert"
                                text={submitMessage}
                                onConfirm={closeAlert}
                                />
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
                                <CLabel htmlFor="email-input">Email</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CInput type="email" id="email-input" name="email-input" placeholder="Enter Email" autoComplete="email" value={newEmail} onChange={(event) =>{setnewEmail(event.target.value)} }/>
                                {EmailError && <CFormText className="help-block">Please enter your email</CFormText>}
                            </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                            <CCol md="3">
                                <CLabel htmlFor="password-input">Password</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CInput type="password" id="password-input" name="password-input" placeholder="Password" autoComplete="new-password" value={newPassword} onChange={(event) =>{setnewPassword(event.target.value)}} />
                                {passwordError && <CFormText className="help-block">Please enter a complex password</CFormText>}
                            </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                            <CCol md="3">
                                <CLabel htmlFor="text-input">Contact No.</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CInput id="text-input" name="text-input" placeholder="Contact Number" value={newJobTitle} onChange={(event) =>{setnewJobTitle(event.target.value)}} />
                               {jobtitleError &&<CFormText>Please enter Contact No.</CFormText>}
                            </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                            <CCol md="3">
                                <CLabel htmlFor="date-input">Activation Start Date</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CInput type="date" id="date-input-start" name="date-input" placeholder="Activation Start Date" value={newStartDate} onChange={(event) =>{setnewStartDate(event.target.value)}} />
                            </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                            <CCol md="3">
                                <CLabel htmlFor="date-input">Activation End Date</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CInput type="date" id="date-input-end" name="date-input" placeholder="Activation End Date" value={newEndDate} onChange={(event) =>{setnewEndDate(event.target.value)}} />
                            </CCol>
                            </CFormGroup>
                        
                            <CFormGroup row>
                            <CCol md="3">
                                <CLabel htmlFor="select">Role</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CSelect custom name="Role" id="Role" value={newRole} onChange={(event) =>{setnewRole(event.target.value)}} defaultValue={newRole}>
                                <option value="0">Please select Role</option>
                                {roleDa.map((e, key) => {   
                                    return <option key={key} value={e.UserID}>{e.FullName}</option>;
                                })}
                                </CSelect>
                            </CCol>
                            </CFormGroup>

                            <CFormGroup row>
                            <CCol md="3">
                                <CLabel htmlFor="select">Branch</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CSelect custom name="Branch" id="Branch" value={newBranch} onChange={(event) =>{setnewBranch(event.target.value)}}>
                                <option value="0">Please select Branch</option>
                                {BranchDa.map((e, key) => {   
                                    return <option key={key} value={e.UserID}>{e.FullName}</option>;
                                })}
                                </CSelect>
                            </CCol>
                            </CFormGroup>

                            <CFormGroup row>
                            <CCol md="3">
                                <CLabel htmlFor="select">Client</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CSelect custom name="Client" id="Client" value={newClient} onChange={(event) =>{setnewClient(event.target.value)}}>
                                {ClientDa.map((e, key) => {   
                                    return <option key={key} value={e.UserID}>{e.FullName}</option>;
                                })}
                                </CSelect>
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
                            <CButton onClick={() => history.push(`/users`)} size="sm" color="danger"> Cancel</CButton>
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

export default User
