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
  CAlert,
  CInputCheckbox
} from '@coreui/react'
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

const Roles = () => {
  const history = useHistory()
  const [modal, setModal] = useState(false)
  const [userDa, setUserDa] = useState([])
  const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)
  const [newUserID, setnewUserID] = useState(0)
  const [newfullname, setnewfullname] = useState('')
  const [newBranch, setnewBranch] = useState('')
  const [newClient, setnewClient] = useState('')
  const [newStatus, setnewStatus] = useState('')
  const [newPermission, setnewPermission] = useState([])
  const [NameError, setNameError] = useState(false)
  const [ClientDa, setClientDa] = useState([])
  const [BranchDa, setBranchDa] = useState([])
  const [submitMessage, setsubmitMessage] = useState("")
  const [addButton, setaddButton] = useState(false)
  const [editButton, seteditButton] = useState(false)
  const [deleteButton, setdeleteButton] = useState(false)


 useEffect(()=>{
    axios.get(`${api_url}api.php?type=roleNextID`)
    .then((response) => { 
        const nextuserID = response.data;
        setnewUserID(nextuserID);
    }).catch(err => {
        console.log('Error: ', err);
    })
    },[])


  useEffect(()=>{
      if(splitPermissions.indexOf("6") > -1){
        setaddButton(true);
      }
      if(splitPermissions.indexOf("7") > -1){
        seteditButton(true);
      }
      if(splitPermissions.indexOf("8") > -1){
        setdeleteButton(true);
      }
    },[])

  const addUser = useCallback((event) =>{
        event.preventDefault();

        if(newfullname === ''){
            setNameError(true);
            return false;
        }else{
            setNameError(false);
        }

        axios.post(`${api_url}api.php?type=addRole`, {
            "user_id":newUserID[0],
            "name":newfullname,
            "permission":newPermission,
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
            setsubmitMessage(user_response.message);
            if(user_response.type === "success"){
                resetForm();
            }
           
        }).catch(err => {
            console.log('Error: ', err);
        })
  })

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


  const resetForm = () => {
      setnewfullname("");
      setnewClient("");
      setnewClient("");
      setnewStatus("");
  }

  const pageChange = newPage => {
    currentPage !== newPage && history.push(`/roles?page=${newPage}`)
  }

  useEffect(() => {
    currentPage !== page && setPage(currentPage)
  }, [currentPage, page])

  const deleteUser = useCallback(id =>{
    if(id !== '00000001'){
      axios.get(`${api_url}api.php?type=deleteRole&id=`+id)
      .then((response) => { 
          console.log(response.data);
      }).catch(err => {
          console.log('Error: ', err);
      })
    }else{
      alert("You are not allow to delete that role.");
    }
  },[])

  useEffect(()=>{
    axios.get(`${api_url}api.php?type=roleData`)
    .then((response) => { 
        const userddData = response.data;
        setUserDa(userddData);
    }).catch(err => {
        console.log('Error: ', err);
    })
    },[addUser,deleteUser])

    const handleAddrTypeChange = (e) => {
      let index;
      let isChecked = e.target.checked;
      if(isChecked){
        newPermission.push(+e.target.value)
      } else {
        index = newPermission.indexOf(+e.target.value)
        newPermission.splice(index, 1)
      }
      setnewPermission(newPermission);
    }
 
  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardHeader>
            Roles
            {addButton ?
            <CButton 
              onClick={() => setModal(!modal)} 
              className="btn btn-primary float-right"
            >Add New Role</CButton>
            : null
            }
            <CModal 
              show={modal} 
              onClose={setModal}
            >
                <CForm onSubmit={addUser} className="form-horizontal">
              <CModalHeader closeButton>
                <CModalTitle>Add Roles</CModalTitle>
              </CModalHeader>
              <CModalBody>
                 <CRow>
                    <CCol xs="12" md="12">
                    <CCard>
                        <CCardBody>
                            {submitMessage !== '' &&
                                <CAlert color="secondary">{submitMessage}</CAlert>
                            }
                            <CFormGroup row>
                            <CCol md="3">
                                <CLabel>Role ID</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <p className="form-control-static">{newUserID}</p>
                            </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                            
                            <CCol md="3">
                                <CLabel htmlFor="text-input">Role Name</CLabel>
                            </CCol>
                            <CCol xs="12" md="9">
                                <CInput id="text-input-name" name="text-input" placeholder="Role Name" value={newfullname} onChange={(event) =>{setnewfullname(event.target.value)} } />
                                {NameError && <CFormText>Please Enter Role Name</CFormText>}
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
                                <option value="0">Please select Client</option>
                                {ClientDa.map((e, key) => {   
                                    return <option key={key} value={e.UserID}>{e.FullName}</option>;
                                })}
                                </CSelect>
                            </CCol>
                            </CFormGroup>
                            
                            <CFormGroup row>
                              <CCol md="3">
                                <CLabel>Permissions</CLabel>
                              </CCol>
                              <CCol md="9">
                                
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="user_View" name="user_View" onChange={e => handleAddrTypeChange(e)} value="1"/>
                                  <CLabel variant="custom-checkbox" htmlFor="user_View">User View</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="user_Add" name="user_Add" onChange={e => handleAddrTypeChange(e)} value="2"/>
                                  <CLabel variant="custom-checkbox" htmlFor="user_Add">User Add</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="user_Edit" name="user_Edit" onChange={e => handleAddrTypeChange(e)} value="3"/>
                                  <CLabel variant="custom-checkbox" htmlFor="user_Edit">User Edit</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="user_Delete" name="user_Delete" onChange={e => handleAddrTypeChange(e)} value="4"/>
                                  <CLabel variant="custom-checkbox" htmlFor="user_Delete">User Delete</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="role_View" name="role_View" onChange={e => handleAddrTypeChange(e)} value="5"/>
                                  <CLabel variant="custom-checkbox" htmlFor="role_View">Role View</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="role_Add" name="role_Add" onChange={e => handleAddrTypeChange(e)} value="6"/>
                                  <CLabel variant="custom-checkbox" htmlFor="role_Add">Role Add</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="role_Edit" name="role_Edit" onChange={e => handleAddrTypeChange(e)} value="7"/>
                                  <CLabel variant="custom-checkbox" htmlFor="role_Edit">Role Edit</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="role_Delete" name="role_Delete" onChange={e => handleAddrTypeChange(e)} value="8"/>
                                  <CLabel variant="custom-checkbox" htmlFor="role_Delete">Role Delete</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="client_View" name="client_View" onChange={e => handleAddrTypeChange(e)} value="9"/>
                                  <CLabel variant="custom-checkbox" htmlFor="client_View">Client View</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="client_Add" name="client_Add" onChange={e => handleAddrTypeChange(e)} value="10"/>
                                  <CLabel variant="custom-checkbox" htmlFor="client_Add">Client Add</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="client_Edit" name="client_Edit" onChange={e => handleAddrTypeChange(e)} value="11"/>
                                  <CLabel variant="custom-checkbox" htmlFor="client_Edit">Client Edit</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="client_Delete" name="client_Delete" onChange={e => handleAddrTypeChange(e)} value="12"/>
                                  <CLabel variant="custom-checkbox" htmlFor="client_Delete">Client Delete</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="branch_View" name="branch_View" onChange={e => handleAddrTypeChange(e)} value="13"/>
                                  <CLabel variant="custom-checkbox" htmlFor="branch_View">Branch View</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="branch_Add" name="branch_Add" onChange={e => handleAddrTypeChange(e)} value="14"/>
                                  <CLabel variant="custom-checkbox" htmlFor="branch_Add">Branch Add</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="branch_Edit" name="branch_Edit" onChange={e => handleAddrTypeChange(e)} value="15"/>
                                  <CLabel variant="custom-checkbox" htmlFor="branch_Edit">Branch Edit</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-checkbox" inline>
                                  <CInputCheckbox custom id="branch_Delete" name="branch_Delete" onChange={e => handleAddrTypeChange(e)} value="16"/>
                                  <CLabel variant="custom-checkbox" htmlFor="branch_Delete">Branch Delete</CLabel>
                                </CFormGroup>
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
              { key: 'FullName', _classes: 'font-weight-bold' },
              'CreatedAt', 'ClientID','BranchID', 'UserActive','Actions'
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
                        onClick={() => history.push(`/role/${item.UserID}`)}
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
                        onClick={() => history.push(`/editRole/${item.UserID}`)}
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

export default Roles
