import React, { useState, useEffect,useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import {
  CButton,
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormGroup,
  CFormText,
  CInput,
  CLabel,
  CSelect,
  CAlert
} from '@coreui/react'
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import axios from "axios";
import * as myConstClass from '../../constants';
const api_url = myConstClass.api_url;



const getBadge = status => {
  switch (status) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}

var permissions = localStorage.getItem("userPermission");
var splitPermissions = permissions.split(',');

const Users = () => {
  const history = useHistory()
  const [modal, setModal] = useState(false)
  const [userDa, setUserDa] = useState([])
  const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)
  const [newUserID, setnewUserID] = useState(0)
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
  const [addButton, setaddButton] = useState(false)
  const [editButton, seteditButton] = useState(false)
  const [deleteButton, setdeleteButton] = useState(false)

 useEffect(()=>{
    nextuserIDfun();
    },[])

const nextuserIDfun = ()=>{
    axios.get(`${api_url}api.php?type=userNextID`)
    .then((response) => { 
        const nextuserID = response.data;
        setnewUserID(nextuserID);
    }).catch(err => {
        console.log('Error: ', err);
    })
} 

useEffect(()=>{
    if(splitPermissions.indexOf("2") > -1){
      setaddButton(true);
    }
    if(splitPermissions.indexOf("3") > -1){
      seteditButton(true);
    }
    if(splitPermissions.indexOf("4") > -1){
      setdeleteButton(true);
    }
  },[])

const closeAlert = () =>{
    setalertError(false);
    setsubmitMessage("");
}

  const addUser = useCallback((event) =>{
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

        axios.post(`${api_url}api.php?type=addUser`, {
            "user_id":newUserID[0],
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
            const user_response = response.data;
            setModal(false);
            setalertError(true);
            setsubmitMessage(user_response.message);
            if(user_response.type === "success"){
                nextuserIDfun();
                resetForm();
            }
           
        }).catch(err => {
            console.log('Error: ', err);
        })
  })


  const resetForm = () => {
      setnewfullname("");
      setnewEmail("");
      setnewPassword("");
      setnewJobTitle("");
      setnewStartDate("");
      setnewEndDate("");
      setnewRole("");
      setnewClient("");
      setnewStatus("");
  }

  const pageChange = newPage => {
    currentPage !== newPage && history.push(`/users?page=${newPage}`)
  }

  useEffect(() => {
    currentPage !== page && setPage(currentPage)
  }, [currentPage, page])

  const deleteUser = useCallback(id =>{
      if(id !== '00000001'){
        axios.get(`${api_url}api.php?type=deleteUser&id=`+id)
        .then((response) => { 
            setModal(false);
            setalertError(true);
            setsubmitMessage("Deleted Successfully!");
            console.log(response.data);
        }).catch(err => {
            console.log('Error: ', err);
        })
      }else{
        setalertError(true);
        setsubmitMessage("You are not allow to delete that user.");
      }
  },[])

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

    useEffect(()=>{
        axios.get(`${api_url}api.php?type=userData`)
        .then((response) => { 
            const userddData = response.data;
            setUserDa(userddData);
        }).catch(err => {
            console.log('Error: ', err);
        })
        },[addUser,deleteUser]) 
 
  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardHeader>
            Users
            {addButton ?
            <CButton 
              onClick={() => setModal(!modal)} 
              className="btn btn-primary float-right"
            >Add New User</CButton>
            : null
            }
            <CModal 
              show={modal} 
              onClose={setModal}
            >
                <CForm onSubmit={addUser} className="form-horizontal">
              <CModalHeader closeButton>
                <CModalTitle>Add User</CModalTitle>
              </CModalHeader>
              <CModalBody>
                 <CRow>
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
                                <p className="form-control-static">{newUserID}</p>
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
                                <CSelect custom name="Role" id="Role" value={newRole} onChange={(event) =>{setnewRole(event.target.value)}}>
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
                           
                        
                        </CCardBody>
                
                    </CCard>
                    
                    </CCol>
                 </CRow>   
              </CModalBody>
              <CModalFooter>
              <CButton type="submit" size="sm" color="primary"> Submit</CButton>
                <CButton onClick={resetForm} size="sm" color="danger"> Reset</CButton>
                <CButton 
                  color="secondary" 
                  size="sm"
                  onClick={() => setModal(false)}
                >Cancel</CButton>
              </CModalFooter>
              </CForm>
            </CModal>
          </CCardHeader>
          <CCardBody>
          <CDataTable
            items={userDa}
            fields={[
                'UserID',
              { key: 'FullName', _classes: 'font-weight-bold' },
              'CreatedAt', 'RoleID', 'UserActive','Actions'
            ]}
            hover
            striped
            itemsPerPage={10}
            activePage={page}
            scopedSlots = {{
              'status':
                (item)=>(
                  <td>
                    <CBadge color={getBadge(item.UserActive)}>
                      {item.status}
                    </CBadge>
                  </td>
                  
                ),
            'Actions':
                (item)=>{
                    return (
                    <td className="py-2">
                        <CButton
                        color="warning"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => history.push(`/users/${item.UserID}`)}
                        >
                            View 
                        </CButton>
                        &nbsp;
                        {editButton ?
                        <CButton
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => history.push(`/editUsers/${item.UserID}`)}
                        >
                            Edit 
                        </CButton>
                        :null 
                    }
                        &nbsp;
                        {deleteButton ?
                        <CButton
                        color="danger"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() =>{deleteUser(item.UserID)}}
                        >
                            Delete
                        </CButton>
                        : null
                    }
                    </td>
                    )}
            }}
          />
          <CPagination
            activePage={page}
            onActivePageChange={pageChange}
            pages={5}
            doubleArrows={false} 
            align="center"
          />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Users
